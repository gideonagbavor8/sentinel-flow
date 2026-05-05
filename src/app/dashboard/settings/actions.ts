"use server";

import { requireAuth } from "@/lib/session";
import prisma from "@/lib/prisma";
import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";
import { revalidatePath } from "next/cache";

export async function generateMfaSecret() {
  const session = await requireAuth();
  
  // Fetch user to get email for the QR code
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) throw new Error("User not found.");

  // 1. Generate a new secret for the user
  const secret = generateSecret();
  
  // 2. Create the otpauth URL
  const otpauth = generateURI({
    label: user.email,
    issuer: "Sentinel Flow",
    secret,
    strategy: "totp"
  });
  
  // 3. Generate QR code as a data URL for the frontend
  const qrCodeUrl = await QRCode.toDataURL(otpauth);
  
  return { secret, qrCodeUrl };
}

export async function enableMfa(token: string, secret: string) {
  const session = await requireAuth();
  
  // 1. Verify the 6-digit token against the secret
  const isValid = verifySync({ token, secret, strategy: "totp" });
  
  if (!isValid) {
    throw new Error("Invalid verification code. Please try again.");
  }
  
  // 2. Save the secret to the user record and enable MFA
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mfaEnabled: true,
      mfaSecret: secret
    }
  });
  
  // 3. Log the security change
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "Multi-Factor Authentication (MFA) enabled",
      ipAddress: "N/A",
      userAgent: "Settings Action"
    }
  });
  
  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function disableMfa() {
  const session = await requireAuth();
  
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      mfaEnabled: false,
      mfaSecret: null
    }
  });
  
  await prisma.auditLog.create({
    data: {
      userId: session.user.id,
      action: "Multi-Factor Authentication (MFA) disabled",
      ipAddress: "N/A",
      userAgent: "Settings Action"
    }
  });
  
  revalidatePath("/dashboard/settings");
}

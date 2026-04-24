import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'utf8');

export function encryptBuffer(buffer: Buffer) {
  const iv = randomBytes(12); // Initialization Vector
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();

  // We store the IV and Tag along with the data so we can decrypt it later
  return Buffer.concat([iv, tag, encrypted]);
}

export function decryptBuffer(encryptedBuffer: Buffer) {
  const iv = encryptedBuffer.subarray(0, 12);
  const tag = encryptedBuffer.subarray(12, 28);
  const data = encryptedBuffer.subarray(28);

  const decipher = createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(data), decipher.final()]);
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../auth-form.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message || data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className="mb-8">
          <h1 className={`${styles.authTitle} text-3xl font-bold mb-2`}>Sentinel Flow</h1>
          <p className={`${styles.authDescription} text-sm`}>Sign in to access your secure vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`${styles.authLabel} block text-sm font-medium mb-2`}>
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className={styles.authInput}
            />
          </div>

          <div>
            <label htmlFor="password" className={`${styles.authLabel} block text-sm font-medium mb-2`}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.authInput}
            />
          </div>

          {error && <div className="text-sm text-red-500 text-center">{error}</div>}

          <button type="submit" className={styles.authButton} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className={`${styles.authDescription} text-sm`}>
            Don't have an account?{" "}
            <Link href="/register" className={styles.authLink}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
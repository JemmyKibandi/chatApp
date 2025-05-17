"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const passwordsMatch = password === confirmPassword || confirmPassword === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;

    setError("");
    setLoading(true);

    try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });
          
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to register");
        setLoading(false);
        return;
      }

      // Success — redirect to login page
      router.push("/login");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-pink-200 to-purple-300">
      <div className="backdrop-blur-lg bg-pink/30 border border-pink-400 rounded-xl shadow-lg p-8 w-full max-w-md text-pink-900">
        <h1 className="text-3xl font-caveat-bold mb-4 text-center">Sign Up</h1>
        <p className="text-center mb-6 text-sm text-white">
          Create a new account to get started.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">
              <span className="label-text white font-caveat-semibold">Username</span>
            </label>
            <input
              type="text"
              placeholder="yourusername"
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text white font-caveat-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-caveat-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-caveat-semibold">Confirm Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className={`input w-full rounded-3xl ${
                !passwordsMatch ? "border border-red-500" : ""
              } bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch && (
              <p className="text-red-600 text-sm mt-1 font-medium">Passwords do not match.</p>
            )}
          </div>

          {error && <p className="text-red-600 text-center font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={!passwordsMatch || loading}
            className={`mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center ${
              passwordsMatch && !loading
                ? "bg-foreground hover:bg-[#C8A2C8] dark:hover:bg-[#ccc]"
                : "bg-gray-400 cursor-not-allowed"
            } text-background gap-2 font-caveat-medium text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5 sm:w-auto`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-white/70 mt-6 text-center">
          Already have an account?{" "}
          <Link href="/login">
            <button className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#C8A2C8] dark:hover:bg-[#ccc] font-caveat-medium text-sm sm:text-base h-4 sm:h-8 px-4 sm:px-5 sm:w-auto">
              Log In{" "}
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}

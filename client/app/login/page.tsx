"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // Saves token in localStorage (or context/auth provider if needed)
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push("/homePage"); // Redirect to chat interface is cofigured here 🪄
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-pink-200 to-purple-300">
      <div className="backdrop-blur-lg bg-pink/30 border border-pink-400 rounded-xl shadow-lg p-8 w-full max-w-md text-pink-900">
        <h1 className="text-3xl font-caveat-bold mb-4 text-center">Login</h1>
        <p className="text-center mb-6 text-sm text-white">
          Welcome back. Please sign in to your account.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="label">
              <span className="label-text white font-caveat-semibold">Username</span>
            </label>
            <input
              type="text"
              placeholder="yourusername"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-caveat-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-1 font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="mx-auto w-full rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#C8A2C8] dark:hover:bg-[#ccc] font-caveat-medium text-sm sm:text-base h-10 px-5"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-white/70 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signUp">
            <button className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#C8A2C8] dark:hover:bg-[#ccc] font-caveat-medium text-sm sm:text-base h-4 sm:h-8 px-4 sm:px-5 sm:w-auto">
              Sign up
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}

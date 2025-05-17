"use client";

import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-pink-200 to-purple-300">
      <div className="backdrop-blur-lg bg-pink/30 border border-pink-400 rounded-xl shadow-lg p-8 w-full max-w-md text-pink-900">
        <h1 className="text-3xl font-caveat-bold mb-4 text-center">Login</h1>
        <p className="text-center mb-6 text-sm text-white">
          Welcome back. Please sign in to your account.
        </p>
        <form className="space-y-5">
          <div>
            <label className="label">
              <span className="label-text white font-caveat-semibold">
                Email
              </span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition  py-3 px-3"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-caveat-semibold">
                Password
              </span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="input w-full rounded-3xl bg-pink-200/30 text-pink-900 placeholder:text-pink-400 focus:bg-pink-300/50 focus:ring-2 focus:ring-pink-400 focus:outline-none transition py-3 px-3"
            />
          </div>
          <Link href="/login">
          <button className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#C8A2C8] dark:hover:bg-[#ccc] font-caveat-medium text-sm sm:text-base h-8 sm:h-10 px-4 sm:px-5 sm:w-auto">
            Login
          </button>
          </Link>
        </form>

        <p className="text-sm text-white/70 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <Link href="/signUp">
            <button className="mx-auto rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#C8A2C8] dark:hover:bg-[#ccc] font-caveat-medium text-sm sm:text-base h-4 sm:h-8 px-4 sm:px-5 sm:w-auto">
              Sign up{" "}
            </button>
          </Link>
        </p>
      </div>
    </div>
  );
}

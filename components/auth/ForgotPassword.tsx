"use client";

import React from "react";
import { Button, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { forgotPassword } from "@/actions/auth-actions";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";

export default function ForgotPassword() {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const email = data.email;
    const res = await forgotPassword(email);

    if (res?.error) {
      return toast.error(res?.error?.message);
    }

    if (res?.emailsent) {
      return toast.success("Password reset link sent to your email");
    }
  });

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-2xl px-10 pb-10 pt-8"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
            }}
          >
            <Icon icon="solar:letter-bold" className="text-2xl text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-xl font-semibold text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              Forgot Password
            </h1>
            <p className="text-sm text-slate-400">Enter your email to reset your password</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <Form
          className="flex w-full flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          {/* Email field */}
          <div
            className="w-full rounded-xl transition-all duration-300"
            style={{
              boxShadow:
                focusedField === "email"
                  ? "0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="rounded-xl border px-4 py-3 transition-colors duration-200"
              style={{
                borderColor: focusedField === "email" ? "#93c5fd" : "#e2e8f0",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Icon icon="solar:letter-linear" className="text-base text-slate-400 shrink-0" />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
                />
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center -mt-1">
            We'll send a reset link valid for 30 minutes to your inbox.
          </p>

          {/* Submit */}
          <Button
            className="group relative w-full overflow-hidden rounded-xl py-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
            style={{
              background: loading
                ? "#93c5fd"
                : "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: loading
                ? "none"
                : "0 4px 20px rgba(99,102,241,0.4), 0 1px 3px rgba(0,0,0,0.1)",
            }}
            type="submit"
            endContent={
              !loading && (
                <Icon
                  icon="akar-icons:arrow-right"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )
            }
            isDisabled={loading}
            isLoading={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[200%]"
              aria-hidden="true"
            />
          </Button>
        </Form>

        {/* Back to login */}
        <p className="text-xs text-slate-400 text-center">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
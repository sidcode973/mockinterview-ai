"use client";

import React from "react";
import { Form } from "@heroui/react";
import { forgotPassword } from "@/actions/auth-actions";
import toast from "react-hot-toast";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";

export default function ForgotPassword() {
  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const email = data.email;
    const res = await forgotPassword(email);

    if ("error" in res && res.error) {
      toast.error(res.error.message);
      return;
    }

    if ("emailSent" in res && res.emailSent) {
      toast.success("Password reset link sent to your email");
    }
  });

  return (
    <AuthShell
      icon="solar:letter-bold"
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
    >
      <Form
        className="flex w-full flex-col gap-4"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <AuthField
          name="email"
          label="Email Address"
          type="email"
          icon="solar:letter-linear"
          placeholder="Enter your email"
          required
        />

        <p className="text-xs text-default-400 text-center -mt-1">
          We&apos;ll send a reset link valid for 30 minutes to your inbox.
        </p>

        <AuthSubmit loading={loading} loadingText="Sending…">
          Send Reset Link
        </AuthSubmit>
      </Form>

      <p className="text-xs text-default-400 text-center mt-5">
        Remembered your password?{" "}
        <a
          href="/login"
          className="text-xs font-semibold text-fuchsia-500 hover:text-fuchsia-600 transition-colors"
        >
          Back to Login
        </a>
      </p>
    </AuthShell>
  );
}

"use client";

import React from "react";
import { Form } from "@heroui/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { resetPassword } from "@/actions/auth-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";

export default function ResetPassword({ token }: { token: string }) {
  const router = useRouter();

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const res = await resetPassword(token, data.newPassword, data.confirmPassword);

    if ("error" in res) {
      toast.error(res.error?.message);
      return;
    }

    if ("passwordUpdated" in res && res.passwordUpdated) {
      toast.success("Password reset successfully");
      router.push("/login");
    }
  });

  return (
    <AuthShell
      icon="solar:lock-password-bold"
      title="Reset Password"
      subtitle="Enter your new password to reset"
    >
      <Form
        className="flex w-full flex-col gap-4"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <AuthField
          name="newPassword"
          label="New Password"
          icon="solar:lock-linear"
          placeholder="Enter your new password"
          required
          toggleVisibility
        />
        <AuthField
          name="confirmPassword"
          label="Confirm Password"
          icon="solar:lock-linear"
          placeholder="Confirm your new password"
          required
          toggleVisibility
        />

        <p className="text-xs text-default-400 text-center -mt-1">
          Use 8+ characters with a mix of letters, numbers & symbols
        </p>

        <AuthSubmit loading={loading} loadingText="Resetting…">
          Reset Password
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

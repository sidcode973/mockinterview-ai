"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { updatePassword } from "@/actions/auth-actions";
import toast from "react-hot-toast";
import { m } from "framer-motion";
import GlassCard from "../ui/GlassCard";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";

export default function UpdatePassword() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const session = useSession();

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const bodyData = {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
      userEmail: session?.data?.user?.email || "",
    };

    const res = await updatePassword(bodyData);

    if ("error" in res && res.error) {
      toast.error(res.error.message);
      return;
    }

    if ("updated" in res && res.updated) {
      toast.success("Password updated successfully");
      formRef.current?.reset();
    }
  });

  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full flex justify-center"
    >
      <GlassCard variant="strong" glow className="w-full max-w-md p-6">
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF1CF7] via-[#b249f8] to-[#22d3ee] shadow-lg shadow-fuchsia-500/40">
            <Icon icon="solar:lock-password-bold" className="text-lg text-white" />
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center">
            <h1 className="text-base font-semibold tracking-tight">Update Password</h1>
            <p className="text-xs text-default-500">
              Enter new passwords to update your account
            </p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-default-200/60 to-transparent" />

        <form ref={formRef} className="flex w-full flex-col gap-3" onSubmit={handleSubmit}>
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

          <p className="text-[11px] text-default-400 text-center">
            Use 8+ characters with a mix of letters, numbers & symbols
          </p>

          <AuthSubmit loading={loading} loadingText="Updating…">
            Update Password
          </AuthSubmit>
        </form>
      </GlassCard>
    </m.div>
  );
}

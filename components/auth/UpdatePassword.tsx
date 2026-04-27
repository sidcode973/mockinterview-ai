"use client";

import React from "react";
import { Button, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { updatePassword } from "@/actions/auth-actions";
import toast from "react-hot-toast";

export default function UpdatePassword() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  const formRef = React.useRef<HTMLFormElement>(null);
  const session = useSession();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

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
      setIsVisible(false);
      setIsConfirmVisible(false);
    }
  });

  return (
    <div className="w-full flex justify-center" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="w-full max-w-xs flex flex-col gap-3 rounded-2xl px-5 pb-5 pt-4"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid #e8edf5",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(59,130,246,0.08), 0 0 0 1px rgba(59,130,246,0.04)",
        }}
      >
        {/* Header — icon on top, centered */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            <Icon icon="solar:lock-password-bold" className="text-base text-white" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <h1
              className="text-sm font-semibold text-slate-800 leading-tight"
              style={{ letterSpacing: "-0.01em" }}
            >
              Update Password
            </h1>
            <p className="text-[11px] text-slate-400 text-center">
              Enter new passwords to update your account
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <form ref={formRef} className="flex w-full flex-col gap-2.5" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div
            className="rounded-lg border px-3 py-1.5 transition-all duration-200"
            style={{
              borderColor: focusedField === "newPassword" ? "#93c5fd" : "#e2e8f0",
              background: focusedField === "newPassword"
                ? "rgba(239,246,255,0.6)"
                : "rgba(255,255,255,0.8)",
              boxShadow: focusedField === "newPassword"
                ? "0 0 0 3px rgba(59,130,246,0.1)"
                : "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <label className="block text-[11px] font-normal text-slate-400 mb-0.5">
              New Password <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                required
                name="newPassword"
                type={isVisible ? "text" : "password"}
                placeholder="Enter your new password"
                onFocus={() => setFocusedField("newPassword")}
                onBlur={() => setFocusedField(null)}
                className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="shrink-0 flex items-center justify-center h-6 w-6 rounded-md transition-all duration-200 hover:bg-blue-50"
              >
                <Icon
                  className="text-sm text-slate-400"
                  icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                />
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div
            className="rounded-lg border px-3 py-1.5 transition-all duration-200"
            style={{
              borderColor: focusedField === "confirmPassword" ? "#93c5fd" : "#e2e8f0",
              background: focusedField === "confirmPassword"
                ? "rgba(239,246,255,0.6)"
                : "rgba(255,255,255,0.8)",
              boxShadow: focusedField === "confirmPassword"
                ? "0 0 0 3px rgba(59,130,246,0.1)"
                : "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            <label className="block text-[11px] font-normal text-slate-400 mb-0.5">
              Confirm Password <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                required
                name="confirmPassword"
                type={isConfirmVisible ? "text" : "password"}
                placeholder="Confirm your new password"
                onFocus={() => setFocusedField("confirmPassword")}
                onBlur={() => setFocusedField(null)}
                className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
              />
              <button
                type="button"
                onClick={toggleConfirmVisibility}
                className="shrink-0 flex items-center justify-center h-6 w-6 rounded-md transition-all duration-200 hover:bg-blue-50"
              >
                <Icon
                  className="text-sm text-slate-400"
                  icon={isConfirmVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                />
              </button>
            </div>
          </div>

          {/* Hint */}
          <p className="text-[11px] text-slate-400 text-center">
            Use 8+ characters with a mix of letters, numbers & symbols
          </p>

          {/* Submit */}
          <Button
            className="group relative w-full overflow-hidden rounded-xl py-4 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-md active:scale-[0.99]"
            style={{
              background: loading
                ? "#93c5fd"
                : "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: loading ? "none" : "0 3px 12px rgba(99,102,241,0.35)",
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
            {loading ? "Updating..." : "Update Password"}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[200%]"
              aria-hidden="true"
            />
          </Button>
        </form>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { Button, Input, Form } from "@heroui/react";
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

    if (res?.error) {
      return toast.error(res?.error?.message);
    }

    if (res?.updated) {
      toast.success("Password updated successfully");
      formRef.current?.reset();
      setIsVisible(false);
      setIsConfirmVisible(false);
    }
  });

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Ambient background blobs */}
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

      <div
        className="relative flex w-full max-w-md flex-col items-center gap-6 rounded-2xl px-10 pb-10 pt-8 transition-all duration-500"
        style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow:
            "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(59,130,246,0.12), 0 0 0 1px rgba(59,130,246,0.06)",
        }}
      >
        {/* Lock icon header */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
            }}
          >
            <Icon icon="solar:lock-password-bold" className="text-2xl text-white" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-xl font-semibold tracking-tight text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              Update Password
            </h1>
            <p className="text-sm text-slate-400">Enter new passwords to update your account</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <form ref={formRef} className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          {/* New Password Field */}
          <div
            className="group relative w-full rounded-xl transition-all duration-300"
            style={{
              boxShadow:
                focusedField === "newPassword"
                  ? "0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Input
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-500"
                >
                  <Icon
                    className="text-xl text-slate-400 transition-colors duration-200 group-hover:text-slate-500"
                    icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                  />
                </button>
              }
              label="New Password"
              name="newPassword"
              placeholder="Enter your new password"
              type={isVisible ? "text" : "password"}
              variant="bordered"
              onFocus={() => setFocusedField("newPassword")}
              onBlur={() => setFocusedField(null)}
              classNames={{
                base: "w-full",
                inputWrapper:
                  "border-slate-200 bg-white/70 hover:border-blue-300 transition-all duration-200 data-[focus=true]:border-blue-400 rounded-xl",
                label: "text-slate-600 font-medium text-sm",
                input: "text-slate-700 placeholder:text-slate-300",
              }}
            />
          </div>

          {/* Confirm Password Field */}
          <div
            className="group relative w-full rounded-xl transition-all duration-300"
            style={{
              boxShadow:
                focusedField === "confirmPassword"
                  ? "0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Input
              isRequired
              endContent={
                <button
                  type="button"
                  onClick={toggleConfirmVisibility}
                  className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-500"
                >
                  <Icon
                    className="text-xl text-slate-400 transition-colors duration-200 group-hover:text-slate-500"
                    icon={isConfirmVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                  />
                </button>
              }
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your new password"
              type={isConfirmVisible ? "text" : "password"}
              variant="bordered"
              onFocus={() => setFocusedField("confirmPassword")}
              onBlur={() => setFocusedField(null)}
              classNames={{
                base: "w-full",
                inputWrapper:
                  "border-slate-200 bg-white/70 hover:border-blue-300 transition-all duration-200 data-[focus=true]:border-blue-400 rounded-xl",
                label: "text-slate-600 font-medium text-sm",
                input: "text-slate-700 placeholder:text-slate-300",
              }}
            />
          </div>

          {/* Password strength hint */}
          <p className="text-xs text-slate-400 text-center -mt-1">
            Use 8+ characters with a mix of letters, numbers & symbols
          </p>

          {/* Submit Button */}
          <Button
            className="group relative mt-2 w-full overflow-hidden rounded-xl py-6 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
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
            {loading ? "Updating..." : "Update Password"}

            {/* Shimmer effect on hover */}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[200%]"
              aria-hidden="true"
            />
          </Button>
        </form>

        {/* Footer hint */}
        <p className="text-xs text-slate-400 text-center">
          Make sure to save your new password somewhere safe.
        </p>
      </div>
    </div>
  );
}
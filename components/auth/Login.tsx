"use client";

import React from "react";
import { Button, Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
    const [isVisible, setIsVisible] = React.useState(false);
    const [focusedField, setFocusedField] = React.useState<string | null>(null);
    const router = useRouter();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
        let res;
        try {
          res = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
            callbackUrl: "/app/dashboard",
          });
        } catch (err) {
          throw err;
        }

        const rawError = res?.error;
        const errorMessage =
          typeof rawError === "string"
            ? rawError === "CredentialsSignin"
              ? "Invalid Email or Password"
              : rawError
            : (rawError && typeof rawError === "object" && "message" in rawError
                ? (rawError as { message?: string }).message
                : null) ?? "Invalid Email or Password";

        if (!res || res?.error || res?.ok === false) {
          toast.error(errorMessage);
          return;
        }

        if (res?.ok) {
          router.push("/app/dashboard");
        }
    });

    const handleGithubLogin = async () => {
          await signIn("github", { callbackUrl: "/app/dashboard" });
    };

    const handleGoogleLogin = async () => {
          await signIn("google", { callbackUrl: "/app/dashboard" });
    };

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-linear-to-br from-slate-50 via-blue-50 to-slate-100"
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
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
            filter: "blur(80px)",
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
            <Icon icon="solar:login-bold" className="text-2xl text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-xl font-semibold text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              Welcome Back
            </h1>
            <p className="text-sm text-slate-400">Log in to your account to continue</p>
          </div>
        </div>

        {/* Divider */}
       <div className="w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

        <Form
          className="flex w-full flex-col gap-4"
          onSubmit={handleSubmit}
          validationBehavior="native"
        >
          {/* Email */}
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

          {/* Password */}
          <div
            className="w-full rounded-xl transition-all duration-300"
            style={{
              boxShadow:
                focusedField === "password"
                  ? "0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="rounded-xl border px-4 py-3 transition-colors duration-200"
              style={{
                borderColor: focusedField === "password" ? "#93c5fd" : "#e2e8f0",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <Icon icon="solar:lock-linear" className="text-base text-slate-400 shrink-0" />
                <input
                  required
                  name="password"
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0 transition-all duration-200 hover:bg-blue-50"
                >
                  <Icon
                    icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                    className="text-base text-slate-400 hover:text-blue-400 transition-colors duration-200"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Forgot password */}
          <div className="flex w-full justify-end -mt-1">
            <Link
              href="/password/forgot"
              className="text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

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
            endContent= {
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
            {loading ? "Signing in..." : "Sign In"}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[200%]"
              aria-hidden="true"
            />
          </Button>
        </Form>

        {/* OR divider */}
        <div className="flex w-full items-center gap-3">
          <div className="flex-1 h-px bg-linear-to-r from-transparent via-slate-200 to-slate-200" />
          <span className="text-xs font-medium text-slate-400 px-1">OR</span>
          <div className="flex-1 h-px bg-linear-to-l from-transparent via-slate-200 to-slate-200" />
        </div>

        {/* Social buttons */}
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/60 hover:text-slate-700 hover:shadow-sm active:scale-[0.99]"
            style={{
              borderColor: "#e2e8f0",
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <Icon icon="flat-color-icons:google" className="text-xl shrink-0" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleGithubLogin}
            className="group flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/80 hover:text-slate-800 hover:shadow-sm active:scale-[0.99]"
            style={{
              borderColor: "#e2e8f0",
              background: "rgba(255,255,255,0.7)",
            }}
          >
            <Icon icon="fe:github" className="text-xl text-slate-700 shrink-0" />
            Continue with GitHub
          </button>
        </div>

        {/* Register link */}
        <p className="text-xs text-slate-400 text-center">
          Need to create an account?{" "}
          <Link
            href="/register"
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { Link, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";

export default function Login() {
  const router = useRouter();

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
    <AuthShell
      icon="solar:login-bold"
      title="Welcome Back"
      subtitle="Log in to your account to continue"
    >
      <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit} validationBehavior="native">
        <AuthField
          name="email"
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          icon="solar:letter-linear"
          required
        />
        <AuthField
          name="password"
          label="Password"
          icon="solar:lock-linear"
          placeholder="Enter your password"
          required
          toggleVisibility
        />

        <div className="flex w-full justify-end -mt-1">
          <Link
            href="/password/forgot"
            className="text-xs font-medium text-fuchsia-500 hover:text-fuchsia-600 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmit loading={loading} loadingText="Signing in…">
          Sign In
        </AuthSubmit>
      </Form>

      <div className="flex w-full items-center gap-3 mt-5">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-default-200/60 to-default-200/60" />
        <span className="text-xs font-medium text-default-400 px-1">OR</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-default-200/60 to-default-200/60" />
      </div>

      <div className="flex w-full flex-col gap-3 mt-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-default-200/60 bg-default-50/40 backdrop-blur-md px-4 py-3 text-sm font-medium text-default-700 transition-all duration-200 hover:border-fuchsia-400/40 hover:bg-default-100/60 active:scale-[0.99]"
        >
          <Icon icon="flat-color-icons:google" className="text-xl shrink-0" />
          Continue with Google
        </button>

        <button
          type="button"
          onClick={handleGithubLogin}
          className="group flex w-full items-center justify-center gap-3 rounded-xl border border-default-200/60 bg-default-50/40 backdrop-blur-md px-4 py-3 text-sm font-medium text-default-700 transition-all duration-200 hover:border-fuchsia-400/40 hover:bg-default-100/60 active:scale-[0.99]"
        >
          <Icon icon="fe:github" className="text-xl shrink-0" />
          Continue with GitHub
        </button>
      </div>

      <p className="text-xs text-default-400 text-center mt-5">
        Need to create an account?{" "}
        <Link
          href="/register"
          className="text-xs font-semibold text-fuchsia-500 hover:text-fuchsia-600 transition-colors"
        >
          Register Now
        </Link>
      </p>
    </AuthShell>
  );
}

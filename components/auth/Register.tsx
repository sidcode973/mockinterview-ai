"use client";

import React from "react";
import { Link, Form } from "@heroui/react";
import { registerUser } from "@/actions/auth-actions";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import AuthShell from "./AuthShell";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";

export default function Register() {
  const router = useRouter();

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const res = await registerUser(data.name, data.email, data.password);

    if (res && "error" in res) {
      toast.error(res.error.message);
      return;
    }

    if (res?.created) {
      toast.success("Account created successfully");
      router.push("/login");
    }
  });

  return (
    <AuthShell
      icon="solar:user-plus-bold"
      title="Welcome"
      subtitle="Create an account to get started"
    >
      <Form
        className="flex w-full flex-col gap-4"
        validationBehavior="native"
        onSubmit={handleSubmit}
      >
        <AuthField
          name="name"
          label="Full Name"
          icon="solar:user-linear"
          placeholder="Enter your full name"
          required
        />
        <AuthField
          name="email"
          label="Email Address"
          type="email"
          icon="solar:letter-linear"
          placeholder="Enter your email"
          required
        />
        <AuthField
          name="password"
          label="Password"
          icon="solar:lock-linear"
          placeholder="Min. 8 characters"
          required
          minLength={8}
          toggleVisibility
        />

        <p className="text-xs text-default-400 text-center -mt-1">
          Use 8+ characters with a mix of letters, numbers & symbols
        </p>

        <AuthSubmit loading={loading} loadingText="Creating account…">
          Create Account
        </AuthSubmit>
      </Form>

      <p className="text-xs text-default-400 text-center mt-5">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-xs font-semibold text-fuchsia-500 hover:text-fuchsia-600 transition-colors"
        >
          Log In
        </Link>
      </p>
    </AuthShell>
  );
}

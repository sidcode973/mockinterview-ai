"use client";

import React, { useState } from "react";
import { Button, Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { IUser } from "@/backend/models/user-model";
import toast from "react-hot-toast";
import { updateProfile } from "@/actions/auth-actions";

export default function UpdateProfile() {
  const { data: userData, update } = useSession() as {
    data: { user: IUser } | null;
    update: () => Promise<unknown>;
  };

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { handleSubmit, loading } = useGenericSubmitHandler(async () => {
    const bodyData = {
      name: name.trim() || userData?.user?.name || "",
      email: userData?.user?.email ?? "",
      avatar,
      oldAvatar: userData?.user?.profilePicture?.id,
    };

    const res = await updateProfile(bodyData);

    if (res && "error" in res) {
      toast.error(res.error.message);
      return;
    }

    if (res?.updated) {
      const updateSession = await update();
      if (updateSession) {
        toast.success("Profile updated successfully");
        setName("");
        setAvatar("");
        setFileName("");
        setFileInputKey((k) => k + 1);
      }
    }
  });

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    processFile(files[0]);
  };

  const onDrop: React.DragEventHandler<HTMLLabelElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const currentAvatar = avatar || null;
  const sessionAvatar = userData?.user?.profilePicture?.url ?? null;

  if (userData == undefined) {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="flex flex-col items-center gap-2">
          <div
            className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200"
            style={{ borderTopColor: "#3b82f6" }}
          />
          <p className="text-xs text-slate-400">Loading profile…</p>
        </div>
      </div>
    );
  }

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
      {/* Header — vertical layout, icon on top */}
<div className="flex flex-col items-center gap-2">
  <div
    className="flex h-9 w-9 items-center justify-center rounded-xl"
    style={{
      background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
      boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
    }}
  >
    <Icon icon="solar:user-id-bold" className="text-base text-white" />
  </div>
  <div className="flex flex-col items-center gap-0.5">
    <h1
      className="text-sm font-semibold text-slate-800 leading-tight"
      style={{ letterSpacing: "-0.01em" }}
    >
      Update Profile
    </h1>
    <p className="text-[11px] text-slate-400">Manage your account details</p>
  </div>
</div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <Form
          className="flex w-full flex-col gap-2.5"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          {/* Name field */}
          <div
            className="rounded-lg border px-3 py-1.5 transition-all duration-200"
            style={{
              borderColor: focusedField === "name" ? "#93c5fd" : "#e2e8f0",
              background: focusedField === "name"
                ? "rgba(239,246,255,0.6)"
                : "rgba(255,255,255,0.8)",
              boxShadow:
                focusedField === "name"
                  ? "0 0 0 3px rgba(59,130,246,0.1)"
                  : "0 1px 2px rgba(0,0,0,0.04)",
            }}
          >
            {/* ✅ label: normal weight, small, muted */}
            <label className="block text-[11px] font-normal text-slate-400 mb-0.5">
              Name <span className="text-red-400">*</span>
            </label>
            {/* ✅ input: text-sm so typed text is clearly readable */}
            <input
              name="name"
              type="text"
              placeholder={userData?.user?.name ?? "Enter your name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
            />
          </div>

          {/* Email field — disabled */}
          <div
            className="rounded-lg border px-3 py-1.5 opacity-55"
            style={{
              borderColor: "#e2e8f0",
              background: "rgba(248,250,252,0.9)",
            }}
          >
            <label className="block text-[11px] font-normal text-slate-400 mb-0.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              required
              name="email"
              type="email"
              disabled
              defaultValue={userData?.user?.email ?? ""}
              className="w-full text-sm text-slate-400 bg-transparent outline-none border-none cursor-not-allowed"
            />
          </div>

          {/* Avatar upload */}
          <div className="w-full flex flex-col gap-1">
            <label className="text-[11px] font-normal text-slate-400 px-0.5">
              Avatar
            </label>

            <label
              htmlFor={`avatar-upload-${fileInputKey}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className="group flex items-center w-full cursor-pointer rounded-lg border-2 border-dashed transition-all duration-200 py-2 px-3 gap-3"
              style={{
                borderColor: isDragging ? "#3b82f6" : avatar ? "#6366f1" : "#dde3ed",
                background: isDragging
                  ? "rgba(59,130,246,0.04)"
                  : avatar
                  ? "rgba(99,102,241,0.03)"
                  : "rgba(248,250,252,0.8)",
              }}
            >
              {currentAvatar ? (
                <>
                  <div
                    className="shrink-0 h-8 w-8 rounded-full overflow-hidden border-2"
                    style={{ borderColor: "#6366f1" }}
                  >
                    <img
                      src={currentAvatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 truncate">{fileName}</p>
                    <p className="text-[10px] text-slate-400">Click or drag to replace</p>
                  </div>
                  <Icon icon="solar:pen-bold" className="text-xs text-indigo-400 shrink-0" />
                </>
              ) : sessionAvatar ? (
                <>
                  <div
                    className="shrink-0 h-8 w-8 rounded-full overflow-hidden border-2"
                    style={{ borderColor: "#e2e8f0" }}
                  >
                    <img
                      src={sessionAvatar}
                      alt="Current avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600">Current avatar</p>
                    <p className="text-[10px] text-slate-400">Click or drag to replace</p>
                  </div>
                  <Icon icon="solar:pen-bold" className="text-xs text-indigo-400 shrink-0" />
                </>
              ) : (
                <>
                  <div
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background: isDragging
                        ? "rgba(59,130,246,0.1)"
                        : "rgba(226,232,240,0.8)",
                    }}
                  >
                    <Icon
                      icon={isDragging ? "solar:upload-bold" : "solar:camera-add-bold"}
                      className="text-sm"
                      style={{ color: isDragging ? "#3b82f6" : "#94a3b8" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-600">
                      {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 5 MB</p>
                  </div>
                </>
              )}

              <input
                key={fileInputKey}
                id={`avatar-upload-${fileInputKey}`}
                type="file"
                accept="image/*"
                onChange={onChange}
                className="sr-only"
              />
            </label>
          </div>

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
            {loading ? "Updating..." : "Update Profile"}
            <span
              className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-700 group-hover:translate-x-[200%]"
              aria-hidden="true"
            />
          </Button>
        </Form>
      </div>
    </div>
  );
}
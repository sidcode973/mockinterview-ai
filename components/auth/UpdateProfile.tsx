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
    update: () => Promise<any>;
  };

  const [name, setName] = useState("");           // ✅ always starts empty
  const [avatar, setAvatar] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ Removed useEffect prefill entirely
  // ✅ Removed didClearAfterSubmit — no longer needed

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const bodyData = {
      name: name.trim() || userData?.user?.name || "",
      email: userData?.user?.email ?? "",
      avatar,
      oldAvatar: userData?.user?.profilePicture?.id,
    };

    const res = await updateProfile(bodyData);

    if (res && "error" in res) {
      return toast.error(res.error.message);
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

  // ✅ Only newly selected file goes into input state
  const currentAvatar = avatar || null;

  // ✅ Session avatar shown as read-only reference — never tied to input
  const sessionAvatar = userData?.user?.profilePicture?.url ?? null;

  if (userData == undefined) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200"
            style={{ borderTopColor: "#3b82f6" }}
          />
          <p className="text-sm text-slate-400">Loading profile…</p>
        </div>
      </div>
    );
  }

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
        {/* Header */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 hover:scale-110 hover:rotate-3"
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
            }}
          >
            <Icon icon="solar:user-id-bold" className="text-2xl text-white" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h1
              className="text-xl font-semibold tracking-tight text-slate-800"
              style={{ letterSpacing: "-0.02em" }}
            >
              Update Profile
            </h1>
            <p className="text-sm text-slate-400">Enter details to update your profile</p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <Form
          className="flex w-full flex-col gap-4"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          {/* Name field — empty on mount, placeholder shows current name as hint */}
          <div
            className="w-full rounded-xl transition-all duration-300"
            style={{
              boxShadow:
                focusedField === "name"
                  ? "0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.1)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="rounded-xl border px-4 py-3 transition-all duration-200"
              style={{
                borderColor: focusedField === "name" ? "#93c5fd" : "#e2e8f0",
                background: "rgba(255,255,255,0.8)",
              }}
            >
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                name="name"
                type="text"
                placeholder={userData?.user?.name ?? "Enter your name"} // ✅ hint only
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                className="w-full text-sm text-slate-700 placeholder:text-slate-300 bg-transparent outline-none border-none"
              />
            </div>
          </div>

          {/* Email field — disabled */}
          <div
            className="rounded-xl border px-4 py-3 opacity-60"
            style={{
              borderColor: "#e2e8f0",
              background: "rgba(248,250,252,0.9)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}
          >
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Email Address <span className="text-red-400">*</span>
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

          {/* Avatar upload — drag & drop zone */}
          <div className="w-full flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-600 px-1">Avatar</label>

            <label
              htmlFor={`avatar-upload-${fileInputKey}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className="group relative flex flex-col items-center justify-center w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 py-5 px-4 gap-3"
              style={{
                borderColor: isDragging ? "#3b82f6" : avatar ? "#6366f1" : "#cbd5e1",
                background: isDragging
                  ? "rgba(59,130,246,0.05)"
                  : avatar
                  ? "rgba(99,102,241,0.04)"
                  : "rgba(248,250,252,0.8)",
                boxShadow: isDragging
                  ? "0 0 0 3px rgba(59,130,246,0.15)"
                  : "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              {currentAvatar ? (
                // ✅ Newly selected file preview
                <div className="flex items-center gap-4 w-full">
                  <div
                    className="shrink-0 h-14 w-14 rounded-full overflow-hidden border-2 transition-all duration-300"
                    style={{ borderColor: "#6366f1", boxShadow: "0 4px 12px rgba(99,102,241,0.25)" }}
                  >
                    <img src={currentAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-600 truncate">{fileName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click or drag to replace</p>
                  </div>
                  <div
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "rgba(99,102,241,0.1)" }}
                  >
                    <Icon icon="solar:pen-bold" className="text-sm text-indigo-500" />
                  </div>
                </div>
              ) : sessionAvatar ? (
                // ✅ Show current session avatar as read-only reference
                <div className="flex items-center gap-4 w-full">
                  <div
                    className="shrink-0 h-14 w-14 rounded-full overflow-hidden border-2"
                    style={{ borderColor: "#cbd5e1" }}
                  >
                    <img src={sessionAvatar} alt="Current avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-600">Current avatar</p>
                    <p className="text-xs text-slate-400 mt-0.5">Click or drag to replace</p>
                  </div>
                  <div
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{ background: "rgba(99,102,241,0.1)" }}
                  >
                    <Icon icon="solar:pen-bold" className="text-sm text-indigo-500" />
                  </div>
                </div>
              ) : (
                // ✅ No avatar at all — empty upload state
                <>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{ background: isDragging ? "rgba(59,130,246,0.12)" : "rgba(226,232,240,0.8)" }}
                  >
                    <Icon
                      icon={isDragging ? "solar:upload-bold" : "solar:camera-add-bold"}
                      className="text-xl transition-colors duration-200"
                      style={{ color: isDragging ? "#3b82f6" : "#94a3b8" }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-600">
                      {isDragging ? "Drop your image here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5 MB</p>
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
"use client";

import React, { useState } from "react";
import { Form } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useSession } from "next-auth/react";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { IUser } from "@/backend/models/user-model";
import toast from "react-hot-toast";
import { updateProfile } from "@/actions/auth-actions";
import GlassCard from "../ui/GlassCard";
import AuthField from "./AuthField";
import AuthSubmit from "./AuthSubmit";
import { m } from "framer-motion";

export default function UpdateProfile() {
  const { data: userData, update } = useSession() as {
    data: { user: IUser } | null;
    update: () => Promise<unknown>;
  };

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
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
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-default-200 border-t-fuchsia-500" />
          <p className="text-xs text-default-400">Loading profile…</p>
        </div>
      </div>
    );
  }

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
            <Icon icon="solar:user-id-bold" className="text-lg text-white" />
          </div>
          <div className="flex flex-col items-center gap-0.5 text-center">
            <h1 className="text-base font-semibold tracking-tight">Update Profile</h1>
            <p className="text-xs text-default-500">Manage your account details</p>
          </div>
        </div>

        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-default-200/60 to-transparent" />

        <Form
          className="flex w-full flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <AuthField
            name="name"
            label="Name"
            icon="solar:user-linear"
            placeholder={userData?.user?.name ?? "Enter your name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <AuthField
            name="email"
            label="Email"
            type="email"
            icon="solar:letter-linear"
            defaultValue={userData?.user?.email ?? ""}
            disabled
            required
          />

          <div className="w-full flex flex-col gap-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-default-500 px-0.5">
              Avatar
            </label>

            <label
              htmlFor={`avatar-upload-${fileInputKey}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              className={`group flex items-center w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 py-3 px-3 gap-3 ${
                isDragging
                  ? "border-fuchsia-400 bg-fuchsia-500/5"
                  : avatar
                  ? "border-cyan-400/60 bg-cyan-500/5"
                  : "border-default-200/60 bg-default-50/30 hover:border-fuchsia-400/40"
              }`}
            >
              {currentAvatar ? (
                <>
                  <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden ring-2 ring-cyan-500/40">
                    <img
                      src={currentAvatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{fileName}</p>
                    <p className="text-[10px] text-default-400">Click or drag to replace</p>
                  </div>
                  <Icon icon="solar:pen-bold" className="text-xs text-cyan-400 shrink-0" />
                </>
              ) : sessionAvatar ? (
                <>
                  <div className="shrink-0 h-9 w-9 rounded-full overflow-hidden ring-2 ring-default-200/60">
                    <img
                      src={sessionAvatar}
                      alt="Current avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">Current avatar</p>
                    <p className="text-[10px] text-default-400">Click or drag to replace</p>
                  </div>
                  <Icon icon="solar:pen-bold" className="text-xs text-cyan-400 shrink-0" />
                </>
              ) : (
                <>
                  <div
                    className={`shrink-0 flex h-9 w-9 items-center justify-center rounded-full ${
                      isDragging ? "bg-fuchsia-500/15" : "bg-default-200/40"
                    }`}
                  >
                    <Icon
                      icon={isDragging ? "solar:upload-bold" : "solar:camera-add-bold"}
                      className={`text-base ${isDragging ? "text-fuchsia-500" : "text-default-400"}`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      {isDragging ? "Drop image here" : "Click to upload or drag & drop"}
                    </p>
                    <p className="text-[10px] text-default-400">PNG, JPG, WEBP up to 5 MB</p>
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

          <AuthSubmit loading={loading} loadingText="Updating…">
            Update Profile
          </AuthSubmit>
        </Form>
      </GlassCard>
    </m.div>
  );
}

"use client";

import React from "react";
import { Icon } from "@iconify/react";

type Props = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: string;
  required?: boolean;
  minLength?: number;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  toggleVisibility?: boolean;
};

export default function AuthField({
  name,
  label,
  type = "text",
  placeholder,
  icon,
  required,
  minLength,
  defaultValue,
  value,
  onChange,
  disabled,
  toggleVisibility,
}: Props) {
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const effectiveType = toggleVisibility ? (visible ? "text" : "password") : type;

  return (
    <div
      className={`w-full rounded-xl border transition-all duration-300 ${
        focused
          ? "border-fuchsia-400/60 ring-2 ring-fuchsia-500/15 bg-default-50/40"
          : "border-default-200/60 bg-default-50/30"
      } ${disabled ? "opacity-60" : ""}`}
    >
      <div className="px-4 py-2.5">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-default-500 mb-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
        <div className="flex items-center gap-2">
          <Icon icon={icon} className="text-base text-default-400 shrink-0" />
          <input
            required={required}
            minLength={minLength}
            name={name}
            type={effectiveType}
            placeholder={placeholder}
            defaultValue={defaultValue}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full text-sm text-foreground placeholder:text-default-400 bg-transparent outline-none border-none disabled:cursor-not-allowed"
          />
          {toggleVisibility && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="flex items-center justify-center h-7 w-7 rounded-lg shrink-0 transition-colors hover:bg-fuchsia-500/10"
              aria-label={visible ? "Hide password" : "Show password"}
            >
              <Icon
                icon={visible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                className="text-base text-default-400"
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

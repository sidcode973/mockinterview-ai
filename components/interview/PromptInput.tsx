"use client";

import type { TextAreaProps } from "@heroui/react";

import React from "react";
import { Textarea } from "@heroui/react";
import { cn } from "@heroui/react";

const PromptInput: React.FC<TextAreaProps> = ({ classNames = {}, ...props }) => {
  const mergedClassNames = {
    ...classNames,
    label: cn("hidden", classNames?.label),
    input: cn("py-0", classNames?.input),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TextareaAny = Textarea as any;

  return (
    <TextareaAny
      aria-label="Prompt"
      className="min-h-10"
      classNames={mergedClassNames}
      minRows={1}
      placeholder="Enter your answer here"
      radius="lg"
      variant="bordered"
      {...props}
    />
  );
};

export default PromptInput;

"use client";

import React from "react";
import { Progress } from "@heroui/react";
import GlassCard from "../ui/GlassCard";

type ResultProps = {
  overallScore: number;
  clarity: number;
  relevance: number;
  completeness: number;
};

export default function ResultScore({ result }: { result: ResultProps }) {
  const data = [
    {
      title: "Overall Score",
      value: result?.overallScore,
      status: "good",
    },
    {
      title: "Clarity",
      value: result?.clarity,
      status: "warn",
    },
    {
      title: "Relevance",
      value: result?.relevance,
      status: "warn",
    },
    {
      title: "Completeness",
      value: result?.completeness,
      status: "warn",
    },
  ];

  return (
    <div className="mt-5 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {data.map((item, index) => (
        <GlassCard key={index} variant="soft" className="flex flex-col p-3">
          <div>
            <div className="my-1 text-sm font-medium text-default-500">
              {item.title}
            </div>
            <div className="text-xl font-semibold tabular-nums">
              <span className={item.status === "good" ? "text-gradient-cyan" : "text-foreground"}>
                {item.value}
              </span>
              <span className="text-default-400">/10</span>
            </div>
          </div>
          <Progress
            size="sm"
            className="mt-2"
            color={item.status === "good" ? "success" : "warning"}
            value={item.value * 10}
          />
        </GlassCard>
      ))}
    </div>
  );
}

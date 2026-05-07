"use client";

import React from "react";

import { IQuestion } from "@/backend/models/interview-model";
import ResultScore from "./ResultScore";
import GlassCard from "../ui/GlassCard";

type Props = {
  index: number;
  question: IQuestion;
};

const QuestionCard = ({ index, question }: Props) => {
  return (
    <GlassCard variant="soft" className="overflow-hidden">
      <div className="flex h-full flex-row items-start gap-3 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500/15 to-cyan-500/15 ring-1 ring-fuchsia-500/30">
          <span className="text-base font-bold text-gradient-fusion">{index}</span>
        </div>
        <div className="flex flex-col">
          <p className="text-large font-medium">{question?.question}</p>

          <p className="text-medium mt-5 mb-1 text-warning">Your Answer:</p>
          <p className="text-small text-default-500">{question?.answer}</p>

          <ResultScore result={question?.result} />

          <p className="text-medium mt-5 mb-1 text-success">
            Remarks/Suggestion:
          </p>
          <p className="text-small text-default-500">
            {question?.result?.suggestion}
          </p>
        </div>
      </div>
    </GlassCard>
  );
};

export default QuestionCard;

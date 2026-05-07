"use client";

import React from "react";
import { Icon } from "@iconify/react";
import FeatureCard from "./FeatureCard";
import { MotionStagger, MotionStaggerItem } from "@/components/ui/motion";
import MotionFadeIn from "@/components/ui/motion/MotionFadeIn";

const featuresCategories = [
  {
    key: "generate",
    title: "Generate Questions",
    icon: <Icon icon="solar:mask-happly-linear" width={32} />,
    descriptions: [
      "Create tailored interview questions based on your field of expertise.",
      "Cover a wide range of topics to ensure comprehensive preparation.",
      "Generate role-specific scenarios to test critical thinking.",
    ],
  },
  {
    key: "provide",
    title: "Answer Assistance",
    icon: <Icon icon="solar:magic-stick-3-linear" width={32} />,
    descriptions: [
      "Get AI-powered suggestions to craft impactful answers.",
      "Practice with model answers to refine your responses.",
      "Simulate real-time interviews with Prep AI.",
    ],
  },
  {
    key: "analyze",
    title: "Analyze and Improve",
    icon: <Icon icon="solar:shield-warning-outline" width={32} />,
    descriptions: [
      "Receive detailed feedback on your performance.",
      "Identify strengths and areas for improvement.",
      "Track your progress over time to ensure readiness.",
    ],
  },
];

export default function InterviewProcessCards() {
  return (
    <div className="my-16 w-full">
      <MotionFadeIn className="text-center">
        <span className="tracking-tight inline font-semibold text-gradient-fusion text-[2.3rem] lg:text-5xl leading-9">
          Trusted Process
        </span>
      </MotionFadeIn>

      <MotionStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 my-10">
        {featuresCategories.map((category) => (
          <MotionStaggerItem key={category.key}>
            <FeatureCard
              descriptions={category.descriptions}
              icon={category.icon}
              title={category.title}
            />
          </MotionStaggerItem>
        ))}
      </MotionStagger>
    </div>
  );
}

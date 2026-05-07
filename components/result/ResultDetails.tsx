"use client";

import React, { useState } from "react";

import { Chip, Pagination } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview-model";
import QuestionCard from "./QuestionCard";
import { getTotalPages, paginate } from "@/helpers/helper";
import ResultStats from "./ResultStats";
import MotionFadeIn from "../ui/motion/MotionFadeIn";
import { MotionStagger, MotionStaggerItem } from "../ui/motion";

export default function ResultDetails({
  interview,
}: {
  interview: IInterview;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 2;

  const totalPages = getTotalPages(
    interview?.questions?.length,
    questionsPerPage
  );

  const currentQuestions = paginate(
    interview?.questions,
    currentPage,
    questionsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="px-1 sm:px-5">
        <MotionFadeIn>
          <ResultStats interview={interview} />
        </MotionFadeIn>

        <div className="w-full flex flex-col gap-3">
          <MotionFadeIn delay={0.1}>
            <div className="flex flex-col md:flex-row justify-between items-center my-5 gap-4">
              <div className="flex flex-wrap gap-3">
                <Chip
                  color="primary"
                  startContent={
                    <Icon icon="tabler:circle-check-filled" width={20} />
                  }
                  variant="faded"
                >
                  {interview?.industry}
                </Chip>

                <Chip
                  color="warning"
                  startContent={
                    <Icon icon="tabler:circle-check-filled" width={20} />
                  }
                  variant="faded"
                >
                  {interview?.type}
                </Chip>

                <Chip
                  color="secondary"
                  startContent={
                    <Icon icon="tabler:circle-check-filled" width={20} />
                  }
                  variant="faded"
                >
                  {interview?.topic}
                </Chip>
              </div>
            </div>
          </MotionFadeIn>

          <MotionStagger key={currentPage} className="flex flex-col gap-3">
            {currentQuestions.map((question, index) => (
              <MotionStaggerItem key={index}>
                <QuestionCard
                  index={(currentPage - 1) * questionsPerPage + index + 1}
                  question={question}
                />
              </MotionStaggerItem>
            ))}
          </MotionStagger>

          <div className="flex justify-center items-center mt-10 mb-6">
            <Pagination
              showControls
              showShadow
              size="lg"
              radius="lg"
              classNames={{
                wrapper: "gap-2",
                item: "w-10 h-10 text-sm font-medium bg-default-100/40 backdrop-blur-md hover:bg-default-200/50",
                cursor: "w-10 h-10 text-sm font-bold bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white shadow-md shadow-fuchsia-500/40",
                prev: "w-10 h-10 bg-default-100/40 backdrop-blur-md hover:bg-default-200/50",
                next: "w-10 h-10 bg-default-100/40 backdrop-blur-md hover:bg-default-200/50",
              }}
              initialPage={1}
              total={totalPages}
              page={currentPage}
              onChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

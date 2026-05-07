"use client";

import React, { useEffect, useState } from "react";
import { Progress, Button, Alert, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview, IQuestion } from "@/backend/models/interview-model";
import { formatTime } from "@/helpers/helper";

import {
  getAnswerFromLocalStorage,
  getAnswersFromLocalStorage,
  getFirstIncompleteQuestionIndex,
  saveAnswerToLocalStorage,
} from "@/helpers/interview";
import toast from "react-hot-toast";
import { updateInteview } from "@/actions/interview-actions";
import { useRouter } from "next/navigation";
import PromptInputWithBottomActions from "./PromptInputWithBottomActions";
import GlassCard from "../ui/GlassCard";
import { m, AnimatePresence } from "framer-motion";

export default function InterviewPage({ interview }: { interview: IInterview }) {
  const initialQuestionIndex = getFirstIncompleteQuestionIndex(
    interview?.questions
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [answer, setAnswer] = useState("");

  const [timeLeft, setTimeLeft] = useState(interview?.durationLeft);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const currentQuestion = interview?.questions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft === 0) {
      handleExitInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  useEffect(() => {
    const storedAnswers = getAnswersFromLocalStorage(interview?._id?.toString());

    if (storedAnswers) {
      setAnswers(storedAnswers);
    } else {
      interview?.questions?.forEach((question: IQuestion) => {
        if (question?.completed) {
          saveAnswerToLocalStorage(
            interview?._id?.toString(),
            question?._id?.toString(),
            question?.answer
          );
        }
      });
    }
  }, [interview?._id, interview?.questions]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }

        if (prevTime === 10) {
          setShowAlert(true);
        }

        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
  };

  const saveAnswerToDB = async (questionId: string, answer: string) => {
    setLoading(true);

    try {
      const res = await updateInteview(
        interview?._id?.toString(),
        timeLeft?.toString(),
        questionId,
        answer
      );

      if (res && "error" in res) {
        setLoading(false);
        return toast.error(res.error.message);
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async (answer: string) => {
    const previousAnswer = answers[currentQuestion?._id?.toString()];

    if (previousAnswer !== answer && answer !== "") {
      await saveAnswerToDB(currentQuestion?._id?.toString(), answer);
      saveAnswerToLocalStorage(interview?._id?.toString(), currentQuestion?._id?.toString(), answer);
    }

    setAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers };
      newAnswers[currentQuestion?._id?.toString()] = answer;
      return newAnswers;
    });

    if (currentQuestionIndex < interview?.numOfQuestions - 1) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex + 1;

        const nextQuestion = interview.questions[newIndex];
        setAnswer(getAnswerFromLocalStorage(interview?._id?.toString(), nextQuestion?._id?.toString()));

        return newIndex;
      });
    } else if (currentQuestionIndex === interview?.numOfQuestions - 1) {
      setCurrentQuestionIndex(0);
      setAnswer(
        getAnswerFromLocalStorage(interview?._id?.toString(), interview.questions[0]?._id?.toString())
      );
    } else {
      setAnswer("");
    }
  };

  const handlePassQuestion = async () => {
    await handleNextQuestion("pass");
  };

  const handlePreviousQuestion = async () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => {
        const newIndex = prevIndex - 1;

        const previousQuestion = interview.questions[newIndex];
        setAnswer(
          getAnswerFromLocalStorage(interview?._id?.toString(), previousQuestion?._id?.toString())
        );

        return newIndex;
      });
    }
  };

  const handleExitInterview = async () => {
    setLoading(true);

    try {
      const res = await updateInteview(
        interview?._id?.toString(),
        timeLeft?.toString(),
        currentQuestion?._id?.toString(),
        answer,
        true
      );

      if (res && "error" in res) {
        setLoading(false);
        return toast.error(res.error.message);
      }

      if (res && "updated" in res && res.updated) {
        setLoading(false);
        router.push("/app/interviews");
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full max-w-full flex-col gap-6">
      {showAlert && (
        <Alert
          color="danger"
          description={"Interview is about to exit"}
          title={"Time up!"}
        />
      )}

      <GlassCard variant="soft" className="p-4">
        <Progress
          aria-label="Interview Progress"
          className="w-full"
          color="secondary"
          classNames={{
            indicator: "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
          }}
          label={`Question ${currentQuestionIndex + 1} of ${interview?.numOfQuestions}`}
          size="md"
          value={((currentQuestionIndex + 1) / interview?.numOfQuestions) * 100}
        />
      </GlassCard>

      <div className="flex flex-wrap gap-1.5">
        {interview?.questions?.map((question: IQuestion, index: number) => (
          <Chip
            key={index}
            color={answers[question?._id?.toString()] ? "success" : "default"}
            size="sm"
            variant="flat"
            className={`font-bold cursor-pointer text-sm transition-transform hover:scale-110 ${
              index === currentQuestionIndex ? "ring-2 ring-fuchsia-500/50" : ""
            }`}
            onClick={() => {
              setCurrentQuestionIndex(index);
              setAnswer(
                getAnswerFromLocalStorage(interview?._id?.toString(), question?._id?.toString())
              );
            }}
          >
            {index + 1}
          </Chip>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm font-semibold">
          <Icon icon="solar:clock-circle-bold" className="text-fuchsia-500" />
          Duration Left:{" "}
          <span className="text-gradient-cyan tabular-nums">{formatTime(timeLeft)}</span>
        </div>
        <Button
          color="danger"
          startContent={<Icon icon="solar:exit-outline" fontSize={18} />}
          variant="solid"
          onPress={handleExitInterview}
          isDisabled={loading}
          isLoading={loading}
        >
          Save & Exit Interview
        </Button>
      </div>

      <AnimatePresence mode="wait">
        <m.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassCard variant="strong" className="px-6 py-10 text-center">
            <span
              className={`tracking-tight inline font-semibold text-gradient-fusion text-[1.4rem] lg:text-2.5xl flex items-center justify-center min-h-[120px]`}
            >
              {currentQuestion?.question}
            </span>
          </GlassCard>
        </m.div>
      </AnimatePresence>

      <PromptInputWithBottomActions
        key={currentQuestionIndex}
        value={answer}
        onChange={handleAnswerChange}
      />

      <div className="flex justify-between items-center">
        <Button
          className="bg-foreground px-4.5 py-2 font-medium text-background"
          radius="full"
          color="secondary"
          variant="flat"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-2"
              icon="solar:arrow-left-linear"
              width={20}
            />
          }
          onPress={handlePreviousQuestion}
          isDisabled={loading || currentQuestionIndex === 0}
          isLoading={loading}
        >
          Previous
        </Button>

        <Button
          className="px-7 py-2"
          radius="full"
          variant="flat"
          color="success"
          startContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-2"
              icon="solar:compass-big-bold"
              width={18}
            />
          }
          onPress={() => handlePassQuestion()}
          isDisabled={loading}
          isLoading={loading}
        >
          Pass
        </Button>

        <Button
          className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-4.5 py-2 font-medium text-white shadow-md shadow-fuchsia-500/20"
          radius="full"
          variant="solid"
          endContent={
            <Icon
              className="flex-none outline-none [&>path]:stroke-2"
              icon="solar:arrow-right-linear"
              width={20}
            />
          }
          onPress={() => handleNextQuestion(answer)}
          isDisabled={loading}
          isLoading={loading}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

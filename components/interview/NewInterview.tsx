"use client";

import React from "react";
import { Form, Input, Select, SelectItem, Button } from "@heroui/react";
import {
  industryTopics,
  interviewDifficulties,
  interviewTypes,
} from "@/constants/data";
import { useGenericSubmitHandler } from "../form/genericSubmitHandler";
import { InterviewBody } from "@/backend/types/interview-types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IUser } from "@/backend/models/user-model";
import toast from "react-hot-toast";
import { newInterview } from "@/actions/interview-actions";

const interviewIndustries = Object.keys(industryTopics);

export default function NewInterview() {
  const [selectedIndustry, setSelectedIndustry] = React.useState("");
  const [topics, setTopics] = React.useState<string[]>([]);

  const { data } = useSession();
  const user = data?.user as IUser;
  const router = useRouter();

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const industry = e.target.value as keyof typeof industryTopics;

    setSelectedIndustry(industry);
    setTopics(industryTopics[industry] || []);
  };

  const { handleSubmit, loading } = useGenericSubmitHandler(async (data) => {
    const interviewData: InterviewBody = {
      industry: data.industry,
      topic: data.topic,
      type: data.type,
      role: data.role,
      difficulty: data.difficulty,
      numOfQuestions: Number(data.numOfQuestions),
      duration: Number(data.duration),
      user: String(user?._id ?? ""),
    };

    const res = await newInterview(interviewData);

    if (res && "error" in res) {
      toast.error(res.error.message);
      return;
    }

    if (res && "created" in res && res.created) {
      toast.success("Interview created successfully");
      router.push("/app/interviews");
    }
  });

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Create New Interview</h2>
        <p className="text-default-500 text-sm mt-1">Configure your AI-powered mock interview session</p>
      </div>

      <Form validationBehavior="native" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 w-full">
          <div className="col-span-1">
            <div className="bg-default-50/50 rounded-xl p-6 border border-default-200/60">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wider mb-4">Interview Setup</h3>
              <div className="flex flex-col gap-4 w-full">
                <Select
                  isRequired
                  label="Industry"
                  labelPlacement="outside"
                  name="industry"
                  placeholder="Select Industry"
                  onChange={handleIndustryChange}
                  variant="bordered"
                >
                  {interviewIndustries?.map((industry) => (
                    <SelectItem key={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  isRequired
                  label="Topic"
                  labelPlacement="outside"
                  name="topic"
                  placeholder="Select Topic"
                  disabled={!selectedIndustry}
                  variant="bordered"
                >
                  {topics?.map((topic) => (
                    <SelectItem key={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  isRequired
                  label="Interview Type"
                  labelPlacement="outside"
                  name="type"
                  placeholder="Select interview type"
                  variant="bordered"
                >
                  {interviewTypes?.map((type) => (
                    <SelectItem key={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  isRequired
                  type="text"
                  label="Job Role"
                  labelPlacement="outside"
                  name="role"
                  placeholder="software developer, data scientist, etc."
                  variant="bordered"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <div className="bg-default-50/50 rounded-xl p-6 border border-default-200/60">
              <h3 className="text-sm font-semibold text-default-600 uppercase tracking-wider mb-4">Preferences</h3>
              <div className="flex flex-col gap-4 w-full">
                <Select
                  isRequired
                  label="Difficulty"
                  labelPlacement="outside"
                  name="difficulty"
                  placeholder="Select difficulty"
                  variant="bordered"
                >
                  {interviewDifficulties?.map((difficulty) => (
                    <SelectItem key={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  isRequired
                  type="number"
                  label="No of Question"
                  labelPlacement="outside"
                  name="numOfQuestions"
                  placeholder="Enter no of questions"
                  variant="bordered"
                />

                <Input
                  isRequired
                  type="number"
                  label="Duration"
                  labelPlacement="outside"
                  name="duration"
                  placeholder="Enter duration"
                  variant="bordered"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 w-full">
          <Button type="reset" variant="flat" size="md">
            Reset
          </Button>
          <Button
            color="primary"
            type="submit"
            size="md"
            className="px-8 font-medium"
            isLoading={loading}
            isDisabled={loading}
          >
            Create Interview
          </Button>
        </div>
      </Form>
    </div>
  );
}

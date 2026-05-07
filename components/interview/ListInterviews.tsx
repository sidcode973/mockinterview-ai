"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { IInterview } from "@/backend/models/interview-model";
import { Key } from "@react-types/shared";
import { usePathname, useRouter } from "next/navigation";
import { deleteInterview } from "@/actions/interview-actions";
import toast from "react-hot-toast";
import Link from "next/link";
import CustomPagination from "../layout/pagination/CustomPagination";
import StatusFilter from "../layout/filter/StatusFilter";
import { isAdminPath } from "@/helpers/auth";
import GlassCard from "../ui/GlassCard";
import MotionFadeIn from "../ui/motion/MotionFadeIn";

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type ListInterviewProps = {
  data: {
    interviews: IInterview[];
    resPerPage: number;
    filteredCount: number;
  };
};

export default function ListInterviews({ data }: ListInterviewProps) {
  const { interviews, resPerPage, filteredCount } = data;

  const router = useRouter();
  const pathName = usePathname();

  const deleteInterviewHandler = React.useCallback(
    async (interviewId: string) => {
      const res = await deleteInterview(interviewId);

      if (res && "error" in res) {
        toast.error(res.error.message);
        return;
      }

      if (res && "deleted" in res && res.deleted) {
        toast.success("Interview deleted successfully");

        if (isAdminPath(pathName)) {
          router.push("/admin/interviews");
        } else {
          router.push("/app/interviews");
        }
      }
    },
    [pathName, router]
  );

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview];

      switch (columnKey) {
        case "interview":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-foreground capitalize">
                {interview?.topic}
              </p>
              <p className="text-xs text-default-400 mt-0.5 capitalize">
                {interview?.type}
              </p>
            </div>
          );
        case "result":
          return (
            <div className="flex flex-col">
              <p className="font-semibold text-foreground">
                {interview?.answered} / {interview?.numOfQuestions}
              </p>
              <p className="text-xs text-default-400 mt-0.5">
                {interview?.numOfQuestions} Questions
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize text-xs font-medium"
              color={interview?.status === "completed" ? "success" : "warning"}
              size="sm"
              variant="flat"
            >
              {interview.status}
            </Chip>
          );
        case "actions":
          return (
            <>
              {interview?.answered === 0 &&
              interview?.status !== "completed" &&
              !isAdminPath(pathName) ? (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white font-medium rounded-lg min-w-[100px] shadow-md shadow-fuchsia-500/20"
                  endContent={
                    <Icon icon="solar:arrow-right-linear" fontSize={16} />
                  }
                  as={Link}
                  href={`/app/conduct/${interview._id}`}
                >
                  Start
                </Button>
              ) : (
                <div className="relative flex items-center justify-center gap-2">
                  {interview?.status !== "completed" &&
                    !isAdminPath(pathName) && (
                      <Tooltip color="primary" content="Continue Interview">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() =>
                            router.push(`/app/conduct/${interview._id}`)
                          }
                        >
                          <Icon
                            icon="solar:round-double-alt-arrow-right-bold"
                            fontSize={20}
                          />
                        </Button>
                      </Tooltip>
                    )}

                  {interview?.status === "completed" && (
                    <Tooltip color="primary" content="View Results">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="primary"
                        onPress={() =>
                          router.push(`/app/results/${interview._id}`)
                        }
                      >
                        <Icon
                          icon="solar:round-double-alt-arrow-right-bold"
                          fontSize={20}
                        />
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip color="danger" content="Delete Interview">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() =>
                        deleteInterviewHandler(interview._id.toString())
                      }
                    >
                      <Icon
                        icon="solar:trash-bin-trash-outline"
                        fontSize={19}
                      />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </>
          );
        default:
          return String(cellValue ?? "");
      }
    },
    [deleteInterviewHandler, pathName, router]
  );

  return (
    <div className="my-4">
      <div className="flex justify-end items-center mb-5">
        <StatusFilter />
      </div>

      {interviews.length === 0 ? (
        <MotionFadeIn>
          <GlassCard variant="soft" className="flex flex-col items-center justify-center py-20 text-center">
            <Icon
              icon="solar:clipboard-list-linear"
              fontSize={48}
              className="text-default-300 mb-4"
            />
            <p className="text-default-500 font-medium">No interviews found</p>
            <p className="text-default-400 text-sm mt-1">
              Try a different filter or create a new interview
            </p>
          </GlassCard>
        </MotionFadeIn>
      ) : (
        <MotionFadeIn>
          <GlassCard variant="soft" className="overflow-hidden">
            <Table aria-label="Interviews table" removeWrapper>
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn
                    key={column.uid}
                    align={column.uid === "actions" ? "center" : "start"}
                    className="text-xs font-semibold text-default-500 uppercase tracking-wider bg-default-100/30"
                  >
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={interviews}>
                {(item) => (
                  <TableRow key={item._id.toString()}>
                    {(columnKey) => (
                      <TableCell>{renderCell(item, columnKey)}</TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </GlassCard>
        </MotionFadeIn>
      )}

      <div className="flex justify-center items-center mt-10">
        <CustomPagination
          resPerPage={resPerPage}
          filteredCount={filteredCount}
        />
      </div>
    </div>
  );
}

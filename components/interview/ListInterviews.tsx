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
} from "@heroui/react" ;
import { Icon } from "@iconify/react" ;
import { IInterview } from "@/backend/models/interview-model" ;
import { Key } from "@react-types/shared" ;
import { useRouter } from "next/navigation" ;
import { deleteInterview } from "@/actions/interview-actions" ;
import toast from "react-hot-toast" ;
import Link from "next/link"
import { calculateAverageScore } from "@/helpers/interview";

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

type ListInterviewProps = {
  data: {
    interviews: IInterview[];
  };
};

export default function ListInterviews({ data }: ListInterviewProps) {
  const { interviews } = data;

  const router = useRouter();

  const deleteInterviewHandler = React.useCallback(async (interviewId: string) => {
    const res = await deleteInterview(interviewId);

    if (res && "error" in res) {
      toast.error(res.error.message);
      return;
    }

    if (res && "deleted" in res && res.deleted) {
      toast.success("Interview deleted successfully");
      router.push("/app/interviews");
    }
  }, [router]);

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key) => {
      const cellValue = interview[columnKey as keyof IInterview];

      switch (columnKey) {
        case "interview":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-default-800 capitalize">{interview?.topic}</p>
              <p className="text-xs text-default-400 mt-0.5 capitalize">
                {interview?.type}
              </p>
            </div>
          );
        case "result":
          return (
            <div className="flex flex-col">
              <p className="font-semibold text-default-800">
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
              interview?.status !== "completed" ? (
                <Button
                  size="sm"
                  className="bg-foreground text-background font-medium rounded-lg min-w-[100px]"
                  endContent={
                    <Icon icon="solar:arrow-right-linear" fontSize={16} />
                  }
                  as={Link}
                  href={`/app/conduct/${interview._id}`}
                >
                  Start
                </Button>
              ) : (
                <div className="relative flex items-center gap-2">
                  {interview?.status !== "completed" && (
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
                  <Tooltip color="danger" content="Delete Interview">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => deleteInterviewHandler(interview._id.toString())}
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
    [deleteInterviewHandler, router]
  );

  return (
    <div className="my-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-default-800">My Interviews</h2>
        <Chip size="sm" variant="flat" color="default" className="text-xs font-medium text-default-500">
          {interviews.length} {interviews.length === 1 ? "interview" : "interviews"}
        </Chip>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Icon icon="solar:clipboard-list-linear" fontSize={48} className="text-default-300 mb-4" />
          <p className="text-default-500 font-medium">No interviews yet</p>
          <p className="text-default-400 text-sm mt-1">Create your first interview to get started</p>
        </div>
      ) : (
        <div className="rounded-xl border border-default-200/60 shadow-sm overflow-hidden">
          <Table aria-label="Interviews table" removeWrapper>
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  className="text-xs font-semibold text-default-500 uppercase tracking-wider bg-default-50/80"
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
        </div>
      )}
    </div>
  );
}

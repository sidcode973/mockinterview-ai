"use client";

import React from "react";
import { IInterview } from "@/backend/models/interview-model";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import Link from "next/link";
import CustomPagination from "../layout/pagination/CustomPagination";
import StatusFilter from "../layout/filter/StatusFilter";

type Props = {
  data: {
    interviews: IInterview[];
    resPerPage: number;
    filteredCount: number;
  };
};

export const columns = [
  { name: "INTERVIEW", uid: "interview" },
  { name: "RESULT", uid: "result" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const ListResults = ({ data }: Props) => {
  const { interviews, resPerPage, filteredCount } = data;

  const renderCell = React.useCallback(
    (interview: IInterview, columnKey: Key): React.ReactNode => {
      const cellValue = interview[columnKey as keyof IInterview];

      switch (columnKey) {
        case "interview":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-default-800 capitalize">
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
              {interview?.status}
            </Chip>
          );
        case "actions":
          return interview?.status === "completed" ? (
            <Button
              size="sm"
              className="bg-foreground text-background font-medium rounded-lg min-w-[120px]"
              endContent={<Icon icon="solar:arrow-right-linear" fontSize={16} />}
              variant="flat"
              as={Link}
              href={`/app/results/${interview._id}`}
            >
              View Result
            </Button>
          ) : (
            <p className="text-xs text-default-400">
              Complete interview first
            </p>
          );
        default:
          return cellValue == null ? null : String(cellValue);
      }
    },
    []
  );

  return (
    <div className="my-4">
      {/* Filter bar */}
      <div className="flex justify-end items-center mb-5">
        <StatusFilter />
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-default-200/60 bg-default-50/30">
          <Icon
            icon="solar:clipboard-list-linear"
            fontSize={48}
            className="text-default-300 mb-4"
          />
          <p className="text-default-500 font-medium">No results found</p>
          <p className="text-default-400 text-sm mt-1">
            Complete an interview to see your results here
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-default-200/60 shadow-sm overflow-hidden">
          <Table aria-label="Results table" removeWrapper>
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

      <div className="flex justify-center items-center mt-10">
        <CustomPagination
          resPerPage={resPerPage}
          filteredCount={filteredCount}
        />
      </div>
    </div>
  );
};

export default ListResults;

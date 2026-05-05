"use client";

import React, { useCallback, useState } from "react";
import Stripe from "stripe";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Pagination,
  Alert,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Key } from "@react-types/shared";
import Link from "next/link";
import { getTotalPages, paginate } from "@/helpers/helper";

// Locale-independent formatter so server and client always produce the same string
// (avoids React hydration mismatches caused by toLocaleDateString()).
const formatDate = (unixSeconds: number | undefined | null): string => {
  if (!unixSeconds) return "—";
  const d = new Date(unixSeconds * 1000);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
};

export const columns = [
  { name: "INVOICE", uid: "invoice" },
  { name: "BILL PAID", uid: "bill" },
  { name: "BILLING DATE", uid: "date" },
  { name: "ACTIONS", uid: "actions" },
];

type Props = {
  invoices: Stripe.Invoice[];
};

const ListInvoices = ({ invoices }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;

  const renderCell = useCallback(
    (invoice: Stripe.Invoice, columnKey: Key): React.ReactNode => {
      switch (columnKey) {
        case "invoice":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-sm capitalize text-default-800">
                {invoice?.account_name ?? "—"}
              </p>
              <p className="text-xs text-default-400 mt-0.5">{invoice?.id}</p>
            </div>
          );

        case "bill":
          return (
            <Chip
              className="capitalize text-xs font-medium"
              color="success"
              size="sm"
              variant="flat"
            >
              ${((invoice?.amount_paid ?? 0) / 100).toFixed(2)}
            </Chip>
          );

        case "date": {
          const periodEnd = invoice?.lines?.data?.[0]?.period?.end;
          return (
            <p className="text-sm text-default-600">{formatDate(periodEnd)}</p>
          );
        }

        case "actions":
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Button
                size="sm"
                className="bg-foreground font-medium text-background rounded-lg"
                endContent={
                  <Icon icon="solar:download-linear" fontSize={16} />
                }
                variant="flat"
                as={Link}
                href={invoice?.invoice_pdf || "#"}
                target="_blank"
                isDisabled={!invoice?.invoice_pdf}
              >
                Download Invoice
              </Button>
            </div>
          );

        default:
          return null;
      }
    },
    []
  );

  // Early return AFTER all hooks have been called — keeps rules-of-hooks happy.
  if (!invoices || invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-default-200/60 bg-default-50/30">
        <Icon
          icon="solar:bill-list-linear"
          fontSize={48}
          className="text-default-300 mb-4"
        />
        <p className="text-default-500 font-medium">No invoices yet</p>
        <p className="text-default-400 text-sm mt-1">
          Your billing history will appear here once you subscribe
        </p>
      </div>
    );
  }

  const lastInvoice = invoices[0];
  const lastInvoiceLine = lastInvoice?.lines?.data?.[0];
  const nextBillingAmount = (lastInvoiceLine?.amount ?? 0) / 100;
  const nextBillingDate = formatDate(lastInvoiceLine?.period?.end);

  const totalPages = getTotalPages(invoices?.length, invoicesPerPage);
  const currentInvoices = paginate(invoices, currentPage, invoicesPerPage);

  return (
    <div className="my-4">
      <div className="flex items-center justify-center w-full mb-5">
        <Alert
          title="Next Billing"
          color="success"
          description={`Your next billing of $${nextBillingAmount.toFixed(
            2
          )} for ${
            lastInvoice?.account_name ?? "your subscription"
          } will be on ${nextBillingDate}`}
        />
      </div>

      <div className="rounded-xl border border-default-200/60 shadow-sm overflow-hidden">
        <Table aria-label="Invoices table" removeWrapper>
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
          <TableBody items={currentInvoices}>
            {(item: Stripe.Invoice) => (
              <TableRow key={item?.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center mt-10">
        <Pagination
          showControls
          showShadow
          size="lg"
          radius="lg"
          classNames={{
            wrapper: "gap-2",
            item: "w-10 h-10 text-sm font-medium bg-default-100 hover:bg-default-200",
            cursor:
              "w-10 h-10 text-sm font-bold bg-primary text-white shadow-md shadow-primary/40",
            prev: "w-10 h-10 bg-default-100 hover:bg-default-200",
            next: "w-10 h-10 bg-default-100 hover:bg-default-200",
          }}
          page={currentPage}
          total={totalPages}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ListInvoices;

"use client";

import React from "react";
import { DateRangePicker } from "@heroui/react";
import {
  parseDate,
  getLocalTimeZone,
  CalendarDate,
} from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import {
  getFirstDayOfMonth,
  getToday,
  updateSearchParams,
} from "@/helpers/helper";
import { useRouter } from "next/navigation";

type Range = { start: CalendarDate; end: CalendarDate };

export default function StatsDatePicker() {
  const [value, setValue] = React.useState<Range>({
    start: parseDate(getFirstDayOfMonth()),
    end: parseDate(getToday()),
  });

  const formatter = useDateFormatter();
  const router = useRouter();

  const dateChangeHandler = (dates: Range | null) => {
    if (!dates) return;

    setValue({
      start: dates.start,
      end: dates.end,
    });

    const start = formatter.format(dates.start.toDate(getLocalTimeZone()));
    const end = formatter.format(dates.end.toDate(getLocalTimeZone()));

    if (start && end) {
      let queryParams = new URLSearchParams(window.location.search);
      queryParams = updateSearchParams(queryParams, "start", start);
      queryParams = updateSearchParams(queryParams, "end", end);

      const path = `${window.location.pathname}?${queryParams.toString()}`;
      router.push(path);
    }
  };

  return (
    <DateRangePicker
      className="max-w-xs"
      size="sm"
      label="Pick Dates"
      // HeroUI accepts CalendarDate but its `RangeValue<DateValue>` type
      // includes ZonedDateTime which has a private brand causing a TS conflict.
      // Runtime is correct — cast through unknown.
      value={value as unknown as React.ComponentProps<typeof DateRangePicker>["value"]}
      onChange={(d) =>
        dateChangeHandler(d as unknown as Range | null)
      }
    />
  );
}

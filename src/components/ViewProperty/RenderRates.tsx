import { useMemo } from "react";
import Scheduler from "@mormat/react-scheduler";
import "@mormat/react-scheduler/dist/mormat_react_scheduler.css";

export interface Rate {
  [date: string]: {
    rate: number;
  };
}

interface PricingCalendarProps {
  rates: Rate;
}

export default function PricingCalendar({ rates }: PricingCalendarProps) {
  const rateRanges = useMemo(() => {
    const entries = Object.entries(rates)
      .map(([date, { rate }]) => ({ date: new Date(date), rate }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const ranges: { startDate: Date; endDate: Date; rate: number }[] = [];
    let currentRange: { startDate: Date; endDate: Date; rate: number } | null =
      null;

    entries.forEach(({ date, rate }) => {
      if (!currentRange) {
        currentRange = { startDate: date, endDate: date, rate };
        ranges.push(currentRange);
      } else {
        const nextDay = new Date(currentRange.endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (
          rate === currentRange.rate &&
          nextDay.toISOString().split("T")[0] ===
            date.toISOString().split("T")[0]
        ) {
          currentRange.endDate = date;
        } else {
          currentRange = { startDate: date, endDate: date, rate };
          ranges.push(currentRange);
        }
      }
    });

    return ranges;
  }, [rates]);

  function formatTimestamp(date: Date, isEndDate = false) {
    const iso = date.toISOString().split("T")[0];
    const time = isEndDate ? "18:00" : "06:00";
    return `${iso} ${time}`;
  }
  const events = rateRanges.map((range, index) => ({
    id: index,
    label: `$${range.rate}`,
    start: formatTimestamp(range.startDate),
    end: formatTimestamp(range.endDate, true),
    bgColor: "#3498db",
  }));

  return (
    <div className="flex items-center justify-end my-2">
      <Scheduler
        events={events}
        initialDate={new Date()}
        draggable={false}
        viewMode="month"
        editable={false}
      />
    </div>
  );
}

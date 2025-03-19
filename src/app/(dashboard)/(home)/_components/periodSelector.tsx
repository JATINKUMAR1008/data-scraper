"use client";
import { Period } from "@/actions/analytics/getPeriods";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export default function PeriodSelector({
  periods,
  selectedPeriod,
}: {
  periods: Period[];
  selectedPeriod: Period;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log("@DEFAULT", selectedPeriod);
  return (
    <Select
      value={`${selectedPeriod.month}-${selectedPeriod.year}`}
      
      onValueChange={(value) => {
        const [month, year] = value.split("-");
        const params = new URLSearchParams(searchParams);
        params.set("month", month);
        params.set("year", year);
        router.push(`?${params.toString()}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select period" />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem 
            key={`${period.month}-${period.year}`} 
            value={`${period.month}-${period.year}`}
          >
            {`${MONTH_NAMES[period.month]} ${period.year}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

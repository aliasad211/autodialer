"use client";

import { useRouter } from "next/navigation";

const options: { value: string; label: string }[] = [
  { value: "30", label: "Last 30 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "month", label: "This Month" },
  { value: "lastmonth", label: "Last Month" },
  { value: "year", label: "This Year" },
];

export default function PeriodSelect({ value }: { value: string }) {
  const router = useRouter();

  return (
    <select
      value={value}
      onChange={(e) => router.push(`/admin/reports?range=${e.target.value}`)}
      className="rounded-lg border bg-white px-4 py-2.5 text-sm outline-none"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

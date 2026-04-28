import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <div className="theme-surface rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </div>
          {change ? (
            <div className="mt-2 text-sm text-slate-500">{change}</div>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-md border border-[#c8d8e6] bg-[#eef6fb] p-3 text-[#1f5f8b]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

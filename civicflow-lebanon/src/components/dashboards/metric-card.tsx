import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-[var(--border)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>
          {change ? (
            <div className="mt-2 text-sm text-blue-700">{change}</div>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3 text-[var(--primary-cta)]">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

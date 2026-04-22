import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, change, icon }: MetricCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight">
            {value}
          </div>
          {change ? (
            <div className="mt-2 text-sm text-emerald-300">{change}</div>
          ) : null}
        </div>

        {icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-blue-300">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  );
}

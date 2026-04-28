import { Building2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="theme-logo-mark flex h-10 w-10 items-center justify-center rounded-lg bg-[#1f5f8b] text-[#ffffff] shadow-sm">
        <Building2 className="h-5 w-5" />
      </div>

      <div>
        <div className="text-xs font-semibold uppercase text-slate-500">
          CivicFlow
        </div>
        <div className="text-base font-semibold text-slate-950">Lebanon</div>
      </div>
    </div>
  );
}

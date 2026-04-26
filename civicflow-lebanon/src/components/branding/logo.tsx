import { Building2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-11 w-1 rounded-full bg-[var(--primary-cta)]" />
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 shadow-[0_8px_22px_rgba(59,130,246,0.15)]">
        <Building2 className="h-5 w-5 text-[var(--primary-cta)]" />
      </div>

      <div>
        <div className="text-sm font-semibold tracking-[0.18em] text-slate-600 uppercase">
          CivicFlow
        </div>
        <div className="text-base font-semibold text-slate-900">Lebanon</div>
      </div>
    </div>
  );
}

import { Building2 } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(2,6,23,0.25)]">
        <Building2 className="h-5 w-5 text-blue-300" />
      </div>

      <div>
        <div className="text-sm font-semibold tracking-[0.18em] text-slate-300 uppercase">
          CivicFlow
        </div>
        <div className="text-base font-semibold text-white">Lebanon</div>
      </div>
    </div>
  );
}

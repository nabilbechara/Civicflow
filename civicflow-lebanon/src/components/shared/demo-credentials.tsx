import { demoUsers } from "@/lib/mock-data";

interface DemoCredentialsProps {
  onSelectEmail?: (email: string) => void;
}

export function DemoCredentials({ onSelectEmail }: DemoCredentialsProps) {
  return (
    <div className="theme-surface mt-6 rounded-3xl border border-white/10 bg-slate-950/30 p-4">
      <div className="text-sm font-semibold text-white">
        Demo login accounts
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Click any account below to auto-fill the email field and test role-based
        routing.
      </p>

      <div className="mt-4 space-y-3">
        {demoUsers
          .filter((user) => user.role !== "super_admin")
          .map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => onSelectEmail?.(user.email)}
              className="theme-surface w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]"
            >
              <div className="text-sm font-medium text-white">
                {user.fullName}
              </div>
              <div className="mt-1 text-xs text-slate-400">{user.email}</div>
              <div className="mt-1 text-xs text-blue-200">
                {user.role.replace("_", " ")} • {user.municipality}
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}

import { Mail, ShieldCheck, UserCog, Users } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { demoUsers } from "@/lib/mock-data";

export default function AdminUsersPage() {
  return (
    <DashboardShell
      roleLabel="Municipality Admin Workspace"
      title="User Management"
      subtitle="Review citizen, employee, and administrator access for the municipality."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-[24px] p-5">
          <Users className="h-5 w-5 text-blue-200" />
          <div className="mt-4 text-3xl font-semibold">{demoUsers.length}</div>
          <div className="mt-1 text-sm text-slate-400">Total users</div>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <ShieldCheck className="h-5 w-5 text-emerald-300" />
          <div className="mt-4 text-3xl font-semibold">
            {demoUsers.filter((user) => user.role !== "citizen").length}
          </div>
          <div className="mt-1 text-sm text-slate-400">Staff accounts</div>
        </div>
        <div className="glass-panel rounded-[24px] p-5">
          <UserCog className="h-5 w-5 text-blue-200" />
          <div className="mt-4 text-3xl font-semibold">RBAC</div>
          <div className="mt-1 text-sm text-slate-400">Access model</div>
        </div>
      </div>

      <section className="glass-panel mt-8 rounded-[24px] p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Municipality users</h2>
            <p className="mt-1 text-sm text-slate-400">
              Admins can audit account roles and contact users from this panel.
            </p>
          </div>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
            Invite user
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] bg-white/5 px-4 py-3 text-xs font-semibold uppercase text-slate-400">
            <div>Name</div>
            <div>Email</div>
            <div>Role</div>
            <div>Municipality</div>
          </div>

          {demoUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1.2fr_1fr_0.9fr_0.8fr] items-center border-t border-white/10 px-4 py-4 text-sm"
            >
              <div className="font-semibold text-white">{user.fullName}</div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-slate-500" />
                {user.email}
              </div>
              <div className="capitalize text-slate-300">
                {user.role.replace("_", " ")}
              </div>
              <div className="text-slate-400">{user.municipality}</div>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}

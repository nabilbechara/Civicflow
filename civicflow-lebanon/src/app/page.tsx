import { Building2, ShieldCheck, Workflow, ArrowRight } from "lucide-react";
import { Topbar } from "@/components/layout/topbar";
import { StatusBadge } from "@/components/shared/status-badge";
import { serviceRequests, services, tenants } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main>
      <Topbar />

      <section className="container-shell pt-10 sm:pt-14 lg:pt-20">
        <div className="glass-panel rounded-[32px] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="badge-soft mb-4">Civic SaaS for Lebanon</div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Trusted digital municipality services for citizens, staff, and
                municipal leadership.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                CivicFlow Lebanon modernizes municipal workflows with a
                multi-tenant platform for citizen requests, internal approvals,
                document handling, role-based access, and transparent service
                delivery.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/login"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                >
                  Log In
                </a>

                <a
                  href="/sign-up"
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Create Account
                </a>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/30 p-5">
              <div className="text-sm text-slate-400">Live tenant snapshot</div>
              <div className="mt-2 text-2xl font-semibold">
                {tenants[0].name}
              </div>
              <div className="mt-1 text-sm text-slate-400">
                Region: {tenants[0].region}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Tenant-isolated municipal workspace",
                  "Citizen portal and staff operations in one platform",
                  "Approval chains, status history, and document management",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Municipality tenants",
                value: `${tenants.length}`,
                copy: "Independent municipal tenants with isolated data and services.",
              },
              {
                icon: Workflow,
                title: "Workflow states",
                value: "9",
                copy: "Structured lifecycle from submission to approval, escalation, or completion.",
              },
              {
                icon: ShieldCheck,
                title: "Access model",
                value: "RBAC",
                copy: "Separate experiences for citizens, employees, admins, and platform operators.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/10 bg-slate-950/30 p-5"
              >
                <item.icon className="mb-4 h-5 w-5 text-blue-300" />
                <div className="text-2xl font-semibold">{item.value}</div>
                <div className="mt-2 text-sm font-medium text-white">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="mb-8">
          <span className="badge-soft">Request transparency</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Real request tracking and service visibility
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Citizens can follow request progress clearly while municipalities
            manage structured processing, approvals, and service performance.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="glass-panel rounded-[24px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Recent service requests
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Lifecycle visibility across departments and review stages.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-sm text-slate-400">
                        {request.reference}
                      </div>
                      <h4 className="mt-1 text-base font-semibold">
                        {request.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {request.summary}
                      </p>
                    </div>

                    <StatusBadge status={request.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Department: {request.department}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Updated: {request.updatedAt}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1">
                      Priority: {request.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[24px] p-6">
            <h3 className="text-xl font-semibold">
              Popular municipal services
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Tenant-specific services can later be configured per municipality.
            </p>

            <div className="mt-6 space-y-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-400">
                        {service.category}
                      </div>
                      <div className="mt-1 text-base font-semibold">
                        {service.title}
                      </div>
                    </div>

                    <div className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-200">
                      {service.estimatedDays} days
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {service.description}
                  </p>

                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
                    Request service <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

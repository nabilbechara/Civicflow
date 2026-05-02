import Link from "next/link";
import { ArrowRight, FileCheck2, Search } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { services } from "@/lib/mock-data";

export default function CitizenServicesPage() {
  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="Municipal Services Catalog"
      subtitle="Browse services, review estimated timelines, and start a new request."
    >
      <div className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-lg font-semibold text-white">
              Available services
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Services shown here can later be filtered by municipality and
              category.
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              placeholder="Search services"
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.id}
            className="theme-surface rounded-[24px] border border-white/10 bg-slate-950/30 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm text-slate-400">{service.category}</div>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {service.title}
                </h2>
              </div>

              <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                {service.estimatedDays} days
              </div>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {service.description}
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                <FileCheck2 className="h-4 w-4 text-blue-200" />
                Required documents
              </div>
              <div className="mt-3 space-y-2">
                {service.requiredDocuments.slice(0, 3).map((document) => (
                  <div
                    key={document}
                    className="text-sm leading-6 text-slate-400"
                  >
                    {document}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/citizen/request/new?service=${service.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Start Request <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/citizen/request/new?service=${service.id}`}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View All Requirements
              </Link>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

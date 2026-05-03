import type { ReactNode } from "react";
import { ShieldCheck, Workflow, Building2 } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";

interface AuthShellProps {
  eyebrow: string;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
}

export function AuthShell({
  eyebrow,
  title,
  description,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="container-shell grid min-h-screen items-center gap-5 py-5 sm:gap-6 sm:py-10 lg:grid-cols-[0.95fr_0.75fr]">
        <section className="theme-surface rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Logo />
            <ThemeToggle />
          </div>

          <div className="max-w-xl">
            <div className="badge-soft mb-4">{eyebrow}</div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {description}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Tenant-aware",
                text: "Each municipality runs in an isolated workspace.",
              },
              {
                icon: Workflow,
                title: "Structured workflows",
                text: "Requests move through clear review and approval stages.",
              },
              {
                icon: ShieldCheck,
                title: "Role-based access",
                text: "Citizens, employees, and admins see different experiences.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="theme-surface rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <item.icon className="mb-3 h-5 w-5 text-[#1f5f8b]" />
                <div className="text-sm font-semibold text-slate-950">
                  {item.title}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="theme-surface mt-10 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-700">
              Demo municipalities
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                "Beirut Municipality",
                "Jounieh Municipality",
                "Zahle Municipality",
              ].map((item) => (
                <div
                  key={item}
                  className="theme-surface rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="theme-surface rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
          {children}

          <div className="mt-6 text-sm text-slate-400">
            {footerText}{" "}
            <a
              href={footerHref}
              className="font-medium text-[#1f5f8b] transition hover:text-[#174767]"
            >
              {footerLinkText}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

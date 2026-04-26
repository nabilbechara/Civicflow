import type { ReactNode } from "react";
import { ShieldCheck, Workflow, Building2 } from "lucide-react";
import { Logo } from "@/components/branding/logo";

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
    <main className="min-h-screen bg-[var(--background-soft)] text-slate-900">
      <div className="container-shell grid min-h-screen items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass-panel rounded-[32px] p-8 lg:p-10">
          <div className="mb-8">
            <Logo />
          </div>

          <div className="max-w-xl">
            <div className="badge-soft mb-4">{eyebrow}</div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
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
                className="rounded-2xl border border-[var(--border)] bg-white p-4"
              >
                <item.icon className="mb-3 h-5 w-5 text-[var(--primary-cta)]" />
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-[var(--border)] bg-white p-5">
            <div className="text-sm font-medium text-slate-700">
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
                  className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-[var(--border)] bg-white p-8 shadow-[0_8px_30px_rgba(15,23,42,0.06)] lg:p-10">
          {children}

          <div className="mt-6 text-sm text-slate-600">
            {footerText}{" "}
            <a
              href={footerHref}
              className="font-medium text-[var(--primary-cta)] transition hover:text-[var(--primary-cta-hover)]"
            >
              {footerLinkText}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

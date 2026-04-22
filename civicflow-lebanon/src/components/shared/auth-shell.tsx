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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_24%),linear-gradient(180deg,#08101d_0%,#0a1323_40%,#0c1729_100%)] text-white">
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
            <p className="mt-4 text-base leading-8 text-slate-300">
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
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <item.icon className="mb-3 h-5 w-5 text-blue-300" />
                <div className="text-sm font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
            <div className="text-sm font-medium text-slate-300">
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
                  className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[32px] p-8 lg:p-10">
          {children}

          <div className="mt-6 text-sm text-slate-400">
            {footerText}{" "}
            <a
              href={footerHref}
              className="font-medium text-white transition hover:text-blue-300"
            >
              {footerLinkText}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { LockKeyhole, ShieldAlert } from "lucide-react";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <section className="container-shell flex min-h-screen items-center justify-center py-12">
        <div className="theme-surface max-w-2xl rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
            <ShieldAlert className="h-10 w-10" />
          </div>

          <div className="mt-6 text-sm font-semibold uppercase text-rose-700">
            Error 403
          </div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            Access denied
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600">
            This workspace is protected by role-based access control. Your
            account does not have permission to view this page.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md bg-[#1f5f8b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#174767]"
            >
              <LockKeyhole className="h-4 w-4" />
              Return to public home
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              Sign in with another account
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

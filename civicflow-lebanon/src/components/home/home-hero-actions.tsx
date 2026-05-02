"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { getDefaultRedirectForRole } from "@/lib/auth";

export function HomeHeroActions() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const dashboardHref = user ? getDefaultRedirectForRole(user.role) : "/login";

  function handleLogout() {
    signOut();
    router.push("/");
  }

  if (user) {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href={dashboardHref}
          className="theme-primary-button inline-flex items-center gap-2 rounded-md bg-[#1f5f8b] px-5 py-3 text-sm font-semibold text-[#ffffff] transition hover:bg-[#174767]"
        >
          Go to dashboard <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          Log out <LogOut className="h-4 w-4" />
        </button>
        <a
          href="#news"
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
        >
          View latest news
        </a>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        href="/login"
        className="theme-primary-button inline-flex items-center gap-2 rounded-md bg-[#1f5f8b] px-5 py-3 text-sm font-semibold text-[#ffffff] transition hover:bg-[#174767]"
      >
        Log in <ArrowRight className="h-4 w-4" />
      </Link>
      <a
        href="#news"
        className="inline-flex items-center rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        View latest news
      </a>
    </div>
  );
}

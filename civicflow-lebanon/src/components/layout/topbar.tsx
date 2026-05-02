"use client";

import { Bell, Globe2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/branding/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { getDefaultRedirectForRole } from "@/lib/auth";

export function Topbar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const dashboardHref = user ? getDefaultRedirectForRole(user.role) : "/login";

  function handleLogout() {
    signOut();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="container-shell flex items-center justify-between py-4">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#news"
          >
            News
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#history"
          >
            History
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#staff"
          >
            Staff
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#contact"
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 sm:inline-flex">
            <Globe2 className="h-4 w-4" />
          </button>

          <button className="hidden h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 sm:inline-flex">
            <Bell className="h-4 w-4" />
          </button>

          {user ? (
            <>
              <Link href={dashboardHref}>
                <Button>Dashboard</Button>
              </Link>
              <Button
                type="button"
                variant="secondary"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <a href="/login">
                <Button variant="secondary">Log In</Button>
              </a>

              <a href="/sign-up">
                <Button>Get Started</Button>
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

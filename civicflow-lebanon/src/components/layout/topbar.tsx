import { Bell, Globe2 } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="container-shell flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#"
          >
            How it works
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#"
          >
            Services
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#"
          >
            Municipalities
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
            href="#"
          >
            Security
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

          <a href="/login">
            <Button variant="secondary">Log In</Button>
          </a>

          <a href="/sign-up">
            <Button>Get Started</Button>
          </a>
        </div>
      </div>
    </header>
  );
}

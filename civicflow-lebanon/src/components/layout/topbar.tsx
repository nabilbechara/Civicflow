import { Bell, Globe2 } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101d]/80 backdrop-blur-xl">
      <div className="container-shell flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          <a
            className="text-sm text-slate-300 transition hover:text-white"
            href="#"
          >
            How it works
          </a>
          <a
            className="text-sm text-slate-300 transition hover:text-white"
            href="#"
          >
            Services
          </a>
          <a
            className="text-sm text-slate-300 transition hover:text-white"
            href="#"
          >
            Municipalities
          </a>
          <a
            className="text-sm text-slate-300 transition hover:text-white"
            href="#"
          >
            Security
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex">
            <Globe2 className="h-4 w-4" />
          </button>

          <button className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-flex">
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

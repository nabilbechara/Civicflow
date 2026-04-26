"use client";

import { Bell, Globe2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";

export function Topbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[var(--border)] bg-white/95 transition-all duration-200 ${
        isScrolled ? "scrolled backdrop-blur-md shadow-sm" : ""
      }`}
    >
      <div className="container-shell flex items-center justify-between py-4">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {["How it works", "Services", "Municipalities", "Security"].map(
            (item) => (
              <a
                key={item}
                className="group relative text-[15px] font-medium text-slate-600 transition-colors duration-150 hover:text-[var(--primary)]"
                href="#"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-[var(--primary)] transition-transform duration-200 group-hover:scale-x-100" />
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Language settings"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-[var(--primary)] sm:inline-flex"
          >
            <Globe2 className="h-4 w-4" />
          </button>

          <button
            aria-label="Notifications"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-[var(--primary)] sm:inline-flex"
          >
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

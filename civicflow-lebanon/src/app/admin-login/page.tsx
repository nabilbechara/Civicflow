"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/shared/auth-shell";
import { getDefaultRedirectForRole } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scope, setScope] = useState("Municipal Employee");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signIn(email, password);

      if (user.role === "citizen") {
        setError("This sign-in page is for employees, admins, and operators.");
        return;
      }

      router.push(getDefaultRedirectForRole(user.role));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Staff and admin access"
      title="Sign in to the municipal operations workspace"
      description="For municipal employees, municipality admins, and platform operators managing requests, workflows, analytics, and tenant settings."
      footerText="Need citizen access instead?"
      footerLinkText="Go to citizen sign in"
      footerHref="/login"
    >
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Staff sign in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Use your municipal or platform credentials to access the internal
            workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Work email
            </label>
            <input
              type="email"
              placeholder="rana.khoury@beirut.gov.lb"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.07]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.07]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Access scope
            </label>
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07]"
            >
              <option className="bg-slate-900">Municipal Employee</option>
              <option className="bg-slate-900">Municipality Admin</option>
              <option className="bg-slate-900">Super Admin</option>
            </select>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <Button
            className="w-full justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Access Workspace"}
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          Demo credentials: employee123 for Karim, admin123 for Rana.
        </div>
      </div>
    </AuthShell>
  );
}

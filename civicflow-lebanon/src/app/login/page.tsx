"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/shared/auth-shell";
import { DemoCredentials } from "@/components/shared/demo-credentials";
import { getDefaultRedirectForRole } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [municipality, setMunicipality] = useState("Beirut Municipality");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await signIn(email, password);
      window.location.assign(getDefaultRedirectForRole(user.role));
      return;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.",
      );
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Unified access"
      title="Sign in to CivicFlow Lebanon"
      description="Use one secure login experience for citizens, municipal staff, and administrators. The platform will determine your role and route you to the correct workspace."
      footerText="Don’t have an account?"
      footerLinkText="Create one"
      footerHref="/sign-up"
    >
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Sign in once. CivicFlow will identify whether you are a citizen,
            employee, or admin and direct you accordingly.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Email address
            </label>
            <input
              type="email"
              placeholder="maya.haddad@example.com"
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
              Municipality
            </label>
            <select
              value={municipality}
              onChange={(event) => setMunicipality(event.target.value)}
              className="auth-select w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07]"
            >
              <option>Beirut Municipality</option>
              <option>Jounieh Municipality</option>
              <option>Zahle Municipality</option>
            </select>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                className="rounded border-white/20 bg-white/5"
              />
              Remember me
            </label>

            <a href="#" className="text-slate-300 transition hover:text-white">
              Forgot password?
            </a>
          </div>

          <Button
            className="w-full justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="auth-button-spinner h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Log In"
            )}
          </Button>
        </form>

        <DemoCredentials onSelectEmail={setEmail} />
      </div>
    </AuthShell>
  );
}

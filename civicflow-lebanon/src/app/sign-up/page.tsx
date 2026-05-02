"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/shared/auth-shell";
import { useAuth } from "@/context/auth-context";
import { getDefaultRedirectForRole } from "@/lib/auth";

const passwordRequirements = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    test: (value: string) => /\d/.test(value),
  },
  {
    label: "One special character",
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [municipality, setMunicipality] = useState("Beirut Municipality");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = passwordRequirements.map((requirement) => ({
    ...requirement,
    isMet: requirement.test(password),
  }));
  const isPasswordStrong = passwordChecks.every((requirement) => requirement.isMet);
  const doPasswordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError("Please create a password that satisfies all requirements.");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Password and confirmation password must match.");
      return;
    }

    setLoading(true);

    try {
      const user = await signUp(fullName, email, password, municipality);
      router.push(getDefaultRedirectForRole(user.role));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Account creation failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Citizen registration"
      title="Create your CivicFlow citizen account"
      description="Register securely to access online municipal services, request certificates, and follow every stage of the approval process."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerHref="/login"
    >
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Create account</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Start with your basic details and select your municipality.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Full name
            </label>
            <input
              type="text"
              placeholder="Maya Haddad"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.07]"
            />
          </div>

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
              Municipality
            </label>
            <select
              value={municipality}
              onChange={(event) => setMunicipality(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-400/40 focus:bg-white/[0.07]"
            >
              <option className="bg-slate-900">Beirut Municipality</option>
              <option className="bg-slate-900">Jounieh Municipality</option>
              <option className="bg-slate-900">Zahle Municipality</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.07]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Confirm password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/40 focus:bg-white/[0.07]"
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-sm font-semibold text-slate-200">
              Password must include
            </div>
            <div className="mt-3 grid gap-2">
              {passwordChecks.map((requirement) => {
                const Icon = requirement.isMet ? CheckCircle2 : XCircle;

                return (
                  <div
                    key={requirement.label}
                    className={`flex items-center gap-2 text-sm ${
                      requirement.isMet ? "text-emerald-300" : "text-rose-200"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {requirement.label}
                  </div>
                );
              })}
              <div
                className={`flex items-center gap-2 text-sm ${
                  doPasswordsMatch ? "text-emerald-300" : "text-rose-200"
                }`}
              >
                {doPasswordsMatch ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Passwords match
              </div>
            </div>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <Button
            className="w-full justify-center"
            type="submit"
            disabled={loading || !isPasswordStrong || !doPasswordsMatch}
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-200">
          New citizens are signed in immediately after registration and can
          begin submitting requests right away.
        </div>
      </div>
    </AuthShell>
  );
}

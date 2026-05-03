"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { RequestStepper } from "@/components/requests/request-stepper";
import { UploadDropzone } from "@/components/requests/upload-dropzone";
import { services } from "@/lib/mock-data";
import { createRequest } from "@/lib/request-api";
import { useAuth } from "@/context/auth-context";

const steps = ["Service", "Details", "Documents", "Review"];

export const dynamic = "force-dynamic";

function NewRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const serviceId = searchParams.get("service") || services[0]?.id || "";

  const selectedService = useMemo(
    () => services.find((service) => service.id === serviceId) || services[0],
    [serviceId],
  );

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setFullName(user.full_name);
    }
  }, [user?.full_name]);

  const requirements = selectedService?.requiredDocuments || [];

  function nextStep() {
    if (step === 2) {
      if (!fullName.trim() || !phone.trim()) {
        setError(
          "Please enter your full name and phone number before continuing.",
        );
        return;
      }
    }

    setError("");
    setStep((current) => Math.min(current + 1, 4));
  }

  function previousStep() {
    setError("");
    setStep((current) => Math.max(current - 1, 1));
  }

  async function submitRequest() {
    if (!selectedService) {
      setError("No service is selected.");
      setStep(1);
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setError("Please complete your applicant details before submitting.");
      setStep(2);
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const createdRequest = await createRequest({
        serviceId: selectedService.id,
        tenantId: selectedService.tenantId,
        applicantName: fullName.trim(),
        applicantPhone: phone.trim(),
        notes: notes.trim(),
        files,
        priority: "Medium",
      });

      router.push(`/citizen/request/submitted?id=${createdRequest.id}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit request to the backend.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardShell
      roleLabel="Citizen Portal"
      title="New Service Request"
      subtitle="Complete the request wizard, upload documents, and submit to your municipality."
    >
      <RequestStepper currentStep={step} steps={steps} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.36fr]">
        <div className="glass-panel rounded-[24px] p-6">
          {step === 1 ? (
            <div>
              <h2 className="text-xl font-semibold">Selected service</h2>
              <p className="mt-1 text-sm text-slate-400">
                Confirm the service you want to request.
              </p>

              <div className="theme-surface mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                <div className="text-sm text-slate-400">
                  {selectedService?.category}
                </div>
                <div className="mt-2 text-2xl font-semibold text-white">
                  {selectedService?.title}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {selectedService?.description}
                </p>
                <div className="mt-4 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-200">
                  Estimated processing time: {selectedService?.estimatedDays}{" "}
                  days
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="text-xl font-semibold">Request details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add the applicant details and any supporting explanation.
              </p>

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Full name
                  </label>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Phone number
                  </label>
                  <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-200">
                    Additional notes
                  </label>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Provide any context that may help the municipality review your request."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="text-xl font-semibold">Upload documents</h2>
              <p className="mt-1 text-sm text-slate-400">
                Add required files before final submission.
              </p>

              <div className="mt-6">
                <UploadDropzone
                  files={files}
                  onAddFiles={(newFiles) =>
                    setFiles((current) => [...current, ...newFiles])
                  }
                  onRemoveFile={(index) =>
                    setFiles((current) =>
                      current.filter(
                        (_, currentIndex) => currentIndex !== index,
                      ),
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h2 className="text-xl font-semibold">Review and submit</h2>
              <p className="mt-1 text-sm text-slate-400">
                Confirm everything before sending the request to the
                municipality.
              </p>

              <div className="mt-6 space-y-4">
                <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Service</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {selectedService?.title}
                  </div>
                </div>

                <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Applicant</div>
                  <div className="mt-1 text-base font-semibold text-white">
                    {fullName}
                  </div>
                  <div className="mt-1 text-sm text-slate-400">{phone}</div>
                </div>

                <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">Supporting notes</div>
                  <div className="mt-1 text-base text-white">
                    {notes || "No additional notes provided."}
                  </div>
                </div>

                <div className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-sm text-slate-400">
                    Uploaded documents
                  </div>
                  <div className="mt-3 text-base text-white">
                    {files.length > 0
                      ? files.map((file) => file.name).join(", ")
                      : "No documents attached."}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={previousStep}
              disabled={step === 1 || isSubmitting}
            >
              Back
            </Button>

            {step < 4 ? (
              <Button type="button" onClick={nextStep}>
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                onClick={submitRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            )}
          </div>
        </div>

        <div className="glass-panel rounded-[24px] p-6">
          <h3 className="text-xl font-semibold">Requirements</h3>
          <p className="mt-1 text-sm text-slate-400">
            Municipality guidance for this service.
          </p>

          <div className="mt-6 space-y-3">
            {requirements.map((requirement) => (
              <div
                key={requirement}
                className="theme-surface rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-200"
              >
                {requirement}
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-200">
            Real uploaded files will now be attached to this request and visible
            during municipal review.
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense
      fallback={
        <DashboardShell
          roleLabel="Citizen Portal"
          title="New Service Request"
          subtitle="Loading request wizard..."
        >
          <div className="glass-panel rounded-[24px] p-6 text-sm text-slate-400">
            Preparing the request form.
          </div>
        </DashboardShell>
      }
    >
      <NewRequestContent />
    </Suspense>
  );
}

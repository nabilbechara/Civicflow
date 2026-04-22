interface RequestStepperProps {
  currentStep: number;
  steps: string[];
}

export function RequestStepper({ currentStep, steps }: RequestStepperProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  isCompleted
                    ? "border-emerald-400/20 bg-emerald-500/15 text-emerald-200"
                    : isActive
                      ? "border-blue-400/20 bg-blue-500/15 text-blue-200"
                      : "border-white/10 bg-white/5 text-slate-400",
                ].join(" ")}
              >
                {stepNumber}
              </div>

              <div className="min-w-0">
                <div
                  className={[
                    "text-sm font-medium",
                    isActive || isCompleted ? "text-white" : "text-slate-500",
                  ].join(" ")}
                >
                  {step}
                </div>
              </div>

              {index < steps.length - 1 ? (
                <div className="hidden h-px flex-1 bg-white/10 lg:block" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

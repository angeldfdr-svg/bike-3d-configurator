import { processSteps } from '@/config/site';

export function ProcessSection() {
  return (
    <section
      id="processo"
      aria-labelledby="processo-title"
      className="border-y border-line bg-ink-900/40"
    >
      <div className="mx-auto w-full max-w-[100rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="max-w-2xl">
          <p className="label-eyebrow">Processo</p>
          <h2
            id="processo-title"
            className="mt-4 text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            Do quadro ao resultado final
          </h2>
        </div>

        <ol className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {processSteps.map((step) => (
            <li key={step.step} className="flex flex-col gap-4 border-t border-line pt-6">
              <span className="num text-sm font-bold tracking-[0.2em] text-lime-400">
                {step.step}
              </span>
              <h3 className="text-lg font-bold tracking-[-0.01em] text-fog-50">{step.title}</h3>
              <p className="max-w-sm text-sm leading-relaxed text-fog-400">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

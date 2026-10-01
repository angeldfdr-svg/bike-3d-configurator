import { ShieldCheck } from 'lucide-react';

import { plannedCompatibilityRules } from '@/config/configurator';

export function CompatibilitySection() {
  return (
    <section
      id="compatibilidade"
      aria-labelledby="compatibilidade-title"
      className="mx-auto w-full max-w-[100rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div>
          <p className="label-eyebrow">Compatibilidade</p>
          <h2
            id="compatibilidade-title"
            className="mt-4 text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            Nenhuma combinação impossível passa em silêncio
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-fog-400">
            As regras são avaliadas a cada seleção. Quando existir conflito, o configurador
            identifica o componente responsável e explica o motivo, em vez de permitir uma
            configuração que não pode ser construída.
          </p>

          <figure className="mt-8 rounded-lg border border-line bg-ink-900/70 p-6">
            <ShieldCheck className="size-5 text-lime-400" aria-hidden="true" />
            <blockquote className="mt-4 text-sm leading-relaxed text-fog-200 italic">
              &laquo;Este conjunto de rodas não é compatível com o grupo selecionado.&raquo;
            </blockquote>
            <figcaption className="mt-3 text-xs text-fog-500">
              Exemplo do formato de mensagem previsto para o motor de compatibilidade.
            </figcaption>
          </figure>
        </div>

        <div className="rounded-lg border border-line bg-ink-900/40 p-6 sm:p-8">
          <h3 className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-300 uppercase">
            Regras planeadas
          </h3>
          <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2">
            {plannedCompatibilityRules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-3 bg-ink-900/40 px-4 py-3.5 text-sm leading-snug text-fog-300"
              >
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-lime-400" />
                {rule}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-fog-500">
            A lista é a especificação do motor. Novas regras são adicionadas como módulos
            independentes, sem alterar os componentes visuais.
          </p>
        </div>
      </div>
    </section>
  );
}

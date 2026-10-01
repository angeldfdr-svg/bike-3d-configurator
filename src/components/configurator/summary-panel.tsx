import { ConfigurationStatus } from '@/components/configurator/configuration-status';
import { Badge } from '@/components/ui/badge';

type SummaryRow = {
  label: string;
  value: string;
  note: string;
};

const rows: readonly SummaryRow[] = [
  {
    label: 'Preço total',
    value: '—',
    note: 'Soma do catálogo, com extras e quantidades',
  },
  {
    label: 'Peso total',
    value: '—',
    note: 'Soma dos componentes selecionados',
  },
  {
    label: 'Especificações',
    value: '—',
    note: 'Quadro, grupo, rodas e pneus em destaque',
  },
  {
    label: 'Compatibilidade',
    value: '—',
    note: 'Validação por regras antes de avançar',
  },
];

/** Live summary block. Values stay empty until pricing and weight land. */
export function SummaryPanel() {
  return (
    <section
      aria-labelledby="summary-title"
      className="overflow-hidden rounded-lg border border-line bg-ink-900/50"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <h2
          id="summary-title"
          className="text-[0.8125rem] font-bold tracking-[0.18em] text-fog-100 uppercase"
        >
          Resumo
        </h2>
        <div className="flex items-center gap-3">
          <ConfigurationStatus />
          <Badge variant="muted">Fase 6</Badge>
        </div>
      </header>

      <dl className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 px-5 py-4">
            <div>
              <dt className="text-[0.8125rem] font-medium text-fog-200">{row.label}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-fog-500">{row.note}</dd>
            </div>
            <span className="num shrink-0 text-lg font-bold text-fog-600">{row.value}</span>
          </div>
        ))}
      </dl>

      <footer className="border-t border-line bg-ink-900/60 px-5 py-4">
        <p className="text-xs leading-relaxed text-fog-500">
          Formato previsto, a título de exemplo:
        </p>
        <p className="num mt-2 text-xs leading-relaxed text-fog-400">
          €4.850 · 7,34 kg · Ultegra Di2 · Carbono 45 mm · 700x28c
        </p>
      </footer>
    </section>
  );
}

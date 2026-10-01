import { configuratorCategories } from '@/config/configurator';

export function CategoryGrid() {
  return (
    <section
      id="categorias"
      aria-labelledby="categorias-title"
      className="mx-auto w-full max-w-[100rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="label-eyebrow">Componentes</p>
          <h2
            id="categorias-title"
            className="mt-4 text-[clamp(1.875rem,4vw,3rem)] leading-[1.05] font-extrabold tracking-[-0.03em]"
          >
            Oito categorias. Uma bicicleta.
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-fog-400">
          Cada categoria tem o seu próprio catálogo, atributos técnicos e regras de
          compatibilidade. A vista 3D acompanha cada escolha.
        </p>
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {configuratorCategories.map((category) => {
          const Icon = category.icon;

          return (
            <li
              key={category.id}
              className="group flex min-h-44 flex-col bg-ink-900 p-6 transition-colors duration-300 hover:bg-ink-850"
            >
              <Icon
                className="size-5 text-lime-400 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <h3 className="mt-6 text-[0.8125rem] font-bold tracking-[0.18em] text-fog-50 uppercase">
                {category.label}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-fog-400">{category.summary}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

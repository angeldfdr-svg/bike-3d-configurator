'use client';

import { Package, RotateCcw, ShieldCheck, Wrench } from 'lucide-react';

export function CanyonTrustBanner() {
  const perks = [
    {
      icon: Package,
      title: 'Entrega Segura Bike Guard',
      desc: 'Embalada e protegida de fábrica',
    },
    {
      icon: RotateCcw,
      title: '30 Dias de Teste',
      desc: 'Garantia total de devolução',
    },
    {
      icon: ShieldCheck,
      title: '6 Anos de Garantia',
      desc: 'Quadro e garfo em carbono',
    },
    {
      icon: Wrench,
      title: 'Ferramentas Incluídas',
      desc: 'Montagem simples em 15 minutos',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-line bg-ink-900/50 p-4 sm:grid-cols-4">
      {perks.map((perk, idx) => {
        const Icon = perk.icon;
        return (
          <div key={idx} className="flex items-start gap-2.5">
            <div className="rounded-md bg-lime-400/10 p-2 text-lime-400">
              <Icon className="size-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-fog-100">{perk.title}</p>
              <p className="text-[0.6875rem] text-fog-400">{perk.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

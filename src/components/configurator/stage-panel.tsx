'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Check, Layers, Eye, Disc3, Cog, Ruler } from 'lucide-react';
import { catalog } from '@/data/catalog';
import { findSelection } from '@/lib/catalog';
import { useBikeStore } from '@/store/bike-store';
import { formatWeight, formatPrice } from '@/lib/format';
import { costBuild } from '@/lib/pricing';
import { getModelVisuals, type ModelColorway } from '@/data/model-visuals';
import { useVisualStore, type StageViewMode } from '@/store/visual-store';

export function StagePanel() {
  const configuration = useBikeStore((state) => state.configuration);
  const activeView = useVisualStore((state) => state.activeView);
  const setActiveView = useVisualStore((state) => state.setActiveView);
  const selectedColorId = useVisualStore((state) => state.selectedColorId);
  const setSelectedColorId = useVisualStore((state) => state.setSelectedColorId);

  // Toggle between bike-mounted macro view and isolated component studio photography
  const [isolatedView, setIsolatedView] = useState(false);

  const selection = useMemo(() => findSelection(catalog, configuration), [configuration]);
  const pricing = useMemo(() => costBuild(catalog, configuration), [configuration]);

  const frame = selection.frame;
  const wheelset = selection.wheelset;
  const groupset = selection.groupset;
  const handlebar = selection.handlebar;
  const saddle = selection.saddle;
  const tire = selection.tire;

  // 1. Resolve current bicycle model and its dedicated colorways
  const modelVisuals = useMemo(() => getModelVisuals(frame?.id ?? null), [frame?.id]);

  // 2. Resolve active colorway for this model
  const activeColorway: ModelColorway = useMemo(() => {
    if (selectedColorId) {
      const found = modelVisuals.colorways.find((c) => c.id === selectedColorId);
      if (found) return found;
    }
    return modelVisuals.colorways[0] ?? {
      id: 'default',
      name: 'Cor Padrão',
      hex: '#c91f37',
      bgClass: 'bg-[#c91f37]',
      image: '/images/bikes/canyon-aeroad-red.jpg',
    };
  }, [modelVisuals, selectedColorId]);

  // 3. Focal transform coordinates for camera views on the lateral studio photograph
  const viewConfig = useMemo(() => {
    switch (activeView) {
      case 'cockpit':
        return {
          label: 'Cockpit & Guiador',
          title: handlebar ? `${handlebar.brand} ${handlebar.name}` : 'Cockpit Integrado Aero',
          subtitle: handlebar ? `Largura ${handlebar.width}mm · ${handlebar.material}` : 'Passagem de cabos 100% interna',
          price: handlebar ? formatPrice(handlebar.price) : null,
          weight: handlebar ? formatWeight(handlebar.weight) : null,
          componentImage: '/images/components/cockpit-aero.svg',
          transform: 'scale(2.35)',
          transformOrigin: '76% 24%',
        };
      case 'wheels':
        return {
          label: 'Rodas & Pneus',
          title: wheelset ? `${wheelset.brand} ${wheelset.name}` : 'Rodas de Competição',
          subtitle: wheelset ? `Perfil ${wheelset.rimDepth}mm · ${tire?.name ?? 'Pneus Tubeless'}` : 'Perfil aerodinâmico em carbono',
          price: wheelset ? formatPrice(wheelset.price) : null,
          weight: wheelset ? formatWeight(wheelset.weight) : null,
          componentImage: '/images/components/wheel-dt-swiss.jpg',
          transform: 'scale(2.2)',
          transformOrigin: '24% 68%',
        };
      case 'drivetrain':
        return {
          label: 'Transmissão & Desviador',
          title: groupset ? `${groupset.brand} ${groupset.name}` : 'Grupo de Transmissão',
          subtitle: groupset ? `${groupset.speeds} velocidades · Travão de disco hidráulico` : 'Eletrónico sem fios 12v',
          price: groupset ? formatPrice(groupset.price) : null,
          weight: groupset ? formatWeight(groupset.weight) : null,
          componentImage: '/images/components/drivetrain-groupset.svg',
          transform: 'scale(2.4)',
          transformOrigin: '48% 70%',
        };
      case 'saddle':
        return {
          label: 'Selim & Espigão',
          title: saddle ? `${saddle.brand} ${saddle.name}` : 'Selim Ergonómico de Corrida',
          subtitle: saddle ? `Largura ${saddle.width}mm · Calhas em ${saddle.railMaterial}` : 'Alívio perineal e calhas de carbono',
          price: saddle ? formatPrice(saddle.price) : null,
          weight: saddle ? formatWeight(saddle.weight) : null,
          componentImage: '/images/components/saddle-carbon.svg',
          transform: 'scale(2.4)',
          transformOrigin: '42% 28%',
        };
      case 'full':
      default:
        return {
          label: 'Vista Geral da Bicicleta',
          title: modelVisuals.modelTitle,
          subtitle: activeColorway.name,
          price: formatPrice(pricing.price),
          weight: formatWeight(pricing.weight),
          componentImage: activeColorway.image,
          transform: 'scale(1)',
          transformOrigin: '50% 50%',
        };
    }
  }, [activeView, handlebar, wheelset, tire, groupset, saddle, modelVisuals, activeColorway, pricing]);

  const viewTabs: { id: StageViewMode; label: string; icon: typeof Sparkles }[] = [
    { id: 'full', label: 'Bicicleta Completa', icon: Layers },
    { id: 'cockpit', label: 'Cockpit', icon: Ruler },
    { id: 'drivetrain', label: 'Transmissão', icon: Cog },
    { id: 'wheels', label: 'Rodas', icon: Disc3 },
    { id: 'saddle', label: 'Selim', icon: Eye },
  ];

  return (
    <section
      aria-label="Palco de Visualização de Estúdio Canyon"
      className="relative overflow-hidden rounded-lg border border-line bg-ink-900"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-line/60 bg-ink-950/85 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-wider text-lime-300 uppercase">
            <Sparkles className="size-3" />
            Canyon Studio
          </span>
          <span className="text-xs font-semibold text-fog-100 sm:inline-block">
            {modelVisuals.modelTitle}
          </span>
          <span className="hidden text-xs text-fog-400 sm:inline-block">
            · {activeColorway.name}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-fog-300">
          <ShieldCheck className="size-3.5 text-lime-400" />
          <span className="font-mono text-[0.6875rem] tracking-wider text-fog-400 uppercase">
            Garantia 6 Anos de Fábrica
          </span>
        </div>
      </div>

      {/* Main Studio Canvas Frame */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e5e5e7]">
        {/* Render either Isolated Component Mode or Mounted Studio Bike Photo */}
        {isolatedView && activeView !== 'full' ? (
          <div className="relative flex h-full w-full items-center justify-center p-8 bg-[#121316]">
            {/* Studio Spotlight glow */}
            <div className="absolute inset-0 bg-radial from-ink-700/40 via-transparent to-black pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center max-w-xl text-center">
              <div className="relative size-64 sm:size-80 drop-shadow-2xl">
                <Image
                  src={viewConfig.componentImage}
                  alt={viewConfig.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 40vw"
                  className="object-contain"
                />
              </div>

              <div className="mt-4 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 backdrop-blur-md">
                <p className="text-sm font-bold text-white">{viewConfig.title}</p>
                <p className="text-xs text-fog-400">{viewConfig.subtitle}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Crisp High-Res Lateral Studio Photo with Smooth Precision Zoom */
          <div className="relative h-full w-full overflow-hidden">
            <div
              className="relative h-full w-full transition-transform duration-700 ease-out"
              style={{
                transform: viewConfig.transform,
                transformOrigin: viewConfig.transformOrigin,
              }}
            >
              <Image
                src={activeColorway.image}
                alt={`${modelVisuals.modelTitle} - ${activeColorway.name}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-contain"
              />
            </div>
          </div>
        )}

        {/* Framing Watermark */}
        <div className="pointer-events-none absolute right-6 bottom-4 select-none opacity-20">
          <span className="text-4xl font-black tracking-widest text-ink-950/40 uppercase">
            CANYON
          </span>
        </div>

        {/* Section View Tabs (Floating in Top-Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1 rounded-lg border border-ink-950/15 bg-white/85 p-1 shadow-md backdrop-blur-md">
          {viewTabs.map((tab) => {
            const isTabActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveView(tab.id);
                  if (tab.id === 'full') setIsolatedView(false);
                }}
                className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-semibold transition-all ${
                  isTabActive
                    ? 'bg-ink-950 text-white shadow-sm'
                    : 'text-ink-800 hover:bg-ink-900/10'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Floating Component Detail Inspector (When in component zoom) */}
        {activeView !== 'full' && (
          <div className="absolute top-4 left-4 z-20 max-w-xs rounded-lg border border-ink-950/15 bg-white/90 p-3 shadow-lg backdrop-blur-md transition-all">
            <div className="flex items-center gap-2.5">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-ink-950/10 bg-fog-200">
                <Image
                  src={viewConfig.componentImage}
                  alt={viewConfig.title}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[0.625rem] font-bold tracking-wider text-fog-500 uppercase">
                  {viewConfig.label}
                </span>
                <p className="truncate text-xs font-bold text-ink-950" title={viewConfig.title}>
                  {viewConfig.title}
                </p>
                <p className="truncate text-[0.6875rem] text-ink-700">
                  {viewConfig.subtitle}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between border-t border-ink-950/10 pt-2 text-[0.6875rem]">
              <span className="font-mono font-semibold text-ink-900">
                {viewConfig.weight ? `${viewConfig.weight}` : ''}
              </span>
              <button
                type="button"
                onClick={() => setIsolatedView(!isolatedView)}
                className="rounded-xs border border-ink-950/20 bg-ink-950 px-2 py-0.5 font-medium text-white transition-colors hover:bg-ink-850"
              >
                {isolatedView ? 'Ver na Bicicleta' : 'Ver Peça Isolada'}
              </button>
            </div>
          </div>
        )}

        {/* Interactive Model Colorways floating on the Studio Floor */}
        <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 rounded-full border border-ink-950/15 bg-white/90 px-3.5 py-1.5 shadow-lg backdrop-blur-md">
          <span className="text-[0.6875rem] font-bold text-ink-900 uppercase tracking-wider mr-1">
            Cor:
          </span>
          <span className="hidden text-[0.6875rem] font-semibold text-ink-700 mr-2 sm:inline-block">
            {activeColorway.name}
          </span>
          {modelVisuals.colorways.map((item) => {
            const isSelected = activeColorway.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={`${item.name} (${item.hex})`}
                onClick={() => setSelectedColorId(item.id)}
                className={`relative size-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  isSelected
                    ? 'border-ink-950 scale-110 ring-2 ring-lime-400 ring-offset-1'
                    : 'border-white/80 opacity-85 hover:opacity-100'
                } ${item.bgClass}`}
              >
                {isSelected && (
                  <Check
                    className={`absolute inset-0 m-auto size-3 ${
                      item.hex === '#e8edf0' ? 'text-ink-950' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Technical Specifications Ribbon (Canyon Spec Bar) */}
      <div className="grid grid-cols-2 gap-3 border-t border-line bg-ink-950 p-4 sm:grid-cols-4 sm:gap-6">
        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Peso Total Estimado
          </span>
          <p className="mt-0.5 font-mono text-sm font-bold text-lime-400">
            {formatWeight(pricing.weight)}
          </p>
        </div>

        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Grupo / Transmissão
          </span>
          <p
            className="mt-0.5 truncate text-xs font-semibold text-fog-100"
            title={groupset?.name ?? 'Shimano Dura-Ace Di2'}
          >
            {groupset ? `${groupset.brand} ${groupset.name}` : 'Shimano Dura-Ace Di2 12v'}
          </p>
        </div>

        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Rodas de Estrada
          </span>
          <p
            className="mt-0.5 truncate text-xs font-semibold text-fog-100"
            title={wheelset?.name ?? 'DT Swiss ARC 1100'}
          >
            {wheelset ? `${wheelset.brand} ${wheelset.name}` : 'DT Swiss ARC 1100 Carbon'}
          </p>
        </div>

        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Quadro & Geometria
          </span>
          <p
            className="mt-0.5 truncate text-xs font-semibold text-fog-100"
            title={frame?.name ?? modelVisuals.modelTitle}
          >
            {frame ? `${frame.brand} ${frame.name}` : modelVisuals.modelTitle}
          </p>
        </div>
      </div>
    </section>
  );
}

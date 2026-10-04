'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Sparkles, ShieldCheck, Check } from 'lucide-react';
import { catalog } from '@/data/catalog';
import { findSelection } from '@/lib/catalog';
import { useBikeStore } from '@/store/bike-store';
import { formatWeight } from '@/lib/format';
import { costBuild } from '@/lib/pricing';

export function StagePanel() {
  const configuration = useBikeStore((state) => state.configuration);
  const selectFrame = useBikeStore((state) => state.selectFrame);
  const [zoomSection, setZoomSection] = useState<'full' | 'cockpit' | 'drivetrain' | 'wheels'>('full');

  const selection = useMemo(() => findSelection(catalog, configuration), [configuration]);
  const pricing = useMemo(() => costBuild(catalog, configuration), [configuration]);

  const frame = selection.frame;
  const wheelset = selection.wheelset;
  const groupset = selection.groupset;

  // Resolve matching real bike studio image
  const bikeStudioConfig = useMemo(() => {
    if (!frame) {
      return {
        image: '/images/bikes/canyon-aeroad-red.jpg',
        title: 'Canyon Aeroad CFR',
        colorName: 'Racing Crimson Red',
        badge: 'Aero de Competição',
        frameId: 'frame-veloce-aero-sl',
      };
    }

    if (frame.maxTireWidth >= 40 || frame.id.includes('gravel') || frame.id.includes('diverge')) {
      return {
        image: '/images/bikes/canyon-grizl-gravel.jpg',
        title: frame.name.includes('Diverge') ? 'Canyon Grizl CF Gravel' : 'Canyon Grail CF SLX',
        colorName: 'Desert Bronze & Olive',
        badge: 'Gravel & Aventura',
        frameId: frame.id,
      };
    }

    switch (frame.id) {
      case 'frame-solstice-dogma-x':
      case 'frame-aether-ultimate-cfg':
      case 'frame-cinder-alloy-pro':
        return {
          image: '/images/bikes/canyon-ultimate-stealth.jpg',
          title: 'Canyon Ultimate CFR',
          colorName: 'Solid Stealth Black',
          badge: 'Escalada Ultra-Leve',
          frameId: frame.id,
        };
      case 'frame-velora-madone-slr':
        return {
          image: '/images/bikes/canyon-aeroad-white.jpg',
          title: 'Canyon Aeroad CFR',
          colorName: 'Pearl White & Chrome',
          badge: 'Aero WorldTour',
          frameId: frame.id,
        };
      case 'frame-northwind-tcr-advanced-sl':
      case 'frame-altiro-caledonia-5':
        return {
          image: '/images/bikes/canyon-aeroad-blue.jpg',
          title: 'Canyon Aeroad CF SLX',
          colorName: 'Team Alpecin Sapphire Blue',
          badge: 'Endurance & Velocidade',
          frameId: frame.id,
        };
      case 'frame-aurelian-tarmac-sl8':
      case 'frame-altiro-r5':
      case 'frame-veloce-aero-sl':
      default:
        return {
          image: '/images/bikes/canyon-aeroad-red.jpg',
          title: 'Canyon Aeroad CFR',
          colorName: 'Racing Crimson Red',
          badge: 'Aero de Competição',
          frameId: frame.id,
        };
    }
  }, [frame]);

  // Colorway options matching Canyon.com
  const colorways = [
    {
      id: 'frame-veloce-aero-sl',
      name: 'Racing Red',
      color: '#c91f37',
      bgClass: 'bg-[#c91f37]',
      image: '/images/bikes/canyon-aeroad-red.jpg',
    },
    {
      id: 'frame-aether-ultimate-cfg',
      name: 'Stealth Black',
      color: '#1a1d1f',
      bgClass: 'bg-[#1a1d1f]',
      image: '/images/bikes/canyon-ultimate-stealth.jpg',
    },
    {
      id: 'frame-velora-madone-slr',
      name: 'Pearl White',
      color: '#e8edf0',
      bgClass: 'bg-[#e8edf0]',
      image: '/images/bikes/canyon-aeroad-white.jpg',
    },
    {
      id: 'frame-northwind-tcr-advanced-sl',
      name: 'Team Blue',
      color: '#1a4c8a',
      bgClass: 'bg-[#1a4c8a]',
      image: '/images/bikes/canyon-aeroad-blue.jpg',
    },
    {
      id: 'frame-aurelian-diverge-stix',
      name: 'Gravel Bronze',
      color: '#9e7b56',
      bgClass: 'bg-[#9e7b56]',
      image: '/images/bikes/canyon-grizl-gravel.jpg',
    },
  ];

  // Zoom transform style based on section
  const imageTransform = useMemo(() => {
    switch (zoomSection) {
      case 'cockpit':
        return 'scale-[1.8] translate-x-[-28%] translate-y-[22%]';
      case 'drivetrain':
        return 'scale-[1.8] translate-x-[5%] translate-y-[-18%]';
      case 'wheels':
        return 'scale-[1.6] translate-x-[32%] translate-y-[5%]';
      case 'full':
      default:
        return 'scale-100 translate-x-0 translate-y-0';
    }
  }, [zoomSection]);

  return (
    <section
      aria-labelledby="studio-title"
      className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-gradient-to-b from-ink-900 to-ink-950 shadow-2xl"
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-line/60 bg-ink-950/80 px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 rounded-full border border-lime-400/30 bg-lime-400/10 px-2.5 py-0.5 text-[0.6875rem] font-bold tracking-wider text-lime-300 uppercase">
            <Sparkles className="size-3" />
            Canyon Studio View
          </span>
          <span className="hidden text-xs text-fog-400 sm:inline-block">
            {bikeStudioConfig.title} · {bikeStudioConfig.colorName}
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
        {/* Crisp High-Res Lateral Studio Photo */}
        <div className="relative h-full w-full overflow-hidden transition-transform duration-700 ease-out">
          <Image
            src={bikeStudioConfig.image}
            alt={bikeStudioConfig.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 65vw"
            className={`object-contain transition-all duration-700 ease-out ${imageTransform}`}
          />
        </div>

        {/* Framing Watermark */}
        <div className="pointer-events-none absolute right-6 bottom-4 select-none opacity-20">
          <span className="text-4xl font-black tracking-widest text-ink-950/40 uppercase">
            CANYON
          </span>
        </div>

        {/* Section Zoom Controls Floating in Top-Right */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-lg border border-ink-950/15 bg-white/80 p-1 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => setZoomSection('full')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              zoomSection === 'full'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-ink-800 hover:bg-ink-900/10'
            }`}
          >
            Vista Geral
          </button>
          <button
            type="button"
            onClick={() => setZoomSection('cockpit')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              zoomSection === 'cockpit'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-ink-800 hover:bg-ink-900/10'
            }`}
          >
            Cockpit
          </button>
          <button
            type="button"
            onClick={() => setZoomSection('drivetrain')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              zoomSection === 'drivetrain'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-ink-800 hover:bg-ink-900/10'
            }`}
          >
            Transmissão
          </button>
          <button
            type="button"
            onClick={() => setZoomSection('wheels')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              zoomSection === 'wheels'
                ? 'bg-ink-950 text-white shadow-sm'
                : 'text-ink-800 hover:bg-ink-900/10'
            }`}
          >
            Rodas
          </button>
        </div>

        {/* Interactive Color Swatches floating on the Studio Floor */}
        <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2 rounded-full border border-ink-950/15 bg-white/85 px-3 py-1.5 shadow-lg backdrop-blur-md">
          <span className="text-[0.6875rem] font-semibold text-ink-800 uppercase tracking-wider mr-1">
            Cor:
          </span>
          {colorways.map((item) => {
            const isSelected = frame?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={item.name}
                onClick={() => selectFrame(item.id)}
                className={`relative size-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  isSelected
                    ? 'border-ink-950 scale-110 ring-2 ring-lime-400 ring-offset-1'
                    : 'border-white/80 opacity-85 hover:opacity-100'
                } ${item.bgClass}`}
              >
                {isSelected && (
                  <Check className={`absolute inset-0 m-auto size-3 ${item.color === '#e8edf0' ? 'text-ink-950' : 'text-white'}`} />
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
          <p className="mt-0.5 truncate text-xs font-semibold text-fog-100" title={groupset?.name ?? 'Shimano Dura-Ace Di2'}>
            {groupset ? `${groupset.brand} ${groupset.name}` : 'Shimano Dura-Ace Di2 12v'}
          </p>
        </div>

        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Rodas de Estrada
          </span>
          <p className="mt-0.5 truncate text-xs font-semibold text-fog-100" title={wheelset?.name ?? 'DT Swiss ARC 1100'}>
            {wheelset ? `${wheelset.brand} ${wheelset.name}` : 'DT Swiss ARC 1100 Carbon'}
          </p>
        </div>

        <div>
          <span className="text-[0.6875rem] font-semibold tracking-wider text-fog-500 uppercase">
            Quadro & Geometria
          </span>
          <p className="mt-0.5 truncate text-xs font-semibold text-fog-100" title={frame?.name ?? 'Canyon CFR Carbon'}>
            {frame ? `${frame.brand} ${frame.name}` : 'CFR Carbon T800'}
          </p>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useMemo, useState } from 'react';
import { catalog } from '@/data/catalog';
import { findSelection } from '@/lib/catalog';
import { useBikeStore } from '@/store/bike-store';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, Eye, Sparkles } from 'lucide-react';

export type Bike2DViewerProps = {
  readonly className?: string;
};

export function Bike2DViewer({ className }: Bike2DViewerProps) {
  const configuration = useBikeStore((state) => state.configuration);
  const cameraView = useBikeStore((state) => state.camera.view);
  const setCameraView = useBikeStore((state) => state.setCameraView);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const selection = useMemo(() => findSelection(catalog, configuration), [configuration]);

  const frame = selection.frame;
  const wheelset = selection.wheelset;
  const tire = selection.tire;
  const groupset = selection.groupset;
  const crankset = selection.crankset;
  const handlebar = selection.handlebar;
  const saddle = selection.saddle;
  const accessories = selection.accessories;

  // Frame visual properties
  const frameColorConfig = useMemo(() => {
    if (!frame) {
      return {
        main: '#5c8b2f',
        accent: '#7cb342',
        dark: '#33691e',
        name: 'Verde Corrida',
      };
    }
    if (frame.material === 'titanio') {
      return {
        main: '#8b8e8b',
        accent: '#b0b3b0',
        dark: '#585a58',
        name: 'Titânio Escovado',
      };
    }
    if (frame.material === 'aluminio' || frame.material === 'aco') {
      return {
        main: '#bcc4c9',
        accent: '#e2e7ec',
        dark: '#858d92',
        name: 'Alumínio Polido',
      };
    }
    switch (frame.id) {
      case 'frame-aurelian-tarmac-sl8':
      case 'frame-altiro-r5':
        return {
          main: '#c91f37',
          accent: '#ff3b56',
          dark: '#800f20',
          name: 'Vermelho Racing',
        };
      case 'frame-northwind-tcr-advanced-sl':
      case 'frame-altiro-caledonia-5':
        return {
          main: '#1a4c8a',
          accent: '#2f74ca',
          dark: '#0e2b50',
          name: 'Azul Profundo',
        };
      case 'frame-velora-madone-slr':
        return {
          main: '#e8edf0',
          accent: '#ffffff',
          dark: '#a8b0b5',
          name: 'Branco Pérola',
        };
      case 'frame-solstice-dogma-x':
      case 'frame-aether-ultimate-cfg':
        return {
          main: '#1a1d1f',
          accent: '#33383c',
          dark: '#0d0e0f',
          name: 'Preto Mate Carbono',
        };
      case 'frame-velora-emonda-slr':
        return {
          main: '#e65c00',
          accent: '#ff8533',
          dark: '#993d00',
          name: 'Laranja Solar',
        };
      case 'frame-aurelian-diverge-stix':
        return {
          main: '#9e7b56',
          accent: '#cca57a',
          dark: '#634b32',
          name: 'Bronze Champaña',
        };
      default:
        return {
          main: '#5c8b2f',
          accent: '#7cb342',
          dark: '#33691e',
          name: 'Verde Corrida',
        };
    }
  }, [frame]);

  const isAero = !frame || frame.maxTireWidth < 40;
  const isGravel = frame ? frame.maxTireWidth >= 40 : false;
  const isClimb = frame ? frame.weight < 800 : false;

  // Wheels & Tires properties
  const rimDepth = wheelset?.rimDepth ?? 45;
  const isAlloyWheel = wheelset?.material === 'aluminio';
  const tireWidth = tire?.width ?? 28;
  const isTanWall = tire?.description.toLowerCase().includes('algod') || tire?.name.toLowerCase().includes('cotton');
  const isDisc = groupset?.brakeSystem !== 'aro';
  const isElectronic = groupset?.shifting === 'eletronico';
  const isSingleRing = crankset?.chainrings === 1;

  // Viewport scale based on view
  const viewBox = useMemo(() => {
    switch (cameraView) {
      case 'cockpit':
        return '520 80 440 320';
      case 'transmissao':
        return '200 240 450 320';
      case 'frontal':
        return '600 200 380 340';
      case 'diagonal':
        return '80 60 880 500';
      case 'lateral':
      default:
        return '0 20 1000 560';
    }
  }, [cameraView]);

  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950 ${className ?? ''}`}>
      {/* Studio Lighting Radial Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06)_0%,transparent_70%)]"
      />

      {/* Main 2D SVG Canvas */}
      <svg
        viewBox={viewBox}
        className="relative h-full w-full max-h-[85vh] transition-all duration-700 ease-out select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Frame Paint Gradients */}
          <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={frameColorConfig.accent} />
            <stop offset="45%" stopColor={frameColorConfig.main} />
            <stop offset="100%" stopColor={frameColorConfig.dark} />
          </linearGradient>

          <linearGradient id="frameHighlight" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>

          {/* Carbon Fiber Texture / Shading */}
          <linearGradient id="carbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252b2f" />
            <stop offset="50%" stopColor="#141719" />
            <stop offset="100%" stopColor="#0a0c0d" />
          </linearGradient>

          <linearGradient id="alloyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e4eaee" />
            <stop offset="50%" stopColor="#9ba4aa" />
            <stop offset="100%" stopColor="#5d656a" />
          </linearGradient>

          <linearGradient id="tanWallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#deb887" />
            <stop offset="50%" stopColor="#c59864" />
            <stop offset="100%" stopColor="#a37845" />
          </linearGradient>

          <filter id="shadowBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* ============================================================== */}
        {/* LAYER 0: Ground Contact Shadow */}
        {/* ============================================================== */}
        <g id="ground-shadow" opacity="0.75">
          <ellipse cx="230" cy="510" rx="90" ry="12" fill="#000000" filter="url(#shadowBlur)" />
          <ellipse cx="770" cy="510" rx="90" ry="12" fill="#000000" filter="url(#shadowBlur)" />
          <ellipse cx="500" cy="512" rx="220" ry="14" fill="#000000" filter="url(#shadowBlur)" opacity="0.6" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 1: REAR WHEEL */}
        {/* Center: [230, 370], Outer Radius: 140 */}
        {/* ============================================================== */}
        <g
          id="rear-wheel"
          className="cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => setHoveredPart('Roda Traseira')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Tire */}
          <circle
            cx="230"
            cy="370"
            r="140"
            fill="none"
            stroke={isTanWall ? 'url(#tanWallGradient)' : '#121416'}
            strokeWidth={tireWidth > 32 ? 22 : 16}
          />
          {/* Tire Tread Outer Ring */}
          <circle
            cx="230"
            cy="370"
            r={140 + (tireWidth > 32 ? 10 : 7)}
            fill="none"
            stroke="#0a0b0d"
            strokeWidth="5"
            strokeDasharray={isGravel ? '4,4' : 'none'}
          />

          {/* Rim */}
          <circle
            cx="230"
            cy="370"
            r={140 - (rimDepth > 50 ? 28 : rimDepth > 35 ? 20 : 12)}
            fill="none"
            stroke={isAlloyWheel ? 'url(#alloyGradient)' : 'url(#carbonGradient)'}
            strokeWidth={rimDepth > 50 ? 38 : rimDepth > 35 ? 26 : 14}
          />
          {/* Rim brake machined track for alloy */}
          {isAlloyWheel && (
            <circle
              cx="230"
              cy="370"
              r="132"
              fill="none"
              stroke="#cfd7dc"
              strokeWidth="4"
            />
          )}

          {/* Spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x2 = 230 + Math.cos(rad) * (140 - 25);
            const y2 = 370 + Math.sin(rad) * (140 - 25);
            return (
              <line
                key={`r-spoke-${i}`}
                x1="230"
                y1="370"
                x2={x2}
                y2={y2}
                stroke="#636c72"
                strokeWidth="1.2"
                opacity="0.8"
              />
            );
          })}

          {/* Disc Brake Rotor */}
          {isDisc && (
            <g id="rear-rotor">
              <circle cx="230" cy="370" r="34" fill="none" stroke="#9ba4aa" strokeWidth="6" />
              <circle cx="230" cy="370" r="28" fill="none" stroke="#464e53" strokeWidth="2" strokeDasharray="3,3" />
              <rect x="200" y="348" width="16" height="22" rx="4" fill="#242a2d" />
            </g>
          )}

          {/* Cassette (Sprockets) */}
          <g id="rear-cassette">
            <circle cx="230" cy="370" r="28" fill="url(#alloyGradient)" />
            <circle cx="230" cy="370" r="22" fill="#31393e" />
            <circle cx="230" cy="370" r="16" fill="url(#alloyGradient)" />
            <circle cx="230" cy="370" r="10" fill="#202428" />
          </g>

          {/* Rear Hub */}
          <circle cx="230" cy="370" r="8" fill="#111315" stroke="#758189" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 2: FRONT WHEEL */}
        {/* Center: [770, 370], Outer Radius: 140 */}
        {/* ============================================================== */}
        <g
          id="front-wheel"
          className="cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => setHoveredPart('Roda Dianteira')}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Tire */}
          <circle
            cx="770"
            cy="370"
            r="140"
            fill="none"
            stroke={isTanWall ? 'url(#tanWallGradient)' : '#121416'}
            strokeWidth={tireWidth > 32 ? 22 : 16}
          />
          <circle
            cx="770"
            cy="370"
            r={140 + (tireWidth > 32 ? 10 : 7)}
            fill="none"
            stroke="#0a0b0d"
            strokeWidth="5"
            strokeDasharray={isGravel ? '4,4' : 'none'}
          />

          {/* Rim */}
          <circle
            cx="770"
            cy="370"
            r={140 - (rimDepth > 50 ? 28 : rimDepth > 35 ? 20 : 12)}
            fill="none"
            stroke={isAlloyWheel ? 'url(#alloyGradient)' : 'url(#carbonGradient)'}
            strokeWidth={rimDepth > 50 ? 38 : rimDepth > 35 ? 26 : 14}
          />
          {isAlloyWheel && (
            <circle
              cx="770"
              cy="370"
              r="132"
              fill="none"
              stroke="#cfd7dc"
              strokeWidth="4"
            />
          )}

          {/* Spokes */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x2 = 770 + Math.cos(rad) * (140 - 25);
            const y2 = 370 + Math.sin(rad) * (140 - 25);
            return (
              <line
                key={`f-spoke-${i}`}
                x1="770"
                y1="370"
                x2={x2}
                y2={y2}
                stroke="#636c72"
                strokeWidth="1.2"
                opacity="0.8"
              />
            );
          })}

          {/* Disc Rotor */}
          {isDisc && (
            <g id="front-rotor">
              <circle cx="770" cy="370" r="38" fill="none" stroke="#9ba4aa" strokeWidth="6" />
              <circle cx="770" cy="370" r="32" fill="none" stroke="#464e53" strokeWidth="2" strokeDasharray="3,3" />
              <rect x="748" y="342" width="16" height="24" rx="4" fill="#242a2d" />
            </g>
          )}

          {/* Front Hub */}
          <circle cx="770" cy="370" r="8" fill="#111315" stroke="#758189" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 3: FRAME & FORK */}
        {/* BB: [470, 410], Seat Cluster: [410, 210], Head Tube: [710, 185], Axles: [230,370], [770,370] */}
        {/* ============================================================== */}
        <g
          id="frame-group"
          className="cursor-pointer transition-all duration-300 hover:brightness-110"
          onMouseEnter={() => setHoveredPart(`Quadro: ${frame?.name ?? 'Aero SL'}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Chainstays (BB to Rear Axle) */}
          <path
            d="M 470 410 L 230 370"
            stroke="url(#frameGradient)"
            strokeWidth={isAero ? 18 : 14}
            strokeLinecap="round"
          />

          {/* Seatstays (Seat Cluster to Rear Axle) */}
          <path
            d={isAero ? 'M 418 250 L 230 370' : 'M 410 210 L 230 370'}
            stroke="url(#frameGradient)"
            strokeWidth={isClimb ? 10 : 13}
            strokeLinecap="round"
          />

          {/* Seat Tube (BB to Seat Cluster) */}
          <path
            d="M 470 410 L 410 210"
            stroke="url(#frameGradient)"
            strokeWidth={isAero ? 26 : 18}
            strokeLinecap="round"
          />

          {/* Down Tube (BB to Head Tube Bottom) */}
          <path
            d="M 470 410 L 702 215"
            stroke="url(#frameGradient)"
            strokeWidth={isAero ? 32 : isClimb ? 20 : 25}
            strokeLinecap="round"
          />

          {/* Top Tube (Seat Cluster to Head Tube Top) */}
          <path
            d="M 410 210 Q 560 195 705 180"
            stroke="url(#frameGradient)"
            strokeWidth={isAero ? 24 : 16}
            fill="none"
            strokeLinecap="round"
          />

          {/* Head Tube */}
          <path
            d="M 705 170 L 700 225"
            stroke="url(#frameGradient)"
            strokeWidth={28}
            strokeLinecap="round"
          />

          {/* Front Fork (Head Tube to Front Axle) */}
          <path
            d="M 700 225 L 770 370"
            stroke="url(#frameGradient)"
            strokeWidth={isAero ? 22 : 16}
            strokeLinecap="round"
          />

          {/* Specular Highlight along Down Tube */}
          <path
            d="M 475 404 L 700 210"
            stroke="url(#frameHighlight)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Bottom Bracket Shell */}
          <circle cx="470" cy="410" r="18" fill="url(#frameGradient)" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 4: SEATPOST & SADDLE */}
        {/* ============================================================== */}
        <g
          id="saddle-group"
          className="cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => setHoveredPart(`Selim: ${saddle?.name ?? 'Race 143'}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Seatpost */}
          <path d="M 410 210 L 390 145" stroke="#1d2226" strokeWidth="15" strokeLinecap="round" />
          {/* Seatpost Clamp */}
          <rect x="382" y="140" width="16" height="8" rx="2" fill="#525a60" />

          {/* Saddle Rails */}
          <path
            d="M 360 146 L 415 146"
            stroke={saddle?.railMaterial === 'carbono' ? '#181b1c' : '#a8b2b8'}
            strokeWidth="3.5"
          />

          {/* Saddle Body */}
          <path
            d="M 345 138 C 360 134, 400 135, 435 141 C 410 147, 360 146, 345 138 Z"
            fill="#121517"
            stroke="#262d32"
            strokeWidth="2"
          />
          {/* Ergonomic Cutout / Channel */}
          <path d="M 375 138 L 410 139" stroke="#060708" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 5: COCKPIT (Stem, Handlebar, Levers) */}
        {/* ============================================================== */}
        <g
          id="cockpit-group"
          className="cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => setHoveredPart(`Guiador: ${handlebar?.name ?? 'Aero 40'}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Stem Spacers & Stem */}
          <rect x="696" y="152" width="16" height="24" rx="2" fill="#1b2024" />
          <path d="M 704 162 L 740 156" stroke="#1b2024" strokeWidth="18" strokeLinecap="round" />

          {/* Handlebar Drop Curve */}
          <path
            d="M 735 156 C 758 156, 764 175, 755 198 C 748 212, 730 216, 715 214"
            fill="none"
            stroke="#22282d"
            strokeWidth={handlebar?.type === 'gravel-drop' ? 15 : 12}
            strokeLinecap="round"
          />

          {/* Bar Tape Texture */}
          <path
            d="M 736 156 C 756 156, 762 174, 754 196"
            fill="none"
            stroke="#15181b"
            strokeWidth="10"
            strokeDasharray="4,2"
          />

          {/* Shift / Brake Levers (Hoods) */}
          <path
            d="M 758 170 C 772 165, 775 180, 770 195 L 764 188"
            fill="#171a1d"
            stroke="#343c42"
            strokeWidth="1.5"
          />
          <path d="M 768 184 L 762 205" stroke="#7d8790" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 6: DRIVETRAIN (Crankset, Derailleur, Chain) */}
        {/* ============================================================== */}
        <g
          id="drivetrain-group"
          className="cursor-pointer transition-opacity duration-200 hover:opacity-90"
          onMouseEnter={() => setHoveredPart(`Transmissão: ${crankset?.name ?? '52/36'} · ${groupset?.name ?? '12v'}`)}
          onMouseLeave={() => setHoveredPart(null)}
        >
          {/* Drive Chain */}
          <path
            d="M 470 376 L 230 354 M 470 444 L 255 425"
            stroke="#87939a"
            strokeWidth="3.5"
            strokeDasharray="2,2"
            opacity="0.9"
          />

          {/* Outer Chainring */}
          <circle cx="470" cy="410" r="38" fill="url(#alloyGradient)" stroke="#222629" strokeWidth="2" />
          <circle cx="470" cy="410" r="34" fill="#1b2023" />
          {!isSingleRing && (
            <circle cx="470" cy="410" r="26" fill="url(#alloyGradient)" opacity="0.6" />
          )}

          {/* Rear Derailleur */}
          <g id="rear-derailleur">
            <rect x="238" y="380" width="18" height="14" rx="3" fill="#1a1d20" />
            {isElectronic ? (
              /* Battery Pack indicator */
              <rect x="246" y="375" width="8" height="6" rx="1" fill="#4caf50" />
            ) : null}
            <line x1="247" y1="394" x2="252" y2="425" stroke="#48535a" strokeWidth="4" strokeLinecap="round" />
            {/* Jockey Wheels */}
            <circle cx="247" cy="396" r="6" fill="#1b1f22" stroke="#6f7b82" strokeWidth="1.5" />
            <circle cx="254" cy="425" r="6" fill="#1b1f22" stroke="#6f7b82" strokeWidth="1.5" />
          </g>

          {/* Crank Arm & Pedals */}
          <line
            x1="470"
            y1="410"
            x2="520"
            y2="465"
            stroke={crankset?.material === 'carbono' ? '#14181a' : '#9aa3a8'}
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Pedal */}
          <rect x="515" y="462" width="18" height="8" rx="2" fill="#2d3439" stroke="#6f7b82" strokeWidth="1" />
          {/* Center BB Cap */}
          <circle cx="470" cy="410" r="10" fill="#0f1214" stroke="#75828a" strokeWidth="2" />
        </g>

        {/* ============================================================== */}
        {/* LAYER 7: ACCESSORIES (Bidões, GPS, Luzes, Bolsa) */}
        {/* ============================================================== */}
        <g id="accessories-group">
          {/* Down Tube Bottle Cage + Bottle */}
          {accessories.some((a) => a.slot === 'bidao') && (
            <g id="accessory-bottle-1">
              <rect
                x="530"
                y="315"
                width="20"
                height="50"
                rx="6"
                fill="#2c3338"
                stroke="#68757d"
                strokeWidth="1.5"
                transform="rotate(-40 540 340)"
              />
              <rect
                x="546"
                y="300"
                width="8"
                height="10"
                rx="2"
                fill="#e65c00"
                transform="rotate(-40 540 340)"
              />
            </g>
          )}

          {/* Cycle Computer on Stem */}
          {accessories.some((a) => a.slot === 'computador') && (
            <g id="accessory-computer">
              <rect x="738" y="140" width="16" height="12" rx="2" fill="#17191b" stroke="#00e5ff" strokeWidth="1.2" />
              <rect x="741" y="143" width="10" height="6" fill="#00e5ff" opacity="0.4" />
            </g>
          )}

          {/* Saddle Bag */}
          {accessories.some((a) => a.slot === 'bolsa') && (
            <g id="accessory-saddle-bag">
              <path
                d="M 370 148 L 398 152 L 390 178 L 364 165 Z"
                fill="#1e2327"
                stroke="#3f484f"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Lights */}
          {accessories.some((a) => a.slot === 'iluminacao') && (
            <g id="accessory-lights">
              {/* Front Light */}
              <rect x="760" y="172" width="12" height="7" rx="2" fill="#202428" stroke="#ffffff" strokeWidth="1" />
              <polygon points="772,173 795,160 795,190" fill="rgba(255,255,255,0.18)" />
              {/* Rear Light */}
              <rect x="382" y="170" width="6" height="10" rx="1" fill="#d32f2f" />
              <polygon points="382,172 360,165 360,185" fill="rgba(255,40,40,0.22)" />
            </g>
          )}
        </g>
      </svg>

      {/* Floating HUD Information & Highlights */}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="accent" className="flex items-center gap-1.5 px-3 py-1 font-semibold shadow-md">
            <Sparkles className="size-3.5 text-lime-400" />
            Estúdio 2D Alta Definição
          </Badge>
          <span className="rounded-full bg-ink-900/80 px-2.5 py-0.5 text-[0.6875rem] font-medium text-fog-300 backdrop-blur-md border border-line">
            {frameColorConfig.name}
          </span>
        </div>

        {hoveredPart && (
          <div className="pointer-events-auto flex items-center gap-2 rounded-md border border-lime-400/40 bg-ink-950/90 px-3 py-1.5 text-xs text-lime-300 shadow-lg backdrop-blur-md transition-all">
            <Eye className="size-3.5 text-lime-400" />
            <span>{hoveredPart}</span>
          </div>
        )}
      </div>

      {/* Bottom Quick-Zoom View Controls */}
      <div className="absolute inset-x-5 bottom-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-line bg-ink-950/80 p-1.5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setCameraView('lateral')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              cameraView === 'lateral'
                ? 'bg-lime-400/15 text-lime-300 border border-lime-400/40'
                : 'text-fog-400 hover:text-fog-100'
            }`}
          >
            Vista Geral
          </button>
          <button
            type="button"
            onClick={() => setCameraView('cockpit')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              cameraView === 'cockpit'
                ? 'bg-lime-400/15 text-lime-300 border border-lime-400/40'
                : 'text-fog-400 hover:text-fog-100'
            }`}
          >
            Cockpit / Frente
          </button>
          <button
            type="button"
            onClick={() => setCameraView('transmissao')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              cameraView === 'transmissao'
                ? 'bg-lime-400/15 text-lime-300 border border-lime-400/40'
                : 'text-fog-400 hover:text-fog-100'
            }`}
          >
            Transmissão
          </button>
          <button
            type="button"
            onClick={() => setCameraView('frontal')}
            className={`rounded-xs px-2.5 py-1 text-[0.6875rem] font-medium transition-colors ${
              cameraView === 'frontal'
                ? 'bg-lime-400/15 text-lime-300 border border-lime-400/40'
                : 'text-fog-400 hover:text-fog-100'
            }`}
          >
            Rodas & Travões
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[0.6875rem] text-fog-500 font-mono tracking-wider">
          <ZoomIn className="size-3" />
          <span>FOTOREALISMO 2D DINÂMICO</span>
        </div>
      </div>
    </div>
  );
}

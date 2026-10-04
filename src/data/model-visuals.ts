/**
 * Model and component studio visual mappings.
 *
 * Implements real Canyon-style visual presentations:
 * 1. Each bicycle frame model has its own dedicated colorways and studio photography.
 * 2. Each component (wheels, cockpit, saddle, drivetrain, tires) has its high-resolution
 *    catalog photography and macro focal coordinates on the studio stage.
 */

export type ModelColorway = {
  readonly id: string;
  readonly name: string;
  readonly hex: string;
  readonly bgClass: string;
  readonly image: string;
};

export type BikeModelVisualConfig = {
  readonly modelTitle: string;
  readonly badge: string;
  readonly defaultColorId: string;
  readonly colorways: readonly ModelColorway[];
};

export const BIKE_MODEL_VISUALS: Record<string, BikeModelVisualConfig> = {
  // 1. Aero Road SL (Canyon Aeroad CFR / Veloce Aero)
  'frame-veloce-aero-sl': {
    modelTitle: 'Canyon Aeroad CFR',
    badge: 'Aero WorldTour',
    defaultColorId: 'crimson-red',
    colorways: [
      {
        id: 'crimson-red',
        name: 'Racing Crimson Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Stealth Carbon Black',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'pearl-white',
        name: 'Pearl White & Chrome',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
      {
        id: 'team-blue',
        name: 'Team Alpecin Sapphire Blue',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
    ],
  },

  // 2. Ultimate CFG / Escalada (Canyon Ultimate CFR)
  'frame-aether-ultimate-cfg': {
    modelTitle: 'Canyon Ultimate CFR',
    badge: 'Escalada Ultra-Leve',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Solid Stealth Black',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'pearl-white',
        name: 'Pearl White Gloss',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Crimson Racing Accent',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
    ],
  },

  // 3. Velora Madone SLR (Aero integrada)
  'frame-velora-madone-slr': {
    modelTitle: 'Velora Madone SLR Pro',
    badge: 'Aero Integrada',
    defaultColorId: 'pearl-white',
    colorways: [
      {
        id: 'pearl-white',
        name: 'Pearl White & Chrome',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Viper Red Metallic',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Matte Carbon Raw',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
    ],
  },

  // 4. Northwind TCR Advanced SL
  'frame-northwind-tcr-advanced-sl': {
    modelTitle: 'Northwind TCR Advanced SL',
    badge: 'Competição All-Round',
    defaultColorId: 'team-blue',
    colorways: [
      {
        id: 'team-blue',
        name: 'Team Sapphire Blue',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Composite Stealth',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Grand Tour Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
    ],
  },

  // 5. Aurelian Diverge STiX (Gravel & Aventura)
  'frame-aurelian-diverge-stix': {
    modelTitle: 'Canyon Grizl CF Gravel',
    badge: 'Gravel & Aventura',
    defaultColorId: 'desert-bronze',
    colorways: [
      {
        id: 'desert-bronze',
        name: 'Desert Bronze & Olive',
        hex: '#8a704c',
        bgClass: 'bg-[#8a704c]',
        image: '/images/bikes/canyon-grizl-gravel.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Stealth Earth Grey',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'team-blue',
        name: 'Glacier Lake Blue',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
    ],
  },

  // 6. Meridian Ti Gravel
  'frame-meridian-ti-gravel': {
    modelTitle: 'Meridian Ti Gravel Titanium',
    badge: 'Gravel Titanium Grade 9',
    defaultColorId: 'desert-bronze',
    colorways: [
      {
        id: 'desert-bronze',
        name: 'Desert Sand Bronze',
        hex: '#8a704c',
        bgClass: 'bg-[#8a704c]',
        image: '/images/bikes/canyon-grizl-gravel.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Brushed Raw Metal',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
    ],
  },

  // 7. Solstice Dogma X
  'frame-solstice-dogma-x': {
    modelTitle: 'Solstice Dogma X Asymmetric',
    badge: 'Superbike T1100 1K',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Nero Stealth Shiny',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Rosso Corsa Velvet',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'pearl-white',
        name: 'Bianco Pearl White',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 8. Aurelian Tarmac SL8
  'frame-aurelian-tarmac-sl8': {
    modelTitle: 'Aurelian Tarmac SL8 FACT 12r',
    badge: 'Corrida World Championship',
    defaultColorId: 'crimson-red',
    colorways: [
      {
        id: 'crimson-red',
        name: 'S-Works Metallic Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Satin Carbon / Gloss Chrome',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'pearl-white',
        name: 'Gloss Pearl White',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 9. Altiro Caledonia-5
  'frame-altiro-caledonia-5': {
    modelTitle: 'Altiro Caledonia-5 Endurance',
    badge: 'Endurance de Longo Curso',
    defaultColorId: 'team-blue',
    colorways: [
      {
        id: 'team-blue',
        name: 'Deep Sea Blue Metallic',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Slate Carbon',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
    ],
  },

  // 10. Ardent Alloy Pro
  'frame-ardent-alloy-pro': {
    modelTitle: 'Ardent Alloy Pro 6061',
    badge: 'Alumínio Hidroformado',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Anodized Stealth Grey',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Racing Red Gloss',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
    ],
  },
};

/** Default fallback configuration */
export const DEFAULT_MODEL_VISUAL: BikeModelVisualConfig = BIKE_MODEL_VISUALS['frame-veloce-aero-sl'] as BikeModelVisualConfig;

export function getModelVisuals(frameId: string | null): BikeModelVisualConfig {
  if (frameId && frameId in BIKE_MODEL_VISUALS) {
    return BIKE_MODEL_VISUALS[frameId] as BikeModelVisualConfig;
  }
  return DEFAULT_MODEL_VISUAL;
}

/** Component imagery and focus coordinates */
export type ComponentVisualMeta = {
  readonly thumbnail: string;
  readonly stageFocus: {
    readonly scale: number;
    readonly x: number;
    readonly y: number;
    readonly label: string;
  };
};

export function getComponentVisualMeta(category: string, _productId?: string | null): ComponentVisualMeta {
  switch (category) {
    case 'rodas':
      return {
        thumbnail: '/images/components/wheel-dt-swiss.jpg',
        stageFocus: {
          scale: 2.15,
          x: -28,
          y: -14,
          label: 'Foco: Rodas & Travão de Disco',
        },
      };

    case 'guiador':
      return {
        thumbnail: '/images/components/cockpit-aero.svg',
        stageFocus: {
          scale: 2.3,
          x: -30,
          y: 22,
          label: 'Foco: Cockpit & Passagem de Cabos',
        },
      };

    case 'selim':
      return {
        thumbnail: '/images/components/saddle-carbon.svg',
        stageFocus: {
          scale: 2.4,
          x: 14,
          y: 24,
          label: 'Foco: Selim & Geometria de Espigão',
        },
      };

    case 'grupo':
    case 'pedaleiro':
    case 'transmissao':
      return {
        thumbnail: '/images/components/drivetrain-groupset.svg',
        stageFocus: {
          scale: 2.35,
          x: 12,
          y: -22,
          label: 'Foco: Transmissão & Desviador Traseiro',
        },
      };

    case 'pneus':
      return {
        thumbnail: '/images/components/tire-tubeless.svg',
        stageFocus: {
          scale: 2.1,
          x: -28,
          y: -14,
          label: 'Foco: Pneus & Rasto Tubeless',
        },
      };

    case 'quadro':
    default:
      return {
        thumbnail: '/images/bikes/canyon-aeroad-red.jpg',
        stageFocus: {
          scale: 1,
          x: 0,
          y: 0,
          label: 'Vista Geral da Bicicleta',
        },
      };
  }
}

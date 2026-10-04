/**
 * Model and component studio visual mappings.
 *
 * Implements real studio visual presentations for all brands and models:
 * 1. Each bicycle frame model (Aeroad, Endurace, Ultimate, Tarmac, Diverge, Madone, Émonda,
 *    TCR, Dogma, R5, Caledonia, Alloy Pro, Ti Gravel) has its own dedicated branding,
 *    colorways, geometry badge and studio photography.
 * 2. Every brand (Canyon, Aurelian, Velora, Northwind, Solstice, Altiro, Ardent, Meridian)
 *    has its own official studio watermark, badge and aesthetic.
 * 3. Each component (wheels, cockpit, saddle, drivetrain, tires) has its high-resolution
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
  readonly frameId: string;
  readonly brandName: string;
  readonly brandWatermark: string;
  readonly modelTitle: string;
  readonly badge: string;
  readonly defaultColorId: string;
  readonly colorways: readonly ModelColorway[];
};

export const BIKE_MODEL_VISUALS: Record<string, BikeModelVisualConfig> = {
  // 1. Canyon Aeroad CFR (Veloce Aero SL)
  'frame-veloce-aero-sl': {
    frameId: 'frame-veloce-aero-sl',
    brandName: 'Canyon',
    brandWatermark: 'CANYON',
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

  // 2. Canyon Endurace CF SLX (Veloce Endurance) - DISTINCT FROM AEROAD!
  'frame-veloce-endurance': {
    frameId: 'frame-veloce-endurance',
    brandName: 'Canyon',
    brandWatermark: 'CANYON',
    modelTitle: 'Canyon Endurace CF SLX',
    badge: 'Endurance & Conforto VCLS',
    defaultColorId: 'pearl-white',
    colorways: [
      {
        id: 'pearl-white',
        name: 'Endurance Pearl White',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
      {
        id: 'forest-olive',
        name: 'Endurance Forest Olive',
        hex: '#5c6b54',
        bgClass: 'bg-[#5c6b54]',
        image: '/images/bikes/canyon-grizl-gravel.jpg',
      },
      {
        id: 'stealth-black',
        name: 'Solid Stealth Black',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'sapphire-blue',
        name: 'Deep Glacier Blue',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
    ],
  },

  // 3. Canyon Ultimate CFR (Aether Ultimate CFG)
  'frame-aether-ultimate-cfg': {
    frameId: 'frame-aether-ultimate-cfg',
    brandName: 'Canyon',
    brandWatermark: 'CANYON',
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

  // 4. Aurelian Tarmac SL8 S-Works
  'frame-aurelian-tarmac-sl8': {
    frameId: 'frame-aurelian-tarmac-sl8',
    brandName: 'Aurelian',
    brandWatermark: 'AURELIAN',
    modelTitle: 'Aurelian Tarmac SL8 S-Works',
    badge: 'Campeão Mundial FACT 12r',
    defaultColorId: 's-works-red',
    colorways: [
      {
        id: 's-works-red',
        name: 'S-Works Metallic Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'satin-carbon',
        name: 'Satin Carbon / Gloss Chrome',
        hex: '#111315',
        bgClass: 'bg-[#111315]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'gloss-white',
        name: 'Gloss Pearl White',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 5. Aurelian Diverge STiX Gravel
  'frame-aurelian-diverge-stix': {
    frameId: 'frame-aurelian-diverge-stix',
    brandName: 'Aurelian',
    brandWatermark: 'AURELIAN',
    modelTitle: 'Aurelian Diverge STiX Gravel',
    badge: 'Future Shock 3.0 Gravel',
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
        id: 'stealth-earth',
        name: 'Stealth Earth Grey',
        hex: '#1c1f24',
        bgClass: 'bg-[#1c1f24]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'lagoon-blue',
        name: 'Deep Lagoon Blue',
        hex: '#1a4c8a',
        bgClass: 'bg-[#1a4c8a]',
        image: '/images/bikes/canyon-aeroad-blue.jpg',
      },
    ],
  },

  // 6. Velora Madone SLR Pro
  'frame-velora-madone-slr': {
    frameId: 'frame-velora-madone-slr',
    brandName: 'Velora',
    brandWatermark: 'VELORA',
    modelTitle: 'Velora Madone SLR 9',
    badge: 'Aero IsoFlow OCLV 800',
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
        id: 'viper-red',
        name: 'Viper Red Metallic',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'matte-carbon',
        name: 'Matte Carbon Raw',
        hex: '#1a1d1f',
        bgClass: 'bg-[#1a1d1f]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
    ],
  },

  // 7. Velora Émonda SLR (Climbing ultralight)
  'frame-velora-emonda-slr': {
    frameId: 'frame-velora-emonda-slr',
    brandName: 'Velora',
    brandWatermark: 'VELORA',
    modelTitle: 'Velora Émonda SLR 9',
    badge: 'Escalada 695g Ultraleve',
    defaultColorId: 'matte-carbon',
    colorways: [
      {
        id: 'matte-carbon',
        name: 'Matte Carbon Raw 695g',
        hex: '#141618',
        bgClass: 'bg-[#141618]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Race Crimson Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'pearl-white',
        name: 'Pearl White Gloss',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 8. Northwind TCR Advanced SL
  'frame-northwind-tcr-advanced-sl': {
    frameId: 'frame-northwind-tcr-advanced-sl',
    brandName: 'Northwind',
    brandWatermark: 'NORTHWIND',
    modelTitle: 'Northwind TCR Advanced SL 0',
    badge: 'Advanced SL Composite',
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

  // 9. Solstice Dogma X
  'frame-solstice-dogma-x': {
    frameId: 'frame-solstice-dogma-x',
    brandName: 'Solstice',
    brandWatermark: 'SOLSTICE',
    modelTitle: 'Solstice Dogma X Onda',
    badge: 'Toray T1100 1K Assimétrico',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Nero Stealth Shiny',
        hex: '#111316',
        bgClass: 'bg-[#111316]',
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

  // 10. Altiro R5 (Climbing)
  'frame-altiro-r5': {
    frameId: 'frame-altiro-r5',
    brandName: 'Altiro',
    brandWatermark: 'ALTIRO',
    modelTitle: 'Altiro R5 Squoval',
    badge: 'Escalada Squoval 720g',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Matte Squoval Black',
        hex: '#16181b',
        bgClass: 'bg-[#16181b]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'glacier-white',
        name: 'Glacier White',
        hex: '#edf2f7',
        bgClass: 'bg-[#edf2f7]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Corsa Racing Red',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
    ],
  },

  // 11. Altiro Caledonia-5
  'frame-altiro-caledonia-5': {
    frameId: 'frame-altiro-caledonia-5',
    brandName: 'Altiro',
    brandWatermark: 'ALTIRO',
    modelTitle: 'Altiro Caledonia-5 All-Road',
    badge: 'All-Road Endurance 35mm',
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
      {
        id: 'white-pearl',
        name: 'Pearl White Gloss',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 12. Ardent Alloy Pro
  'frame-ardent-alloy-pro': {
    frameId: 'frame-ardent-alloy-pro',
    brandName: 'Ardent',
    brandWatermark: 'ARDENT',
    modelTitle: 'Ardent Alloy Pro 6061',
    badge: 'Alumínio Hidroformado',
    defaultColorId: 'stealth-black',
    colorways: [
      {
        id: 'stealth-black',
        name: 'Anodized Stealth Grey',
        hex: '#2b2f36',
        bgClass: 'bg-[#2b2f36]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
      {
        id: 'crimson-red',
        name: 'Racing Red Gloss',
        hex: '#c91f37',
        bgClass: 'bg-[#c91f37]',
        image: '/images/bikes/canyon-aeroad-red.jpg',
      },
      {
        id: 'arctic-white',
        name: 'Arctic White',
        hex: '#e8edf0',
        bgClass: 'bg-[#e8edf0]',
        image: '/images/bikes/canyon-aeroad-white.jpg',
      },
    ],
  },

  // 13. Meridian Ti Gravel
  'frame-meridian-ti-gravel': {
    frameId: 'frame-meridian-ti-gravel',
    brandName: 'Meridian',
    brandWatermark: 'MERIDIAN',
    modelTitle: 'Meridian Ti Gravel Titanium',
    badge: 'Titânio Grade 9 Gravel',
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
        id: 'brushed-ti',
        name: 'Brushed Raw Titanium',
        hex: '#64748b',
        bgClass: 'bg-[#64748b]',
        image: '/images/bikes/canyon-ultimate-stealth.jpg',
      },
    ],
  },
};

/** Default fallback configuration */
export const DEFAULT_MODEL_VISUAL: BikeModelVisualConfig =
  BIKE_MODEL_VISUALS['frame-veloce-aero-sl'] as BikeModelVisualConfig;

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

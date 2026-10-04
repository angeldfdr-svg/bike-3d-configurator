/**
 * Domain model for the configurator catalog.
 *
 * Units are fixed at the model boundary so pricing, weight and compatibility
 * logic never have to guess:
 *
 *   - money: integer cents (EUR)
 *   - mass: integer grams (a wheelset is priced and weighed as a pair)
 *   - lengths, widths and diameters: millimetres
 *
 * Every product carries two views of its data:
 *
 *   - `specifications`: the human readable rows shown in the interface.
 *   - the structured attributes of each subtype: the machine readable values
 *     the compatibility rules consume.
 *
 * The two must stay consistent; `tests/catalog.test.ts` enforces that.
 */

export type ComponentCategory =
  | 'quadro'
  | 'rodas'
  | 'grupo'
  | 'pedaleiro'
  | 'guiador'
  | 'selim'
  | 'pneus'
  | 'extras';

/** A single label/value row shown in a product card. */
export type Specification = {
  readonly label: string;
  readonly value: string;
};

/** Fields shared by every sellable component. */
export type ComponentBase = {
  readonly id: string;
  readonly name: string;
  readonly brand: string;
  readonly category: ComponentCategory;
  readonly model: string;
  /** Price in EUR cents. */
  readonly price: number;
  /** Mass in grams. */
  readonly weight: number;
  readonly description: string;
  readonly specifications: readonly Specification[];
  /** Optional local asset path. The interface must render a fallback. */
  readonly image?: string;
};

/* ------------------------------------------------------------------ *
 * Shared technical vocabularies
 * ------------------------------------------------------------------ */

export type FrameMaterial = 'carbono' | 'aluminio' | 'titanio' | 'aco';
export type FrameSize = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type BottomBracketStandard = 'BSA' | 'T47' | 'BB86' | 'DUB';
export type BrakeSystem = 'disco-hidraulico' | 'disco-mecanico' | 'aro';
export type AxleStandard = 'quick-release' | 'thru-axle-12mm' | 'thru-axle-15mm';
export type FreehubStandard = 'HG' | 'XDR' | 'MicroSpline' | 'Campagnolo';
export type SeatpostDiameter = 27.2 | 30.9 | 31.6;
export type HandlebarClamp = 31.8 | 35;
export type HandlebarType = 'drop' | 'gravel-drop' | 'flat';
export type TireType = 'clincher' | 'tubeless' | 'tubular';
export type WheelSize = '700c' | '650b';
export type ShiftingType = 'mecanico' | 'eletronico';

/* ------------------------------------------------------------------ *
 * Component subtypes
 * ------------------------------------------------------------------ */

export type BikeFrame = ComponentBase & {
  readonly category: 'quadro';
  readonly material: FrameMaterial;
  readonly sizes: readonly FrameSize[];
  /** Maximum tyre width admitted by the frame, in millimetres. */
  readonly maxTireWidth: number;
  readonly bottomBracket: BottomBracketStandard;
  readonly brakeSystem: BrakeSystem;
  readonly frontAxle: AxleStandard;
  readonly rearAxle: AxleStandard;
  readonly seatpostDiameter: SeatpostDiameter;
};

export type Wheelset = ComponentBase & {
  readonly category: 'rodas';
  readonly material: 'carbono' | 'aluminio';
  /** Rim depth in millimetres. */
  readonly rimDepth: number;
  readonly wheelSize: WheelSize;
  readonly freehub: FreehubStandard;
  readonly frontAxle: AxleStandard;
  readonly rearAxle: AxleStandard;
  readonly brakeSystem: BrakeSystem;
  /** Whether the rim accepts tubeless tyres. */
  readonly tubelessReady: boolean;
};

export type Groupset = ComponentBase & {
  readonly category: 'grupo';
  readonly manufacturer: string;
  readonly speeds: number;
  readonly shifting: ShiftingType;
  readonly brakeSystem: BrakeSystem;
  readonly freehub: FreehubStandard;
  readonly bottomBracket: BottomBracketStandard;
};

export type Crankset = ComponentBase & {
  readonly category: 'pedaleiro';
  /** Crank arm length in millimetres. */
  readonly length: number;
  readonly chainrings: number;
  /** Chainring combination, e.g. `52/36`. */
  readonly ratio: string;
  readonly bottomBracket: BottomBracketStandard;
  /** Number of rear sprockets the crankset is designed for. */
  readonly speeds: number;
};

export type Handlebar = ComponentBase & {
  readonly category: 'guiador';
  readonly type: HandlebarType;
  /** Centre to centre width in millimetres. */
  readonly width: number;
  readonly material: 'carbono' | 'aluminio' | 'aco';
  readonly clamp: HandlebarClamp;
  /** Reach in millimetres. */
  readonly reach: number;
  /** Drop in millimetres. */
  readonly drop: number;
};

export type Saddle = ComponentBase & {
  readonly category: 'selim';
  readonly railMaterial: 'carbono' | 'aco';
  /** Shell width in millimetres. */
  readonly width: number;
};

export type Tire = ComponentBase & {
  readonly category: 'pneus';
  /** Casing width in millimetres. */
  readonly width: number;
  readonly type: TireType;
  /** Threads per inch of the casing. */
  readonly tpi: number;
  readonly wheelSize: WheelSize;
};

export type Accessory = ComponentBase & {
  readonly category: 'extras';
  /** Where the accessory attaches, e.g. `computador` or `bidao`. */
  readonly slot: string;
  /** Default quantity when the accessory is added to a build. */
  readonly quantity: number;
};

/** Every product the configurator can sell. */
export type Component =
  | BikeFrame
  | Wheelset
  | Groupset
  | Crankset
  | Handlebar
  | Saddle
  | Tire
  | Accessory;

/** Products grouped by the category shown in the interface. */
export type Catalog = {
  readonly frames: readonly BikeFrame[];
  readonly wheelsets: readonly Wheelset[];
  readonly groupsets: readonly Groupset[];
  readonly cranksets: readonly Crankset[];
  readonly handlebars: readonly Handlebar[];
  readonly saddles: readonly Saddle[];
  readonly tires: readonly Tire[];
  readonly accessories: readonly Accessory[];
};

/** Union of every category key, useful for generic lookups. */
export type CatalogKey = keyof Catalog;

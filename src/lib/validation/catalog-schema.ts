import { z } from 'zod';

import type {
  Accessory,
  BikeFrame,
  Catalog,
  Crankset,
  Groupset,
  Handlebar,
  Saddle,
  Tire,
  Wheelset,
} from '@/types/components';

/**
 * Runtime contract for the catalog.
 *
 * The TypeScript types describe the shape we expect; these schemas are the
 * boundary that actually runs when data arrives from a file, an API or a
 * database. Both views are kept side by side and `tests/catalog.test.ts`
 * checks they stay in sync.
 */

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'identificador inválido');
const label = z.string().min(1, 'não pode ser vazio');
const grams = z.number().int('peso tem de ser inteiro').nonnegative('peso não pode ser negativo');
const cents = z
  .number()
  .int('preço tem de ser inteiro (cêntimos)')
  .nonnegative('preço não pode ser negativo');
const millimetres = z.number().positive('tem de ser positivo');

const specificationSchema = z.object({
  label,
  value: label,
});

const componentBaseSchema = {
  id: slug,
  name: label,
  brand: label,
  model: label,
  price: cents,
  weight: grams,
  description: z.string().min(10, 'descrição demasiado curta'),
  specifications: z.array(specificationSchema).min(1, 'produto sem especificações'),
  image: z.string().min(1).optional(),
};

const frameMaterialSchema = z.enum(['carbono', 'aluminio', 'titanio', 'aco']);
const frameSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);
const bottomBracketSchema = z.enum(['BSA', 'T47', 'BB86', 'DUB']);
const brakeSystemSchema = z.enum(['disco-hidraulico', 'disco-mecanico', 'aro']);
const axleStandardSchema = z.enum(['quick-release', 'thru-axle-12mm', 'thru-axle-15mm']);
const freehubSchema = z.enum(['HG', 'XDR', 'MicroSpline', 'Campagnolo']);
const seatpostDiameterSchema = z.union([z.literal(27.2), z.literal(30.9), z.literal(31.6)]);
const handlebarClampSchema = z.union([z.literal(31.8), z.literal(35)]);

export const bikeFrameSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('quadro'),
  material: frameMaterialSchema,
  sizes: z.array(frameSizeSchema).min(1, 'quadro sem tamanhos'),
  maxTireWidth: millimetres,
  bottomBracket: bottomBracketSchema,
  brakeSystem: brakeSystemSchema,
  frontAxle: axleStandardSchema,
  rearAxle: axleStandardSchema,
  seatpostDiameter: seatpostDiameterSchema,
});

export const wheelsetSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('rodas'),
  material: z.enum(['carbono', 'aluminio']),
  rimDepth: millimetres,
  wheelSize: z.enum(['700c', '650b']),
  freehub: freehubSchema,
  frontAxle: axleStandardSchema,
  rearAxle: axleStandardSchema,
  brakeSystem: brakeSystemSchema,
  tubelessReady: z.boolean(),
});

export const groupsetSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('grupo'),
  manufacturer: label,
  speeds: z.number().int().min(1).max(13),
  shifting: z.enum(['mecanico', 'eletronico']),
  brakeSystem: brakeSystemSchema,
  freehub: freehubSchema,
  bottomBracket: bottomBracketSchema,
});

export const cranksetSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('pedaleiro'),
  length: z.number().positive(),
  chainrings: z.number().int().min(1).max(3),
  ratio: z.string().regex(/^\d+(\/\d+)?$/, 'relação inválida'),
  bottomBracket: bottomBracketSchema,
  speeds: z.number().int().min(1).max(13),
});

export const handlebarSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('guiador'),
  type: z.enum(['drop', 'gravel-drop', 'flat']),
  width: millimetres,
  material: z.enum(['carbono', 'aluminio', 'aco']),
  clamp: handlebarClampSchema,
  reach: z.number().nonnegative(),
  drop: z.number().nonnegative(),
});

export const saddleSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('selim'),
  railMaterial: z.enum(['carbono', 'aco']),
  width: millimetres,
});

export const tireSchema = z.object({
  ...componentBaseSchema,
  category: z.literal('pneus'),
  width: millimetres,
  type: z.enum(['clincher', 'tubeless', 'tubular']),
  tpi: z.number().int().positive(),
  wheelSize: z.enum(['700c', '650b']),
});

export const accessorySchema = z.object({
  ...componentBaseSchema,
  category: z.literal('extras'),
  slot: label,
  quantity: z.number().int().min(1),
});

export const catalogSchema = z.object({
  frames: z.array(bikeFrameSchema),
  wheelsets: z.array(wheelsetSchema),
  groupsets: z.array(groupsetSchema),
  cranksets: z.array(cranksetSchema),
  handlebars: z.array(handlebarSchema),
  saddles: z.array(saddleSchema),
  tires: z.array(tireSchema),
  accessories: z.array(accessorySchema),
});

/**
 * Parse and validate a catalog payload.
 *
 * Throws a `ZodError` with the offending path when the payload is invalid, so
 * a broken catalog fails loudly at startup instead of silently producing wrong
 * prices or impossible configurations.
 */
export function parseCatalog(input: unknown): Catalog {
  return catalogSchema.parse(input);
}

/** Non throwing variant, useful for API boundaries and tests. */
export function safeParseCatalog(input: unknown) {
  return catalogSchema.safeParse(input);
}

export type ParsedCatalog = z.infer<typeof catalogSchema>;

/*
 * Compile-time guards: the schemas must stay at least as strict as the domain
 * types. If a schema ever drifts looser than its TypeScript counterpart, the
 * corresponding `Assert` below stops compiling.
 */
type Assert<T extends true> = T;

export type SchemaTypeGuards = [
  Assert<ParsedCatalog['frames'] extends readonly BikeFrame[] ? true : false>,
  Assert<ParsedCatalog['wheelsets'] extends readonly Wheelset[] ? true : false>,
  Assert<ParsedCatalog['groupsets'] extends readonly Groupset[] ? true : false>,
  Assert<ParsedCatalog['cranksets'] extends readonly Crankset[] ? true : false>,
  Assert<ParsedCatalog['handlebars'] extends readonly Handlebar[] ? true : false>,
  Assert<ParsedCatalog['saddles'] extends readonly Saddle[] ? true : false>,
  Assert<ParsedCatalog['tires'] extends readonly Tire[] ? true : false>,
  Assert<ParsedCatalog['accessories'] extends readonly Accessory[] ? true : false>,
];

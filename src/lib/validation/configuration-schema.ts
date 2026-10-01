import { z } from 'zod';

import type {
  BikeConfiguration,
  CameraState,
  SavedConfiguration,
} from '@/types/configuration';

/**
 * Runtime contract for persisted configurations.
 *
 * Everything that crosses a boundary (localStorage, a URL, a future API) is
 * parsed here before it reaches the store, so a corrupted or outdated payload
 * can never produce an impossible build.
 */

export const configurationVersion = 1;

const frameSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL']);
const idSchema = z.string().min(1);

export const selectedAccessorySchema = z.object({
  id: idSchema,
  quantity: z.number().int().min(1).max(99),
});

export const bikeConfigurationSchema = z.object({
  frameId: idSchema.nullable(),
  frameSize: frameSizeSchema.nullable(),
  wheelsetId: idSchema.nullable(),
  groupsetId: idSchema.nullable(),
  cranksetId: idSchema.nullable(),
  handlebarId: idSchema.nullable(),
  saddleId: idSchema.nullable(),
  tireId: idSchema.nullable(),
  accessories: z.array(selectedAccessorySchema),
});

/** `{ version, configuration }` — the shareable payload. */
export const configurationPayloadSchema = z.object({
  version: z.literal(configurationVersion),
  configuration: bikeConfigurationSchema,
});

/** `{ version, configuration, savedAt }` — what the repository stores. */
export const savedConfigurationSchema = configurationPayloadSchema.extend({
  savedAt: z.string().min(1),
});

export const cameraStateSchema = z.object({
  view: z.enum(['frontal', 'lateral', 'traseira', 'superior']),
  autoRotate: z.boolean(),
});

/** Serialise a configuration for a URL or a storage payload. */
export function serializeConfiguration(configuration: BikeConfiguration): string {
  return JSON.stringify({ version: configurationVersion, configuration });
}

/** Serialise a configuration together with the moment it was saved. */
export function serializeSavedConfiguration(saved: SavedConfiguration): string {
  return JSON.stringify({
    version: configurationVersion,
    configuration: saved.configuration,
    savedAt: saved.savedAt,
  });
}

/** Parse a configuration payload, returning `null` when it is not usable. */
export function parseConfiguration(input: unknown): BikeConfiguration | null {
  const result = configurationPayloadSchema.safeParse(input);

  return result.success ? result.data.configuration : null;
}

/** Parse a saved configuration, returning `null` when it is not usable. */
export function parseSavedConfiguration(input: unknown): SavedConfiguration | null {
  const result = savedConfigurationSchema.safeParse(input);

  if (!result.success) return null;

  return { configuration: result.data.configuration, savedAt: result.data.savedAt };
}

export function parseCameraState(input: unknown): CameraState | null {
  const result = cameraStateSchema.safeParse(input);

  return result.success ? result.data : null;
}

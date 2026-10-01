import type { BikeConfiguration, SelectedAccessory } from '@/types/configuration';
import type { Catalog, FrameSize } from '@/types/components';

/**
 * Pure helpers for configurations.
 *
 * No React, no store, no side effects: everything here is a function of its
 * arguments, which is what makes the store thin and the behaviour testable.
 */

export function emptyConfiguration(): BikeConfiguration {
  return {
    frameId: null,
    frameSize: null,
    wheelsetId: null,
    groupsetId: null,
    cranksetId: null,
    handlebarId: null,
    saddleId: null,
    tireId: null,
    accessories: [],
  };
}

/** Every id referenced by a configuration, accessories included. */
export function configurationIds(configuration: BikeConfiguration): readonly string[] {
  const slots = [
    configuration.frameId,
    configuration.wheelsetId,
    configuration.groupsetId,
    configuration.cranksetId,
    configuration.handlebarId,
    configuration.saddleId,
    configuration.tireId,
  ];

  return [
    ...slots.filter((id): id is string => typeof id === 'string' && id.length > 0),
    ...configuration.accessories.map((accessory) => accessory.id),
  ];
}

/** True when every single-component slot is filled. */
export function isConfigurationComplete(configuration: BikeConfiguration): boolean {
  return (
    configuration.frameId !== null &&
    configuration.wheelsetId !== null &&
    configuration.groupsetId !== null &&
    configuration.cranksetId !== null &&
    configuration.handlebarId !== null &&
    configuration.saddleId !== null &&
    configuration.tireId !== null
  );
}

/**
 * Pick a frame size that the frame actually offers.
 *
 * Keeps the user's choice when the new frame supports it, otherwise falls back
 * to the first available size. Returns `null` for a frame without sizes.
 */
export function resolveFrameSize(
  sizes: readonly FrameSize[],
  preferred: FrameSize | null,
): FrameSize | null {
  if (sizes.length === 0) return null;
  if (preferred !== null && sizes.includes(preferred)) return preferred;
  return sizes[0] ?? null;
}

export function findAccessory(
  accessories: readonly SelectedAccessory[],
  id: string,
): SelectedAccessory | undefined {
  return accessories.find((accessory) => accessory.id === id);
}

export function hasAccessory(
  accessories: readonly SelectedAccessory[],
  id: string,
): boolean {
  return findAccessory(accessories, id) !== undefined;
}

/** Add an accessory, or bump its quantity when it is already selected. */
export function addAccessory(
  accessories: readonly SelectedAccessory[],
  id: string,
  quantity: number,
): readonly SelectedAccessory[] {
  const safeQuantity = Math.max(1, Math.trunc(quantity));
  const existing = findAccessory(accessories, id);

  if (existing) {
    return accessories.map((accessory) =>
      accessory.id === id
        ? { id, quantity: accessory.quantity + safeQuantity }
        : accessory,
    );
  }

  return [...accessories, { id, quantity: safeQuantity }];
}

/** Replace the quantity of a selected accessory. Removes it at zero or below. */
export function setAccessoryQuantity(
  accessories: readonly SelectedAccessory[],
  id: string,
  quantity: number,
): readonly SelectedAccessory[] {
  if (quantity <= 0) return removeAccessory(accessories, id);

  return accessories.map((accessory) =>
    accessory.id === id ? { id, quantity: Math.trunc(quantity) } : accessory,
  );
}

export function removeAccessory(
  accessories: readonly SelectedAccessory[],
  id: string,
): readonly SelectedAccessory[] {
  return accessories.filter((accessory) => accessory.id !== id);
}

/** Ids present in the configuration but missing from the catalog. */
export function danglingIds(
  configuration: BikeConfiguration,
  catalog: Catalog,
): readonly string[] {
  const known = new Set(
    [
      ...catalog.frames,
      ...catalog.wheelsets,
      ...catalog.groupsets,
      ...catalog.cranksets,
      ...catalog.handlebars,
      ...catalog.saddles,
      ...catalog.tires,
      ...catalog.accessories,
    ].map((product) => product.id),
  );

  return configurationIds(configuration).filter((id) => !known.has(id));
}

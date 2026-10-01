import type { FrameSize } from '@/types/components';

/**
 * A build in progress.
 *
 * The configuration stores ids, never whole products: it is small, easy to
 * serialise into a URL or a database row, and stays valid when catalog data
 * changes. Resolution against the catalog happens in the selectors.
 */

export type CameraView = 'frontal' | 'lateral' | 'traseira' | 'superior';

export type CameraState = {
  readonly view: CameraView;
  readonly autoRotate: boolean;
};

/** A single component slot of the build. */
export type ComponentSlot =
  | 'frameId'
  | 'wheelsetId'
  | 'groupsetId'
  | 'cranksetId'
  | 'handlebarId'
  | 'saddleId'
  | 'tireId';

export type SelectedAccessory = {
  readonly id: string;
  readonly quantity: number;
};

export type BikeConfiguration = {
  readonly frameId: string | null;
  readonly frameSize: FrameSize | null;
  readonly wheelsetId: string | null;
  readonly groupsetId: string | null;
  readonly cranksetId: string | null;
  readonly handlebarId: string | null;
  readonly saddleId: string | null;
  readonly tireId: string | null;
  readonly accessories: readonly SelectedAccessory[];
};

/** A configuration the user chose to keep. */
export type SavedConfiguration = {
  readonly configuration: BikeConfiguration;
  /** ISO 8601 timestamp. */
  readonly savedAt: string;
};

export type ConfigurationStatus = 'idle' | 'loading' | 'ready' | 'error';

/** The single component slots, in the order the interface presents them. */
export const componentSlots: readonly ComponentSlot[] = [
  'frameId',
  'wheelsetId',
  'groupsetId',
  'cranksetId',
  'handlebarId',
  'saddleId',
  'tireId',
];

import { CameraControls } from '@/components/configurator/camera-controls';
import { CategoryPanel } from '@/components/configurator/category-panel';
import { RoadmapPanel } from '@/components/configurator/roadmap-panel';
import { StagePanel } from '@/components/configurator/stage-panel';
import { SummaryPanel } from '@/components/configurator/summary-panel';

/**
 * Two-pane configurator shell.
 *
 * Desktop: 3D stage and camera on the left, components and summary on the right.
 * Mobile: 3D -> components -> summary, in that reading order.
 */
export function ConfiguratorView() {
  return (
    <div className="mx-auto w-full max-w-[100rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="order-1 flex min-w-0 flex-col gap-4">
          <StagePanel />
          <CameraControls />
          <RoadmapPanel />
        </div>

        <div className="order-2 flex min-w-0 flex-col gap-6 lg:sticky lg:top-24">
          <CategoryPanel />
          <SummaryPanel />
        </div>
      </div>
    </div>
  );
}

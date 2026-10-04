import { CanyonTrustBanner } from '@/components/configurator/canyon-trust-banner';
import { CategoryPanel } from '@/components/configurator/category-panel';
import { RoadmapPanel } from '@/components/configurator/roadmap-panel';
import { StagePanel } from '@/components/configurator/stage-panel';
import { SummaryPanel } from '@/components/configurator/summary-panel';
import { UserConfigurationSync } from '@/components/configurator/user-configuration-sync';

/**
 * Configurator shell.
 *
 * Desktop: The Canyon Studio view on the left, the components and the
 * summary on the right, with the project state spanning both columns below.
 * Clean, photographic e-commerce presentation matching Canyon.com.
 */
export function ConfiguratorView() {
  return (
    <div className="mx-auto w-full max-w-[100rem] px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
      <UserConfigurationSync />
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start">
        <div className="order-1 flex min-w-0 flex-col gap-4">
          <StagePanel />
          <CanyonTrustBanner />
        </div>

        <div className="order-2 flex min-w-0 flex-col gap-6 lg:sticky lg:top-24">
          <CategoryPanel />
          <SummaryPanel />
        </div>

        <div className="order-3 min-w-0 lg:col-span-2">
          <RoadmapPanel />
        </div>
      </div>
    </div>
  );
}

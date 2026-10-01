'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

import { SceneBoundary } from '@/components/3d/scene-boundary';
import { useWebGLSupport } from '@/components/3d/webgl-support';
import { cameraViewDescriptions } from '@/lib/3d/camera-views';
import { useBikeStore } from '@/store/bike-store';

const BikeScene = dynamic(
  () => import('@/components/3d/bike-scene').then((module) => module.BikeScene),
  {
    ssr: false,
    loading: () => <SceneLoading />,
  },
);

function SceneLoading() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-ink-950">
      <Loader2 className="size-5 animate-spin text-lime-400" aria-hidden="true" />
      <p className="text-xs tracking-[0.16em] text-fog-500 uppercase">A preparar a cena 3D</p>
    </div>
  );
}

function SceneReference() {
  return (
    <div className="relative h-full w-full">
      <Image
        src="/images/bike-stage.webp"
        alt="Bicicleta de estrada em carbono em estúdio, vista lateral"
        fill
        sizes="(max-width: 1024px) 100vw, 62vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/10 to-ink-950/45"
      />
      <p className="absolute inset-x-5 bottom-5 text-xs leading-relaxed text-fog-400">
        WebGL indisponível neste dispositivo. A mostrar a fotografia de referência.
      </p>
    </div>
  );
}

/**
 * The interactive 3D stage.
 *
 * Three layers of degradation, in order: WebGL support, runtime errors, and a
 * loading state. The editorial reference image is the last resort, so the stage
 * is never empty.
 */
export function StageCanvas() {
  const support = useWebGLSupport();
  const view = useBikeStore((state) => state.camera.view);

  return (
    <div className="absolute inset-0">
      <SceneBoundary fallback={<SceneReference />}>
        {support === 'supported' ? (
          <BikeScene />
        ) : support === 'unknown' ? (
          <SceneLoading />
        ) : (
          <SceneReference />
        )}
      </SceneBoundary>

      {/* Screen reader description of the current view. */}
      <p className="sr-only" aria-live="polite">
        {`Vista 3D: ${cameraViewDescriptions[view]}. Arraste para rodar a bicicleta ou use os botões de vista.`}
      </p>
    </div>
  );
}

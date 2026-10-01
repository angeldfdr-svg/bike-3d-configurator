'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ElementRef } from 'react';
import { Suspense, useMemo, useRef } from 'react';

import { BikeModel } from '@/components/3d/bike-model';
import { CameraRig } from '@/components/3d/camera-rig';
import { catalog } from '@/data/catalog';
import { resolveBikeGeometry } from '@/lib/3d/bike-geometry';
import { resolveCameraPreset } from '@/lib/3d/camera-views';
import { useBikeStore } from '@/store/bike-store';

type Controls = ElementRef<typeof OrbitControls>;

/**
 * The WebGL scene.
 *
 * Mounted through a lazy boundary in `StageCanvas`, so Three.js is only
 * downloaded when the stage actually renders.
 */
export function BikeScene() {
  const configuration = useBikeStore((state) => state.configuration);
  const controlsRef = useRef<Controls | null>(null);

  const geometry = useMemo(
    () => resolveBikeGeometry(configuration, catalog),
    [configuration],
  );

  const initialCamera = useMemo(
    () => resolveCameraPreset('lateral', geometry),
    [geometry],
  );

  return (
    <Canvas
      dpr={[1, 1.75]}
      shadows={false}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{
        position: [initialCamera.position[0], initialCamera.position[1], initialCamera.position[2]],
        fov: 35,
        near: 0.1,
        far: 50,
      }}
    >
      <Suspense fallback={null}>
        <hemisphereLight args={['#cfd8c4', '#0a0b09', 0.55]} />
        <directionalLight position={[2.4, 3.6, 2.2]} intensity={2.1} />
        <directionalLight position={[-2.8, 1.6, -2.4]} intensity={0.7} color="#bfe35c" />
        <directionalLight position={[0, 1.2, -3.2]} intensity={0.5} />

        <BikeModel />
        <CameraRig geometry={geometry} controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  );
}

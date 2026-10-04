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
      shadows
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{
        position: [initialCamera.position[0], initialCamera.position[1], initialCamera.position[2]],
        fov: 31,
        near: 0.1,
        far: 60,
      }}
    >
      <color attach="background" args={['#070b10']} />
      <fog attach="fog" args={['#070b10', 4.8, 16]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.7} color="#edf3ff" />
        <hemisphereLight args={['#f5f2ea', '#091118', 0.9]} />
        <directionalLight
          position={[3.8, 5.2, 2.8]}
          intensity={2.4}
          color="#fffaf0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.00008}
        />
        <directionalLight position={[-4.5, 2.2, -2.6]} intensity={1.2} color="#bde4ff" />
        <directionalLight position={[0.5, 1.6, -4.8]} intensity={1.1} color="#d7e7ff" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.018, 0]} receiveShadow>
          <circleGeometry args={[4.5, 64]} />
          <meshStandardMaterial color="#111820" roughness={0.96} metalness={0.08} />
        </mesh>

        <BikeModel />
        <CameraRig geometry={geometry} controlsRef={controlsRef} />
      </Suspense>
    </Canvas>
  );
}

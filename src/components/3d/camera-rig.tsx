'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ElementRef, RefObject } from 'react';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

import { presetSettled, resolveCameraPreset, stageAspect } from '@/lib/3d/camera-views';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import { useBikeStore } from '@/store/bike-store';

type Controls = ElementRef<typeof OrbitControls>;

/** Radians per second while auto rotation is on. */
const AUTO_ROTATE_SPEED = 0.45;
/** Settling speed for preset transitions. */
const SETTLE = 0.0015;

/**
 * Camera behaviour.
 *
 * Preset views animate the camera to a framing computed from the bike, auto
 * rotation orbits it, and the pointer always takes over. Only one code path
 * writes the camera, so the three never fight each other.
 */
export function CameraRig({
  geometry,
  controlsRef,
}: {
  geometry: BikeGeometry;
  controlsRef: RefObject<Controls | null>;
}) {
  const view = useBikeStore((state) => state.camera.view);
  const autoRotate = useBikeStore((state) => state.camera.autoRotate);
  const camera = useThree((state) => state.camera);
  // The canvas keeps its own measured size, so the framing follows the real
  // shape of the stage instead of the one it was designed around.
  const size = useThree((state) => state.size);
  const aspect = stageAspect(size.width, size.height);

  const animating = useRef(true);
  const orbitAngle = useRef(0);

  // A new preset restarts the transition from wherever the camera currently is.
  useEffect(() => {
    const controls = controlsRef.current;

    if (controls != null) {
      const offset = camera.position.clone().sub(controls.target);
      orbitAngle.current = Math.atan2(offset.x, offset.z);
    }

    animating.current = true;
  }, [view, geometry, camera, controlsRef, aspect]);

  useFrame((_, delta) => {
    const controls = controlsRef.current ?? undefined;
    const preset = resolveCameraPreset(view, geometry, aspect);
    const target = new Vector3(preset.target[0], preset.target[1], preset.target[2]);
    const desired = new Vector3(preset.position[0], preset.position[1], preset.position[2]);

    if (autoRotate) {
      const offset = camera.position.clone().sub(target);
      const radius = Math.max(Math.hypot(offset.x, offset.z), 0.001);
      orbitAngle.current += delta * AUTO_ROTATE_SPEED;

      camera.position.set(
        target.x + Math.sin(orbitAngle.current) * radius,
        camera.position.y,
        target.z + Math.cos(orbitAngle.current) * radius,
      );
    } else if (animating.current) {
      const step = 1 - Math.pow(SETTLE, delta);
      camera.position.lerp(desired, step);
      controls?.target.lerp(target, step);

      // Both have to arrive. The camera can already be sitting on its preset
      // while the orbit target is still wherever the scene put it, which used
      // to leave the bike framed off centre until the next click.
      const settled = presetSettled(
        camera.position.distanceTo(desired),
        controls === undefined ? null : controls.target.distanceTo(target),
      );

      if (settled) {
        animating.current = false;
      }
    }

    controls?.update();
    camera.lookAt(controls?.target ?? target);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.85}
      zoomSpeed={0.7}
      minDistance={1.1}
      maxDistance={6}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI / 2 + 0.12}
      onStart={() => {
        animating.current = false;
      }}
    />
  );
}

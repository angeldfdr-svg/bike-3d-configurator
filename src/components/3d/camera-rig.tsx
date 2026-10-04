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
/** Temporary spin speed when a part changes (faster = more dramatic). */
const PART_SPIN_SPEED = 1.1;
/** How long (seconds) the brief spin lasts after a part change. */
const PART_SPIN_DURATION = 2.0;
/** Settling speed for preset transitions. */
const SETTLE = 0.0015;

/**
 * Camera behaviour.
 *
 * Preset views animate the camera to a framing computed from the bike, auto
 * rotation orbits it, and the pointer always takes over. Only one code path
 * writes the camera, so the three never fight each other.
 *
 * Brief spin: whenever the user picks a new component a 2-second burst of
 * auto-rotation shows off the new part from every angle. The user can
 * interrupt it at any time by dragging.
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
  const configuration = useBikeStore((state) => state.configuration);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const aspect = stageAspect(size.width, size.height);

  const animating = useRef(true);
  const orbitAngle = useRef(0);
  const spinRemaining = useRef(0);
  const reducedMotion = useRef(false);
  const userInteracting = useRef(false);
  const prevConfig = useRef(configuration);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    function updatePreference() {
      reducedMotion.current = query.matches;
      if (query.matches) spinRemaining.current = 0;
    }

    updatePreference();
    query.addEventListener('change', updatePreference);

    return () => query.removeEventListener('change', updatePreference);
  }, []);

  // A new preset restarts the transition from wherever the camera currently is.
  useEffect(() => {
    const controls = controlsRef.current;

    if (controls != null) {
      const offset = camera.position.clone().sub(controls.target);
      orbitAngle.current = Math.atan2(offset.x, offset.z);
    }

    animating.current = true;
  }, [view, geometry, camera, controlsRef, aspect]);

  // Detect component changes and trigger a brief spin.
  useEffect(() => {
    const prev = prevConfig.current;
    const cur = configuration;

    const changed =
      prev.frameId !== cur.frameId ||
      prev.wheelsetId !== cur.wheelsetId ||
      prev.groupsetId !== cur.groupsetId ||
      prev.cranksetId !== cur.cranksetId ||
      prev.handlebarId !== cur.handlebarId ||
      prev.saddleId !== cur.saddleId ||
      prev.tireId !== cur.tireId;

    if (changed && !reducedMotion.current) {
      spinRemaining.current = PART_SPIN_DURATION;
    }

    prevConfig.current = cur;
  }, [configuration]);

  useFrame((_, delta) => {
    const controls = controlsRef.current ?? undefined;
    const preset = resolveCameraPreset(view, geometry, aspect);
    const target = new Vector3(preset.target[0], preset.target[1], preset.target[2]);
    const desired = new Vector3(preset.position[0], preset.position[1], preset.position[2]);

    if (userInteracting.current) {
      controls?.update();
      camera.lookAt(controls?.target ?? target);
      return;
    }

    if (reducedMotion.current) {
      camera.position.copy(desired);
      controls?.target.copy(target);
      animating.current = false;
    } else {
      // Brief part-change spin takes priority over continuous auto-rotate.
      const briefSpin = spinRemaining.current > 0;

      if (briefSpin) {
        spinRemaining.current = Math.max(0, spinRemaining.current - delta);
        const offset = camera.position.clone().sub(target);
        const radius = Math.max(Math.hypot(offset.x, offset.z), 0.001);
        orbitAngle.current += delta * PART_SPIN_SPEED;

        camera.position.set(
          target.x + Math.sin(orbitAngle.current) * radius,
          camera.position.y,
          target.z + Math.cos(orbitAngle.current) * radius,
        );
      } else if (autoRotate) {
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

        const settled = presetSettled(
          camera.position.distanceTo(desired),
          controls === undefined ? null : controls.target.distanceTo(target),
        );

        if (settled) {
          animating.current = false;
        }
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
        userInteracting.current = true;
        animating.current = false;
        spinRemaining.current = 0;
      }}
      onEnd={() => {
        userInteracting.current = false;
      }}
    />
  );
}

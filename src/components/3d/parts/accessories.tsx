'use client';

import { Tube } from '@/components/3d/tube';
import { unitBox, unitCylinder, unitSphere } from '@/components/3d/geometry-cache';
import { standardMaterial } from '@/components/3d/material-cache';
import { tubeMountPlacements } from '@/lib/3d/instances';
import type { BikeGeometry } from '@/lib/3d/bike-geometry';
import type { Accessory } from '@/types/components';
import { isAccessorySlot, mountedQuantity } from '@/lib/3d/part-variants';

type AccessoryProps = {
  geometry: BikeGeometry;
  accessories: readonly Accessory[];
};

/**
 * Extras mounted on the bike.
 *
 * Each accessory slot has a place to live: a computer on the stem, lights front
 * and rear, bottle cages on the tubes and a bag under the saddle. Only what the
 * configuration actually selects is drawn, and never more than the bike can
 * physically carry.
 */
export function Accessories({ geometry, accessories }: AccessoryProps) {
  return (
    <group name="accessories">
      {accessories.map((accessory) => {
        if (!isAccessorySlot(accessory.slot)) return null;

        const count = mountedQuantity(accessory);

        if (count <= 0) return null;

        switch (accessory.slot) {
          case 'computador':
            return <CycleComputer key={accessory.id} geometry={geometry} />;
          case 'iluminacao':
            return <Lights key={accessory.id} geometry={geometry} count={count} />;
          case 'bidao':
            return <BottleCages key={accessory.id} geometry={geometry} count={count} />;
          case 'bolsa':
            return <SaddleBag key={accessory.id} geometry={geometry} />;
          default:
            return null;
        }
      })}
    </group>
  );
}

function CycleComputer({ geometry }: { geometry: BikeGeometry }) {
  const { handlebarCenter } = geometry;

  return (
    <group name="computer">
      <mesh
        position={[handlebarCenter[0] + 0.02, handlebarCenter[1] + 0.045, 0]}
        scale={[0.05, 0.032, 0.012]}
      >
        <primitive object={unitBox()} attach="geometry" />
        <primitive object={standardMaterial('darkMetal')} attach="material" />
      </mesh>
      <Tube
        from={[handlebarCenter[0] + 0.02, handlebarCenter[1] + 0.03, 0]}
        to={[handlebarCenter[0] + 0.02, handlebarCenter[1] + 0.045, 0]}
        radius={0.004}
        material="darkMetal"
        radialSegments={6}
      />
    </group>
  );
}

function Lights({ geometry, count }: { geometry: BikeGeometry; count: number }) {
  const { headTubeTop, saddleCenter } = geometry;

  return (
    <group name="lights">
      {count >= 1 ? (
        <mesh position={[headTubeTop[0] + 0.01, headTubeTop[1] + 0.02, 0]} scale={[0.045, 0.03, 0.03]}>
          <primitive object={unitBox()} attach="geometry" />
          <primitive object={standardMaterial('darkMetal')} attach="material" />
        </mesh>
      ) : null}
      {count >= 2 ? (
        <mesh position={[saddleCenter[0] - 0.02, saddleCenter[1] - 0.03, 0]} scale={[0.03, 0.026, 0.026]}>
          <primitive object={unitBox()} attach="geometry" />
          <primitive object={standardMaterial('darkMetal')} attach="material" />
        </mesh>
      ) : null}
    </group>
  );
}

function BottleCages({ geometry, count }: { geometry: BikeGeometry; count: number }) {
  const { bottomBracket, seatCluster } = geometry;
  const placements = tubeMountPlacements(
    count,
    [bottomBracket[0] - 0.05, bottomBracket[1] + 0.05, 0],
    [seatCluster[0] - 0.02, seatCluster[1] - 0.02, 0],
    [0.03, 0, 0],
    0.09,
  );

  return (
    <group name="bottle-cages">
      {placements.map((placement, index) => (
        <group key={index} position={placement.position}>
          {/* Cage */}
          <mesh scale={[0.014, 0.08, 0.055]}>
            <primitive object={unitCylinder(10)} attach="geometry" />
            <primitive object={standardMaterial('rawAlloy')} attach="material" />
          </mesh>
          {/* Bottle */}
          <mesh position={[0.012, 0, 0]} scale={[0.032, 0.11, 0.032]}>
            <primitive object={unitSphere(12, 8)} attach="geometry" />
            <primitive object={standardMaterial('barTape')} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SaddleBag({ geometry }: { geometry: BikeGeometry }) {
  const { saddleCenter } = geometry;

  return (
    <group name="saddle-bag">
      <mesh position={[saddleCenter[0] - 0.01, saddleCenter[1] - 0.06, 0]} scale={[0.11, 0.05, 0.07]}>
        <primitive object={unitSphere(12, 10)} attach="geometry" />
        <primitive object={standardMaterial('barTape')} attach="material" />
      </mesh>
    </group>
  );
}

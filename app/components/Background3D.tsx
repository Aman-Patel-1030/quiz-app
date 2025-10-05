'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 2000;

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions in a large sphere
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      // Purple/blue/pink gradient colors
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.5 + Math.random() * 0.5; // R
        colors[i * 3 + 1] = 0.2; // G
        colors[i * 3 + 2] = 1; // B (Blue-Purple)
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.8; // R
        colors[i * 3 + 1] = 0.2; // G
        colors[i * 3 + 2] = 1; // B (Purple)
      } else {
        colors[i * 3] = 0.2; // R
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G
        colors[i * 3 + 2] = 1; // B (Cyan)
      }
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (!particlesRef.current) return;

    // Rotate the entire particle field
    particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;

    // Animate individual particles
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WaveGrid() {
  const meshRef = useRef<THREE.Mesh>(null);
  const gridSize = 50;
  const segments = 50;

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
    const originalPositions = meshRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length / 3; i++) {
      const x = originalPositions[i * 3];
      const z = originalPositions[i * 3 + 2];

      // Create wave effect
      const wave1 = Math.sin(x * 0.5 + time) * 0.5;
      const wave2 = Math.sin(z * 0.5 + time * 0.8) * 0.5;
      const distance = Math.sqrt(x * x + z * z);
      const wave3 = Math.sin(distance * 0.3 - time) * 0.8;

      positions[i * 3 + 1] = wave1 + wave2 + wave3;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
    meshRef.current.rotation.z = time * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[gridSize, gridSize, segments, segments]} />
      <meshStandardMaterial
        color="#4a1fb8"
        wireframe
        transparent
        opacity={0.2}
        emissive="#6b21a8"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['#0a0118']} />
        <fog attach="fog" args={['#0a0118', 10, 50]} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ec4899" />

        <ParticleField />
        <WaveGrid />
      </Canvas>
    </div>
  );
}

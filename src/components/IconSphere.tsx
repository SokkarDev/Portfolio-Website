'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

type Skill = { name: string; icon: string; value: string };

const SKILLS: Skill[] = [
  { name: 'React', icon: '⚛️', value: 'Interactive UIs that keep users engaged' },
  { name: 'Next.js', icon: '▲', value: 'Blazing fast load speeds for better SEO' },
  { name: 'TypeScript', icon: 'TS', value: 'Fewer bugs, more reliable code' },
  { name: 'JavaScript', icon: 'JS', value: 'Dynamic functionality that converts' },
  { name: 'Tailwind CSS', icon: '✦', value: 'Rapid development, consistent design' },
  { name: 'HTML', icon: '</>', value: 'Semantic structure for accessibility' },
  { name: 'CSS', icon: '🎨', value: 'Pixel-perfect, responsive layouts' },
  { name: 'Python', icon: '🐍', value: 'Automation & backend flexibility' },
  { name: 'Shopify', icon: '🛒', value: 'E-commerce stores that drive sales' },
  { name: 'WordPress', icon: 'W', value: 'Easy content management for clients' },
  { name: 'Figma', icon: '◈', value: 'Design-to-code precision' },
  { name: 'SEO', icon: '📈', value: 'Higher rankings, more organic traffic' },
];

/** Fibonacci sphere: distribute N points evenly on a sphere */
function getSpherePoints(n: number, radius = 1.4): [number, number, number][] {
  const points: [number, number, number][] = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;
    const x = radius * Math.sin(inclination) * Math.cos(azimuth);
    const y = radius * Math.sin(inclination) * Math.sin(azimuth);
    const z = radius * Math.cos(inclination);
    points.push([x, y, z]);
  }

  return points;
}

function SkillPoint({ position, skill, isHovered }: { position: [number, number, number]; skill: Skill; isHovered: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hover, setHover] = useState(false);
  const showTooltip = hover || isHovered;

  return (
    <group position={position}>
      <mesh ref={meshRef} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color="transparent" visible={false} />
      </mesh>
      <Html
        center
        distanceFactor={2}
        style={{
          pointerEvents: 'auto',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all duration-200 ${
            showTooltip
              ? 'bg-gray-900/95 border-indigo-500/40 shadow-lg shadow-purple-500/20 scale-110'
              : 'bg-white/5 border-white/10'
          }`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <span className="text-base font-bold text-white">{skill.icon}</span>
          <span className={`text-xs font-medium ${showTooltip ? 'text-gray-100' : 'text-gray-300'}`}>{skill.name}</span>
          {showTooltip && (
            <span className="text-[10px] text-indigo-200/90 max-w-[140px] text-center leading-tight">{skill.value}</span>
          )}
        </div>
      </Html>
    </group>
  );
}

function SphereGroup({ skills, autoRotate }: { skills: Skill[]; autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const points = useMemo(() => getSpherePoints(skills.length), [skills.length]);

  useFrame((_, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillPoint key={skill.name} position={points[i]} skill={skill} isHovered={false} />
      ))}
    </group>
  );
}

function IconSphereScene({ skills, autoRotate }: { skills: Skill[]; autoRotate: boolean }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <SphereGroup skills={skills} autoRotate={autoRotate} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
}

export function IconSphere() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex w-full max-w-[28rem] md:max-w-[32rem] aspect-square mx-auto items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 pb-4 pt-4">
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 50 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <IconSphereScene skills={SKILLS} autoRotate={!shouldReduceMotion} />
      </Canvas>
    </div>
  );
}

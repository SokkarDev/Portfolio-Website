import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const mousePosition = { x: 0, y: 0 };

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const particleCount = 800;

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const s = new Float32Array(particleCount);
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;

      pos[i * 3] = Math.cos(theta) * radius * 1.2;
      pos[i * 3 + 1] = y * 1.2;
      pos[i * 3 + 2] = Math.sin(theta) * radius * 1.2;
      s[i] = 0.015 + Math.random() * 0.01;
    }
    return { positions: pos, sizes: s };
  }, []);

  useMemo(() => {
    if (geometryRef.current) {
      geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometryRef.current.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    }
  }, [positions, sizes]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    particlesRef.current.rotation.y += (mousePosition.x * 0.3 - particlesRef.current.rotation.y) * 0.02;
    particlesRef.current.rotation.x += (mousePosition.y * 0.2 - particlesRef.current.rotation.x) * 0.02;
    particlesRef.current.rotation.y += 0.002;
    
    const scale = 1 + Math.sin(time * 0.5) * 0.03;
    particlesRef.current.scale.setScalar(scale);
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.025}
        color="#a855f7"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const scale = 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

function OrbitRings() {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <>
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.4, 0.003, 16, 100]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[1.5, 0.002, 16, 100]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.2} />
      </mesh>
    </>
  );
}

export default function ParticleSphere() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <InnerGlow />
      <Particles />
      <OrbitRings />
    </>
  );
}

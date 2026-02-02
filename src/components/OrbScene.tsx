import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Shared mouse position and hover state - updated from InteractiveOrb component
export const mousePosition = { x: 0, y: 0 };
export const orbHoverState = { isHovered: false };

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);
  
  // Smooth target position
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentDistort = useRef(0.35);

  useFrame((state) => {
    if (meshRef.current) {
      // Enhanced mouse following
      targetRotation.current.x = mousePosition.y * 0.5;
      targetRotation.current.y = mousePosition.x * 0.5;
      
      // Lerp to target (smooth interpolation)
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x + state.clock.elapsedTime * 0.08) * 0.08;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y + state.clock.elapsedTime * 0.1) * 0.08;
      
      // More pronounced position shift based on mouse
      meshRef.current.position.x += (mousePosition.x * 0.25 - meshRef.current.position.x) * 0.05;
      meshRef.current.position.y += (mousePosition.y * 0.2 - meshRef.current.position.y) * 0.05;
      
      // Scale pulse on hover
      const targetScale = orbHoverState.isHovered ? 1.15 : 1;
      const currentScale = meshRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.08;
      meshRef.current.scale.setScalar(newScale);
    }
    if (materialRef.current) {
      // More dramatic distortion changes on hover and mouse movement
      const mouseSpeed = Math.abs(mousePosition.x) + Math.abs(mousePosition.y);
      const baseDistort = orbHoverState.isHovered ? 0.6 : 0.35;
      const mouseDistort = Math.min(mouseSpeed * 0.15, 0.15);
      const targetDistort = baseDistort + mouseDistort + Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
      
      currentDistort.current += (targetDistort - currentDistort.current) * 0.1;
      materialRef.current.distort = currentDistort.current;
      
      // Color shift on hover
      if (orbHoverState.isHovered) {
        materialRef.current.color.lerp(new THREE.Color('#a855f7'), 0.05);
      } else {
        materialRef.current.color.lerp(new THREE.Color('#6366f1'), 0.05);
      }
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.15} floatIntensity={0.3}>
      <Sphere ref={meshRef} args={[0.9, 128, 128]}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#6366f1"
          attach="material"
          distort={0.35}
          speed={1.5}
          roughness={0.15}
          metalness={0.85}
          envMapIntensity={1.2}
        />
      </Sphere>
    </Float>
  );
}

function InnerGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = -state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.y = -state.clock.elapsedTime * 0.07;
      
      // Pulse more on hover
      const baseScale = orbHoverState.isHovered ? 0.85 : 0.75;
      const scale = baseScale + Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.7, 64, 64]}>
      <meshStandardMaterial
        color="#a855f7"
        transparent
        opacity={0.35}
        roughness={0.4}
        metalness={0.6}
      />
    </Sphere>
  );
}

// Exploding particles that respond to hover
function ExplodingParticles() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Mesh[]>([]);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const baseRadius = 0.95;
      
      temp.push({
        basePosition: [
          Math.sin(phi) * Math.cos(theta) * baseRadius,
          Math.sin(phi) * Math.sin(theta) * baseRadius,
          Math.cos(phi) * baseRadius,
        ] as [number, number, number],
        explodedPosition: [
          Math.sin(phi) * Math.cos(theta) * (baseRadius + 0.8 + Math.random() * 0.5),
          Math.sin(phi) * Math.sin(theta) * (baseRadius + 0.8 + Math.random() * 0.5),
          Math.cos(phi) * (baseRadius + 0.8 + Math.random() * 0.5),
        ] as [number, number, number],
        scale: 0.015 + Math.random() * 0.02,
        speed: 0.5 + Math.random() * 0.5,
      });
    }
    return temp;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05 + mousePosition.x * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.05 + mousePosition.y * 0.2;
    }
    
    // Animate each particle
    particlesRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const particle = particles[i];
      
      // Lerp between base and exploded position based on hover
      const targetX = orbHoverState.isHovered ? particle.explodedPosition[0] : particle.basePosition[0];
      const targetY = orbHoverState.isHovered ? particle.explodedPosition[1] : particle.basePosition[1];
      const targetZ = orbHoverState.isHovered ? particle.explodedPosition[2] : particle.basePosition[2];
      
      mesh.position.x += (targetX - mesh.position.x) * 0.08 * particle.speed;
      mesh.position.y += (targetY - mesh.position.y) * 0.08 * particle.speed;
      mesh.position.z += (targetZ - mesh.position.z) * 0.08 * particle.speed;
      
      // Pulse scale
      const baseScale = particle.scale * (orbHoverState.isHovered ? 1.5 : 1);
      const scale = baseScale + Math.sin(state.clock.elapsedTime * 2 + i) * 0.005;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group ref={groupRef}>
      {particles.map((particle, i) => (
        <mesh 
          key={i} 
          position={particle.basePosition}
          ref={(el) => { if (el) particlesRef.current[i] = el; }}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={orbHoverState.isHovered ? 3 : 2}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

// Orbiting ring with mouse influence
function OrbitRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: [number, number, number] }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * speed;
      
      // Expand on hover
      const targetScale = orbHoverState.isHovered ? 1.15 : 1;
      const currentScale = ringRef.current.scale.x;
      const newScale = currentScale + (targetScale - currentScale) * 0.08;
      ringRef.current.scale.setScalar(newScale);
    }
  });

  return (
    <group rotation={tilt}>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.005, 16, 100]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={orbHoverState.isHovered ? 0.5 : 0.3}
          emissive={color}
          emissiveIntensity={orbHoverState.isHovered ? 0.6 : 0.3}
        />
      </mesh>
    </group>
  );
}

// Floating small orbs around main sphere
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null);
  
  const orbs = useMemo(() => {
    return [
      { angle: 0, radius: 1.6, speed: 0.3, size: 0.06, yOffset: 0.2 },
      { angle: Math.PI * 0.66, radius: 1.5, speed: -0.25, size: 0.05, yOffset: -0.15 },
      { angle: Math.PI * 1.33, radius: 1.7, speed: 0.2, size: 0.04, yOffset: 0.1 },
    ];
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = mousePosition.x * 0.2;
      groupRef.current.rotation.x = mousePosition.y * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <FloatingOrb key={i} {...orb} index={i} />
      ))}
    </group>
  );
}

function FloatingOrb({ angle, radius, speed, size, yOffset, index }: { angle: number; radius: number; speed: number; size: number; yOffset: number; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const currentAngle = angle + state.clock.elapsedTime * speed;
      const expandedRadius = orbHoverState.isHovered ? radius * 1.3 : radius;
      
      meshRef.current.position.x = Math.cos(currentAngle) * expandedRadius;
      meshRef.current.position.z = Math.sin(currentAngle) * expandedRadius;
      meshRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
      
      // Pulse
      const scale = size * (1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2);
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#6366f1"
        emissiveIntensity={1.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
}

export default function OrbScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.6} color="#a855f7" />
      <pointLight position={[0, 0, 3]} intensity={1.2} color="#6366f1" />
      <pointLight position={[0, 2, -2]} intensity={1} color="#a855f7" />
      
      <Environment preset="city" />
      
      <InnerGlow />
      <AnimatedSphere />
      <ExplodingParticles />
      <FloatingOrbs />
      
      <OrbitRing radius={1.4} speed={0.12} color="#818cf8" tilt={[0, 0, 0]} />
      <OrbitRing radius={1.6} speed={-0.1} color="#a855f7" tilt={[0.5, 0, 0.3]} />
      <OrbitRing radius={1.8} speed={0.07} color="#6366f1" tilt={[-0.3, 0.5, 0]} />
    </>
  );
}

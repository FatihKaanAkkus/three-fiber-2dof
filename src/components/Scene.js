import { Backdrop, Environment, OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Wrapper as TwoDOFWrapper } from '../three/2DOF';
import { Wrapper as VectorsWrapper } from '../three/Vectors';

THREE.Object3D.DefaultUp.set(0, 0, 1);

export default function Scene() {
  return (
    <div className="Scene">
      <Canvas dpr={[1, 2]} shadows camera={{ position: [2, 3, 3] }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[-10, 0, -5]} intensity={1} color="red" />
        <directionalLight position={[-1, -2, -5]} intensity={0.2} color="#0c8cbf" />
        <spotLight position={[1, 0, 5]} intensity={2.5} penumbra={1} angle={0.55} castShadow color="#0c8cbf" />

        <group position={[0, 0, 0]}>
          <TwoDOFWrapper />
        </group>
        <group position={[11.5, 0, 0]}>
          <VectorsWrapper />
        </group>

        <Backdrop castShadow floor={1} position={[0, -3, -3]} scale={[60, 30, 20]}>
          <meshStandardMaterial color="#373d3f" envMapIntensity={0.1} />
        </Backdrop>
        <gridHelper position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]} />
        <Environment preset="city" />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

import { forwardRef, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
const { PI } = Math;

THREE.Object3D.DefaultUp.set(0, 0, 1);

export const Wrapper = forwardRef(({ children, ...props }, ref) => {
  const [arr] = useState([
    new THREE.Vector3(0, -2, 0).normalize(),
    new THREE.Vector3(1, -1, 0).normalize(),
    new THREE.Vector3(1, 2, 0).normalize(),
    new THREE.Vector3(0, 2, 0).normalize(),
    new THREE.Vector3(-2, 2, 0).normalize(),
    new THREE.Vector3(-3, 1, 0).normalize(),
    new THREE.Vector3(-2, 2, 0).normalize(),
    new THREE.Vector3(0, 2, 0).normalize(),
    new THREE.Vector3(-2, 0, 0).normalize(),
    new THREE.Vector3(-2, -3, 0).normalize(),
  ]);

  /** @type {React.MutableRefObject<THREE.ArrowHelper>} */
  const tangentRef = useRef();
  /** @type {React.MutableRefObject<THREE.ArrowHelper>} */
  const normalRef = useRef();
  /** @type {React.MutableRefObject<THREE.ArrowHelper>} */
  const toolRef = useRef();

  useFrame((state) => {
    // const t = state.clock.getElapsedTime();
    // const dt = state.clock.getDelta();
    const tangent = tangentRef.current;
    const normal = normalRef.current;
    const tool = toolRef.current;
    const index = 4; // parseInt(t / 1) % arr.length;

    const vT = new THREE.Vector4().copy(arr[index]);
    const vN = new THREE.Vector3().copy(vT);
    vN.applyAxisAngle(new THREE.Vector3(0, 0, 1), PI / 2);

    const vPT = new THREE.Vector3().copy(vN);
    vPT.applyAxisAngle(vT, -PI / 2 + 0.33);
    // console.log(vPT);

    tangent.setDirection(vT);
    normal.setDirection(vN);
    tool.setDirection(vPT);
  }, []);

  return (
    <>
      <arrowHelper ref={tangentRef} args={[undefined, undefined, undefined, 0xff0000]} />
      <arrowHelper ref={normalRef} args={[undefined, undefined, undefined, 0x00ff00]} />
      <arrowHelper ref={toolRef} args={[undefined, undefined, undefined, 0xffffff]} />
    </>
  );
});

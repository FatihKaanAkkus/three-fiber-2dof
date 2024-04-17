import { forwardRef, useLayoutEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  ArrowHelper,
  AxesHelper,
  BoxBufferGeometry,
  BufferGeometry,
  CatmullRomCurve3,
  Line,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshNormalMaterial,
  Object3D,
  Quaternion,
  SphereBufferGeometry,
  Vector3,
  Vector4,
} from 'three';
import { A_Tool, A_2, A_1, A_Base, L1, L2, T_CNC } from './Transformation';
import { cubicTrajectory } from './Trajectory';
const { cos, sin, asin, PI } = Math;

Object3D.DefaultUp.set(0, 0, 1);

let q1 = 0;
let q2 = 0;
let dx = 0;
let dy = 0;
let dz = 0;

let p1 = new Vector3();
let p10 = new Vector3();

let traj = cubicTrajectory(0, 0, 1, 0, 0, 20);
let pointsArr = [
  // new Vector3(0, 2, 0).normalize(),
  // new Vector3(0, -2, 0).normalize(),
  new Vector3(0, 2, 0).normalize(),
  new Vector3(1, 1, 0).normalize(),
  new Vector3(2, 0, 0).normalize(),
  new Vector3(0, -2, 0).normalize(),
  new Vector3(-1, -1, 0).normalize(),
  new Vector3(1, -1, 0).normalize(),
  new Vector3(-2, 0, 0).normalize(),
  new Vector3(-1, 1, 0).normalize(),
  new Vector3(0, 2, 0).normalize(),
];
let curve = new CatmullRomCurve3(pointsArr);
let points = curve.getPoints(traj.qd.length);
let ii = 1;
let dir = 0;
let moving = true;

const Cnc = forwardRef(({ children, ...props }, ref) => {
  useFrame(() => {
    // const mat = T_CNC(dx, dy, dz).multiply(A_Base(0, 0));
    // ref.current.matrix.copy(mat);
    // ref.current.matrixAutoUpdate = false;
  });

  return (
    <>
      <axesHelper args={[0.15]} {...props} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
        <group position={[0, 0, 0.3 / 2]}>
          <mesh>
            <boxGeometry args={[0.025, 0.3, 0.3]} />
            <meshBasicMaterial transparent opacity={0.5} />
          </mesh>
        </group>
        {children}
      </axesHelper>
    </>
  );
});

const Base = forwardRef(({ children, ...props }, ref) => {
  useFrame(() => {
    // const mat = T_CNC(dx, dy, dz).multiply(A_Base(0, 0));
    // ref.current.matrix.copy(mat);
    // ref.current.matrixAutoUpdate = false;
  });

  return (
    <>
      <axesHelper args={[0.15]} {...props} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
        <group position={[0, 0, -0.05]}>
          <mesh>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
            <meshNormalMaterial transparent opacity={0.5} />
          </mesh>
        </group>
        {children}
      </axesHelper>
    </>
  );
});

const Link1 = forwardRef(({ children, ...props }, ref) => {
  useFrame(() => {
    // const mat = T_CNC(dx, dy, dz).multiply(A_1(q1, q2));
    // ref.current.matrix.copy(mat);
    // ref.current.matrixAutoUpdate = false;
  });

  return (
    <>
      <axesHelper args={[0.15]} {...props} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
        <group position={[0, -L1 / 2, 0]}>
          <mesh>
            <boxGeometry args={[0.1, L1, 0.05]} />
            <meshNormalMaterial transparent opacity={0.5} />
          </mesh>
        </group>
        {children}
      </axesHelper>
    </>
  );
});

const Link2 = forwardRef(({ children, ...props }, ref) => {
  useFrame(() => {
    // const mat = T_CNC(dx, dy, dz).multiply(A_2(q1, q2));
    // ref.current.matrix.copy(mat);
    // ref.current.matrixAutoUpdate = false;
  });

  return (
    <>
      <axesHelper args={[0.15]} {...props} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
        <group position={[L2 / 2, 0, 0]}>
          <mesh>
            <boxGeometry args={[L2, 0.1, 0.05]} />
            <meshNormalMaterial transparent opacity={0.5} />
          </mesh>
        </group>
        {children}
      </axesHelper>
    </>
  );
});

const Tool = forwardRef(({ children, ...props }, ref) => {
  useFrame(() => {
    // const mat = T_CNC(dx, dy, dz).multiply(A_Tool(q1, q2));
    // ref.current.matrix.copy(mat);
    // ref.current.matrixAutoUpdate = false;
  });

  return (
    <>
      <axesHelper args={[0.15]} {...props} ref={ref}>
        <mesh>
          <sphereGeometry args={[0.05, 32, 16]} />
          <meshBasicMaterial color={props.color} />
        </mesh>
        {children}
      </axesHelper>
    </>
  );
});

export const Wrapper = forwardRef(({ children, ...props }, ref) => {
  /** @type {{ current: AxesHelper }} */
  const cncRef = useRef(null);
  /** @type {{ current: AxesHelper }} */
  const baseRef = useRef(null);
  /** @type {{ current: AxesHelper }} */
  const link1Ref = useRef(null);
  /** @type {{ current: AxesHelper }} */
  const link2Ref = useRef(null);
  /** @type {{ current: AxesHelper }} */
  const toolRef = useRef(null);

  /** @type {React.MutableRefObject<ArrowHelper>} */
  const tangentRef = useRef();
  /** @type {React.MutableRefObject<ArrowHelper>} */
  const normalRef = useRef();
  /** @type {React.MutableRefObject<ArrowHelper>} */
  const targetRef = useRef();

  /** @type {{ current: Mesh }} */
  const ballRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    /**
     * 2-DOF cutter head.
     */
    // q1 = sin(t);
    // q2 = sin(t);
    // dx = sin(t);
    // dy = sin(t);
    // dz = 1 + sin(t);

    /**
     * Trajectory.
     */
    if (dir === 0 && ii + 1 >= traj.qd.length) {
      dir = 1;
    } else if (dir === 1 && ii - 1 <= 0) {
      dir = 0;
    }
    if (dir) {
      p10.copy(points[(ii - 1) % traj.qd.length]);
      p1.copy(points[(moving ? ii-- : ii) % traj.qd.length]);
    } else {
      p10.copy(points[(ii + 1) % traj.qd.length]);
      p1.copy(points[(moving ? ii++ : ii) % traj.qd.length]);
    }

    /**
     * Desired vector for bevel angle.
     * @note Assumed working on the xy-plane.
     */
    const vTangent = new Vector3().copy(p10).sub(p1).setZ(0).normalize();

    const vNormal = new Vector3().copy(vTangent);
    vNormal.applyAxisAngle(new Vector3(0, 0, 1), PI / 2);

    const vTarget = new Vector3().copy(vNormal);
    vTarget.applyAxisAngle(vTangent, -PI / 2 + (dir === 1 ? -1 : 1) * sin(t));
    vTarget.normalize();

    try {
      tangentRef.current.setDirection(vTangent);
      tangentRef.current.position.copy(p1);
      normalRef.current.setDirection(vNormal);
      normalRef.current.position.copy(p1);
      targetRef.current.setDirection(vTarget);
      targetRef.current.position.copy(p1);

      /**
       * Target matrix.
       * @note Delete me later.
       */
      const mTg = new Matrix4();
      const quat = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), vTarget);
      mTg.makeRotationFromQuaternion(quat);
      mTg.setPosition(p1);
      const mTgX = new Vector3();
      const mTgY = new Vector3();
      const mTgZ = new Vector3();
      const mTgP = new Vector3();
      mTg.extractBasis(mTgX, mTgY, mTgZ);
      mTgP.setFromMatrixPosition(mTg);

      ballRef.current.position.copy(new Vector3().copy(vTarget).normalize().sub(mTgZ).multiplyScalar(1e6));
    } catch (error) {}

    /**
     * Solve q values.
     */
    let q2 = asin(-vTarget.x);
    let q1 = asin(-vTarget.y / cos(q2));
    let dx = -(-L1 - L2 * sin(q2));
    let dy = -(-L2 * cos(q2) * sin(q1));
    let dz = -(-L2 * cos(q1) * cos(q2));

    /**
     * Offset callculation for cnc base.
     */
    const pOffset = new Vector3();
    pOffset.set(p1.x + dx, p1.y + dy, p1.z + dz);

    try {
      /**
       * Forward calculations
       */
      const vTarget_ = new Vector3();
      vTarget_.x = sin(q2);
      vTarget_.y = -cos(q2) * sin(q1);
      vTarget_.z = 1 - vTarget_.x * vTarget_.x - vTarget_.y * vTarget_.y; // -cos(q1)*cos(q2)
      vTarget_.normalize();

      const zDown = new Vector3(0, 0, -1);
      const bevelAngle = vTarget_.angleTo(zDown);
      // console.log(bevelAngle);

      // tangentRef.current.setDirection(new Vector3(0, 0, -1).cross(vTarget_));

      const vTip = new Vector3();
      vTip.x = /* cncX */ +(-L1 + L2 * sin(q2));
      vTip.y = /* cncY */ +(-L2 * cos(q2) * sin(q1));
      vTip.z = /* cncZ */ +(-L2 * cos(q1) * cos(q2));
      // console.log(vTip);

      if (Math.abs(bevelAngle) > 1e-12) {
        const vTangent_ = new Vector3().copy(vTarget_);
        vTangent_.setZ(0);
        vTangent_.applyAxisAngle(new Vector3(0, 0, 1), -PI / 2);
        vTangent_.normalize();
      }

      // if (parseInt(t * 1e3, 10) % 10 === 0) {
      //   console.clear();
      // }
    } catch (error) {
      console.error(error);
    }

    if (cncRef.current) {
      const mat = T_CNC(pOffset.x, pOffset.y, pOffset.z);
      cncRef.current.matrix.copy(mat);
      cncRef.current.matrixAutoUpdate = false;
    }
    if (baseRef.current) {
      const mat = T_CNC(pOffset.x, pOffset.y, pOffset.z).multiply(A_Base(0, 0));
      baseRef.current.matrix.copy(mat);
      baseRef.current.matrixAutoUpdate = false;
    }
    if (link1Ref.current) {
      const mat = T_CNC(pOffset.x, pOffset.y, pOffset.z).multiply(A_1(q1, q2));
      link1Ref.current.matrix.copy(mat);
      link1Ref.current.matrixAutoUpdate = false;
    }
    if (link2Ref.current) {
      const mat = T_CNC(pOffset.x, pOffset.y, pOffset.z).multiply(A_2(q1, q2));
      link2Ref.current.matrix.copy(mat);
      link2Ref.current.matrixAutoUpdate = false;
    }
    if (toolRef.current) {
      const mat = T_CNC(pOffset.x, pOffset.y, pOffset.z).multiply(A_Tool(q1, q2));
      toolRef.current.matrix.copy(mat);
      toolRef.current.matrixAutoUpdate = false;
    }
  }, []);

  return (
    <>
      <axesHelper scale={100} />

      <Cnc ref={cncRef} color="grey"></Cnc>
      <Base ref={baseRef} color="grey"></Base>
      <Link1 ref={link1Ref} color="lime"></Link1>
      <Link2 ref={link2Ref} color="red"></Link2>
      <Tool ref={toolRef} color="magenta"></Tool>

      <arrowHelper ref={tangentRef} args={[undefined, undefined, undefined, 0xff0000]} scale={0.25} />
      <arrowHelper ref={normalRef} args={[undefined, undefined, undefined, 0x00ff00]} scale={0.25} />
      <arrowHelper ref={targetRef} args={[undefined, undefined, undefined, 0xffffff]} scale={0.1} />

      <line args={[new BufferGeometry().setFromPoints(points)]}>
        <lineBasicMaterial />
      </line>
      <line args={[new BufferGeometry().setFromPoints(pointsArr)]}>
        <lineBasicMaterial color="black" />
      </line>

      <mesh ref={ballRef}>
        <sphereGeometry args={[0.025, 32, 16]} />
        <meshBasicMaterial color={0xf0f00f} />
      </mesh>
    </>
  );
});

import { Matrix4, Object3D } from 'three';
const { cos, sin } = Math;

Object3D.DefaultUp.set(0, 0, 1);

export const L1 = 600.5 * 1e-3;
export const L2 = 290 * 1e-3;

/**
 * @param {{ theta: Number, offset: Number, length: Number, alpha: Number }} dh
 * @returns {Matrix4}
 */
const tf = ({ theta, offset, length, alpha }) => {
  return new Matrix4().set(
    Math.cos(theta),
    -Math.sin(theta) * Math.cos(alpha),
    Math.sin(theta) * Math.sin(alpha),
    length * Math.cos(theta),
    Math.sin(theta),
    Math.cos(theta) * Math.cos(alpha),
    -Math.cos(theta) * Math.sin(alpha),
    length * Math.sin(theta),
    0,
    Math.sin(alpha),
    Math.cos(alpha),
    offset,
    0,
    0,
    0,
    1
  );
};

//

//

export const T_CNC = (d1, d2, d3) => {
  return new Matrix4().set(1, 0, 0, d1, 0, 1, 0, d2, 0, 0, 1, d3, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const T_B = (q1, q2) => {
  return new Matrix4().set(0, 0, -1, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const T_1 = (q1, q2) => {
  return new Matrix4().set(sin(q1), 0, -cos(q1), 0, -cos(q1), 0, -sin(q1), 0, 0, 1, 0, L1, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const T_2 = (q1, q2) => {
  return new Matrix4().set(cos(q2), -sin(q2), 0, 0, sin(q2), cos(q2), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const T_T = (q1, q2) => {
  return new Matrix4().set(1, 0, 0, L2, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const A_Base = (q1, q2) => {
  // return T_CNC(0, 0);
  return new Matrix4().set(0, 0, -1, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1);
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const A_1 = (q1, q2) => {
  // return T_B(q1, q2).multiply(T_1(q1, q2));
  return new Matrix4().set(0, -1, 0, -L1, -sin(q1), 0, cos(q1), 0, -cos(q1), 0, -sin(q1), 0, 0, 0, 0, 1);
};
/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const A_2 = (q1, q2) => {
  // return T_B(q1, q2).multiply(T_1(q1, q2)).multiply(T_2(q1, q2));
  return new Matrix4().set(
    -sin(q2),
    -cos(q2),
    0,
    -L1,
    -cos(q2) * sin(q1),
    sin(q1) * sin(q2),
    cos(q1),
    0,
    -cos(q1) * cos(q2),
    cos(q1) * sin(q2),
    -sin(q1),
    0,
    0,
    0,
    0,
    1
  );
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const A_Tool = (q1, q2) => {
  // return T_B(q1, q2).multiply(T_1(q1, q2)).multiply(T_2(q1, q2)).multiply(T_T(q1, q2));
  return new Matrix4().set(
    -sin(q2),
    -cos(q2),
    0,
    -L1 - L2 * sin(q2),
    -cos(q2) * sin(q1),
    sin(q1) * sin(q2),
    cos(q1),
    -L2 * cos(q2) * sin(q1),
    -cos(q1) * cos(q2),
    cos(q1) * sin(q2),
    -sin(q1),
    -L2 * cos(q1) * cos(q2),
    0,
    0,
    0,
    1
  );
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const Inv_A_Tool = (q1, q2) => {
  return A_Tool(q1, q2).invert();
};

/**
 * @param {Number} q1
 * @param {Number} q2
 * @returns {Matrix4}
 */
export const Inv_T_B = (q1, q2) => {
  return T_B(q1, q2).invert();
};

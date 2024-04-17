import * as THREE from 'three';

export const PI = Math.PI;
export const PIo2 = PI / 2;
export const PIt2 = 2 * PI;
export const DEG2RAD = PIt2 / 360;
export const MOVINGLINKOFFSET = 1;

const INTERVAL = 10;

/**
 * @typedef {Object} CubicTrajectory
 * @property {Number[]} qd Position array
 * @property {Number[]} vd Velocity array
 * @property {Number[]} ad Acceleration array
 */

/**
 * @param {Number} x0 Initial position
 * @param {Number} xf Final position
 * @param {Number} total Total number of points
 */
export function linspace(x0, xf, total) {
  let arr = [];
  let step = (xf - x0) / (total - 1);
  for (let i = 0; i < total; i++) {
    arr = [...arr, x0 + step * i];
  }
  return arr;
}

/**
 * @param {Number} q0 Initial position
 * @param {Number} v0 Initial velocity
 * @param {Number} q1 Final position
 * @param {Number} v1 Final velocity
 * @param {Number} t0 Initial time
 * @param {Number} tf Final Time
 * @return {CubicTrajectory} Cubic tracjectory object
 */
export function cubicTrajectory(q0, v0, q1, v1, t0, tf) {
  let obj = { qd: [], vd: [], ad: [] };

  let t_ = linspace(t0, tf, (1000 / INTERVAL) * (tf - t0));

  let M = new THREE.Matrix4();
  M.set(
    1,
    t0,
    Math.pow(t0, 2),
    Math.pow(t0, 3),
    0,
    1,
    2 * t0,
    3 * Math.pow(t0, 2),
    1,
    tf,
    Math.pow(tf, 2),
    Math.pow(tf, 3),
    0,
    1,
    2 * tf,
    3 * Math.pow(tf, 2)
  );

  let invM = new THREE.Matrix4().copy(M).invert();

  let b = new THREE.Vector4(q0, v0, q1, v1);

  let a = new THREE.Vector4().copy(b).applyMatrix4(invM);

  for (let i = 0; i < t_.length; i++) {
    const t = t_[i];

    // qd = a(1).*c + a(2).*t +a(3).*t.^2 + a(4).*t.^3;
    // vd = a(2).*c +2*a(3).*t +3*a(4).*t.^2;
    // ad = 2*a(3).*c + 6*a(4).*t;
    obj = {
      qd: [...obj.qd, a.x + a.y * t + a.z * Math.pow(t, 2) + a.w * Math.pow(t, 3)],
      vd: [...obj.vd, a.y + 2 * a.z * t + 3 * a.w * Math.pow(t, 2)],
      ad: [...obj.ad, 2 * a.z + 6 * a.w * t],
    };
  }

  return obj;
}

/*!
 * Rk4thSpring - 0.1.0
 * Copyright (c) 2024. Khaled Sameer<khaled.smq@hotmail.com>
 *
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://github.com/KhaledSMQ/Rk4thSpring for details.
 */

/* eslint-disable */

/**
 * @class Rk4thSpring
 * @preserve
 * A spring animation class that simulates a damped harmonic oscillator.
 */
const _Rk4thSpring = class _Rk4thSpring {
  constructor(options = {}) {
    const {
      mass = 1,
      tension = 170,
      friction = null,
      precision = 0.01,
      initialValue = 0,
      velocity = 0,
      targetValue = 0,
      onStart = null,
      onUpdate = null,
      onEnd = null
    } = options;
    this.mass = mass;
    this.tension = tension;
    this.friction = friction !== null ? friction : this.calculateCriticalDamping();
    this.precision = precision;
    this.value = initialValue;
    this.velocity = velocity;
    this.targetValue = targetValue;
    this.lastTime = null;
    this.isAnimating = false;
    this.frameCallback = null;
    this.onStart = onStart;
    this.onUpdate = onUpdate;
    this.onEnd = onEnd;
    this.animate = this.animate.bind(this);
  }
  /**
   * Creates a new SpringAnimation instance using a preset.
   * @param presetName - The name of the preset to use.
   * @param options - Additional options to override preset defaults.
   * @returns A new SpringAnimation instance.
   */
  static createWithPreset(presetName, options = {}) {
    const preset = _Rk4thSpring.presets[presetName];
    if (!preset) {
      throw new Error(`Preset ${presetName} not found.`);
    }
    return new _Rk4thSpring({ ...preset, ...options });
  }
  /**
   * Applies a preset configuration to the current instance.
   * @param presetName - The name of the preset to apply.
   */
  applyPreset(presetName) {
    const preset = _Rk4thSpring.presets[presetName];
    if (preset) {
      this.mass = preset.mass;
      this.tension = preset.tension;
      this.friction = preset.friction !== void 0 ? preset.friction : this.calculateCriticalDamping();
    }
  }
  /**
   * Calculates the critical damping coefficient.
   * @returns The critical damping coefficient.
   */
  calculateCriticalDamping() {
    return 2 * Math.sqrt(this.mass * this.tension);
  }
  /**
   * Calculates the spring force using Hooke's law.
   * @param distance - The distance from the equilibrium position.
   * @returns The spring force.
   */
  calculateSpringForce(distance) {
    return -this.tension * distance;
  }
  /**
   * Calculates the damping force.
   * @param velocity - The current velocity.
   * @returns The damping force.
   */
  calculateDampingForce(velocity) {
    return -this.friction * velocity;
  }
  /**
   * Helper method to calculate acceleration.
   * @param position - The current position.
   * @param velocity - The current velocity.
   * @returns The acceleration.
   */
  acceleration(position, velocity) {
    const distance = position - this.targetValue;
    const springForce = this.calculateSpringForce(distance);
    const dampingForce = this.calculateDampingForce(velocity);
    return (springForce + dampingForce) / this.mass;
  }
  /**
   * Updates the spring physics using the Runge-Kutta 4th Order method.
   * @param deltaTime - The time elapsed since the last update.
   * @returns Whether the animation should stop.
   */
  update(deltaTime) {
    const k1_v = this.acceleration(this.value, this.velocity) * deltaTime;
    const k1_x = this.velocity * deltaTime;
    const k2_v = this.acceleration(this.value + 0.5 * k1_x, this.velocity + 0.5 * k1_v) * deltaTime;
    const k2_x = (this.velocity + 0.5 * k1_v) * deltaTime;
    const k3_v = this.acceleration(this.value + 0.5 * k2_x, this.velocity + 0.5 * k2_v) * deltaTime;
    const k3_x = (this.velocity + 0.5 * k2_v) * deltaTime;
    const k4_v = this.acceleration(this.value + k3_x, this.velocity + k3_v) * deltaTime;
    const k4_x = (this.velocity + k3_v) * deltaTime;
    this.velocity += 1 / 6 * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
    this.value += 1 / 6 * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
    const distance = this.value - this.targetValue;
    const kineticEnergy = 0.5 * this.mass * this.velocity ** 2;
    const potentialEnergy = 0.5 * this.tension * distance ** 2;
    const totalEnergy = kineticEnergy + potentialEnergy;
    return totalEnergy < this.precision;
  }
  /**
   * Starts the spring animation towards the target value.
   * @param targetValue - The value to animate towards.
   * @param callback - The callback function to execute on each frame.
   */
  start(targetValue, callback) {
    this.targetValue = targetValue;
    this.frameCallback = callback || null;
    if (!this.isAnimating) {
      this.isAnimating = true;
      this.lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();
      if (this.onStart) {
        this.onStart(this.value);
      }
      this.animate();
    }
  }
  /**
   * The animation loop that updates the physics and handles callbacks.
   */
  animate() {
    if (!this.isAnimating) return;
    const currentTime = typeof performance !== "undefined" ? performance.now() : Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1e3;
    this.lastTime = currentTime;
    const shouldStop = this.update(deltaTime);
    if (this.frameCallback) {
      this.frameCallback(this.value);
    }
    if (this.onUpdate) {
      this.onUpdate(this.value);
    }
    if (shouldStop) {
      this.isAnimating = false;
      this.velocity = 0;
      this.value = this.targetValue;
      if (this.frameCallback) {
        this.frameCallback(this.value);
      }
      if (this.onEnd) {
        this.onEnd(this.value);
      }
    } else {
      this.requestAnimationFrame();
    }
  }
  requestAnimationFrame() {
    requestAnimationFrame(this.animate);
  }
  /**
   * Sets the current value of the animation.
   * @param value - The new value to set.
   * @param resetVelocity - Whether to reset the velocity to zero.
   */
  setValue(value, resetVelocity = false) {
    this.value = value;
    if (resetVelocity) {
      this.velocity = 0;
    }
  }
  /**
   * Stops the animation.
   */
  stop() {
    this.isAnimating = false;
  }
};
_Rk4thSpring.presets = {
  gentle: { mass: 1, tension: 120 },
  wobbly: { mass: 1, tension: 180 },
  stiff: { mass: 1, tension: 210 },
  slow: { mass: 1, tension: 280 },
  molasses: { mass: 1, tension: 280, friction: 120 }
};
let Rk4thSpring = _Rk4thSpring;
export {
  Rk4thSpring
};
//# sourceMappingURL=index.mjs.map

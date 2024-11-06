import { Callback, Options, Preset, PresetName } from "./types";

/**
 * @class Rk4thSpring
 * @preserve
 * A spring animation class that simulates a damped harmonic oscillator.
 */
export class Rk4thSpring {
    // Physics constants
    mass: number;
    tension: number;
    friction: number;
    precision: number;

    // Animation state
    value: number;
    velocity: number;
    targetValue: number;

    // Animation frame tracking
    lastTime: number | null;
    isAnimating: boolean;
    frameCallback: Callback | null;

    // Event callbacks
    onStart: Callback | null;
    onUpdate: Callback | null;
    onEnd: Callback | null;

    constructor(options: Options = {}) {
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
            onEnd = null,
        } = options;

        // Physics constants
        this.mass = mass;
        this.tension = tension;
        this.friction = friction !== null ? friction : this.calculateCriticalDamping();
        this.precision = precision;

        // Animation state
        this.value = initialValue;
        this.velocity = velocity;
        this.targetValue = targetValue;

        // Animation frame tracking
        this.lastTime = null;
        this.isAnimating = false;
        this.frameCallback = null;

        // Event callbacks
        this.onStart = onStart;
        this.onUpdate = onUpdate;
        this.onEnd = onEnd;

        // Bind the animate method to optimize performance
        this.animate = this.animate.bind(this);
    }

    static presets: { [key in PresetName]: Preset } = {
        gentle: {mass: 1, tension: 120},
        wobbly: {mass: 1, tension: 180},
        stiff: {mass: 1, tension: 210},
        slow: {mass: 1, tension: 280},
        molasses: {mass: 1, tension: 280, friction: 120},
    };

    /**
     * Creates a new SpringAnimation instance using a preset.
     * @param presetName - The name of the preset to use.
     * @param options - Additional options to override preset defaults.
     * @returns A new SpringAnimation instance.
     */
    static createWithPreset(
        presetName: PresetName,
        options: Options = {}
    ): Rk4thSpring {
        const preset = Rk4thSpring.presets[presetName];
        if (!preset) {
            throw new Error(`Preset ${presetName} not found.`);
        }
        return new Rk4thSpring({...preset, ...options});
    }

    /**
     * Applies a preset configuration to the current instance.
     * @param presetName - The name of the preset to apply.
     */
    applyPreset(presetName: PresetName): void {
        const preset = Rk4thSpring.presets[presetName];
        if (preset) {
            this.mass = preset.mass;
            this.tension = preset.tension;
            this.friction =
                preset.friction !== undefined
                    ? preset.friction
                    : this.calculateCriticalDamping();
        }
    }

    /**
     * Calculates the critical damping coefficient.
     * @returns The critical damping coefficient.
     */
    calculateCriticalDamping(): number {
        return 2 * Math.sqrt(this.mass * this.tension);
    }

    /**
     * Calculates the spring force using Hooke's law.
     * @param distance - The distance from the equilibrium position.
     * @returns The spring force.
     */
    calculateSpringForce(distance: number): number {
        return -this.tension * distance;
    }

    /**
     * Calculates the damping force.
     * @param velocity - The current velocity.
     * @returns The damping force.
     */
    calculateDampingForce(velocity: number): number {
        return -this.friction * velocity;
    }

    /**
     * Helper method to calculate acceleration.
     * @param position - The current position.
     * @param velocity - The current velocity.
     * @returns The acceleration.
     */
    acceleration(position: number, velocity: number): number {
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
    update(deltaTime: number): boolean {
        const k1_v = this.acceleration(this.value, this.velocity) * deltaTime;
        const k1_x = this.velocity * deltaTime;

        const k2_v =
            this.acceleration(this.value + 0.5 * k1_x, this.velocity + 0.5 * k1_v) *
            deltaTime;
        const k2_x = (this.velocity + 0.5 * k1_v) * deltaTime;

        const k3_v =
            this.acceleration(this.value + 0.5 * k2_x, this.velocity + 0.5 * k2_v) *
            deltaTime;
        const k3_x = (this.velocity + 0.5 * k2_v) * deltaTime;

        const k4_v =
            this.acceleration(this.value + k3_x, this.velocity + k3_v) * deltaTime;
        const k4_x = (this.velocity + k3_v) * deltaTime;

        this.velocity += (1 / 6) * (k1_v + 2 * k2_v + 2 * k3_v + k4_v);
        this.value += (1 / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);

        const distance = this.value - this.targetValue;

        // Energy-based stopping condition
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
    start(targetValue: number, callback?: (value: number) => void): void {
        this.targetValue = targetValue;
        this.frameCallback = callback || null;

        if (!this.isAnimating) {
            this.isAnimating = true;
            this.lastTime =
                typeof performance !== "undefined" ? performance.now() : Date.now();
            if (this.onStart) {
                this.onStart(this.value);
            }
            this.animate();
        }
    }

    /**
     * The animation loop that updates the physics and handles callbacks.
     */
    animate(): void {
        if (!this.isAnimating) return;

        const currentTime =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        const deltaTime = (currentTime - (this.lastTime as number)) / 1000; // Convert to seconds
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


    private requestAnimationFrame() {
        requestAnimationFrame(this.animate);
    }

    /**
     * Sets the current value of the animation.
     * @param value - The new value to set.
     * @param resetVelocity - Whether to reset the velocity to zero.
     */
    setValue(value: number, resetVelocity: boolean = false): void {
        this.value = value;
        if (resetVelocity) {
            this.velocity = 0;
        }
    }

    /**
     * Stops the animation.
     */
    stop(): void {
        this.isAnimating = false;
    }

}

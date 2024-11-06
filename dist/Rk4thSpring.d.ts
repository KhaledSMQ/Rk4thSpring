import { Callback, Options, Preset, PresetName } from './types';
/**
 * @class Rk4thSpring
 * @preserve
 * A spring animation class that simulates a damped harmonic oscillator.
 */
export declare class Rk4thSpring {
    mass: number;
    tension: number;
    friction: number;
    precision: number;
    value: number;
    velocity: number;
    targetValue: number;
    lastTime: number | null;
    isAnimating: boolean;
    frameCallback: Callback | null;
    onStart: Callback | null;
    onUpdate: Callback | null;
    onEnd: Callback | null;
    constructor(options?: Options);
    static presets: {
        [key in PresetName]: Preset;
    };
    /**
     * Creates a new SpringAnimation instance using a preset.
     * @param presetName - The name of the preset to use.
     * @param options - Additional options to override preset defaults.
     * @returns A new SpringAnimation instance.
     */
    static createWithPreset(presetName: PresetName, options?: Options): Rk4thSpring;
    /**
     * Applies a preset configuration to the current instance.
     * @param presetName - The name of the preset to apply.
     */
    applyPreset(presetName: PresetName): void;
    /**
     * Calculates the critical damping coefficient.
     * @returns The critical damping coefficient.
     */
    calculateCriticalDamping(): number;
    /**
     * Calculates the spring force using Hooke's law.
     * @param distance - The distance from the equilibrium position.
     * @returns The spring force.
     */
    calculateSpringForce(distance: number): number;
    /**
     * Calculates the damping force.
     * @param velocity - The current velocity.
     * @returns The damping force.
     */
    calculateDampingForce(velocity: number): number;
    /**
     * Helper method to calculate acceleration.
     * @param position - The current position.
     * @param velocity - The current velocity.
     * @returns The acceleration.
     */
    acceleration(position: number, velocity: number): number;
    /**
     * Updates the spring physics using the Runge-Kutta 4th Order method.
     * @param deltaTime - The time elapsed since the last update.
     * @returns Whether the animation should stop.
     */
    update(deltaTime: number): boolean;
    /**
     * Starts the spring animation towards the target value.
     * @param targetValue - The value to animate towards.
     * @param callback - The callback function to execute on each frame.
     */
    start(targetValue: number, callback?: (value: number) => void): void;
    /**
     * The animation loop that updates the physics and handles callbacks.
     */
    animate(): void;
    private requestAnimationFrame;
    /**
     * Sets the current value of the animation.
     * @param value - The new value to set.
     * @param resetVelocity - Whether to reset the velocity to zero.
     */
    setValue(value: number, resetVelocity?: boolean): void;
    /**
     * Stops the animation.
     */
    stop(): void;
}

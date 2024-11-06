import { beforeEach, describe, expect, it } from "vitest";
import { Rk4thSpring } from "../Rk4thSpring";

export function setupRAFMock() {
    let currentCallback: FrameRequestCallback | null = null;
    let currentTime = 0;

    // Mock implementation
    global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
        currentCallback = callback;
        return 1; // Return a dummy handle
    };

    // @ts-ignore
    global.cancelAnimationFrame = (handle: number): void => {
        currentCallback = null;
    };

    // Helper to trigger the next animation frame
    const triggerNextFrame = (timestamp = currentTime + 16.67): number => {
        currentTime = timestamp;
        if (currentCallback) {
            const cb = currentCallback;
            currentCallback = null;
            cb(timestamp);
        }
        return timestamp;
    };

    return {
        triggerNextFrame,
        // Reset the mock to initial state
        reset: () => {
            currentCallback = null;
            currentTime = 0;
        },
        // Get current timestamp
        getCurrentTime: () => currentTime,
    };
}

describe("Rk4thSpring", () => {
    let rafMock: any;
    beforeEach(() => {
        rafMock = setupRAFMock();
    });
    it("should initialize with default values", () => {
        const spring = new Rk4thSpring();
        expect(spring.mass).toBe(1);
        expect(spring.tension).toBe(170);
        expect(spring.friction).toBe(spring.calculateCriticalDamping());
        expect(spring.precision).toBe(0.01);
        expect(spring.value).toBe(0);
        expect(spring.velocity).toBe(0);
        expect(spring.targetValue).toBe(0);
        expect(spring.isAnimating).toBe(false);
    });

    it("should initialize with custom values", () => {
        const options = {
            mass: 2,
            tension: 200,
            friction: 30,
            precision: 0.001,
            initialValue: 10,
            velocity: 5,
            targetValue: 20,
        };
        const spring = new Rk4thSpring(options);
        expect(spring.mass).toBe(2);
        expect(spring.tension).toBe(200);
        expect(spring.friction).toBe(30);
        expect(spring.precision).toBe(0.001);
        expect(spring.value).toBe(10);
        expect(spring.velocity).toBe(5);
        expect(spring.targetValue).toBe(20);
    });

    it("should create a new instance with a preset", () => {
        const spring = Rk4thSpring.createWithPreset("gentle");
        expect(spring.mass).toBe(1);
        expect(spring.tension).toBe(120);
    });

    it("should apply a preset to an existing instance", () => {
        const spring = new Rk4thSpring();
        spring.applyPreset("wobbly");
        expect(spring.mass).toBe(1);
        expect(spring.tension).toBe(180);
    });

    it("should calculate critical damping", () => {
        const spring = new Rk4thSpring({mass: 2, tension: 200});
        expect(spring.calculateCriticalDamping()).toBeCloseTo(40);
    });

    it("should calculate spring force", () => {
        const spring = new Rk4thSpring({tension: 200});
        expect(spring.calculateSpringForce(10)).toBe(-2000);
    });

    it("should calculate damping force", () => {
        const spring = new Rk4thSpring({friction: 30});
        expect(spring.calculateDampingForce(5)).toBe(-150);
    });

    it("should calculate acceleration", () => {
        const spring = new Rk4thSpring({
            mass: 2,
            tension: 200,
            friction: 30,
            targetValue: 10,
        });
        expect(spring.acceleration(20, 5)).toBeCloseTo(-1075);
    });

    it("should update the spring physics", () => {
        const spring = new Rk4thSpring({
            mass: 1,
            tension: 100,
            friction: 10,
            precision: 0.01,
            initialValue: 0,
            targetValue: 10,
        });
        const shouldStop = spring.update(0.016);
        expect(spring.value).not.toBe(0);
        expect(spring.velocity).not.toBe(0);
        expect(shouldStop).toBe(false);
    });

    it("should start the animation", () => {
        const spring = new Rk4thSpring({initialValue: 0, targetValue: 10});
        spring.start(10, (value) => {
            expect(value).toBeGreaterThan(0);
            spring.stop();
        });
    });

    it("should stop the animation", () => {
        const spring = new Rk4thSpring();
        spring.start(10);
        rafMock.triggerNextFrame();
        spring.stop();
        expect(spring.isAnimating).toBe(false);
    });

    it("should set the value and optionally reset velocity", () => {
        const spring = new Rk4thSpring({initialValue: 0, velocity: 5});
        spring.setValue(10, true);
        expect(spring.value).toBe(10);
        expect(spring.velocity).toBe(0);
    });


    it("should set the value and optionally reset velocity", () => {
        const spring = new Rk4thSpring({initialValue: 0, velocity: 5});
        spring.setValue(10, true);
        expect(spring.value).toBe(10);
        expect(spring.velocity).toBe(0);
    });
});

# Rk4thSpring Animation Library

# Overview

The `Rk4thSpring` class is a physics-based animation library that simulates a damped harmonic oscillator using the 4th-order Runge-Kutta method. It provides smooth and natural motion, ideal for UI animations, game development, or any application requiring realistic spring dynamics.

## Why Runge-Kutta 4th Order Method?

The Runge-Kutta 4th Order (RK4) method is a numerical technique for solving ordinary differential equations (ODEs) with high accuracy. In the context of spring animations, it offers a significant advantage over simpler methods like Euler's method by providing better stability and precision without greatly increasing computational cost. By using RK4, `Rk4thSpring` can simulate complex spring dynamics accurately, resulting in smoother and more realistic animations that closely mimic natural motion.

## Key Features

- Physics-based spring animations using damped harmonic oscillator equations
- Configurable mass, tension, and friction parameters
- Built-in presets for common animation styles
- Event callbacks for animation lifecycle (start, update, end)
- High precision numerical integration using RK4 method
- Energy-based stopping condition for accurate animation completion
- TypeScript support with full type definitions

## Installation

```typescript
npm install rk4th-spring

import { Rk4thSpring } from 'rk4th-spring';
```

## Basic Usage

```typescript
// Create a spring with default parameters
const spring = new Rk4thSpring();

// Animate to a target value
spring.start(100, (value) => {
  // Update your UI with the current value
  element.style.transform = `translateX(${value}px)`;
});
```

## Using Presets

```typescript
// Create a spring with a preset
const wobblySpring = Rk4thSpring.createWithPreset("wobbly", {
  initialValue: 0,
  onUpdate: (value) => {
    element.style.scale = value;
  },
});

// Start animation
wobblySpring.start(1);
```

## Advanced Configuration

```typescript
const customSpring = new Rk4thSpring({
  mass: 1, // Controls the "weight" of the animated object
  tension: 170, // Controls the "stiffness" of the spring
  friction: 26, // Controls the damping effect
  precision: 0.01, // Controls when the animation stops
  initialValue: 0, // Starting value
  velocity: 0, // Initial velocity
  targetValue: 0, // Initial target value
  onStart: (value) => console.log("Animation started:", value),
  onUpdate: (value) => console.log("Current value:", value),
  onEnd: (value) => console.log("Animation completed:", value),
});
```

#### Parameters

- `options` (Optional): An object containing configuration options.

  - `mass` (number): Mass of the object attached to the spring. Default is `1`.
  - `tension` (number): Stiffness of the spring. Default is `170`.
  - `friction` (number | null): Damping coefficient. If `null`, it's calculated as critical damping. Default is `null`.
  - `precision` (number): Energy threshold for stopping the animation. Default is `0.01`.
  - `initialValue` (number): Initial position of the spring. Default is `0`.
  - `velocity` (number): Initial velocity. Default is `0`.
  - `targetValue` (number): Target position to animate towards. Default is `0`.
  - `onStart` (`Callback` | null): Function called when the animation starts.
  - `onUpdate` (`Callback` | null): Function called on each animation frame.
  - `onEnd` (`Callback` | null): Function called when the animation ends.

## Available Presets

- `gentle`: Smooth, gentle animations
- `wobbly`: Bouncy, playful animations
- `stiff`: Quick, responsive animations
- `slow`: Gradual, controlled animations
- `molasses`: Heavy, slow-moving animations
- `avati`: Custom preset with high mass and friction

## Practical Example: Animated Button

```typescript
// Create an interactive button animation
const buttonSpring = Rk4thSpring.createWithPreset("wobbly", {
  initialValue: 1,
  onUpdate: (value) => {
    button.style.transform = `scale(${value})`;
  },
});

// Add interaction handlers
button.addEventListener("mousedown", () => {
  buttonSpring.start(0.95); // Scale down on press
});

button.addEventListener("mouseup", () => {
  buttonSpring.start(1); // Scale back to normal
});
```

## Advanced Example: Chained Animations

```typescript
const chainedAnimation = new Rk4thSpring({
  tension: 180,
  friction: 12,
  onUpdate: (value) => {
    // Animate multiple properties
    element.style.transform = `
            translateX(${value}px)
            scale(${1 + value * 0.001})
        `;
    element.style.opacity = Math.min(1, value * 0.01);
  },
  onEnd: () => {
    // Start next animation when this one completes
    nextAnimation.start();
  },
});
```

## Tips for Best Results

1. **Adjust Mass**: Higher mass values create heavier-feeling animations
2. **Tune Tension**: Higher tension values make the spring stiffer and faster
3. **Control Friction**: Higher friction values reduce oscillation
4. **Use Precision**: Adjust the precision value to control when animations stop
5. **Monitor Performance**: Use the built-in callbacks to track animation progress

## Technical Details

The `Rk4thSpring` class employs the 4th-order Runge-Kutta method for numerical integration, providing high accuracy in simulating spring dynamics.

### Equations of Motion

The acceleration `a` is calculated using Hooke's law and damping force:

```math
a = \frac{-\text{tension} \times (\text{position} - \text{targetValue}) - \text{friction} \times \text{velocity}}{\text{mass}}
```

### Energy-Based Stopping Condition

Animation stops when total mechanical energy falls below `precision`.

- **Kinetic Energy:**

  ```math
  KE = 0.5 \times \text{mass} \times \text{velocity}^2
  ```

- **Potential Energy:**

  ```math
  PE = 0.5 \times \text{tension} \times (\text{position} - \text{targetValue})^2
  ```

- **Total Energy:**

  ```math
  E_{\text{total}} = KE + PE
  ```

## Browser Compatibility

Relies on `requestAnimationFrame` and `performance.now()`. Compatible with modern browsers.

## Contributing

Contributions are welcome! Please open issues or submit pull requests on the [GitHub repository](https://github.com/KhaledSMQ/Rk4thSpring).

## License

This library is licensed under the [MIT License](LICENSE).

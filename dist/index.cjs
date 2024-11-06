/*!
 * Rk4thSpring - 0.1.0
 * Copyright (c) 2024. Khaled Sameer<khaled.smq@hotmail.com>
 *
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://github.com/KhaledSMQ/Rk4thSpring for details.
 */

/* eslint-disable */

"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});
/**
 * @class Rk4thSpring
 * @preserve
 * A spring animation class that simulates a damped harmonic oscillator.
 */
const t=class t{constructor(t={}){const{mass:i=1,tension:s=170,friction:e=null,precision:a=.01,initialValue:n=0,velocity:l=0,targetValue:o=0,onStart:h=null,onUpdate:r=null,onEnd:c=null}=t;this.mass=i,this.tension=s,this.friction=null!==e?e:this.calculateCriticalDamping(),this.precision=a,this.value=n,this.velocity=l,this.targetValue=o,this.lastTime=null,this.isAnimating=!1,this.frameCallback=null,this.onStart=h,this.onUpdate=r,this.onEnd=c,this.animate=this.animate.bind(this)}static createWithPreset(i,s={}){const e=t.presets[i];if(!e)throw new Error(`Preset ${i} not found.`);return new t({...e,...s})}applyPreset(i){const s=t.presets[i];s&&(this.mass=s.mass,this.tension=s.tension,this.friction=void 0!==s.friction?s.friction:this.calculateCriticalDamping())}calculateCriticalDamping(){return 2*Math.sqrt(this.mass*this.tension)}calculateSpringForce(t){return-this.tension*t}calculateDampingForce(t){return-this.friction*t}acceleration(t,i){const s=t-this.targetValue;return(this.calculateSpringForce(s)+this.calculateDampingForce(i))/this.mass}update(t){const i=this.acceleration(this.value,this.velocity)*t,s=this.velocity*t,e=this.acceleration(this.value+.5*s,this.velocity+.5*i)*t,a=(this.velocity+.5*i)*t,n=this.acceleration(this.value+.5*a,this.velocity+.5*e)*t,l=(this.velocity+.5*e)*t,o=this.acceleration(this.value+l,this.velocity+n)*t,h=(this.velocity+n)*t;this.velocity+=1/6*(i+2*e+2*n+o),this.value+=1/6*(s+2*a+2*l+h);const r=this.value-this.targetValue;return.5*this.mass*this.velocity**2+.5*this.tension*r**2<this.precision}start(t,i){this.targetValue=t,this.frameCallback=i||null,this.isAnimating||(this.isAnimating=!0,this.lastTime="undefined"!=typeof performance?performance.now():Date.now(),this.onStart&&this.onStart(this.value),this.animate())}animate(){if(!this.isAnimating)return;const t="undefined"!=typeof performance?performance.now():Date.now(),i=(t-this.lastTime)/1e3;this.lastTime=t;const s=this.update(i);this.frameCallback&&this.frameCallback(this.value),this.onUpdate&&this.onUpdate(this.value),s?(this.isAnimating=!1,this.velocity=0,this.value=this.targetValue,this.frameCallback&&this.frameCallback(this.value),this.onEnd&&this.onEnd(this.value)):this.requestAnimationFrame()}requestAnimationFrame(){requestAnimationFrame(this.animate)}setValue(t,i=!1){this.value=t,i&&(this.velocity=0)}stop(){this.isAnimating=!1}};t.presets={gentle:{mass:1,tension:120},wobbly:{mass:1,tension:180},stiff:{mass:1,tension:210},slow:{mass:1,tension:280},molasses:{mass:1,tension:280,friction:120}};let i=t;exports.Rk4thSpring=i;
//# sourceMappingURL=index.cjs.map

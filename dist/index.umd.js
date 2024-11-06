/*!
 * Rk4thSpring - 0.1.0
 * Copyright (c) 2024. Khaled Sameer<khaled.smq@hotmail.com>
 *
 * Licensed under MIT, https://opensource.org/licenses/MIT/
 * Please visit https://github.com/KhaledSMQ/Rk4thSpring for details.
 */

/* eslint-disable */

!function(t,i){"object"==typeof exports&&"undefined"!=typeof module?i(exports):"function"==typeof define&&define.amd?define(["exports"],i):i((t="undefined"!=typeof globalThis?globalThis:t||self).Spring={})}(this,(function(t){"use strict";
/**
   * @class Rk4thSpring
   * @preserve
   * A spring animation class that simulates a damped harmonic oscillator.
   */const i=class t{constructor(t={}){const{mass:i=1,tension:e=170,friction:s=null,precision:n=.01,initialValue:a=0,velocity:o=0,targetValue:l=0,onStart:h=null,onUpdate:r=null,onEnd:c=null}=t;this.mass=i,this.tension=e,this.friction=null!==s?s:this.calculateCriticalDamping(),this.precision=n,this.value=a,this.velocity=o,this.targetValue=l,this.lastTime=null,this.isAnimating=!1,this.frameCallback=null,this.onStart=h,this.onUpdate=r,this.onEnd=c,this.animate=this.animate.bind(this)}static createWithPreset(i,e={}){const s=t.presets[i];if(!s)throw new Error(`Preset ${i} not found.`);return new t({...s,...e})}applyPreset(i){const e=t.presets[i];e&&(this.mass=e.mass,this.tension=e.tension,this.friction=void 0!==e.friction?e.friction:this.calculateCriticalDamping())}calculateCriticalDamping(){return 2*Math.sqrt(this.mass*this.tension)}calculateSpringForce(t){return-this.tension*t}calculateDampingForce(t){return-this.friction*t}acceleration(t,i){const e=t-this.targetValue;return(this.calculateSpringForce(e)+this.calculateDampingForce(i))/this.mass}update(t){const i=this.acceleration(this.value,this.velocity)*t,e=this.velocity*t,s=this.acceleration(this.value+.5*e,this.velocity+.5*i)*t,n=(this.velocity+.5*i)*t,a=this.acceleration(this.value+.5*n,this.velocity+.5*s)*t,o=(this.velocity+.5*s)*t,l=this.acceleration(this.value+o,this.velocity+a)*t,h=(this.velocity+a)*t;this.velocity+=1/6*(i+2*s+2*a+l),this.value+=1/6*(e+2*n+2*o+h);const r=this.value-this.targetValue;return.5*this.mass*this.velocity**2+.5*this.tension*r**2<this.precision}start(t,i){this.targetValue=t,this.frameCallback=i||null,this.isAnimating||(this.isAnimating=!0,this.lastTime="undefined"!=typeof performance?performance.now():Date.now(),this.onStart&&this.onStart(this.value),this.animate())}animate(){if(!this.isAnimating)return;const t="undefined"!=typeof performance?performance.now():Date.now(),i=(t-this.lastTime)/1e3;this.lastTime=t;const e=this.update(i);this.frameCallback&&this.frameCallback(this.value),this.onUpdate&&this.onUpdate(this.value),e?(this.isAnimating=!1,this.velocity=0,this.value=this.targetValue,this.frameCallback&&this.frameCallback(this.value),this.onEnd&&this.onEnd(this.value)):this.requestAnimationFrame()}requestAnimationFrame(){requestAnimationFrame(this.animate)}setValue(t,i=!1){this.value=t,i&&(this.velocity=0)}stop(){this.isAnimating=!1}};i.presets={gentle:{mass:1,tension:120},wobbly:{mass:1,tension:180},stiff:{mass:1,tension:210},slow:{mass:1,tension:280},molasses:{mass:1,tension:280,friction:120}};let e=i;t.Rk4thSpring=e,Object.defineProperty(t,Symbol.toStringTag,{value:"Module"})}));
//# sourceMappingURL=index.umd.js.map

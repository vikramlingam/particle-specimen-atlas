import * as THREE from 'three';
import { particleVertexShader, particleFragmentShader } from '../shaders/particleShaders';
import { ParticleCloudData } from '../generators/proceduralGeometries';

export interface ParticleSystemSettings {
  particleCount: number;
  noiseScale: number;
  noiseSpeed: number;
  noiseAmplitude: number;
  particleSize: number;
  colorPaletteMode: number;
  theme: 'dark' | 'light';
  paused: boolean;
}

export class MorphParticleSystem {
  public mesh: THREE.Points;
  public geometry: THREE.BufferGeometry;
  public material: THREE.ShaderMaterial;

  private count: number;
  private currentShapeData: ParticleCloudData;
  private targetShapeData: ParticleCloudData;

  // Transition state
  private isTransitioning: boolean = false;
  private transitionProgress: number = 1.0;
  private transitionDuration: number = 1.8; // seconds
  private transitionStartTime: number = 0;

  // Cached typed arrays for zero-allocation mid-transition interrupts
  private posOriginArray: Float32Array;
  private posTargetArray: Float32Array;
  private colOriginArray: Float32Array;
  private colTargetArray: Float32Array;
  private delayArray: Float32Array;
  private scaleArray: Float32Array;
  private kineticOriginArray: Float32Array;
  private kineticTargetArray: Float32Array;

  constructor(initialData: ParticleCloudData, settings: ParticleSystemSettings) {
    this.count = initialData.positions.length / 3;
    this.currentShapeData = initialData;
    this.targetShapeData = initialData;

    this.geometry = new THREE.BufferGeometry();

    // Allocate buffers
    this.posOriginArray = new Float32Array(initialData.positions);
    this.posTargetArray = new Float32Array(initialData.positions);
    this.colOriginArray = new Float32Array(initialData.colors);
    this.colTargetArray = new Float32Array(initialData.colors);
    this.delayArray = new Float32Array(initialData.delays);
    this.scaleArray = new Float32Array(initialData.scales);
    this.kineticOriginArray = new Float32Array(this.count * 4);
    this.kineticTargetArray = new Float32Array(this.count * 4);

    if (initialData.kinetics) {
      this.kineticOriginArray.set(initialData.kinetics);
      this.kineticTargetArray.set(initialData.kinetics);
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.posOriginArray, 3));
    this.geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(this.posTargetArray, 3));
    this.geometry.setAttribute('aOriginColor', new THREE.BufferAttribute(this.colOriginArray, 3));
    this.geometry.setAttribute('aTargetColor', new THREE.BufferAttribute(this.colTargetArray, 3));
    this.geometry.setAttribute('aDelay', new THREE.BufferAttribute(this.delayArray, 1));
    this.geometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1));
    this.geometry.setAttribute('aOriginKinetic', new THREE.BufferAttribute(this.kineticOriginArray, 4));
    this.geometry.setAttribute('aTargetKinetic', new THREE.BufferAttribute(this.kineticTargetArray, 4));

    // Shader Material with precision guards and blending
    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTransition: { value: 1.0 },
        uNoiseScale: { value: settings.noiseScale },
        uNoiseSpeed: { value: settings.noiseSpeed },
        uNoiseAmplitude: { value: settings.noiseAmplitude },
        uSize: { value: settings.particleSize },
        uPixelRatio: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
        uTheme: { value: settings.theme === 'light' ? 1.0 : 0.0 },
        uColorPaletteMode: { value: settings.colorPaletteMode }
      },
      transparent: true,
      depthWrite: false,
      blending: settings.theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.frustumCulled = false;
  }

  /**
   * Transition smoothly to a new shape.
   * If a transition is already underway, interrupts cleanly with zero popping.
   */
  public morphTo(newShapeData: ParticleCloudData, duration: number = 1.8) {
    if (newShapeData === this.targetShapeData && this.transitionProgress >= 1.0) {
      return; // already at target
    }

    // Mid-transition interrupt handling: compute current interpolated position
    if (this.isTransitioning && this.transitionProgress < 1.0) {
      const t = this.transitionProgress;
      const posAttr = this.geometry.getAttribute('position') as THREE.BufferAttribute;
      const colAttr = this.geometry.getAttribute('aOriginColor') as THREE.BufferAttribute;

      for (let i = 0; i < this.count; i++) {
        const stagger = this.delayArray[i] * 0.35;
        let progress = Math.max(0.0, Math.min(1.0, (t - stagger) / (1.0 - 0.35)));
        // Cubic ease
        progress = progress * progress * (3.0 - 2.0 * progress);

        const i3 = i * 3;
        // Current position
        this.posOriginArray[i3] = this.posOriginArray[i3] + (this.posTargetArray[i3] - this.posOriginArray[i3]) * progress;
        this.posOriginArray[i3 + 1] = this.posOriginArray[i3 + 1] + (this.posTargetArray[i3 + 1] - this.posOriginArray[i3 + 1]) * progress;
        this.posOriginArray[i3 + 2] = this.posOriginArray[i3 + 2] + (this.posTargetArray[i3 + 2] - this.posOriginArray[i3 + 2]) * progress;

        // Current color
        this.colOriginArray[i3] = this.colOriginArray[i3] + (this.colTargetArray[i3] - this.colOriginArray[i3]) * progress;
        this.colOriginArray[i3 + 1] = this.colOriginArray[i3 + 1] + (this.colTargetArray[i3 + 1] - this.colOriginArray[i3 + 1]) * progress;
        this.colOriginArray[i3 + 2] = this.colOriginArray[i3 + 2] + (this.colTargetArray[i3 + 2] - this.colOriginArray[i3 + 2]) * progress;
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    } else {
      // Completed transition: target becomes origin
      this.posOriginArray.set(this.posTargetArray);
      this.colOriginArray.set(this.colTargetArray);
      this.kineticOriginArray.set(this.kineticTargetArray);
      (this.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
      (this.geometry.getAttribute('aOriginColor') as THREE.BufferAttribute).needsUpdate = true;
      (this.geometry.getAttribute('aOriginKinetic') as THREE.BufferAttribute).needsUpdate = true;
    }

    // Set new target
    this.targetShapeData = newShapeData;
    this.posTargetArray.set(newShapeData.positions);
    this.colTargetArray.set(newShapeData.colors);
    if (newShapeData.kinetics) {
      this.kineticTargetArray.set(newShapeData.kinetics);
    } else {
      this.kineticTargetArray.fill(0);
    }
    (this.geometry.getAttribute('aTargetPosition') as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.getAttribute('aTargetColor') as THREE.BufferAttribute).needsUpdate = true;
    (this.geometry.getAttribute('aTargetKinetic') as THREE.BufferAttribute).needsUpdate = true;

    // Reset transition progress
    this.transitionDuration = Math.max(0.6, duration);
    this.transitionProgress = 0.0;
    this.isTransitioning = true;
    this.material.uniforms.uTransition.value = 0.0;
  }

  public update(time: number, delta: number, paused: boolean = false) {
    if (!paused) {
      this.material.uniforms.uTime.value = time;
    }

    if (this.isTransitioning) {
      this.transitionProgress += delta / this.transitionDuration;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.isTransitioning = false;
        this.currentShapeData = this.targetShapeData;
      }
      this.material.uniforms.uTransition.value = this.transitionProgress;
    }
  }

  public updateSettings(settings: Partial<ParticleSystemSettings>) {
    if (settings.noiseScale !== undefined) {
      this.material.uniforms.uNoiseScale.value = settings.noiseScale;
    }
    if (settings.noiseSpeed !== undefined) {
      this.material.uniforms.uNoiseSpeed.value = settings.noiseSpeed;
    }
    if (settings.noiseAmplitude !== undefined) {
      this.material.uniforms.uNoiseAmplitude.value = settings.noiseAmplitude;
    }
    if (settings.particleSize !== undefined) {
      this.material.uniforms.uSize.value = settings.particleSize;
    }
    if (settings.colorPaletteMode !== undefined) {
      this.material.uniforms.uColorPaletteMode.value = settings.colorPaletteMode;
    }
    if (settings.theme !== undefined) {
      const isLight = settings.theme === 'light';
      this.material.uniforms.uTheme.value = isLight ? 1.0 : 0.0;
      this.material.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
      this.material.needsUpdate = true;
    }
  }

  public setPixelRatio(dpr: number) {
    this.material.uniforms.uPixelRatio.value = Math.min(dpr, 2.0);
  }

  public getCurrentShape(): ParticleCloudData {
    return this.targetShapeData;
  }

  public getTransitionProgress(): number {
    return this.transitionProgress;
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}


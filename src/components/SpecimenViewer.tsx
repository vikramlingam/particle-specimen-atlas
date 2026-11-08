import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  generateRose,
  generateAnatomicalHeart,
  generateHumanBrain,
  generateHumanLungs,
  generateHumanEye,
  generateHumanTooth,
  generateHumanKidney,
  generateBacteriophage,
  generateEarthCutaway,
  generateEnginePiston,
  generateTurbofanEngine,
  generateSaturn,
  generateSpiralGalaxy,
  generateRocket,
  generateDNAHelix,
  generateCumulusCloud,
  generateHumanBust,
  generateBohrAtom,
  generateTokamakFusion,
  generateBlackHole,
  generateBlueWhale,
  generateTRexSkull,
  generateNautilusShell,
  generateNeuronSynapse,
  generatePlantChloroplast,
  generateHumanEar,
  generateHumanKnee,
  generateMitochondrion,
  generateCoronavirus,
  generateMicroprocessor,
  generateParticleCollider,
  generateJWST,
  generateEarthMagnetosphere,
  generateAtmosphericTornado,
  generateBirdWing,
  ParticleCloudData
} from '../generators/proceduralGeometries';
import { MorphParticleSystem, ParticleSystemSettings } from './MorphParticleSystem';
import { ArchitecturalBoundingBox } from './ArchitecturalBoundingBox';
import { SPECIMEN_EDUCATIONAL_DB, SpecimenHotspot } from '../data/educationalAnnotations';

export type ShapeId =
  | 'heart'
  | 'brain'
  | 'lungs'
  | 'eye'
  | 'tooth'
  | 'kidney'
  | 'ear'
  | 'knee'
  | 'dna'
  | 'bacteriophage'
  | 'neuron'
  | 'chloroplast'
  | 'mitochondrion'
  | 'virus'
  | 'earth'
  | 'saturn'
  | 'galaxy'
  | 'blackhole'
  | 'atom'
  | 'fusion'
  | 'collider'
  | 'magnetosphere'
  | 'tornado'
  | 'rocket'
  | 'piston'
  | 'jet'
  | 'microchip'
  | 'jwst'
  | 'whale'
  | 'rex'
  | 'nautilus'
  | 'wing'
  | 'rose'
  | 'cloud'
  | 'bust'
  | 'custom';

export interface ProjectedHotspot extends SpecimenHotspot {
  screenX: number;
  screenY: number;
  visible: boolean;
}

export interface SpecimenViewerProps {
  activeShape: ShapeId;
  particleCount: number;
  noiseScale: number;
  noiseSpeed: number;
  noiseAmplitude: number;
  particleSize: number;
  colorPaletteMode: number;
  theme: 'dark' | 'light';
  autoRotate: boolean;
  paused: boolean;
  showWireframe: boolean;
  showCenterGuide: boolean;
  customShapeData: ParticleCloudData | null;
  onHotspotsUpdate?: (hotspots: ProjectedHotspot[]) => void;
  onTelemetryUpdate?: (data: {
    fps: number;
    camX: number;
    camY: number;
    camZ: number;
    zoom: number;
    specimenName: string;
    catalogId: string;
    dimensions: { x: number; y: number; z: number };
  }) => void;
}

export interface SpecimenViewerHandle {
  resetCamera: () => void;
  captureSnapshot: () => void;
  focusOnHotspot: (pos: [number, number, number]) => void;
}

export const SpecimenViewer = forwardRef<SpecimenViewerHandle, SpecimenViewerProps>((props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const particleSystemRef = useRef<MorphParticleSystem | null>(null);
  const boundingBoxRef = useRef<ArchitecturalBoundingBox | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const propsRef = useRef(props);
  propsRef.current = props;

  const shapesCacheRef = useRef<Map<ShapeId, ParticleCloudData>>(new Map());

  const fpsFrames = useRef(0);
  const fpsLastTime = useRef(performance.now());
  const currentFps = useRef(60);

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (!cameraRef.current || !controlsRef.current) return;
      cameraRef.current.position.set(0, 1.2, 14.5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    },
    captureSnapshot: () => {
      if (!rendererRef.current) return;
      const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `specimen-${propsRef.current.activeShape}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    },
    focusOnHotspot: (pos: [number, number, number]) => {
      if (!controlsRef.current || !cameraRef.current) return;
      controlsRef.current.target.set(pos[0] * 0.4, pos[1] * 0.4, pos[2] * 0.4);
      controlsRef.current.update();
    }
  }));

  const getShapeData = (shapeId: ShapeId, count: number): ParticleCloudData => {
    if (shapeId === 'custom' && props.customShapeData) {
      return props.customShapeData;
    }

    const cached = shapesCacheRef.current.get(shapeId);
    if (cached && cached.positions.length / 3 === count) {
      return cached;
    }

    let generated: ParticleCloudData;
    switch (shapeId) {
      case 'rose':
        generated = generateRose(count);
        break;
      case 'heart':
        generated = generateAnatomicalHeart(count);
        break;
      case 'brain':
        generated = generateHumanBrain(count);
        break;
      case 'lungs':
        generated = generateHumanLungs(count);
        break;
      case 'eye':
        generated = generateHumanEye(count);
        break;
      case 'tooth':
        generated = generateHumanTooth(count);
        break;
      case 'kidney':
        generated = generateHumanKidney(count);
        break;
      case 'bacteriophage':
        generated = generateBacteriophage(count);
        break;
      case 'dna':
        generated = generateDNAHelix(count);
        break;
      case 'earth':
        generated = generateEarthCutaway(count);
        break;
      case 'saturn':
        generated = generateSaturn(count);
        break;
      case 'galaxy':
        generated = generateSpiralGalaxy(count);
        break;
      case 'rocket':
        generated = generateRocket(count);
        break;
      case 'piston':
        generated = generateEnginePiston(count);
        break;
      case 'jet':
        generated = generateTurbofanEngine(count);
        break;
      case 'atom':
        generated = generateBohrAtom(count);
        break;
      case 'fusion':
        generated = generateTokamakFusion(count);
        break;
      case 'blackhole':
        generated = generateBlackHole(count);
        break;
      case 'whale':
        generated = generateBlueWhale(count);
        break;
      case 'rex':
        generated = generateTRexSkull(count);
        break;
      case 'nautilus':
        generated = generateNautilusShell(count);
        break;
      case 'neuron':
        generated = generateNeuronSynapse(count);
        break;
      case 'chloroplast':
        generated = generatePlantChloroplast(count);
        break;
      case 'ear':
        generated = generateHumanEar(count);
        break;
      case 'knee':
        generated = generateHumanKnee(count);
        break;
      case 'mitochondrion':
        generated = generateMitochondrion(count);
        break;
      case 'virus':
        generated = generateCoronavirus(count);
        break;
      case 'microchip':
        generated = generateMicroprocessor(count);
        break;
      case 'collider':
        generated = generateParticleCollider(count);
        break;
      case 'jwst':
        generated = generateJWST(count);
        break;
      case 'magnetosphere':
        generated = generateEarthMagnetosphere(count);
        break;
      case 'tornado':
        generated = generateAtmosphericTornado(count);
        break;
      case 'wing':
        generated = generateBirdWing(count);
        break;
      case 'cloud':
        generated = generateCumulusCloud(count);
        break;
      case 'bust':
      default:
        generated = generateHumanBust(count);
        break;
    }

    shapesCacheRef.current.set(shapeId, generated);
    return generated;
  };

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.set(0, 1.2, 14.5);
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    },
    captureSnapshot: () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        const dataUrl = rendererRef.current.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `specimen-${props.activeShape}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    },
    focusOnHotspot: (pos: [number, number, number]) => {
      if (controlsRef.current) {
        controlsRef.current.target.set(pos[0] * 0.4, pos[1] * 0.4, pos[2] * 0.4);
      }
    }
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.set(0, 1.2, 14.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(props.theme === 'light' ? 0xF8F7F4 : 0x101114, 1.0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.5;
    controls.maxDistance = 36.0;
    controls.autoRotate = props.autoRotate;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    const initialData = getShapeData(props.activeShape, props.particleCount);
    const boundingBox = new ArchitecturalBoundingBox({
      theme: props.theme,
      showCenterGuide: props.showCenterGuide
    });
    boundingBox.setDimensions(initialData.dimensions.x, initialData.dimensions.y, initialData.dimensions.z, true);
    boundingBox.visible = props.showWireframe;
    scene.add(boundingBox);
    boundingBoxRef.current = boundingBox;

    const particleSettings: ParticleSystemSettings = {
      particleCount: props.particleCount,
      noiseScale: props.noiseScale,
      noiseSpeed: props.noiseSpeed,
      noiseAmplitude: props.noiseAmplitude,
      particleSize: props.particleSize,
      colorPaletteMode: props.colorPaletteMode,
      theme: props.theme,
      paused: props.paused,
    };
    const particleSystem = new MorphParticleSystem(initialData, particleSettings);
    scene.add(particleSystem.mesh);
    particleSystemRef.current = particleSystem;

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      particleSystem.setPixelRatio(window.devicePixelRatio);
    };

    window.addEventListener('resize', handleResize);

    const computeProjectedHotspots = (): ProjectedHotspot[] => {
      const currentActive = propsRef.current.activeShape;
      const edu = SPECIMEN_EDUCATIONAL_DB[currentActive];
      if (edu && edu.hotspots && container) {
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight;
        const tempVec = new THREE.Vector3();

        return edu.hotspots.map((hs) => {
          tempVec.set(hs.position[0], hs.position[1], hs.position[2]);
          tempVec.project(camera);

          const isFront = tempVec.z < 1.0;
          const sx = (tempVec.x * 0.5 + 0.5) * width;
          const sy = (-tempVec.y * 0.5 + 0.5) * height;

          return {
            ...hs,
            screenX: Math.round(sx),
            screenY: Math.round(sy),
            visible: isFront && sx >= 0 && sx <= width && sy >= 0 && sy <= height
          };
        });
      }
      return [];
    };

    // Immediate synchronous projection for initial frame
    if (propsRef.current.onHotspotsUpdate) {
      propsRef.current.onHotspotsUpdate(computeProjectedHotspots());
    }

    const clock = new THREE.Clock();
    let lastTelemetryTime = performance.now();
    let lastHotspotsTime = 0;

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      controls.update();
      particleSystem.update(elapsedTime, delta, propsRef.current.paused);
      boundingBox.update(delta);
      renderer.render(scene, camera);

      fpsFrames.current++;
      const now = performance.now();
      if (now - fpsLastTime.current >= 500) {
        currentFps.current = Math.round((fpsFrames.current * 1000) / (now - fpsLastTime.current));
        fpsFrames.current = 0;
        fpsLastTime.current = now;
      }

      // Hotspot screen projection update (every 40ms)
      if (now - lastHotspotsTime >= 40 && propsRef.current.onHotspotsUpdate && container) {
        lastHotspotsTime = now;
        propsRef.current.onHotspotsUpdate(computeProjectedHotspots());
      }

      if (now - lastTelemetryTime >= 150 && propsRef.current.onTelemetryUpdate) {
        lastTelemetryTime = now;
        const currentShape = particleSystem.getCurrentShape();
        propsRef.current.onTelemetryUpdate({
          fps: currentFps.current,
          camX: camera.position.x,
          camY: camera.position.y,
          camZ: camera.position.z,
          zoom: Math.round(camera.position.length() * 10) / 10,
          specimenName: currentShape.name,
          catalogId: currentShape.catalogId,
          dimensions: currentShape.dimensions,
        });
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      controls.dispose();
      particleSystem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!particleSystemRef.current || !boundingBoxRef.current) return;

    const targetData = getShapeData(props.activeShape, props.particleCount);
    particleSystemRef.current.morphTo(targetData, 1.8);
    boundingBoxRef.current.setDimensions(targetData.dimensions.x, targetData.dimensions.y, targetData.dimensions.z);
  }, [props.activeShape, props.customShapeData, props.particleCount]);

  useEffect(() => {
    if (!particleSystemRef.current) return;
    particleSystemRef.current.updateSettings({
      noiseScale: props.noiseScale,
      noiseSpeed: props.noiseSpeed,
      noiseAmplitude: props.noiseAmplitude,
      particleSize: props.particleSize,
      colorPaletteMode: props.colorPaletteMode,
    });
  }, [props.noiseScale, props.noiseSpeed, props.noiseAmplitude, props.particleSize, props.colorPaletteMode]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = props.autoRotate;
    }
  }, [props.autoRotate]);

  useEffect(() => {
    if (boundingBoxRef.current) {
      boundingBoxRef.current.visible = props.showWireframe;
      boundingBoxRef.current.setGuideVisible(props.showCenterGuide);
    }
  }, [props.showWireframe, props.showCenterGuide]);

  useEffect(() => {
    if (!rendererRef.current || !boundingBoxRef.current || !particleSystemRef.current) return;
    const isLight = props.theme === 'light';
    rendererRef.current.setClearColor(isLight ? 0xF8F7F4 : 0x101114, 1.0);
    boundingBoxRef.current.setTheme(props.theme);
    particleSystemRef.current.updateSettings({ theme: props.theme });
  }, [props.theme]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing outline-none"
    />
  );
});

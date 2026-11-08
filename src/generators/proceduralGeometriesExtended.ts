import * as THREE from 'three';
import { ParticleCloudData } from './proceduralGeometries';

function hexToRGB(hex: string): [number, number, number] {
  const color = new THREE.Color(hex);
  return [color.r, color.g, color.b];
}

// ============================================================================
// 1. BOHR-RUTHERFORD ATOM SPECIMEN
// Category: Physics
// ============================================================================
export function generateBohrAtom(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const protonRed = hexToRGB('#E63946');
  const neutronGold = hexToRGB('#FFB703');
  const electronAzure = hexToRGB('#48CAE4');
  const orbitalViolet = hexToRGB('#9D4EDD');
  const orbitalEmerald = hexToRGB('#2A9D8F');

  const nucleusCount = Math.floor(count * 0.16);
  const orbitalCount = count - nucleusCount;

  let idx = 0;

  // A. Dense vibrating proton-neutron nucleus
  for (let i = 0; i < nucleusCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 0.72 * Math.pow(Math.random(), 0.38);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const isProton = Math.random() > 0.48;
    const col = isProton ? protonRed : neutronGold;
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.75 + Math.random() * 0.45;

    // Type 0: Subtle quantum nuclear jiggle
    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 2.2;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Electron orbital shells (1s spherical, 2p dumbbell, 3d cloverleaf rings)
  const shells = [
    { radius: 2.1, tiltX: 0.0, tiltZ: 0.0, col: electronAzure, speed: 3.2, p1: 1.0 },
    { radius: 3.2, tiltX: 0.75, tiltZ: 0.35, col: orbitalViolet, speed: 2.4, p1: 0.0 },
    { radius: 3.8, tiltX: -0.75, tiltZ: -0.35, col: orbitalEmerald, speed: 2.0, p1: 1.0 },
    { radius: 4.6, tiltX: 0.35, tiltZ: -0.85, col: neutronGold, speed: 1.6, p1: 0.0 },
  ];

  for (let i = 0; i < orbitalCount; i++, idx++) {
    const s = shells[i % shells.length];
    const angle = Math.random() * Math.PI * 2.0;

    // Dumbbell / Torus probability wave spread
    const ringJitter = (Math.random() - 0.5) * 0.16;
    const r = s.radius + ringJitter;

    let x = Math.cos(angle) * r;
    let y = (Math.random() - 0.5) * 0.22;
    let z = Math.sin(angle) * r;

    // Rotate into inclined plane
    const cosTX = Math.cos(s.tiltX);
    const sinTX = Math.sin(s.tiltX);
    const y1 = y * cosTX - z * sinTX;
    const z1 = y * sinTX + z * cosTX;

    const cosTZ = Math.cos(s.tiltZ);
    const sinTZ = Math.sin(s.tiltZ);
    const x2 = x * cosTZ - y1 * sinTZ;
    const y2 = x * sinTZ + y1 * cosTZ;

    positions[idx * 3] = x2;
    positions[idx * 3 + 1] = y2;
    positions[idx * 3 + 2] = z1;

    colors[idx * 3] = s.col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = s.col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = s.col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;

    // Type 10: Quantum Orbital Resonance
    kinetics[idx * 4] = 10.0;
    kinetics[idx * 4 + 1] = s.speed;
    kinetics[idx * 4 + 2] = s.p1;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Bohr-Rutherford Atom',
    catalogId: 'SPECIMEN // 18-ATOM',
    description: 'Quantum atomic model featuring a dense proton-neutron nucleus surrounded by inclined electron probability orbitals.',
    dimensions: { x: 5.6, y: 5.6, z: 5.6 }
  };
}

// ============================================================================
// 2. TOKAMAK FUSION REACTOR SPECIMEN
// Category: Physics
// ============================================================================
export function generateTokamakFusion(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const coilSteel = hexToRGB('#A8DADC');
  const coreGraphite = hexToRGB('#457B9D');
  const plasmaGold = hexToRGB('#FFB703');
  const plasmaCrimson = hexToRGB('#E63946');
  const divertorCyan = hexToRGB('#00B4D8');

  const coilCount = Math.floor(count * 0.40);
  const solenoidCount = Math.floor(count * 0.12);
  const plasmaCount = count - coilCount - solenoidCount;

  let idx = 0;

  // A. 18 D-Shaped Toroidal Magnetic Field Coils
  const numCoils = 18;
  for (let i = 0; i < coilCount; i++, idx++) {
    const cIdx = Math.floor(Math.random() * numCoils);
    const coilAngle = (cIdx / numCoils) * Math.PI * 2.0;

    // D-shape parametric curve: straight inner leg, curved outer arc
    const t = Math.random() * Math.PI * 2.0;
    const rMinor = 1.35 + Math.cos(t) * 0.95;
    const yLocal = Math.sin(t) * 2.2;
    const rMajor = 2.45 + rMinor;

    const crossSpread = (Math.random() - 0.5) * 0.16;
    const x = Math.cos(coilAngle) * (rMajor + crossSpread);
    const z = Math.sin(coilAngle) * (rMajor + crossSpread);
    const y = yLocal + (Math.random() - 0.5) * 0.14;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = coilSteel[0];
    colors[idx * 3 + 1] = coilSteel[1];
    colors[idx * 3 + 2] = coilSteel[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.4;

    // Type 0: Rigid stationary magnetic coils
    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Central Solenoid & Divertor Structure
  for (let i = 0; i < solenoidCount; i++, idx++) {
    const t = Math.random();
    const y = (t - 0.5) * 4.6;
    const angle = Math.random() * Math.PI * 2.0;
    const r = (0.75 + Math.sin(t * Math.PI * 8.0) * 0.08) * (0.85 + 0.3 * Math.random());

    positions[idx * 3] = Math.cos(angle) * r;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * r;

    const col = Math.abs(y) > 1.8 ? divertorCyan : coreGraphite;
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.4;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Swirling Toroidal Plasma Core
  for (let i = 0; i < plasmaCount; i++, idx++) {
    const phi = Math.random() * Math.PI * 2.0; // Toroidal angle
    const theta = Math.random() * Math.PI * 2.0; // Poloidal angle
    const rMinor = 0.75 * Math.pow(Math.random(), 0.45);
    const R0 = 2.5;

    const r = R0 + rMinor * Math.cos(theta);
    const x = r * Math.cos(phi);
    const z = r * Math.sin(phi);
    const y = rMinor * Math.sin(theta) * 1.35; // elongated elongation kappa ~ 1.35

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const heat = 1.0 - (rMinor / 0.75);
    let col: [number, number, number];
    if (heat > 0.65) {
      col = plasmaGold;
    } else if (heat > 0.3) {
      col = plasmaCrimson;
    } else {
      col = divertorCyan;
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 7: Toroidal Helical Magnetic Plasma Flow
    kinetics[idx * 4] = 7.0;
    kinetics[idx * 4 + 1] = 3.2; // Rapid plasma stream
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Tokamak Fusion Reactor',
    catalogId: 'SPECIMEN // 19-TOKAMAK',
    description: 'Magnetic confinement fusion device with D-shaped superconducting coils confining high-temperature swirling deuterium plasma.',
    dimensions: { x: 6.8, y: 5.6, z: 6.8 }
  };
}

// ============================================================================
// 3. BLACK HOLE & ACCRETION DISK SPECIMEN
// Category: Cosmos
// ============================================================================
export function generateBlackHole(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const whiteHot = hexToRGB('#FFFFFF');
  const azurePlasma = hexToRGB('#48CAE4');
  const orangeGlow = hexToRGB('#F4A261');
  const crimsonSink = hexToRGB('#D62828');
  const jetCyan = hexToRGB('#00F5D4');

  const diskCount = Math.floor(count * 0.72);
  const horizonCount = Math.floor(count * 0.12);
  const jetCount = count - diskCount - horizonCount;

  let idx = 0;

  // A. Swirling Relativistic Accretion Disk
  for (let i = 0; i < diskCount; i++, idx++) {
    const u = Math.random();
    const r = 1.6 + Math.pow(u, 1.6) * 3.8; // Inner ISCO radius to outer rim
    const angle = Math.random() * Math.PI * 2.0;

    // Relativistic disk thickness flares slightly with radius
    const diskHeight = (0.08 + (r - 1.6) * 0.06) * (Math.random() - 0.5) * 2.0;

    positions[idx * 3] = Math.cos(angle) * r;
    positions[idx * 3 + 1] = diskHeight;
    positions[idx * 3 + 2] = Math.sin(angle) * r;

    // Radial temperature gradient: white-hot at ISCO, azure middle, crimson outer
    const tempNorm = (r - 1.6) / 3.8;
    let col: [number, number, number];
    if (tempNorm < 0.15) {
      col = whiteHot;
    } else if (tempNorm < 0.45) {
      col = azurePlasma;
    } else if (tempNorm < 0.75) {
      col = orangeGlow;
    } else {
      col = crimsonSink;
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;

    // Type 8: Relativistic Accretion Infall Swirl
    kinetics[idx * 4] = 8.0;
    kinetics[idx * 4 + 1] = 2.4; // Differential rotation
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Event Horizon & Photon Ring Sphere
  for (let i = 0; i < horizonCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const isPhotonRing = Math.random() > 0.4;
    const r = isPhotonRing ? 1.55 : 1.15;

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const col = isPhotonRing ? whiteHot : crimsonSink;
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = isPhotonRing ? 0.7 : 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Bipolar Relativistic Plasma Jets
  for (let i = 0; i < jetCount; i++, idx++) {
    const isNorth = Math.random() > 0.5;
    const signY = isNorth ? 1.0 : -1.0;
    const t = Math.random();
    const y = signY * (1.2 + t * 3.4);

    const angle = Math.random() * Math.PI * 2.0;
    // Collimated magnetic nozzle taper
    const jetRadius = (0.22 + t * 0.45) * Math.pow(Math.random(), 0.5);

    positions[idx * 3] = Math.cos(angle) * jetRadius;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * jetRadius;

    colors[idx * 3] = jetCyan[0];
    colors[idx * 3 + 1] = jetCyan[1];
    colors[idx * 3 + 2] = jetCyan[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;

    // Type 6: Continuous relativistic outflow
    kinetics[idx * 4] = 6.0;
    kinetics[idx * 4 + 1] = 2.2;
    kinetics[idx * 4 + 2] = t;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Kerr Black Hole',
    catalogId: 'SPECIMEN // 20-BLACKHOLE',
    description: 'Rotating black hole with relativistic accretion disk, innermost stable circular orbit, photon sphere, and bipolar magnetic plasma jets.',
    dimensions: { x: 7.2, y: 5.8, z: 7.2 }
  };
}

// ============================================================================
// 4. BLUE WHALE SPECIMEN
// Category: Zoology
// ============================================================================
export function generateBlueWhale(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const dorsalSlate = hexToRGB('#3D5A80');
  const lateralBlue = hexToRGB('#5C82A6');
  const ventralPale = hexToRGB('#DCE6EE');
  const baleenGold = hexToRGB('#E0FBFC');

  let idx = 0;

  for (let i = 0; i < count; i++, idx++) {
    // Spine runs along Z-axis from +3.2 (head) to -3.8 (tail fluke)
    const t = Math.random();
    const z = 3.2 - t * 7.0;

    // Longitudinal profile widths
    let width = 0.0;
    let height = 0.0;

    if (z > 1.2) {
      // Rostrum & head: broad, tapered anteriorly
      const headT = (z - 1.2) / 2.0;
      width = 1.35 * Math.sin((1.0 - headT) * Math.PI * 0.5 + 0.35);
      height = 0.95 * (1.0 - headT * 0.4);
    } else if (z > -1.5) {
      // Mid-torso thorax: maximum girth
      const bodyT = (z + 1.5) / 2.7;
      width = 1.55 * Math.sin(bodyT * Math.PI);
      height = 1.25 * Math.sin(bodyT * Math.PI);
    } else if (z > -3.0) {
      // Peduncle (tail stock): laterally compressed
      const pedT = (z + 3.0) / 1.5;
      width = 0.45 * pedT + 0.15;
      height = 0.75 * pedT + 0.22;
    } else {
      // Horizontal Tail Flukes: wide flat lateral expanse
      const flukeT = (-3.0 - z) / 0.8;
      width = 0.45 + flukeT * 2.2; // span up to 2.65
      height = 0.14 * (1.0 - flukeT * 0.5);
    }

    const angle = Math.random() * Math.PI * 2.0;
    const vol = Math.pow(Math.random(), 0.42);

    let x = Math.cos(angle) * width * vol;
    let y = Math.sin(angle) * height * vol;

    // Pectoral flippers (at z ~ 0.2 to 0.8)
    const isFlipper = Math.random() < 0.08 && z > 0.1 && z < 0.9;
    if (isFlipper) {
      const flipperSign = Math.random() > 0.5 ? 1.0 : -1.0;
      const flipperT = Math.random();
      x = flipperSign * (width + flipperT * 1.8);
      y = -0.4 - flipperT * 0.6;
    }

    // Ventral throat grooves (pleats) along underside
    if (y < -0.2 && z > 0.0) {
      const pleat = Math.sin(x * 18.0) * 0.04;
      y += pleat;
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    // Counter-shading coloration: dark slate dorsal, pale ventral
    let col: [number, number, number];
    if (y > 0.2) {
      col = dorsalSlate;
    } else if (y < -0.4) {
      col = ventralPale;
    } else {
      col = lateralBlue;
    }

    if (z > 2.2 && y < 0.0) {
      col = baleenGold; // baleen plates
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 9: Undulating Aquatic Swimming Wave
    kinetics[idx * 4] = 9.0;
    kinetics[idx * 4 + 1] = 1.8; // Swimming stroke tempo
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Balaenoptera Musculus (Blue Whale)',
    catalogId: 'SPECIMEN // 21-WHALE',
    description: 'Anatomical marine giant featuring tapered rostrum, ventral throat pleats, pectoral flippers, and undulating caudal fluke tail.',
    dimensions: { x: 5.4, y: 3.8, z: 7.8 }
  };
}

// ============================================================================
// 5. TYRANNOSAURUS REX SKULL SPECIMEN
// Category: Zoology
// ============================================================================
export function generateTRexSkull(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const fossilOchre = hexToRGB('#D4A373');
  const boneIvory = hexToRGB('#F4F1DE');
  const fossilDark = hexToRGB('#6B5E51');
  const toothEnamel = hexToRGB('#FFFDF0');

  const craniumCount = Math.floor(count * 0.65);
  const jawCount = Math.floor(count * 0.25);
  const teethCount = count - craniumCount - jawCount;

  let idx = 0;

  // A. Cranium with fenestrae (antorbital, orbit, temporal)
  for (let i = 0; i < craniumCount; i++, idx++) {
    const isLeft = Math.random() > 0.5;
    const signX = isLeft ? -1.0 : 1.0;

    const t = Math.random();
    const z = 2.4 - t * 4.6; // Snout (+2.4) to back of skull (-2.2)

    // Snout tapers anteriorly; cranium widens posteriorly
    const width = (0.65 + Math.pow(t, 0.8) * 1.45) * signX;
    const yTop = 0.4 + Math.sin(t * Math.PI * 0.9) * 0.95;
    const yBot = -0.2 - (1.0 - t) * 0.45;

    let x = width * (0.8 + 0.25 * Math.random());
    let y = yBot + Math.random() * (yTop - yBot);

    // Antorbital Fenestra (large weight-saving opening between eye and nasal)
    const isAntorbital = z > 0.2 && z < 1.4 && y > 0.0 && y < 0.8;
    // Eye Socket Orbit
    const isOrbit = z > -0.6 && z < 0.1 && y > 0.2 && y < 0.95;
    if ((isAntorbital || isOrbit) && Math.random() < 0.82) {
      // Hollow cavity: shift points to fenestra rims
      x *= 1.25;
      y = isAntorbital ? (y > 0.4 ? 0.85 : -0.05) : (y > 0.6 ? 1.0 : 0.15);
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = Math.random() > 0.4 ? fossilOchre : (Math.random() > 0.5 ? boneIvory : fossilDark);
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Dentary Lower Jaw
  for (let i = 0; i < jawCount; i++, idx++) {
    const isLeft = Math.random() > 0.5;
    const signX = isLeft ? -1.0 : 1.0;

    const t = Math.random();
    const z = 2.2 - t * 4.2;

    const width = (0.55 + Math.pow(t, 0.85) * 1.35) * signX;
    const y = -0.7 - Math.sin(t * Math.PI * 0.7) * 0.55 + (Math.random() - 0.5) * 0.22;
    const x = width * (0.85 + 0.2 * Math.random());

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = fossilOchre[0];
    colors[idx * 3 + 1] = fossilOchre[1];
    colors[idx * 3 + 2] = fossilOchre[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Serrated Recurved Predatory Teeth
  const numTeeth = 32;
  for (let i = 0; i < teethCount; i++, idx++) {
    const isUpper = Math.random() > 0.4;
    const signY = isUpper ? 1.0 : -1.0;
    const toothIdx = Math.floor(Math.random() * numTeeth);
    const toothProgress = toothIdx / numTeeth;

    const zBase = 2.2 - toothProgress * 2.2;
    const isLeft = Math.random() > 0.5;
    const signX = isLeft ? -1.0 : 1.0;
    const xBase = signX * (0.65 + toothProgress * 0.7);
    const yBase = isUpper ? -0.25 : -0.65;

    // Banana-shaped recurved tooth cone
    const tCone = Math.random();
    const toothLen = 0.45 + (1.0 - toothProgress * 0.4) * 0.55;
    const toothRad = 0.12 * (1.0 - tCone);

    const a = Math.random() * Math.PI * 2.0;
    const x = xBase + Math.cos(a) * toothRad;
    const y = yBase - signY * tCone * toothLen;
    const z = zBase - Math.pow(tCone, 1.3) * 0.18; // backward curve

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = toothEnamel[0];
    colors[idx * 3 + 1] = toothEnamel[1];
    colors[idx * 3 + 2] = toothEnamel[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Tyrannosaurus Rex Cranium',
    catalogId: 'SPECIMEN // 22-TREX_SKULL',
    description: 'Fossilized Late Cretaceous theropod skull showing antorbital fenestrae, cranial sutures, dentary lower jaw, and serrated recurved teeth.',
    dimensions: { x: 5.6, y: 5.2, z: 6.8 }
  };
}

// ============================================================================
// 6. NAUTILUS SHELL SPECIMEN
// Category: Zoology
// ============================================================================
export function generateNautilusShell(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const nacreWhite = hexToRGB('#F8F9FA');
  const stripeRust = hexToRGB('#934B2F');
  const stripeCoral = hexToRGB('#C47352');
  const septumPearly = hexToRGB('#E9ECEF');

  let idx = 0;

  for (let i = 0; i < count; i++, idx++) {
    // Logarithmic golden spiral: r = a * exp(b * theta)
    const thetaMax = Math.PI * 4.8;
    const u = Math.random();
    const theta = Math.pow(u, 0.65) * thetaMax;

    const b = 0.178; // Golden ratio spiral constant
    const r = 0.28 * Math.exp(b * theta);

    // Chamber cross section width increases exponentially with radius
    const chamberWidth = r * 0.48;
    const chamberHeight = r * 0.62;

    const crossAngle = Math.random() * Math.PI * 2.0;
    const vol = Math.random() < 0.75 ? (0.85 + 0.15 * Math.random()) : Math.pow(Math.random(), 0.5);

    // Coordinate along planar spiral
    const cx = Math.cos(theta) * r;
    const cy = Math.sin(theta) * r;

    // Lateral tube offset along Z (shell thickness)
    const zOffset = Math.sin(crossAngle) * chamberWidth * vol;
    const radialOffset = Math.cos(crossAngle) * chamberHeight * vol;

    // Normal vector to spiral
    const nx = Math.cos(theta);
    const ny = Math.sin(theta);

    const x = cx + nx * radialOffset;
    const y = cy + ny * radialOffset;
    const z = zOffset;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    // Natural radiating brown-red zebra flame camouflage patterns
    const stripe = Math.sin(theta * 9.0 + z * 3.5);
    const isSeptum = Math.abs(Math.sin(theta * 3.8)) < 0.08;

    let col: [number, number, number];
    if (isSeptum) {
      col = septumPearly;
    } else if (stripe > 0.35 && theta > Math.PI * 1.5) {
      col = stripeRust;
    } else if (stripe > 0.0) {
      col = stripeCoral;
    } else {
      col = nacreWhite;
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 0: Subtle buoyant floating hover
    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.5;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Nautilus Pompilius Shell',
    catalogId: 'SPECIMEN // 23-NAUTILUS',
    description: 'Equiangular logarithmic spiral shell showing internal camera chambers, curved septa, siphuncle canal, and pearly nacre.',
    dimensions: { x: 5.6, y: 5.8, z: 3.4 }
  };
}

// ============================================================================
// 7. NEURON & SYNAPTIC BOUTON SPECIMEN
// Category: Biology
// ============================================================================
export function generateNeuronSynapse(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const somaGold = hexToRGB('#FFB703');
  const axonCyan = hexToRGB('#00B4D8');
  const myelinIvory = hexToRGB('#F8F9FA');
  const vesicleAmber = hexToRGB('#FB8500');
  const dendriteViolet = hexToRGB('#7209B7');

  const somaCount = Math.floor(count * 0.28);
  const dendriteCount = Math.floor(count * 0.25);
  const axonCount = Math.floor(count * 0.32);
  const boutonCount = count - somaCount - dendriteCount - axonCount;

  let idx = 0;

  // A. Soma (Cell Body & Nucleus) at upper center
  for (let i = 0; i < somaCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = (1.1 + Math.sin(phi * 4.0) * 0.15) * Math.pow(Math.random(), 0.45);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = 1.8 + r * Math.cos(phi) * 1.15;
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    colors[idx * 3] = somaGold[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = somaGold[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = somaGold[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.8;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Branching Dendrites with Spines (spreading upward and sideways)
  const numDendrites = 8;
  for (let i = 0; i < dendriteCount; i++, idx++) {
    const dIdx = Math.floor(Math.random() * numDendrites);
    const baseAngle = (dIdx / numDendrites) * Math.PI * 2.0;

    const t = Math.random();
    const dist = 1.0 + t * 2.2;
    const branchAngle = baseAngle + Math.sin(t * 6.0) * 0.35;

    const thickness = (0.28 * (1.0 - t * 0.65)) * Math.random();
    const a = Math.random() * Math.PI * 2.0;

    const x = Math.cos(branchAngle) * dist + Math.cos(a) * thickness;
    const y = 1.8 + Math.sin(t * Math.PI * 0.65) * 1.8 + Math.sin(a) * thickness;
    const z = Math.sin(branchAngle) * dist * 0.7;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = dendriteViolet[0];
    colors[idx * 3 + 1] = dendriteViolet[1];
    colors[idx * 3 + 2] = dendriteViolet[2];

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.5;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Myelinated Axon descending downward with Nodes of Ranvier
  for (let i = 0; i < axonCount; i++, idx++) {
    const t = Math.random();
    const y = 0.8 - t * 3.4; // from y=0.8 down to y=-2.6

    // 5 myelin sheaths with gaps (Nodes of Ranvier)
    const myelinSegment = Math.sin(t * Math.PI * 5.0);
    const isNodeOfRanvier = Math.abs(myelinSegment) < 0.15;

    const rad = isNodeOfRanvier ? 0.12 : (0.35 + Math.sin(t * 32.0) * 0.04);
    const a = Math.random() * Math.PI * 2.0;

    positions[idx * 3] = Math.cos(a) * rad;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(a) * rad;

    const col = isNodeOfRanvier ? axonCyan : myelinIvory;
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = isNodeOfRanvier ? 0.85 : 0.6;

    // Type 6: Action potential pulse wave traveling down axon
    kinetics[idx * 4] = 6.0;
    kinetics[idx * 4 + 1] = 1.8;
    kinetics[idx * 4 + 2] = t;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // D. Synaptic Bouton & Neurotransmitter Vesicles
  for (let i = 0; i < boutonCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);

    // Enlarged bulb at base
    const r = (0.75 + Math.sin(phi * 3.0) * 0.12) * Math.pow(Math.random(), 0.5);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = -2.8 + r * Math.cos(phi) * 0.8;
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const isVesicle = Math.random() > 0.45;
    const col = isVesicle ? vesicleAmber : axonCyan;

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.75 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 1.2;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Neuron & Synapse',
    catalogId: 'SPECIMEN // 24-NEURON',
    description: 'Pyramidal neuron featuring dendritic arbor, axon hillock, myelinated sheath segments with Nodes of Ranvier, and synaptic terminal vesicles.',
    dimensions: { x: 5.8, y: 7.2, z: 4.8 }
  };
}

// ============================================================================
// 8. PLANT CHLOROPLAST SPECIMEN
// Category: Biology
// ============================================================================
export function generatePlantChloroplast(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const envelopeGreen = hexToRGB('#2D6A4F');
  const thylakoidEmerald = hexToRGB('#74C69D');
  const stromaLime = hexToRGB('#B7E4C7');
  const atpSynthaseGold = hexToRGB('#FFB703');

  const envelopeCount = Math.floor(count * 0.28);
  const granaCount = Math.floor(count * 0.52);
  const stromaCount = count - envelopeCount - granaCount;

  let idx = 0;

  // A. Double-Membrane Cutaway Envelope
  for (let i = 0; i < envelopeCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 1.65; // cutaway 3/4 view
    const phi = (v - 0.5) * Math.PI;

    const radX = 3.2;
    const radY = 1.85;
    const radZ = 2.4;

    positions[idx * 3] = radX * Math.cos(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = radY * Math.sin(phi);
    positions[idx * 3 + 2] = radZ * Math.cos(phi) * Math.sin(theta);

    colors[idx * 3] = envelopeGreen[0];
    colors[idx * 3 + 1] = envelopeGreen[1];
    colors[idx * 3 + 2] = envelopeGreen[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.0;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Thylakoid Grana Discs (Stacks of coins)
  const numGrana = 10;
  const granaPositions = [
    [-1.6, -0.4, -0.6],
    [-0.8, 0.3, 0.4],
    [-1.2, -0.1, 0.8],
    [0.0, -0.5, -0.7],
    [0.2, 0.2, 0.0],
    [0.6, -0.4, 0.9],
    [1.4, 0.1, -0.5],
    [1.5, -0.3, 0.6],
    [-0.2, 0.5, -0.2],
    [1.0, 0.4, 0.1],
  ];

  for (let i = 0; i < granaCount; i++, idx++) {
    const gIdx = Math.floor(Math.random() * numGrana);
    const gCenter = granaPositions[gIdx];

    // Stack of 6 discs
    const discIdx = Math.floor(Math.random() * 6);
    const discY = gCenter[1] + (discIdx - 2.5) * 0.16;

    const angle = Math.random() * Math.PI * 2.0;
    const discRad = 0.62 * Math.pow(Math.random(), 0.6);

    const x = gCenter[0] + Math.cos(angle) * discRad;
    const y = discY + (Math.random() - 0.5) * 0.04;
    const z = gCenter[2] + Math.sin(angle) * discRad;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const isATP = Math.random() < 0.08;
    const col = isATP ? atpSynthaseGold : thylakoidEmerald;

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.6;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Stroma Lamellae & Aqueous Matrix
  for (let i = 0; i < stromaCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = (v - 0.5) * Math.PI;
    const vol = Math.pow(Math.random(), 0.5);

    positions[idx * 3] = 2.6 * Math.cos(phi) * Math.cos(theta) * vol;
    positions[idx * 3 + 1] = 1.4 * Math.sin(phi) * vol;
    positions[idx * 3 + 2] = 2.0 * Math.cos(phi) * Math.sin(theta) * vol;

    colors[idx * 3] = stromaLime[0];
    colors[idx * 3 + 1] = stromaLime[1];
    colors[idx * 3 + 2] = stromaLime[2];

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;

    kinetics[idx * 4] = 0.0;
    kinetics[idx * 4 + 1] = 0.4;
    kinetics[idx * 4 + 2] = 0.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Plant Chloroplast',
    catalogId: 'SPECIMEN // 25-CHLOROPLAST',
    description: 'Photosynthetic plant organelle showing double-membrane envelope, aqueous stroma, stacked thylakoid grana, and ATP synthase units.',
    dimensions: { x: 6.8, y: 4.2, z: 5.4 }
  };
}


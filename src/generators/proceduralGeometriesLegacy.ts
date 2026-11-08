import * as THREE from 'three';
import { ParticleCloudData } from './proceduralGeometries';

function hexToRGB(hex: string): [number, number, number] {
  const color = new THREE.Color(hex);
  return [color.r, color.g, color.b];
}

export function generateSaturn(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const planetColors = [
    hexToRGB('#E6C387'),
    hexToRGB('#D4A86A'),
    hexToRGB('#F4DEB3'),
    hexToRGB('#B88B4A'),
    hexToRGB('#8F7049'),
  ];

  const ringColors = [
    hexToRGB('#E0D6C3'),
    hexToRGB('#BEB4A2'),
    hexToRGB('#D9CFBA'),
    hexToRGB('#8A857A'),
    hexToRGB('#F2EADB'),
  ];

  const planetCount = Math.floor(count * 0.35);
  const ringCount = count - planetCount;

  let idx = 0;
  const planetRadius = 1.65;
  const oblateness = 0.90;

  for (let i = 0; i < planetCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = planetRadius * Math.pow(Math.random(), 0.35);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi) * oblateness;
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const bandFreq = Math.sin(positions[idx * 3 + 1] * 8.0) * 0.5 + 0.5;
    let col: [number, number, number];
    if (Math.abs(positions[idx * 3 + 1]) > 1.2) {
      col = planetColors[4];
    } else if (bandFreq > 0.6) {
      col = planetColors[2];
    } else if (bandFreq > 0.3) {
      col = planetColors[0];
    } else {
      col = planetColors[1];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  const tiltAngle = 26.7 * (Math.PI / 180.0);

  for (let i = 0; i < ringCount; i++, idx++) {
    let r: number;
    let ringType = 0;

    const roll = Math.random();
    if (roll < 0.15) {
      r = 2.1 + Math.random() * 0.6;
      ringType = 0;
    } else if (roll < 0.65) {
      r = 2.7 + Math.random() * 0.95;
      ringType = 1;
    } else if (roll < 0.70) {
      r = 3.65 + Math.random() * 0.25;
      ringType = 2;
    } else {
      r = 3.90 + Math.random() * 1.3;
      ringType = 3;
    }

    const angle = Math.random() * Math.PI * 2.0;
    const thickness = (Math.random() - 0.5) * 0.08 * (1.0 + (r - 2.1) * 0.08);

    let rx = Math.cos(angle) * r;
    let ry = thickness;
    let rz = Math.sin(angle) * r;

    const cosA = Math.cos(tiltAngle);
    const sinA = Math.sin(tiltAngle);
    const yTilted = ry * cosA - rz * sinA;
    const zTilted = ry * sinA + rz * cosA;

    positions[idx * 3] = rx;
    positions[idx * 3 + 1] = yTilted;
    positions[idx * 3 + 2] = zTilted;

    let col: [number, number, number];
    if (ringType === 1) {
      col = Math.random() > 0.4 ? ringColors[0] : ringColors[4];
    } else if (ringType === 3) {
      col = ringColors[1];
    } else if (ringType === 0) {
      col = ringColors[2];
    } else {
      col = ringColors[3];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.5;

    // Type 2: Keplerian differential rotation for rings
    kinetics[idx * 4] = 2.0;
    kinetics[idx * 4 + 1] = 0.85;
    kinetics[idx * 4 + 2] = 1.0; // P1=1.0: differential orbital velocity
    kinetics[idx * 4 + 3] = 0.0;
  }

  // Planet body axial rotation
  for (let i = 0; i < planetCount; i++) {
    kinetics[i * 4] = 2.0;
    kinetics[i * 4 + 1] = 0.5;
    kinetics[i * 4 + 2] = 0.0;
    kinetics[i * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Saturnus & Annuli',
    catalogId: 'SPECIMEN // 11-SATURN',
    description: 'Oblate planetary sphere with 26.7° inclined accretion disk, Keplerian zoning, and Cassini division.',
    dimensions: { x: 10.4, y: 5.6, z: 9.8 }
  };
}

export function generateSpiralGalaxy(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const coreColors = [hexToRGB('#FFEAA7'), hexToRGB('#FDCB6E'), hexToRGB('#FFFDF8')];
  const armColors = [
    hexToRGB('#74B9FF'),
    hexToRGB('#0984E3'),
    hexToRGB('#E84393'),
    hexToRGB('#FD79A8'),
    hexToRGB('#DFE6E9'),
  ];
  const haloColors = [hexToRGB('#B2BEC3'), hexToRGB('#636E72')];

  const coreCount = Math.floor(count * 0.30);
  const armCount = Math.floor(count * 0.60);
  const haloCount = count - coreCount - armCount;

  let idx = 0;

  for (let i = 0; i < coreCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.35 * Math.pow(Math.random(), 0.65);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi) * 0.55;
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    let col: [number, number, number];
    if (r < 0.4) {
      col = coreColors[2];
    } else if (r < 0.8) {
      col = coreColors[0];
    } else {
      col = coreColors[1];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.6;
  }

  const numArms = 2;
  const armPitch = 0.38;

  for (let i = 0; i < armCount; i++, idx++) {
    const arm = Math.floor(Math.random() * numArms);
    const armOffset = (arm / numArms) * Math.PI * 2.0;

    const distNorm = Math.pow(Math.random(), 0.65);
    const r = 0.8 + distNorm * 4.4;

    const spiralAngle = Math.log(r / 0.8) / armPitch + armOffset;
    const armSpread = 0.35 + distNorm * 0.55;
    const theta = spiralAngle + (Math.random() - 0.5) * armSpread;
    const diskThickness = 0.12 * Math.exp(-distNorm * 1.5) * (Math.random() - 0.5) * 2.0;

    positions[idx * 3] = Math.cos(theta) * r;
    positions[idx * 3 + 1] = diskThickness + (Math.random() - 0.5) * 0.08;
    positions[idx * 3 + 2] = Math.sin(theta) * r;

    let col: [number, number, number];
    const roll = Math.random();
    if (roll < 0.22) {
      col = armColors[2];
    } else if (roll < 0.35) {
      col = armColors[3];
    } else if (roll < 0.70) {
      col = armColors[0];
    } else if (roll < 0.88) {
      col = armColors[1];
    } else {
      col = armColors[4];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.55;
  }

  for (let i = 0; i < haloCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 2.5 + Math.random() * 3.2;

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi) * 0.65;
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const col = haloColors[Math.floor(Math.random() * haloColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.55 + Math.random() * 0.45;
  }

  for (let i = 0; i < count; i++) {
    kinetics[i * 4] = 2.0; // Type 2: Differential galactic density wave rotation
    kinetics[i * 4 + 1] = 0.75;
    kinetics[i * 4 + 2] = 1.0;
    kinetics[i * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Galaxia Spiralis Andromeda',
    catalogId: 'SPECIMEN // 12-GALAXY',
    description: 'Logarithmic spiral galaxy with supermassive stellar core bulge, H II starburst emission nebulae, and halo clusters.',
    dimensions: { x: 10.8, y: 3.8, z: 10.8 }
  };
}

export function generateRocket(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const bodyWhite = [hexToRGB('#F8F9FA'), hexToRGB('#E9ECEF'), hexToRGB('#DEE2E6')];
  const accentColors = [hexToRGB('#E07A5F'), hexToRGB('#2D3436'), hexToRGB('#636E72')];
  const engineColors = [hexToRGB('#4A4B4D'), hexToRGB('#8D99AE')];
  const plumeColors = [hexToRGB('#FFEAA7'), hexToRGB('#FD79A8'), hexToRGB('#FF7675'), hexToRGB('#D63031')];

  const bodyCount = Math.floor(count * 0.42);
  const fairingCount = Math.floor(count * 0.18);
  const finCount = Math.floor(count * 0.10);
  const plumeCount = count - bodyCount - fairingCount - finCount;

  let idx = 0;
  const rocketRadius = 0.95;

  for (let i = 0; i < bodyCount; i++, idx++) {
    const t = Math.random();
    const y = -0.8 + t * 3.6;

    const angle = Math.random() * Math.PI * 2.0;
    const vol = 0.85 + 0.15 * Math.random();

    let r = rocketRadius;
    const isInterstage = (t > 0.33 && t < 0.37) || (t > 0.72 && t < 0.76);
    if (isInterstage) {
      r *= 0.96;
    }

    positions[idx * 3] = Math.cos(angle) * r * vol;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * r * vol;

    let col: [number, number, number];
    if (isInterstage) {
      col = accentColors[0];
    } else if (t < 0.12) {
      col = accentColors[1];
    } else {
      col = bodyWhite[Math.floor(Math.random() * bodyWhite.length)];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  for (let i = 0; i < fairingCount; i++, idx++) {
    const t = Math.random();
    const y = 2.8 + t * 1.7;

    const fairingR = rocketRadius * (1.0 - Math.pow(t, 1.4));
    const angle = Math.random() * Math.PI * 2.0;
    const vol = 0.88 + 0.12 * Math.random();

    positions[idx * 3] = Math.cos(angle) * fairingR * vol;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * fairingR * vol;

    const col = t > 0.88 ? accentColors[1] : bodyWhite[0];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  for (let i = 0; i < finCount; i++, idx++) {
    const isEngine = Math.random() > 0.45;

    if (!isEngine) {
      const fin = Math.floor(Math.random() * 4);
      const baseAngle = (fin / 4.0) * Math.PI * 2.0;
      const finProgress = Math.random();
      const finHeight = (Math.random() - 0.5) * 0.45;

      const r = rocketRadius + finProgress * 0.75;
      positions[idx * 3] = Math.cos(baseAngle) * r;
      positions[idx * 3 + 1] = 2.45 + finHeight;
      positions[idx * 3 + 2] = Math.sin(baseAngle) * r;

      const col = accentColors[1];
      colors[idx * 3] = col[0];
      colors[idx * 3 + 1] = col[1];
      colors[idx * 3 + 2] = col[2];
    } else {
      const nozzle = Math.floor(Math.random() * 4);
      const nAngle = (nozzle / 4.0) * Math.PI * 2.0 + Math.PI * 0.25;
      const nOffset = 0.45;
      const t = Math.random();

      const nx = Math.cos(nAngle) * nOffset;
      const nz = Math.sin(nAngle) * nOffset;
      const bellRadius = 0.15 + t * 0.28;
      const a = Math.random() * Math.PI * 2.0;

      positions[idx * 3] = nx + Math.cos(a) * bellRadius;
      positions[idx * 3 + 1] = -0.8 - t * 0.45;
      positions[idx * 3 + 2] = nz + Math.sin(a) * bellRadius;

      const col = engineColors[Math.floor(Math.random() * engineColors.length)];
      colors[idx * 3] = col[0];
      colors[idx * 3 + 1] = col[1];
      colors[idx * 3 + 2] = col[2];
    }

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  for (let i = 0; i < plumeCount; i++, idx++) {
    const t = Math.random();
    const y = -1.25 - t * 2.95;

    const shockWave = Math.sin(t * 16.0) * 0.18 * (1.0 - t * 0.6);
    const plumeRadius = (0.35 + t * 1.45 + shockWave) * Math.pow(Math.random(), 0.55);

    const a = Math.random() * Math.PI * 2.0;
    positions[idx * 3] = Math.cos(a) * plumeRadius;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(a) * plumeRadius;

    let col: [number, number, number];
    if (plumeRadius < 0.35 && t < 0.45) {
      col = plumeColors[0];
    } else if (Math.abs(shockWave) > 0.08) {
      col = plumeColors[1];
    } else if (t < 0.7) {
      col = plumeColors[2];
    } else {
      col = plumeColors[3];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.75 + Math.random() * 0.55;
  }

  for (let i = 0; i < count; i++) {
    if (i < bodyCount + fairingCount + finCount) {
      kinetics[i * 4] = 0.0; // Rigid spacecraft structure
      kinetics[i * 4 + 1] = 0.0;
    } else {
      kinetics[i * 4] = 6.0; // Type 6: Continuous hypersonic rocket exhaust plume
      kinetics[i * 4 + 1] = 2.4;
      kinetics[i * 4 + 2] = Math.random();
      kinetics[i * 4 + 3] = 0.0;
    }
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Astronautica Launch Vehicle',
    catalogId: 'SPECIMEN // 13-ROCKET',
    description: 'Orbital spacecraft launch vehicle with Haack ogive fairing, grid fins, multi-engine bells, and supersonic plasma exhaust plume.',
    dimensions: { x: 4.8, y: 8.8, z: 4.8 }
  };
}

export function generateDNAHelix(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const strand1Colors = [hexToRGB('#00B4D8'), hexToRGB('#0077B6'), hexToRGB('#90E0EF')];
  const strand2Colors = [hexToRGB('#2EC4B6'), hexToRGB('#009688'), hexToRGB('#CBF3F0')];
  const basePairColors = [hexToRGB('#E63946'), hexToRGB('#FFB703'), hexToRGB('#8338EC'), hexToRGB('#FB8500')];

  const strandCount = Math.floor(count * 0.30);
  const baseCount = count - strandCount * 2;

  let idx = 0;
  const helixTurns = 3.5;
  const helixRadius = 1.45;
  const totalHeight = 7.0;

  for (let i = 0; i < strandCount; i++, idx++) {
    const t = Math.random();
    const theta = t * Math.PI * 2.0 * helixTurns;
    const y = -totalHeight * 0.5 + t * totalHeight;

    const pipeAngle = Math.random() * Math.PI * 2.0;
    const pipeRadius = 0.22 * (0.8 + 0.4 * Math.random());

    positions[idx * 3] = Math.cos(theta) * helixRadius + Math.cos(pipeAngle) * pipeRadius;
    positions[idx * 3 + 1] = y + Math.sin(pipeAngle) * pipeRadius;
    positions[idx * 3 + 2] = Math.sin(theta) * helixRadius + Math.sin(pipeAngle) * pipeRadius;

    const col = strand1Colors[Math.floor(Math.random() * strand1Colors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  const grooveOffset = Math.PI + 0.45;
  for (let i = 0; i < strandCount; i++, idx++) {
    const t = Math.random();
    const theta = t * Math.PI * 2.0 * helixTurns + grooveOffset;
    const y = -totalHeight * 0.5 + t * totalHeight;

    const pipeAngle = Math.random() * Math.PI * 2.0;
    const pipeRadius = 0.22 * (0.8 + 0.4 * Math.random());

    positions[idx * 3] = Math.cos(theta) * helixRadius + Math.cos(pipeAngle) * pipeRadius;
    positions[idx * 3 + 1] = y + Math.sin(pipeAngle) * pipeRadius;
    positions[idx * 3 + 2] = Math.sin(theta) * helixRadius + Math.sin(pipeAngle) * pipeRadius;

    const col = strand2Colors[Math.floor(Math.random() * strand2Colors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  const totalRungs = Math.floor(helixTurns * 10.5);
  for (let i = 0; i < baseCount; i++, idx++) {
    const rungIdx = Math.floor(Math.random() * totalRungs);
    const rungT = rungIdx / totalRungs;

    const theta1 = rungT * Math.PI * 2.0 * helixTurns;
    const theta2 = theta1 + grooveOffset;
    const y = -totalHeight * 0.5 + rungT * totalHeight;

    const p1x = Math.cos(theta1) * helixRadius;
    const p1z = Math.sin(theta1) * helixRadius;
    const p2x = Math.cos(theta2) * helixRadius;
    const p2z = Math.sin(theta2) * helixRadius;

    const s = Math.random();
    positions[idx * 3] = p1x + (p2x - p1x) * s;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = p1z + (p2z - p1z) * s;

    const pairType = (rungIdx % 2 === 0);
    let col: [number, number, number];
    if (pairType) {
      col = s < 0.5 ? basePairColors[0] : basePairColors[1];
    } else {
      col = s < 0.5 ? basePairColors[2] : basePairColors[3];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;
  }

  for (let i = 0; i < count; i++) {
    kinetics[i * 4] = 2.0; // Type 2: Continuous smooth axial helical rotation
    kinetics[i * 4 + 1] = 0.85;
    kinetics[i * 4 + 2] = 0.0;
    kinetics[i * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Helicis B-DNA Duplex',
    catalogId: 'SPECIMEN // 14-DNA',
    description: 'Right-handed B-DNA double helix with asymmetric major/minor grooves and hydrogen-bonded nucleotide base pair rungs.',
    dimensions: { x: 4.8, y: 7.8, z: 4.8 }
  };
}

export function generateCumulusCloud(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const cloudColors = [
    hexToRGB('#FFFFFF'),
    hexToRGB('#F4F1FA'),
    hexToRGB('#E6E9F2'),
    hexToRGB('#FDF6EB'),
    hexToRGB('#D4D8E8'),
    hexToRGB('#C4CCE0'),
  ];

  const spheres = [
    { x: 0.0, y: 0.0, z: 0.0, r: 2.1 },
    { x: -1.6, y: -0.2, z: 0.2, r: 1.7 },
    { x: 1.7, y: -0.1, z: -0.1, r: 1.8 },
    { x: -0.8, y: 1.1, z: 0.3, r: 1.5 },
    { x: 0.9, y: 1.2, z: -0.2, r: 1.4 },
    { x: 0.1, y: 1.7, z: 0.1, r: 1.2 },
    { x: -2.3, y: -0.5, z: -0.4, r: 1.1 },
    { x: 2.4, y: -0.6, z: 0.3, r: 1.2 },
    { x: 0.0, y: -0.8, z: 1.2, r: 1.3 },
    { x: -0.5, y: -0.7, z: -1.1, r: 1.2 },
    { x: 1.4, y: 0.6, z: 1.0, r: 1.1 },
    { x: -1.3, y: 0.5, z: -0.9, r: 1.1 },
  ];

  for (let i = 0; i < count; i++) {
    const s = spheres[Math.floor(Math.random() * spheres.length)];

    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const rad = s.r * Math.pow(Math.random(), 0.6);

    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(theta);

    const puff = 1.0 + Math.sin(nx * 4.0 + ny * 3.0) * 0.14;
    positions[i * 3] = s.x + nx * rad * puff;
    positions[i * 3 + 1] = s.y + ny * rad * puff;
    positions[i * 3 + 2] = s.z + nz * rad * puff;

    const heightNorm = (positions[i * 3 + 1] + 1.8) / 3.8;
    let col: [number, number, number];
    if (heightNorm > 0.75) {
      col = Math.random() > 0.4 ? cloudColors[3] : cloudColors[0];
    } else if (heightNorm > 0.4) {
      col = Math.random() > 0.5 ? cloudColors[0] : cloudColors[1];
    } else if (heightNorm > 0.2) {
      col = Math.random() > 0.5 ? cloudColors[2] : cloudColors[4];
    } else {
      col = cloudColors[5];
    }

    colors[i * 3] = col[0];
    colors[i * 3 + 1] = col[1];
    colors[i * 3 + 2] = col[2];

    delays[i] = Math.random();
    scales[i] = 0.75 + Math.random() * 0.6;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Cumulus Congestus',
    catalogId: 'SPECIMEN // 15-CLOUD',
    description: 'Volumetric multi-cluster metaball sampling with soft density roll-off and atmospheric scattering.',
    dimensions: { x: 7.2, y: 4.8, z: 5.6 }
  };
}

export function generateHumanBust(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const marbleColors = [
    hexToRGB('#EAE6DF'),
    hexToRGB('#D8D3C8'),
    hexToRGB('#C49A82'),
    hexToRGB('#F8F5EE'),
    hexToRGB('#A89F91'),
    hexToRGB('#B87560'),
  ];

  let idx = 0;
  const headCount = Math.floor(count * 0.32);
  const neckCount = Math.floor(count * 0.18);
  const torsoCount = count - headCount - neckCount;

  for (let i = 0; i < headCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);

    const headHeight = 2.75;
    const headRadius = 1.05;

    let rx = headRadius * Math.sin(phi) * Math.sin(theta) * 0.88;
    let ry = headRadius * Math.cos(phi) * 1.15;
    let rz = headRadius * Math.sin(phi) * Math.cos(theta) * 1.05;

    if (ry < 0.1) {
      const taper = (0.1 - ry) * 0.45;
      rx *= (1.0 - taper * 0.4);
      if (rz > 0.0) {
        rz += (0.1 - ry) * 0.3;
      }
    }

    const vol = Math.pow(Math.random(), 0.3);
    positions[idx * 3] = rx * vol;
    positions[idx * 3 + 1] = headHeight + ry * vol;
    positions[idx * 3 + 2] = rz * vol;

    const col = marbleColors[Math.floor(Math.random() * marbleColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  for (let i = 0; i < neckCount; i++, idx++) {
    const t = Math.random();
    const y = 0.8 + t * 0.85;
    const angle = Math.random() * Math.PI * 2.0;
    const neckRadius = (0.55 + (1.0 - t) * 0.25) * (0.8 + 0.3 * Math.random());

    positions[idx * 3] = Math.cos(angle) * neckRadius * 0.85;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * neckRadius * 0.95 - (1.0 - t) * 0.1;

    const col = marbleColors[Math.floor(Math.random() * marbleColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  for (let i = 0; i < torsoCount; i++, idx++) {
    const t = Math.random();
    const y = 0.8 - t * 3.6;

    let shoulderWidth: number;
    if (t < 0.25) {
      shoulderWidth = 1.0 + (t / 0.25) * 1.8;
    } else {
      const waistProgress = (t - 0.25) / 0.75;
      shoulderWidth = 2.8 - waistProgress * 1.1;
    }

    const chestDepth = 0.85 + Math.sin(t * Math.PI) * 0.35;
    const angle = Math.random() * Math.PI * 2.0;
    const vol = Math.pow(Math.random(), 0.35);

    let x = Math.cos(angle) * shoulderWidth * 0.9 * vol;
    let z = Math.sin(angle) * chestDepth * vol;

    if (t > 0.15 && t < 0.55 && z > 0.0) {
      z += Math.sin((t - 0.15) / 0.4 * Math.PI) * 0.35 * (1.0 - Math.abs(x) / 2.0);
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    let col: [number, number, number];
    if (Math.abs(x) > 2.0 || y < -2.2) {
      col = Math.random() > 0.5 ? marbleColors[2] : marbleColors[5];
    } else {
      col = Math.random() > 0.4 ? marbleColors[0] : marbleColors[1];
    }

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.5;
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] -= 0.2;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Statua Humana',
    catalogId: 'SPECIMEN // 16-BUST',
    description: 'Anatomical classical marble bust with cranial plane, cervical column, and pectoral silhouette.',
    dimensions: { x: 5.8, y: 7.2, z: 4.2 }
  };
}

export function sampleGeometryToParticles(
  geometry: THREE.BufferGeometry,
  targetCount: number,
  specimenName: string = 'Imported Specimen'
): ParticleCloudData {
  const positions = new Float32Array(targetCount * 3);
  const colors = new Float32Array(targetCount * 3);
  const delays = new Float32Array(targetCount);
  const scales = new Float32Array(targetCount);

  geometry.computeBoundingBox();
  const box = geometry.boundingBox || new THREE.Box3();
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
  const targetScale = 6.0 / maxDim;

  const posAttr = geometry.getAttribute('position');
  const vertexCount = posAttr ? posAttr.count : 0;
  const defaultCol = hexToRGB('#A2B4C7');

  for (let i = 0; i < targetCount; i++) {
    if (vertexCount > 0) {
      const vIdx = Math.floor(Math.random() * vertexCount);
      const vx = (posAttr.getX(vIdx) - center.x) * targetScale;
      const vy = (posAttr.getY(vIdx) - center.y) * targetScale;
      const vz = (posAttr.getZ(vIdx) - center.z) * targetScale;

      positions[i * 3] = vx + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = vy + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 2] = vz + (Math.random() - 0.5) * 0.08;
    } else {
      positions[i * 3] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4.0;
    }

    colors[i * 3] = defaultCol[0];
    colors[i * 3 + 1] = defaultCol[1];
    colors[i * 3 + 2] = defaultCol[2];

    delays[i] = Math.random();
    scales[i] = 0.7 + Math.random() * 0.5;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: specimenName,
    catalogId: 'SPECIMEN // USER-IMPORT',
    description: `Sampled mesh geometry containing ${targetCount.toLocaleString()} divergence-free particle nodes.`,
    dimensions: { x: size.x * targetScale, y: size.y * targetScale, z: size.z * targetScale }
  };
}


import * as THREE from 'three';

export interface ParticleCloudData {
  positions: Float32Array;
  colors: Float32Array;
  delays: Float32Array;
  scales: Float32Array;
  kinetics?: Float32Array;
  name: string;
  catalogId: string;
  description: string;
  dimensions: { x: number; y: number; z: number };
}

function hexToRGB(hex: string): [number, number, number] {
  const color = new THREE.Color(hex);
  return [color.r, color.g, color.b];
}

// ============================================================================
// 1. ROSE BOUQUET SPECIMEN
// ============================================================================
export function generateRose(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const petalColors = [
    hexToRGB('#D95F6E'), // Terracotta rose
    hexToRGB('#E67B88'), // Soft rose pink
    hexToRGB('#F298A2'), // Blush petal
    hexToRGB('#FCEAE6'), // Cream petal edge
    hexToRGB('#B8384A'), // Deep velvet core
    hexToRGB('#E88674'), // Warm coral accent
  ];

  const leafColors = [
    hexToRGB('#5E7E65'), // Deep sage foliage
    hexToRGB('#73967B'), // Soft sage
    hexToRGB('#8CAE94'), // Muted lichen
    hexToRGB('#A8C2AF'), // Pale sage leaf rim
  ];

  const stemColors = [
    hexToRGB('#7A4D3E'), // Earthy umber
    hexToRGB('#5E382C'), // Dark woody bark
    hexToRGB('#966352'), // Warm terracotta fiber
    hexToRGB('#C48C7A'), // Fibrous highlight
  ];

  const bloomCount = Math.floor(count * 0.68);
  const leafCount = Math.floor(count * 0.18);
  const stemCount = count - bloomCount - leafCount;

  let idx = 0;
  const bloomCenters = [
    { x: 0.0, y: 1.6, z: 0.0, r: 1.5, petals: 6 },
    { x: 1.4, y: 1.2, z: 0.2, r: 1.3, petals: 5 },
    { x: -1.3, y: 1.3, z: 0.3, r: 1.3, petals: 5 },
    { x: 0.2, y: 1.1, z: 1.4, r: 1.3, petals: 5 },
    { x: -0.3, y: 1.2, z: -1.3, r: 1.3, petals: 5 },
    { x: 1.0, y: 0.8, z: -1.0, r: 1.2, petals: 5 },
    { x: -1.0, y: 0.7, z: -1.0, r: 1.2, petals: 5 },
    { x: 0.9, y: 0.7, z: 1.1, r: 1.2, petals: 5 },
  ];

  for (let i = 0; i < bloomCount; i++, idx++) {
    const center = bloomCenters[Math.floor(Math.random() * bloomCenters.length)];
    const theta = Math.random() * Math.PI * 12.0;
    const normRadius = Math.pow(Math.random(), 0.65);
    const r = center.r * normRadius;

    const ruffle = Math.sin(theta * center.petals) * 0.22 * normRadius;
    const petalHeight = Math.pow(normRadius, 1.3) * 0.9 + Math.cos(theta * 3.0) * 0.15;

    const x = center.x + Math.cos(theta) * (r + ruffle);
    const z = center.z + Math.sin(theta) * (r + ruffle);
    const y = center.y + petalHeight + (Math.random() - 0.5) * 0.2;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    let col: [number, number, number];
    if (normRadius < 0.25) {
      col = petalColors[4];
    } else if (normRadius < 0.6) {
      col = Math.random() > 0.4 ? petalColors[0] : petalColors[1];
    } else if (normRadius < 0.85) {
      col = Math.random() > 0.4 ? petalColors[2] : petalColors[5];
    } else {
      col = Math.random() > 0.5 ? petalColors[3] : petalColors[2];
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  const leafSpokes = 10;
  for (let i = 0; i < leafCount; i++, idx++) {
    const spoke = Math.floor(Math.random() * leafSpokes);
    const baseAngle = (spoke / leafSpokes) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
    const leafProgress = Math.pow(Math.random(), 0.7);

    const leafLength = 2.4;
    const leafWidth = Math.sin(leafProgress * Math.PI) * 0.75;
    const sideOffset = (Math.random() - 0.5) * leafWidth;

    const dist = 0.5 + leafProgress * leafLength;
    const droop = -Math.pow(leafProgress, 1.5) * 0.8;

    const x = Math.cos(baseAngle) * dist - Math.sin(baseAngle) * sideOffset;
    const z = Math.sin(baseAngle) * dist + Math.cos(baseAngle) * sideOffset;
    const y = 0.4 + droop + (Math.random() - 0.5) * 0.15;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = leafColors[Math.floor(Math.random() * leafColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.5;
  }

  const stemFibers = 12;
  for (let i = 0; i < stemCount; i++, idx++) {
    const fiber = Math.floor(Math.random() * stemFibers);
    const t = Math.random();
    const y = 0.2 - t * 3.4;

    const bundleWaist = 0.28 + Math.pow(t - 0.35, 2.0) * 0.6;
    const spiral = (fiber / stemFibers) * Math.PI * 2.0 + t * 2.5;

    const radius = bundleWaist * (0.8 + 0.4 * Math.random());
    const x = Math.cos(spiral) * radius + Math.sin(y * 1.2) * 0.12;
    const z = Math.sin(spiral) * radius + Math.cos(y * 1.2) * 0.12;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = stemColors[Math.floor(Math.random() * stemColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.4;
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += 0.4;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Rosa Floribunda Bouquet',
    catalogId: 'SPECIMEN // 01-ROSE',
    description: 'Multi-bloom botanical rose bouquet with layered ruffled petals, sage foliage, and fibrous stem bundle.',
    dimensions: { x: 5.8, y: 7.2, z: 5.8 }
  };
}

// ============================================================================
// 2. ANATOMICAL HUMAN HEART
// ============================================================================
export function generateAnatomicalHeart(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const myocardiumColors = [
    hexToRGB('#A31D1D'), // Deep muscular myocardium
    hexToRGB('#C02626'), // Crimson ventricular wall
    hexToRGB('#82181A'), // Deep cardiac interior
    hexToRGB('#B93B3B'), // Anterior surface
  ];

  const aortaColors = [
    hexToRGB('#E63946'), // Bright oxygenated scarlet aorta
    hexToRGB('#D02230'), // Aortic arch deep red
    hexToRGB('#F4626E'), // Brachiocephalic branch highlight
  ];

  const pulmonaryColors = [
    hexToRGB('#2B5876'), // Venous pulmonary artery blue
    hexToRGB('#4E4376'), // Vena cava deep violet-navy
    hexToRGB('#3B7EA1'), // Pulmonary bifurcation cyan-blue
  ];

  const coronaryColors = [
    hexToRGB('#E63946'), // Coronary artery scarlet
    hexToRGB('#3B7EA1'), // Cardiac vein blue
    hexToRGB('#E5A84B'), // Epicardial sulcus adipose tissue (gold)
  ];

  const ventCount = Math.floor(count * 0.52);
  const atriaCount = Math.floor(count * 0.20);
  const aortaCount = Math.floor(count * 0.14);
  const pulmCount = Math.floor(count * 0.09);
  const coronCount = count - ventCount - atriaCount - aortaCount - pulmCount;

  let idx = 0;

  // Ventricles & Apex
  for (let i = 0; i < ventCount; i++, idx++) {
    const t = Math.random();
    const phi = Math.random() * Math.PI * 2.0;
    const vol = Math.pow(Math.random(), 0.35);

    const y = 0.3 - t * 3.1;
    const coneRadius = (1.8 * (1.0 - t * 0.85) + Math.sin(t * Math.PI) * 0.45) * vol;

    const tiltX = -t * 0.75;
    const tiltZ = t * 0.45;

    let rx = Math.cos(phi) * coneRadius * 1.1;
    let rz = Math.sin(phi) * coneRadius * 0.95;

    if (phi > 0.8 && phi < 1.8) {
      const grooveDepr = Math.sin((phi - 0.8) / 1.0 * Math.PI) * 0.25;
      rx *= (1.0 - grooveDepr);
      rz *= (1.0 - grooveDepr);
    }

    positions[idx * 3] = rx + tiltX;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = rz + tiltZ;

    const col = myocardiumColors[Math.floor(Math.random() * myocardiumColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // Atria & Auricular Appendages
  for (let i = 0; i < atriaCount; i++, idx++) {
    const isRightAtrium = Math.random() > 0.45;
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const vol = Math.pow(Math.random(), 0.3);

    const cx = isRightAtrium ? 1.05 : -0.85;
    const cy = 0.75;
    const cz = isRightAtrium ? 0.3 : -0.45;
    const r = isRightAtrium ? 1.0 : 0.85;

    let x = cx + r * Math.sin(phi) * Math.cos(theta) * vol;
    let y = cy + r * Math.cos(phi) * vol * 0.85;
    let z = cz + r * Math.sin(phi) * Math.sin(theta) * vol;

    if (isRightAtrium && theta > 0.0 && theta < Math.PI * 0.7) {
      z += 0.35 * Math.sin(theta);
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = isRightAtrium ? pulmonaryColors[1] : myocardiumColors[1];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;
  }

  // Aorta & Arch Branches
  for (let i = 0; i < aortaCount; i++, idx++) {
    const isBranch = Math.random() < 0.28;

    if (!isBranch) {
      const t = Math.random();
      const archAngle = t * Math.PI * 0.85;
      const pipeRadius = 0.42 * (0.8 + 0.4 * Math.random());
      const crossAngle = Math.random() * Math.PI * 2.0;

      const pathX = 0.1 - Math.sin(archAngle) * 0.9;
      const pathY = 0.5 + Math.sin(archAngle * 1.1) * 2.2;
      const pathZ = 0.2 - Math.cos(archAngle) * 0.85;

      const x = pathX + Math.cos(crossAngle) * pipeRadius;
      const y = pathY + Math.sin(crossAngle) * pipeRadius * 0.5;
      const z = pathZ + Math.sin(crossAngle) * pipeRadius;

      positions[idx * 3] = x;
      positions[idx * 3 + 1] = y;
      positions[idx * 3 + 2] = z;
    } else {
      const branchIdx = Math.floor(Math.random() * 3);
      const branchOffsets = [
        { bx: -0.1, by: 2.5, bz: 0.15, angle: 0.1 },
        { bx: -0.45, by: 2.65, bz: -0.05, angle: 0.0 },
        { bx: -0.8, by: 2.55, bz: -0.25, angle: -0.15 }
      ][branchIdx];

      const len = Math.random() * 1.1;
      const pipeRad = 0.18 * (0.8 + 0.4 * Math.random());
      const a = Math.random() * Math.PI * 2.0;

      positions[idx * 3] = branchOffsets.bx + Math.cos(a) * pipeRad + len * branchOffsets.angle;
      positions[idx * 3 + 1] = branchOffsets.by + len;
      positions[idx * 3 + 2] = branchOffsets.bz + Math.sin(a) * pipeRad;
    }

    const col = aortaColors[Math.floor(Math.random() * aortaColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // Pulmonary Trunk & Vena Cava
  for (let i = 0; i < pulmCount; i++, idx++) {
    const isVenaCava = Math.random() < 0.35;

    if (!isVenaCava) {
      const t = Math.random();
      const pipeRad = 0.38 * (0.8 + 0.4 * Math.random());
      const a = Math.random() * Math.PI * 2.0;

      let px: number, py: number, pz: number;
      if (t < 0.6) {
        px = 0.3 - t * 0.6;
        py = 0.3 + t * 2.2;
        pz = 0.65 - t * 0.4;
      } else {
        const isLeft = Math.random() > 0.5;
        const branchT = (t - 0.6) / 0.4;
        px = isLeft ? -0.1 - branchT * 1.3 : 0.0 + branchT * 1.4;
        py = 1.6 + branchT * 0.2;
        pz = 0.4 - branchT * 0.8;
      }

      positions[idx * 3] = px + Math.cos(a) * pipeRad;
      positions[idx * 3 + 1] = py;
      positions[idx * 3 + 2] = pz + Math.sin(a) * pipeRad;
    } else {
      const h = Math.random() * 1.8;
      const pipeRad = 0.35 * (0.8 + 0.4 * Math.random());
      const a = Math.random() * Math.PI * 2.0;

      positions[idx * 3] = 1.1 + Math.cos(a) * pipeRad;
      positions[idx * 3 + 1] = 0.9 + h;
      positions[idx * 3 + 2] = -0.1 + Math.sin(a) * pipeRad;
    }

    const col = pulmonaryColors[Math.floor(Math.random() * pulmonaryColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.04;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.04;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // Coronary Sulcus Vessels
  for (let i = 0; i < coronCount; i++, idx++) {
    const isAnteriorSulcus = Math.random() > 0.4;
    let cx: number, cy: number, cz: number;

    if (isAnteriorSulcus) {
      const t = Math.random();
      cy = 0.2 - t * 2.8;
      cx = -0.1 - t * 0.6 + (Math.random() - 0.5) * 0.15;
      cz = 1.35 * (1.0 - t * 0.7) + (Math.random() - 0.5) * 0.12;
    } else {
      const theta = Math.random() * Math.PI * 2.0;
      cx = Math.cos(theta) * 1.75;
      cy = 0.25 + Math.sin(theta * 2.0) * 0.15;
      cz = Math.sin(theta) * 1.5;
    }

    positions[idx * 3] = cx;
    positions[idx * 3 + 1] = cy;
    positions[idx * 3 + 2] = cz;

    const col = coronaryColors[Math.floor(Math.random() * coronaryColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.5;
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += 0.2;
    kinetics[i * 4] = 4.0; // Type 4: Cardiac cycle (systole/diastole ventricular wringing twist)
    kinetics[i * 4 + 1] = 1.15; // Biological pulse speed (approx 72 bpm)
    kinetics[i * 4 + 2] = 0.0;
    kinetics[i * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Cor Humanum Anatomicum',
    catalogId: 'SPECIMEN // 02-HEART',
    description: 'Anatomical human heart with left/right ventricles, apex tilt, aortic arch with systemic branches, pulmonary trunk, and coronary vessels.',
    dimensions: { x: 5.6, y: 7.2, z: 5.2 }
  };
}

// ============================================================================
// 3. HUMAN BRAIN (Realistic hemispheres, gyri/sulci, cerebellum, brainstem)
// ============================================================================
export function generateHumanBrain(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const cortexColors = [
    hexToRGB('#C3B6D4'), // Soft gray matter lavender
    hexToRGB('#B0A2C3'), // Cortical gray
    hexToRGB('#DED7E6'), // Highlight gyrus ridge
    hexToRGB('#827394'), // Deep sulcus shadow
    hexToRGB('#D4707D'), // Capillary rose blush
  ];

  const cerebellumColors = [
    hexToRGB('#A295B3'), // Cerebellar folia
    hexToRGB('#BEB4CD'), // Light folia striation
    hexToRGB('#756787'), // Sub-occipital shadow
  ];

  const stemColors = [
    hexToRGB('#EBE6DC'), // Pons ivory
    hexToRGB('#DDD8CB'), // Medulla oblongata
    hexToRGB('#C8C2B3'), // Spinal cord base
  ];

  // 72% Cerebrum (Hemispheres), 18% Cerebellum, 10% Brainstem
  const cerebrumCount = Math.floor(count * 0.72);
  const cerebellumCount = Math.floor(count * 0.18);
  const stemCount = count - cerebrumCount - cerebellumCount;

  let idx = 0;

  // A. Cerebral Hemispheres (Left and Right separated by longitudinal fissure)
  for (let i = 0; i < cerebrumCount; i++, idx++) {
    const isLeft = Math.random() > 0.5;
    const signX = isLeft ? -1.0 : 1.0;

    // Theta: 0 (anterior / frontal) to PI (posterior / occipital)
    // Phi: 0 (superior apex dome) to PI/2 (inferior base)
    const theta = Math.random() * Math.PI;
    const phi = Math.pow(Math.random(), 0.72) * (Math.PI * 0.55);

    // Anatomical cerebral dimensions
    const radX = 1.42;
    const radY = 1.55;
    const radZ = 1.95;

    // Anteroposterior taper (slightly wider at parietal/posterior)
    const apTaper = 1.0 - 0.12 * Math.cos(theta);

    // Realistic multi-harmonic gyri and sulci convolutions
    const g1 = Math.sin(theta * 11.0 + phi * 9.0) * 0.12;
    const g2 = Math.cos(phi * 13.0 - theta * 7.0) * 0.08;
    const g3 = Math.sin(theta * 22.0) * 0.04;
    const gyrus = 1.0 + g1 + g2 + g3;

    // High density on cortical surface shell for sharp gyri definition
    const shell = Math.random() < 0.8 ? (0.86 + 0.14 * Math.random()) : Math.pow(Math.random(), 0.5);

    let hx = radX * Math.sin(phi) * apTaper * gyrus * shell;
    let hy = (radY * Math.cos(phi) * gyrus * shell) + 0.45;
    let hz = radZ * Math.cos(theta) * Math.sin(phi) * gyrus * shell;

    // Temporal lobe inferolateral bulge
    if (phi > 0.65 && theta > 0.8 && theta < 2.0) {
      hx *= 1.18;
      hy -= 0.18;
    }

    // Offset left / right hemisphere and enforce longitudinal fissure
    const x = signX * (0.24 + hx);
    const y = hy;
    const z = hz;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    let col: [number, number, number];
    if (g1 > 0.06) {
      col = cortexColors[2];
    } else if (g1 < -0.06) {
      col = cortexColors[3];
    } else if (Math.random() < 0.15) {
      col = cortexColors[4];
    } else {
      col = isLeft ? cortexColors[0] : cortexColors[1];
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  // B. Cerebellum (Tucked postero-inferiorly with horizontal folia striations)
  for (let i = 0; i < cerebellumCount; i++, idx++) {
    const isLeft = Math.random() > 0.5;
    const signX = isLeft ? -1.0 : 1.0;

    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const shell = 0.84 + 0.16 * Math.random();

    const cx = 0.72 * signX;
    const cy = -0.65;
    const cz = -1.1;

    // Horizontal laminar folia
    const folia = 1.0 + Math.sin(phi * 28.0) * 0.07;

    const rx = 0.82 * Math.sin(phi) * Math.cos(theta) * folia * shell;
    const ry = 0.62 * Math.cos(phi) * folia * shell * 0.8;
    const rz = 0.92 * Math.sin(phi) * Math.sin(theta) * folia * shell;

    positions[idx * 3] = cx + rx;
    positions[idx * 3 + 1] = cy + ry;
    positions[idx * 3 + 2] = cz + rz;

    const col = cerebellumColors[Math.floor(Math.random() * cerebellumColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;
  }

  // C. Brainstem (Pons & Medulla Oblongata)
  for (let i = 0; i < stemCount; i++, idx++) {
    const t = Math.random();
    const y = -0.35 - t * 2.3;

    const ponsBulge = Math.exp(-Math.pow((t - 0.28) / 0.16, 2.0)) * 0.35;
    const stemRadius = (0.42 + ponsBulge) * (0.8 + 0.35 * Math.random());

    const angle = Math.random() * Math.PI * 2.0;
    const x = Math.cos(angle) * stemRadius * 0.85;
    const z = -0.28 + Math.sin(angle) * stemRadius * 1.05;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = stemColors[Math.floor(Math.random() * stemColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.02;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.02;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += 0.3;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Cerebrum & Encephalon',
    catalogId: 'SPECIMEN // 03-BRAIN',
    description: 'Human brain with convoluted gyri and sulci, longitudinal fissure, stratified cerebellum, and brainstem.',
    dimensions: { x: 5.6, y: 6.2, z: 6.4 }
  };
}

// ============================================================================
// 4. HUMAN LUNGS (Segmented trachea, carina, bronchial arborization, cardiac notch)
// ============================================================================
export function generateHumanLungs(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const tracheaColors = [
    hexToRGB('#F4EAD4'), // Cartilaginous ivory ring
    hexToRGB('#E6D5B8'), // Inter-cartilaginous membrane
    hexToRGB('#D4C3A3'), // Tracheal carina
  ];

  const bronchusColors = [
    hexToRGB('#D46553'), // Bronchial arborization terracotta
    hexToRGB('#E87A68'), // Secondary bronchus
    hexToRGB('#B84D3C'), // Deep segmental airway
  ];

  const lungColors = [
    hexToRGB('#E27D79'), // Spongy alveolar rose
    hexToRGB('#F0938F'), // Soft parenchyma blush
    hexToRGB('#D4635F'), // Pulmonary base
    hexToRGB('#F9B8B5'), // Pleural surface highlight
    hexToRGB('#3B7EA1'), // Pulmonary vessel capillary blue
    hexToRGB('#E63946'), // Pulmonary capillary scarlet
  ];

  const tracheaCount = Math.floor(count * 0.12);
  const arborCount = Math.floor(count * 0.14);
  const rightLungCount = Math.floor(count * 0.37);
  const leftLungCount = count - tracheaCount - arborCount - rightLungCount;

  let idx = 0;

  // A. Trachea with horizontal C-shaped cartilage rings
  for (let i = 0; i < tracheaCount; i++, idx++) {
    const t = Math.random();
    const y = 3.4 - t * 2.0;

    const cRing = Math.sin(t * 32.0) * 0.05;
    const pipeRadius = (0.35 + cRing) * (0.85 + 0.3 * Math.random());

    const angle = (Math.random() - 0.5) * Math.PI * 1.85;
    const x = Math.sin(angle) * pipeRadius;
    const z = Math.cos(angle) * pipeRadius;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = tracheaColors[Math.floor(Math.random() * tracheaColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // B. Bronchial Arborization Tree
  for (let i = 0; i < arborCount; i++, idx++) {
    const isRight = Math.random() > 0.5;
    const signX = isRight ? 1.0 : -1.0;

    const level = Math.random();
    const branchAngle = 0.45 + level * 0.65;
    const dist = level * 2.2;

    const bx = signX * (0.2 + Math.sin(branchAngle) * dist);
    const by = 1.4 - Math.cos(branchAngle) * dist * 1.1;
    const bz = (Math.random() - 0.5) * 0.8 * level;

    const thickness = (0.22 * (1.0 - level * 0.6)) * (0.8 + 0.4 * Math.random());
    const a = Math.random() * Math.PI * 2.0;

    positions[idx * 3] = bx + Math.cos(a) * thickness;
    positions[idx * 3 + 1] = by;
    positions[idx * 3 + 2] = bz + Math.sin(a) * thickness;

    const col = bronchusColors[Math.floor(Math.random() * bronchusColors.length)];
    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;
  }

  // C. Right Lung (3 distinct lobes with fissures)
  for (let i = 0; i < rightLungCount; i++, idx++) {
    const t = Math.random();
    const y = 1.6 - t * 4.2;

    const coneFactor = Math.sin(t * Math.PI * 0.85);
    let width = 1.35 * coneFactor;
    let depth = 1.45 * coneFactor;

    // Fissures (Horizontal & Oblique)
    const isHorizontalFissure = Math.abs(y - 0.2) < 0.12;
    const isObliqueFissure = Math.abs(y + 1.1 - t * 0.5) < 0.12;
    if (isHorizontalFissure || isObliqueFissure) {
      width *= 0.85;
      depth *= 0.85;
    }

    const angle = Math.random() * Math.PI * 2.0;
    const vol = Math.pow(Math.random(), 0.38);

    const x = 1.6 + Math.cos(angle) * width * vol;
    const z = Math.sin(angle) * depth * vol;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    let col: [number, number, number];
    const roll = Math.random();
    if (roll < 0.08) {
      col = lungColors[4];
    } else if (roll < 0.16) {
      col = lungColors[5];
    } else if (vol > 0.85) {
      col = lungColors[3];
    } else {
      col = lungColors[Math.floor(Math.random() * 3)];
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  // D. Left Lung (2 lobes with prominent medial Cardiac Notch)
  for (let i = 0; i < leftLungCount; i++, idx++) {
    const t = Math.random();
    const y = 1.6 - t * 4.2;

    const coneFactor = Math.sin(t * Math.PI * 0.85);
    let width = 1.25 * coneFactor;
    const depth = 1.45 * coneFactor;

    const angle = Math.random() * Math.PI * 2.0;
    const vol = Math.pow(Math.random(), 0.38);

    let lx = Math.cos(angle) * width * vol;
    let lz = Math.sin(angle) * depth * vol;

    // Pronounced Cardiac Notch indent
    if (y > -1.6 && y < 0.4 && lx > -0.5 && lz > -0.3) {
      lx -= 0.75 * (1.0 - Math.abs(y + 0.6) / 1.0);
    }

    positions[idx * 3] = -1.6 + lx;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = lz;

    let col: [number, number, number];
    const roll = Math.random();
    if (roll < 0.08) {
      col = lungColors[4];
    } else if (roll < 0.16) {
      col = lungColors[5];
    } else if (vol > 0.85) {
      col = lungColors[3];
    } else {
      col = lungColors[Math.floor(Math.random() * 3)];
    }

    colors[idx * 3] = col[0] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 1] = col[1] + (Math.random() - 0.5) * 0.03;
    colors[idx * 3 + 2] = col[2] + (Math.random() - 0.5) * 0.03;

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.5;
  }

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 1] += 0.2;
    // Trachea vs Lungs breathing kinetics
    if (i < tracheaCount + arborCount) {
      kinetics[i * 4] = 0.0; // Stationary trachea & main bronchi
      kinetics[i * 4 + 1] = 0.0;
    } else {
      kinetics[i * 4] = 5.0; // Type 5: Respiratory lung inhalation/exhalation expansion
      kinetics[i * 4 + 1] = 0.35; // Gentle peaceful breathing rate
    }
    kinetics[i * 4 + 2] = 0.0;
    kinetics[i * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Pulmo & Arbor Bronchialis',
    catalogId: 'SPECIMEN // 04-LUNGS',
    description: 'Bilateral human lungs with cartilaginous trachea, carina, bronchial arborization, and medial cardiac notch.',
    dimensions: { x: 6.8, y: 7.2, z: 5.4 }
  };
}

// ============================================================================
// 5. HUMAN EYE & OPTIC NERVE (Cornea, iris, pupil, lens, retina, optic nerve)
// ============================================================================
export function generateHumanEye(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const scleraWhite = hexToRGB('#F4F6F8');
  const corneaClear = hexToRGB('#A8DADC');
  const irisHazel = [hexToRGB('#2A9D8F'), hexToRGB('#E76F51'), hexToRGB('#264653')];
  const pupilBlack = hexToRGB('#111317');
  const retinaColor = hexToRGB('#E63946');
  const nerveColor = hexToRGB('#D4A373');

  const scleraCount = Math.floor(count * 0.45);
  const corneaCount = Math.floor(count * 0.15);
  const irisCount = Math.floor(count * 0.18);
  const retinaCount = Math.floor(count * 0.12);
  const nerveCount = count - scleraCount - corneaCount - irisCount - retinaCount;

  let idx = 0;
  const eyeRadius = 2.0;

  // A. Sclera (White sphere shell)
  for (let i = 0; i < scleraCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const vol = 0.94 + 0.06 * Math.random();

    let z = eyeRadius * Math.cos(phi) * vol;
    // Don't render sclera where cornea/pupil sits (z > 1.2)
    if (z > 1.2) {
      z = 1.2 - Math.random() * 0.2;
    }

    const x = eyeRadius * Math.sin(phi) * Math.cos(theta) * vol;
    const y = eyeRadius * Math.sin(phi) * Math.sin(theta) * vol;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = scleraWhite[0];
    colors[idx * 3 + 1] = scleraWhite[1];
    colors[idx * 3 + 2] = scleraWhite[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // B. Cornea (Anterior transparent bulging dome)
  for (let i = 0; i < corneaCount; i++, idx++) {
    const angle = Math.random() * Math.PI * 2.0;
    const r = Math.pow(Math.random(), 0.6) * 1.15;
    const bulge = Math.sqrt(Math.max(0.0, 1.4 - r * r * 0.8));

    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    const z = 1.4 + bulge * 0.7;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = corneaClear[0];
    colors[idx * 3 + 1] = corneaClear[1];
    colors[idx * 3 + 2] = corneaClear[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // C. Iris & Pupil
  for (let i = 0; i < irisCount; i++, idx++) {
    const angle = Math.random() * Math.PI * 2.0;
    const rad = 0.35 + Math.random() * 0.85; // pupil radius = 0.35
    const isPupil = Math.random() < 0.22;

    let x: number, y: number, col: [number, number, number];
    if (isPupil) {
      const pr = Math.random() * 0.34;
      x = Math.cos(angle) * pr;
      y = Math.sin(angle) * pr;
      col = pupilBlack;
    } else {
      x = Math.cos(angle) * rad;
      y = Math.sin(angle) * rad;
      col = irisHazel[Math.floor(Math.random() * irisHazel.length)];
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = 1.35;

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;
  }

  // D. Retina (Posterior interior hemisphere)
  for (let i = 0; i < retinaCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random() * 0.65 + 0.35; // posterior hemisphere
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = (eyeRadius - 0.15) * (0.95 + 0.05 * Math.random());

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[idx * 3 + 2] = r * Math.cos(phi);

    colors[idx * 3] = retinaColor[0];
    colors[idx * 3 + 1] = retinaColor[1];
    colors[idx * 3 + 2] = retinaColor[2];

    delays[idx] = Math.random();
    scales[idx] = 0.6 + Math.random() * 0.45;
  }

  // E. Optic Nerve Cable (Exiting posteromedially)
  for (let i = 0; i < nerveCount; i++, idx++) {
    const t = Math.random(); // 0 at eye, 1 extending back
    const len = t * 1.8;
    const a = Math.random() * Math.PI * 2.0;
    const r = 0.38 * (0.8 + 0.4 * Math.random());

    positions[idx * 3] = -0.3 + Math.cos(a) * r - len * 0.15;
    positions[idx * 3 + 1] = -0.1 + Math.sin(a) * r;
    positions[idx * 3 + 2] = -eyeRadius - len;

    colors[idx * 3] = nerveColor[0];
    colors[idx * 3 + 1] = nerveColor[1];
    colors[idx * 3 + 2] = nerveColor[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Oculus Humanus',
    catalogId: 'SPECIMEN // 05-EYE',
    description: 'Human eye optical system with anterior cornea dome, hazel iris, pupil aperture, and posterior optic nerve cable.',
    dimensions: { x: 4.8, y: 4.8, z: 6.2 }
  };
}

// ============================================================================
// 6. HUMAN MOLAR TOOTH (Enamel crown, cusps, dentin, pulp, twin roots)
// ============================================================================
export function generateHumanTooth(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const enamelWhite = [hexToRGB('#F8F9FA'), hexToRGB('#EDF2F4'), hexToRGB('#FAF0CA')];
  const dentinCream = hexToRGB('#E9D8A6');
  const pulpCrimson = hexToRGB('#E63946');
  const cementumBeige = hexToRGB('#D4A373');

  const crownCount = Math.floor(count * 0.48);
  const pulpCount = Math.floor(count * 0.12);
  const rootCount = count - crownCount - pulpCount;

  let idx = 0;

  // A. Crown & Cusps (4 occlusal cusps)
  for (let i = 0; i < crownCount; i++, idx++) {
    const u = Math.random() * 2.0 - 1.0;
    const v = Math.random() * 2.0 - 1.0;
    const t = Math.random(); // 0 at neck (y=0.2), 1 at occlusal surface (y=1.8)

    const x = u * 1.45 * (0.8 + t * 0.35);
    const z = v * 1.35 * (0.8 + t * 0.35);

    // 4 Occlusal Cusps elevation
    const cuspX = Math.sin(u * Math.PI) * 0.45;
    const cuspZ = Math.sin(v * Math.PI) * 0.45;
    const y = 0.2 + t * 1.6 + (t > 0.8 ? (cuspX + cuspZ) : 0.0);

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    const col = enamelWhite[Math.floor(Math.random() * enamelWhite.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // B. Dental Pulp Chamber (Living central core)
  for (let i = 0; i < pulpCount; i++, idx++) {
    const t = Math.random();
    const y = 0.1 + t * 1.1;
    const angle = Math.random() * Math.PI * 2.0;
    const r = 0.32 * Math.pow(Math.random(), 0.5);

    positions[idx * 3] = Math.cos(angle) * r;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * r;

    colors[idx * 3] = pulpCrimson[0];
    colors[idx * 3 + 1] = pulpCrimson[1];
    colors[idx * 3 + 2] = pulpCrimson[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;
  }

  // C. Twin Tapered Roots (Mesial and Distal roots)
  for (let i = 0; i < rootCount; i++, idx++) {
    const isMesial = Math.random() > 0.5;
    const rootOffsetX = isMesial ? 0.75 : -0.75;
    const t = Math.random(); // 0 at neck (y=0.2), 1 at root apex (y=-3.2)
    const y = 0.2 - t * 3.4;

    const rootRadius = (0.55 * (1.0 - t * 0.75)) * (0.8 + 0.4 * Math.random());
    const angle = Math.random() * Math.PI * 2.0;

    // Slight curvature inward at tips
    const curveX = isMesial ? Math.sin(t * Math.PI) * 0.25 : -Math.sin(t * Math.PI) * 0.25;

    positions[idx * 3] = rootOffsetX + Math.cos(angle) * rootRadius + curveX;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * rootRadius;

    colors[idx * 3] = cementumBeige[0];
    colors[idx * 3 + 1] = cementumBeige[1];
    colors[idx * 3 + 2] = cementumBeige[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Dens Molaris',
    catalogId: 'SPECIMEN // 06-TOOTH',
    description: 'Human molar tooth with enamel crown, occlusal cusps, vascular dental pulp core, and twin tapered anchoring roots.',
    dimensions: { x: 4.8, y: 6.8, z: 4.8 }
  };
}

// ============================================================================
// 7. HUMAN KIDNEY (Bean-shaped cortex, medullary pyramids, renal pelvis, ureter)
// ============================================================================
export function generateHumanKidney(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const cortexRed = [hexToRGB('#9B2226'), hexToRGB('#AE2012'), hexToRGB('#BB3E03')];
  const pyramidCrimson = hexToRGB('#7A171B');
  const pelvisCream = hexToRGB('#E9D8A6');
  const arteryScarlet = hexToRGB('#E63946');
  const veinBlue = hexToRGB('#2B5876');

  const cortexCount = Math.floor(count * 0.55);
  const pyramidCount = Math.floor(count * 0.25);
  const vesselCount = count - cortexCount - pyramidCount;

  let idx = 0;

  // A. Bean-shaped Renal Cortex
  for (let i = 0; i < cortexCount; i++, idx++) {
    const t = Math.random() * Math.PI * 2.0;
    const h = (Math.random() - 0.5) * 4.2; // height y
    const vol = Math.pow(Math.random(), 0.35);

    // Kidney bean cross section
    const r = (1.8 - Math.pow(Math.abs(h) / 2.5, 2.0) * 0.7) * vol;
    let x = Math.cos(t) * r * 1.25;
    let z = Math.sin(t) * r * 0.85;

    // Medial hilum notch (x < 0)
    if (x < 0.2 && Math.abs(h) < 1.4) {
      x += 0.85 * (1.0 - Math.abs(h) / 1.4);
    }

    positions[idx * 3] = x + 0.4;
    positions[idx * 3 + 1] = h;
    positions[idx * 3 + 2] = z;

    const col = cortexRed[Math.floor(Math.random() * cortexRed.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // B. Medullary Pyramids (Triangular filtering cones)
  const numPyramids = 6;
  for (let i = 0; i < pyramidCount; i++, idx++) {
    const pIdx = Math.floor(Math.random() * numPyramids);
    const pAngle = (pIdx / numPyramids) * Math.PI * 1.3 - Math.PI * 0.65;
    const pDist = 0.4 + Math.random() * 0.85;

    const x = Math.cos(pAngle) * pDist + 0.5;
    const y = Math.sin(pAngle) * 1.5;
    const z = (Math.random() - 0.5) * 0.55;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = pyramidCrimson[0];
    colors[idx * 3 + 1] = pyramidCrimson[1];
    colors[idx * 3 + 2] = pyramidCrimson[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // C. Renal Pelvis, Ureter & Hilum Vessels
  for (let i = 0; i < vesselCount; i++, idx++) {
    const isUreter = Math.random() > 0.4;
    let x: number, y: number, z: number, col: [number, number, number];

    if (isUreter) {
      // Descending ureter tube
      const t = Math.random();
      y = -0.5 - t * 2.6;
      x = -0.5 - t * 0.35 + (Math.random() - 0.5) * 0.15;
      z = (Math.random() - 0.5) * 0.2;
      col = pelvisCream;
    } else {
      // Renal artery (red) or vein (blue)
      const isArtery = Math.random() > 0.5;
      const t = Math.random();
      y = 0.2 + (Math.random() - 0.5) * 0.6;
      x = -0.4 - t * 1.4;
      z = (Math.random() - 0.5) * 0.35;
      col = isArtery ? arteryScarlet : veinBlue;
    }

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Ren Humanum',
    catalogId: 'SPECIMEN // 07-KIDNEY',
    description: 'Human kidney organ with bean-shaped cortex, medullary filtration pyramids, renal pelvis funnel, and descending ureter.',
    dimensions: { x: 5.4, y: 6.8, z: 4.8 }
  };
}

// ============================================================================
// 8. BACTERIOPHAGE T4 (20-sided capsid, sheath, baseplate, 6 tail fibers)
// ============================================================================
export function generateBacteriophage(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const capsidColors = [hexToRGB('#00B4D8'), hexToRGB('#90E0EF'), hexToRGB('#0077B6')];
  const sheathColors = [hexToRGB('#F77F00'), hexToRGB('#FCBF49')];
  const fiberColors = [hexToRGB('#E63946'), hexToRGB('#D62828')];

  const capsidCount = Math.floor(count * 0.48);
  const sheathCount = Math.floor(count * 0.22);
  const fiberCount = count - capsidCount - sheathCount;

  let idx = 0;

  // A. Icosahedral Capsid Head
  for (let i = 0; i < capsidCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const vol = Math.pow(Math.random(), 0.35);

    // Icosahedral facet modulation
    const facet = 1.0 + Math.sin(phi * 5.0) * Math.cos(theta * 5.0) * 0.12;
    const r = 1.65 * facet * vol;

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = 2.4 + r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    const col = capsidColors[Math.floor(Math.random() * capsidColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // B. Contractile Tail Sheath Cylinder & Baseplate
  for (let i = 0; i < sheathCount; i++, idx++) {
    const t = Math.random(); // 0 at neck, 1 at baseplate
    const y = 0.9 - t * 2.4; // from y=0.9 down to y=-1.5

    const spiral = t * 28.0;
    const a = Math.random() * Math.PI * 2.0;
    // Tail cylinder with baseplate flare
    const r = (t > 0.92 ? 0.75 : 0.32) * (0.85 + 0.3 * Math.random());

    positions[idx * 3] = Math.cos(a) * r;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(a) * r;

    const col = sheathColors[Math.floor(Math.random() * sheathColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // C. 6 Jointed Tail Fibers (Landing legs)
  const numFibers = 6;
  for (let i = 0; i < fiberCount; i++, idx++) {
    const fIdx = Math.floor(Math.random() * numFibers);
    const fAngle = (fIdx / numFibers) * Math.PI * 2.0;
    const t = Math.random(); // 0 baseplate to 1 foot tip

    // Jointed knee bend at t=0.45
    let r: number, y: number;
    if (t < 0.45) {
      r = 0.75 + (t / 0.45) * 1.6;
      y = -1.5 - (t / 0.45) * 0.8;
    } else {
      const kneeT = (t - 0.45) / 0.55;
      r = 2.35 + kneeT * 0.8;
      y = -2.3 - kneeT * 1.2;
    }

    positions[idx * 3] = Math.cos(fAngle) * r + (Math.random() - 0.5) * 0.08;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(fAngle) * r + (Math.random() - 0.5) * 0.08;

    const col = fiberColors[Math.floor(Math.random() * fiberColors.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Phagus T4 Bacteriovorus',
    catalogId: 'SPECIMEN // 08-PHAGE',
    description: 'Bacteriophage virus with icosahedral capsid head, contractile injection tail sheath, and 6 jointed anchoring tail fibers.',
    dimensions: { x: 6.8, y: 7.8, z: 6.8 }
  };
}

// ============================================================================
// 9. PLANET EARTH & GEOLOGICAL CORE CUTAWAY
// ============================================================================
export function generateEarthCutaway(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);

  const innerCoreGold = hexToRGB('#FFEAA7');
  const outerCoreOrange = hexToRGB('#F77F00');
  const mantleTerracotta = hexToRGB('#D62828');
  const crustOceanBlue = hexToRGB('#0077B6');
  const continentGreen = hexToRGB('#2A9D8F');

  const innerCount = Math.floor(count * 0.15);
  const outerCount = Math.floor(count * 0.25);
  const mantleCount = Math.floor(count * 0.35);
  const crustCount = count - innerCount - outerCount - mantleCount;

  let idx = 0;
  const earthRadius = 2.6;

  // A. Solid Inner Core (Center sphere)
  for (let i = 0; i < innerCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 0.75 * Math.pow(Math.random(), 0.4);

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    colors[idx * 3] = innerCoreGold[0];
    colors[idx * 3 + 1] = innerCoreGold[1];
    colors[idx * 3 + 2] = innerCoreGold[2];

    delays[idx] = Math.random();
    scales[idx] = 0.75 + Math.random() * 0.45;
  }

  // B. Liquid Outer Core Shell
  for (let i = 0; i < outerCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 0.75 + Math.random() * 0.7;

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    colors[idx * 3] = outerCoreOrange[0];
    colors[idx * 3 + 1] = outerCoreOrange[1];
    colors[idx * 3 + 2] = outerCoreOrange[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // C. Silicate Mantle
  for (let i = 0; i < mantleCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.45 + Math.random() * 1.0;

    positions[idx * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[idx * 3 + 1] = r * Math.cos(phi);
    positions[idx * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    colors[idx * 3] = mantleTerracotta[0];
    colors[idx * 3 + 1] = mantleTerracotta[1];
    colors[idx * 3 + 2] = mantleTerracotta[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  // D. Crust Surface (Oceans & Continents)
  for (let i = 0; i < crustCount; i++, idx++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2.0;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = earthRadius * (0.97 + 0.03 * Math.random());

    // Cutaway 90 degree wedge so inner layers are clearly visible!
    let px = r * Math.sin(phi) * Math.cos(theta);
    let py = r * Math.cos(phi);
    let pz = r * Math.sin(phi) * Math.sin(theta);

    if (px > 0.0 && pz > 0.0) {
      // Cutaway quadrant
      px *= 0.35;
      pz *= 0.35;
    }

    positions[idx * 3] = px;
    positions[idx * 3 + 1] = py;
    positions[idx * 3 + 2] = pz;

    const isContinent = Math.sin(theta * 3.0 + phi * 2.0) * Math.cos(phi * 4.0) > 0.15;
    const col = isContinent ? continentGreen : crustOceanBlue;
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    name: 'Terra Geologica',
    catalogId: 'SPECIMEN // 09-EARTH',
    description: 'Planetary Earth cutaway cross-section revealing solid iron inner core, liquid outer core dynamo, mantle, and tectonic crust.',
    dimensions: { x: 5.8, y: 5.8, z: 5.8 }
  };
}

// ============================================================================
// 10. ENGINE PISTON & CRANKSHAFT
// ============================================================================
export function generateEnginePiston(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const crownSilver = [hexToRGB('#F8F9FA'), hexToRGB('#CED4DA')];
  const rodSteel = hexToRGB('#6C757D');
  const crankBronze = [hexToRGB('#D4A373'), hexToRGB('#E07A5F')];

  const crownCount = Math.floor(count * 0.40);
  const rodCount = Math.floor(count * 0.30);
  const crankCount = count - crownCount - rodCount;

  let idx = 0;

  // A. Piston Crown, Skirt & Ring Grooves (Reciprocates vertically in Y)
  for (let i = 0; i < crownCount; i++, idx++) {
    const t = Math.random(); // 0 at wrist pin, 1 at crown top
    const y = 0.8 + t * 2.2; // from y=0.8 to y=3.0

    const angle = Math.random() * Math.PI * 2.0;
    let r = 1.65;
    // Ring grooves
    if ((y > 2.2 && y < 2.35) || (y > 2.5 && y < 2.65)) {
      r = 1.48;
    }

    const vol = 0.85 + 0.15 * Math.random();
    positions[idx * 3] = Math.cos(angle) * r * vol;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = Math.sin(angle) * r * vol;

    const col = crownSilver[Math.floor(Math.random() * crownSilver.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 3: Reciprocating kinematics (P1=1.0: Piston crown)
    kinetics[idx * 4] = 3.0;
    kinetics[idx * 4 + 1] = 4.5;
    kinetics[idx * 4 + 2] = 1.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. H-Beam Connecting Rod (Swings angularly between crank and wrist pin)
  for (let i = 0; i < rodCount; i++, idx++) {
    const t = Math.random(); // 0 at wrist pin (y=1.0), 1 at crank journal (y=-1.5)
    const y = 1.0 - t * 2.5;

    const tiltX = Math.sin(t * Math.PI) * 0.45;
    const w = 0.45;
    const d = 0.75;

    const x = (Math.random() - 0.5) * w + tiltX;
    const z = (Math.random() - 0.5) * d;

    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = rodSteel[0];
    colors[idx * 3 + 1] = rodSteel[1];
    colors[idx * 3 + 2] = rodSteel[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 3: Reciprocating kinematics (P1=3.0: Connecting rod, P2=t)
    kinetics[idx * 4] = 3.0;
    kinetics[idx * 4 + 1] = 4.5;
    kinetics[idx * 4 + 2] = 3.0;
    kinetics[idx * 4 + 3] = t;
  }

  // C. Crankshaft & Counterweight (Revolves in circular orbit)
  for (let i = 0; i < crankCount; i++, idx++) {
    const angle = Math.random() * Math.PI * 2.0;
    const r = 0.6 + Math.random() * 1.5;
    const cy = -1.8 + Math.sin(angle) * r;
    const cx = Math.cos(angle) * r;
    const cz = (Math.random() - 0.5) * 1.4;

    positions[idx * 3] = cx;
    positions[idx * 3 + 1] = cy;
    positions[idx * 3 + 2] = cz;

    const col = crankBronze[Math.floor(Math.random() * crankBronze.length)];
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.7 + Math.random() * 0.45;

    // Type 3: Reciprocating kinematics (P1=4.0: Revolving crankshaft)
    kinetics[idx * 4] = 3.0;
    kinetics[idx * 4 + 1] = 4.5;
    kinetics[idx * 4 + 2] = 4.0;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Mechanica Piston & Crankshaft',
    catalogId: 'SPECIMEN // 10-PISTON',
    description: 'Internal combustion reciprocating engine assembly with piston crown, ring grooves, H-beam connecting rod, and counterweighted crankshaft.',
    dimensions: { x: 5.2, y: 7.4, z: 4.8 }
  };
}

// ============================================================================
// 11. TURBOFAN JET ENGINE
// ============================================================================
export function generateTurbofanEngine(count: number): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  const kinetics = new Float32Array(count * 4);

  const fanTitanium = hexToRGB('#A8DADC');
  const cowlWhite = hexToRGB('#F8F9FA');
  const coreGraphite = hexToRGB('#2B2D42');
  const flameOrange = hexToRGB('#E63946');

  const fanCount = Math.floor(count * 0.35);
  const coreCount = Math.floor(count * 0.40);
  const exhaustCount = count - fanCount - coreCount;

  let idx = 0;

  // A. Front Fan Blades (Twisted titanium blades revolving around Z-axis)
  const numBlades = 18;
  for (let i = 0; i < fanCount; i++, idx++) {
    const bIdx = Math.floor(Math.random() * numBlades);
    const baseAngle = (bIdx / numBlades) * Math.PI * 2.0;
    const rNorm = Math.pow(Math.random(), 0.65);
    const r = 0.45 + rNorm * 2.1;

    // Aerodynamic twist along blade
    const twist = rNorm * 0.85;
    const a = baseAngle + twist;

    positions[idx * 3] = Math.cos(a) * r;
    positions[idx * 3 + 1] = Math.sin(a) * r;
    positions[idx * 3 + 2] = 2.0 - rNorm * 0.45;

    colors[idx * 3] = fanTitanium[0];
    colors[idx * 3 + 1] = fanTitanium[1];
    colors[idx * 3 + 2] = fanTitanium[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    // Type 1: High-speed axial fan revolution
    kinetics[idx * 4] = 1.0;
    kinetics[idx * 4 + 1] = 4.2;
    kinetics[idx * 4 + 2] = r;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // B. Nacelle Cowling & Core Compressor / Combustor
  for (let i = 0; i < coreCount; i++, idx++) {
    const t = Math.random(); // 0 front to 1 rear
    const z = 2.0 - t * 4.6;

    const angle = Math.random() * Math.PI * 2.0;
    // Outer nacelle vs inner core
    const isNacelle = Math.random() > 0.45;
    let r = isNacelle ? (2.6 - t * 0.5) : (0.75 + Math.sin(t * Math.PI) * 0.45);

    positions[idx * 3] = Math.cos(angle) * r;
    positions[idx * 3 + 1] = Math.sin(angle) * r;
    positions[idx * 3 + 2] = z;

    const col = isNacelle ? cowlWhite : coreGraphite;
    colors[idx * 3] = col[0];
    colors[idx * 3 + 1] = col[1];
    colors[idx * 3 + 2] = col[2];

    delays[idx] = Math.random();
    scales[idx] = 0.65 + Math.random() * 0.45;

    if (isNacelle) {
      // Type 0: Rigid stationary nacelle casing
      kinetics[idx * 4] = 0.0;
      kinetics[idx * 4 + 1] = 0.0;
    } else {
      // Type 1: Core compressor rotor discs revolving
      kinetics[idx * 4] = 1.0;
      kinetics[idx * 4 + 1] = 3.2;
    }
    kinetics[idx * 4 + 2] = r;
    kinetics[idx * 4 + 3] = 0.0;
  }

  // C. Exhaust Jet Flame Core
  for (let i = 0; i < exhaustCount; i++, idx++) {
    const t = Math.random();
    const z = -2.6 - t * 2.2;
    const r = (0.55 - t * 0.35) * Math.pow(Math.random(), 0.5);
    const angle = Math.random() * Math.PI * 2.0;

    positions[idx * 3] = Math.cos(angle) * r;
    positions[idx * 3 + 1] = Math.sin(angle) * r;
    positions[idx * 3 + 2] = z;

    colors[idx * 3] = flameOrange[0];
    colors[idx * 3 + 1] = flameOrange[1];
    colors[idx * 3 + 2] = flameOrange[2];

    delays[idx] = Math.random();
    scales[idx] = 0.75 + Math.random() * 0.45;

    // Type 1: Swirling supersonic exhaust gases
    kinetics[idx * 4] = 1.0;
    kinetics[idx * 4 + 1] = 5.6;
    kinetics[idx * 4 + 2] = r;
    kinetics[idx * 4 + 3] = 0.0;
  }

  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name: 'Turbofan Aero Engine',
    catalogId: 'SPECIMEN // 11-TURBOFAN',
    description: 'High-bypass aviation turbofan engine with wide-chord titanium fan blades, axial core compressor, combustor, and exhaust nozzle.',
    dimensions: { x: 5.6, y: 5.6, z: 7.2 }
  };
}

// Re-export extended & verified generators
export {
  generateBohrAtom,
  generateTokamakFusion,
  generateBlackHole,
  generateBlueWhale,
  generateTRexSkull,
  generateNautilusShell,
  generateNeuronSynapse,
  generatePlantChloroplast
} from './proceduralGeometriesExtended';

// Re-export advanced scientific & anatomical generators
export {
  generateHumanEar,
  generateHumanKnee,
  generateMitochondrion,
  generateCoronavirus,
  generateMicroprocessor,
  generateParticleCollider,
  generateJWST,
  generateEarthMagnetosphere,
  generateAtmosphericTornado,
  generateBirdWing
} from './proceduralGeometriesAdvanced';

// Re-export previous verified generators
export {
  generateSaturn,
  generateSpiralGalaxy,
  generateRocket,
  generateDNAHelix,
  generateCumulusCloud,
  generateHumanBust,
  sampleGeometryToParticles
} from './proceduralGeometriesLegacy';

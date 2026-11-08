import * as THREE from 'three';
import { ParticleCloudData } from './proceduralGeometries';

const POINT_COUNT = 100_000;

function finalizeParticleCloudData(
  positions: Float32Array,
  colors: Float32Array,
  kinetics: Float32Array,
  count: number,
  name: string,
  catalogId: string,
  description: string,
  dimensions = { x: 5.4, y: 5.4, z: 5.4 }
): ParticleCloudData {
  const delays = new Float32Array(count);
  const scales = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    delays[i] = ((positions[i * 3 + 1] + 3.0) / 6.0) * 0.4 + ((i % 1000) / 1000) * 0.6;
    scales[i] = 0.8 + (((i * 17) % 100) / 100) * 0.5;
  }
  return {
    positions,
    colors,
    delays,
    scales,
    kinetics,
    name,
    catalogId,
    description,
    dimensions
  };
}

// Helper pseudo-random function with seed
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2d679f);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// =========================================================================
// 26. HUMAN EAR & COCHLEA (Anatomy)
// Outer pinna auricle, auditory canal, tympanic membrane, ossicles (malleus,
// incus, stapes), and 2.75-turn logarithmic spiral cochlea with semicircular canals.
// =========================================================================
export function generateHumanEar(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(101);

  // Allocations:
  // Pinna auricle cartilage: 45,000 points
  // External auditory acoustic meatus (canal): 15,000 points
  // Tympanic membrane (eardrum): 8,000 points
  // Auditory ossicles (malleus, incus, stapes): 10,000 points
  // Cochlea logarithmic spiral: 14,000 points
  // Semicircular balance canals: 8,000 points

  const nPinna = 45000;
  const nCanal = 15000;
  const nEardrum = 8000;
  const nOssicles = 10000;
  const nCochlea = 14000;
  const nCanals = count - (nPinna + nCanal + nEardrum + nOssicles + nCochlea);

  let offset = 0;

  // 1. Outer Pinna Auricle
  for (let i = 0; i < nPinna; i++) {
    const u = rand();
    const v = rand();
    const theta = u * Math.PI * 1.85 - 0.2; // curved C shape
    const rBase = 1.6 + 0.6 * Math.cos(theta * 0.8);
    const zBase = Math.sin(theta) * 2.3;

    // Helix rim rolling
    const isRim = v < 0.35;
    const rimRadius = isRim ? 0.28 * Math.sqrt(rand()) : (0.4 + 0.7 * v);
    const rimAngle = rand() * Math.PI * 2.0;

    let x = (rBase + (isRim ? Math.cos(rimAngle) * 0.25 : (rand() - 0.5) * 0.4)) * 1.05 - 0.8;
    let y = zBase + (isRim ? Math.sin(rimAngle) * 0.25 : (rand() - 0.5) * 0.3);
    let z = (isRim ? Math.sin(rimAngle) * 0.35 : (0.2 - Math.pow(v, 1.5) * 0.8)) + (rand() - 0.5) * 0.08;

    // Concha depression
    if (!isRim && v > 0.6) {
      z -= 0.6;
      x += 0.3;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z + 0.8;

    // Natural cartilage warm flesh tones
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.92 + rand() * 0.06;
    colors[cIdx + 1] = 0.68 + rand() * 0.08;
    colors[cIdx + 2] = 0.62 + rand() * 0.08;

    // Motion: static cartilage housing with subtle acoustic resonance
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 0.0; // pinna static
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nPinna;

  // 2. Auditory Canal (curved S tube going inward)
  for (let i = 0; i < nCanal; i++) {
    const t = rand(); // 0 at outer concha, 1 at eardrum
    const angle = rand() * Math.PI * 2.0;
    const rTube = 0.28 + 0.06 * Math.sin(t * Math.PI);

    const cx = -0.3 - t * 1.5 + Math.sin(t * Math.PI) * 0.2;
    const cy = -0.15 - t * 0.3;
    const cz = 0.5 - t * 1.8;

    const x = cx + Math.cos(angle) * rTube;
    const y = cy + Math.sin(angle) * rTube;
    const z = cz;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.82 + rand() * 0.08;
    colors[cIdx + 1] = 0.52 + rand() * 0.08;
    colors[cIdx + 2] = 0.48 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 1.0; // acoustic air column wave
    kinetics[kIdx + 3] = t;
  }
  offset += nCanal;

  // 3. Tympanic Membrane (Eardrum disc tilted at 55 degrees)
  const drumCenter = new THREE.Vector3(-1.8, -0.45, -1.3);
  for (let i = 0; i < nEardrum; i++) {
    const r = Math.sqrt(rand()) * 0.38;
    const phi = rand() * Math.PI * 2.0;
    // Conical tenting towards umbo
    const depth = -Math.pow(1.0 - r / 0.38, 2.0) * 0.14;

    const x = drumCenter.x + Math.cos(phi) * r * 0.85 + depth * 0.6;
    const y = drumCenter.y + Math.sin(phi) * r;
    const z = drumCenter.z + depth * 0.8;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Translucent pearly grey membrane
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.88 + rand() * 0.08;
    colors[cIdx + 1] = 0.86 + rand() * 0.08;
    colors[cIdx + 2] = 0.82 + rand() * 0.1;

    // Type 11: Tympanic vibration membrane
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 2.4; // rapid acoustic oscillation
    kinetics[kIdx + 2] = 2.0; // eardrum drumhead mode
    kinetics[kIdx + 3] = 1.0 - r / 0.38; // amplitude highest at center
  }
  offset += nEardrum;

  // 4. Auditory Ossicles (Malleus, Incus, Stapes)
  for (let i = 0; i < nOssicles; i++) {
    const sub = i / nOssicles;
    let p = new THREE.Vector3();

    if (sub < 0.45) {
      // Malleus (hammer handle attached to umbo, extending to head)
      const t = rand();
      const pStart = new THREE.Vector3(-1.8, -0.45, -1.4);
      const pHead = new THREE.Vector3(-1.95, -0.05, -1.55);
      p.lerpVectors(pStart, pHead, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08));
    } else if (sub < 0.78) {
      // Incus (anvil body articulating with malleus head, long process extending)
      const t = rand();
      const pBody = new THREE.Vector3(-1.95, -0.05, -1.55);
      const pEnd = new THREE.Vector3(-2.15, -0.22, -1.75);
      p.lerpVectors(pBody, pEnd, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.07, (rand() - 0.5) * 0.07, (rand() - 0.5) * 0.07));
    } else {
      // Stapes (stirrup arch and footplate on oval window)
      const u = rand();
      const pIncus = new THREE.Vector3(-2.15, -0.22, -1.75);
      const pFootplate = new THREE.Vector3(-2.35, -0.25, -1.9);
      p.lerpVectors(pIncus, pFootplate, u);
      const arch = Math.sin(u * Math.PI) * 0.12 * (rand() > 0.5 ? 1 : -1);
      p.y += arch;
      p.add(new THREE.Vector3((rand() - 0.5) * 0.05, (rand() - 0.5) * 0.05, (rand() - 0.5) * 0.05));
    }

    const idx = (offset + i) * 3;
    positions[idx] = p.x;
    positions[idx + 1] = p.y;
    positions[idx + 2] = p.z;

    // Dense ivory bone coloration
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.94 + rand() * 0.04;
    colors[cIdx + 1] = 0.91 + rand() * 0.05;
    colors[cIdx + 2] = 0.78 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 2.4;
    kinetics[kIdx + 2] = 3.0; // ossicular mechanical lever chain
    kinetics[kIdx + 3] = sub;
  }
  offset += nOssicles;

  // 5. Cochlea Spiral (2.75 logarithmic conical turns)
  const cochleaCenter = new THREE.Vector3(-2.45, -0.35, -2.05);
  for (let i = 0; i < nCochlea; i++) {
    const t = rand(); // 0 at base (high frequency), 1 at apex (low frequency)
    const theta = t * (Math.PI * 2.0 * 2.75);
    const rSpiral = (1.0 - t * 0.65) * 0.55;
    const zCone = t * 0.45;
    const rCross = (1.0 - t * 0.5) * 0.16;
    const phi = rand() * Math.PI * 2.0;

    const cx = cochleaCenter.x + Math.cos(theta) * rSpiral;
    const cy = cochleaCenter.y + zCone;
    const cz = cochleaCenter.z + Math.sin(theta) * rSpiral;

    const x = cx + Math.cos(phi) * rCross;
    const y = cy + Math.sin(phi) * rCross;
    const z = cz + (rand() - 0.5) * 0.04;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Pearly amethyst to cyan tonotopic frequency gradient
    const cIdx = (offset + i) * 3;
    colors[cIdx] = THREE.MathUtils.lerp(0.85, 0.35, t);
    colors[cIdx + 1] = THREE.MathUtils.lerp(0.55, 0.75, t);
    colors[cIdx + 2] = THREE.MathUtils.lerp(0.95, 0.92, t);

    // Type 11: Traveling basilar membrane wave
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 2.0;
    kinetics[kIdx + 2] = 4.0; // cochlear traveling wave
    kinetics[kIdx + 3] = t; // spatial frequency tonotopy
  }
  offset += nCochlea;

  // 6. Semicircular Balance Canals (Superior, Posterior, Horizontal)
  const vestibuleCenter = new THREE.Vector3(-2.3, 0.15, -1.9);
  for (let i = 0; i < nCanals; i++) {
    const canalIdx = i % 3;
    const theta = rand() * Math.PI * 1.5 - 0.3; // 3/4 toroidal arc
    const rCanal = 0.48;
    const rTube = 0.06;
    const phi = rand() * Math.PI * 2.0;

    let localX = Math.cos(theta) * rCanal + Math.cos(phi) * rTube;
    let localY = Math.sin(theta) * rCanal + Math.sin(phi) * rTube;
    let localZ = (rand() - 0.5) * rTube * 1.5;

    let p = new THREE.Vector3();
    if (canalIdx === 0) {
      // Superior canal (vertical sagittal plane)
      p.set(vestibuleCenter.x + localZ, vestibuleCenter.y + localY, vestibuleCenter.z + localX);
    } else if (canalIdx === 1) {
      // Posterior canal (vertical coronal plane)
      p.set(vestibuleCenter.x + localX, vestibuleCenter.y + localY, vestibuleCenter.z + localZ);
    } else {
      // Lateral / horizontal canal (horizontal axial plane)
      p.set(vestibuleCenter.x + localX, vestibuleCenter.y + localZ, vestibuleCenter.z + localY);
    }

    const idx = (offset + i) * 3;
    positions[idx] = p.x;
    positions[idx + 1] = p.y;
    positions[idx + 2] = p.z;

    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.55 + rand() * 0.1;
    colors[cIdx + 1] = 0.72 + rand() * 0.1;
    colors[cIdx + 2] = 0.88 + rand() * 0.1;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 11.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 5.0; // endolymph fluid circulation
    kinetics[kIdx + 3] = canalIdx;
  }

  // Normalize center and scale to fit viewport [-3, 3]
  normalizeSpecimenBounds(positions, count, 2.7);

  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Human Ear & Cochlea',
    'SPECIMEN // 26-EAR',
    'Human acoustic audition apparatus displaying cartilaginous pinna, ear canal, vibrating tympanic membrane, ossicles, and 2.75-turn spiral cochlea.'
  );
}

// =========================================================================
// 27. HUMAN KNEE JOINT (Anatomy)
// Distal femur condyles, proximal tibia plateau, patella kneecap, ACL,
// PCL, medial & lateral crescent meniscus discs, fibula.
// =========================================================================
export function generateHumanKnee(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(202);

  const nFemur = 38000;
  const nTibia = 30000;
  const nPatella = 10000;
  const nMenisci = 12000;
  const nLigaments = count - (nFemur + nTibia + nPatella + nMenisci);

  let offset = 0;

  // 1. Distal Femur (Shaft and medial/lateral convex bicondylar runners)
  for (let i = 0; i < nFemur; i++) {
    const isCondyle = rand() < 0.65;
    let x = 0, y = 0, z = 0;

    if (isCondyle) {
      // Medial and Lateral Condyle lobes
      const isMedial = rand() > 0.5;
      const xSign = isMedial ? 1.0 : -1.0;
      const theta = rand() * Math.PI * 1.3 - 0.4; // wraps from trochlea to posterior
      const rCondyle = 0.85 + 0.15 * Math.sin(theta);
      const width = (rand() - 0.5) * 0.55;

      x = xSign * 0.85 + width;
      y = 0.4 - Math.sin(theta) * rCondyle;
      z = Math.cos(theta) * rCondyle * 1.1;
    } else {
      // Femoral shaft extending upwards
      const h = rand(); // 0 to 1
      const yShaft = 0.4 + h * 2.3;
      const rShaft = 0.55 - h * 0.15;
      const phi = rand() * Math.PI * 2.0;

      x = Math.cos(phi) * rShaft * 0.9;
      y = yShaft;
      z = Math.sin(phi) * rShaft * 0.9;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Bone ivory cream with glossy articular cartilage on condyle surfaces
    const cIdx = (offset + i) * 3;
    if (isCondyle && y < 0.1) {
      // Articular hyaline cartilage (smooth pearly white-blue)
      colors[cIdx] = 0.88 + rand() * 0.08;
      colors[cIdx + 1] = 0.92 + rand() * 0.08;
      colors[cIdx + 2] = 0.98;
    } else {
      colors[cIdx] = 0.94 + rand() * 0.05;
      colors[cIdx + 1] = 0.89 + rand() * 0.06;
      colors[cIdx + 2] = 0.78 + rand() * 0.06;
    }

    // Type 12: Knee flexion-extension kinematics (femur rotates and rolls)
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 12.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 1.0; // Femur body
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nFemur;

  // 2. Proximal Tibia & Fibula
  for (let i = 0; i < nTibia; i++) {
    const isPlateau = rand() < 0.55;
    let x = 0, y = 0, z = 0;

    if (isPlateau) {
      // Tibial plateau surface with intercondylar eminence (tibial spine)
      const u = (rand() - 0.5) * 2.2;
      const v = (rand() - 0.5) * 1.5;
      const rPlateau = Math.sqrt((u * 0.8) ** 2 + (v * 1.1) ** 2);
      if (rPlateau < 1.1) {
        x = u;
        // Central tibial spines poke up
        const isSpine = Math.abs(u) < 0.25 && Math.abs(v) < 0.3;
        y = -0.55 + (isSpine ? 0.32 * (1.0 - Math.abs(u) / 0.25) : 0.0) + (rand() - 0.5) * 0.08;
        z = v;
      } else {
        x = u * 0.8;
        y = -0.65;
        z = v * 0.8;
      }
    } else {
      // Tibial shaft descending downwards
      const h = rand();
      const yShaft = -0.65 - h * 2.2;
      const rShaft = 0.65 - h * 0.2;
      const phi = rand() * Math.PI * 2.0;
      // Triangular tibial cross section
      const tri = 1.0 + 0.25 * Math.cos(phi * 3.0);

      x = Math.cos(phi) * rShaft * tri;
      y = yShaft;
      z = Math.sin(phi) * rShaft * tri;

      // Small lateral fibula head
      if (rand() < 0.2) {
        x = -1.1 - rand() * 0.25;
        y = -0.7 - rand() * 1.8;
        z = -0.3 + (rand() - 0.5) * 0.25;
      }
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.93 + rand() * 0.05;
    colors[cIdx + 1] = 0.88 + rand() * 0.06;
    colors[cIdx + 2] = 0.77 + rand() * 0.06;

    // Tibia is ground reference
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 12.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 0.0; // stationary tibia
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nTibia;

  // 3. Patella (Kneecap sesamoid bone)
  for (let i = 0; i < nPatella; i++) {
    const u = (rand() - 0.5) * 2.0;
    const v = (rand() - 0.5) * 2.0;
    if (u * u + v * v < 1.0) {
      // Teardrop/shield shape with apex pointing down
      const x = u * 0.52;
      const y = 0.35 + v * 0.65 - (u * u) * 0.15;
      const z = 1.25 + (1.0 - (u * u + v * v)) * 0.28 + (rand() - 0.5) * 0.06;

      const idx = (offset + i) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      const cIdx = (offset + i) * 3;
      colors[cIdx] = 0.96 + rand() * 0.03;
      colors[cIdx + 1] = 0.90 + rand() * 0.05;
      colors[cIdx + 2] = 0.80 + rand() * 0.06;

      // Patella articulates over trochlea groove
      const kIdx = (offset + i) * 4;
      kinetics[kIdx] = 12.0;
      kinetics[kIdx + 1] = 1.0;
      kinetics[kIdx + 2] = 2.0; // Patella gliding
      kinetics[kIdx + 3] = 0.0;
    } else {
      i--;
    }
  }
  offset += nPatella;

  // 4. Medial & Lateral Meniscus Shock-Absorbing Crescent Discs
  for (let i = 0; i < nMenisci; i++) {
    const isMedial = i % 2 === 0;
    const xCenter = isMedial ? 0.75 : -0.75;
    // Crescent wedge angle
    const theta = rand() * Math.PI * 1.6 - 0.8;
    const rOuter = 0.52 + (rand() - 0.5) * 0.08;
    const rWedge = rand(); // wedge thicker at outer perimeter
    const r = rOuter - rWedge * 0.22;

    const x = xCenter + Math.cos(theta) * r * (isMedial ? 0.9 : 1.0);
    const y = -0.52 + (1.0 - rWedge) * 0.14 + (rand() - 0.5) * 0.04;
    const z = Math.sin(theta) * r;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Fibrocartilage dense turquoise-cyan
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.45 + rand() * 0.1;
    colors[cIdx + 1] = 0.82 + rand() * 0.1;
    colors[cIdx + 2] = 0.78 + rand() * 0.1;

    // Meniscus deforms under femoral compression
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 12.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 3.0; // Meniscus compliance
    kinetics[kIdx + 3] = isMedial ? 1.0 : 0.0;
  }
  offset += nMenisci;

  // 5. Cruciate & Collateral Ligaments (ACL, PCL, MCL, LCL)
  for (let i = 0; i < nLigaments; i++) {
    const ligType = i % 4;
    let p = new THREE.Vector3();

    if (ligType === 0) {
      // ACL: Anterior Cruciate Ligament (from anterior tibia to lateral femoral condyle)
      const t = rand();
      const pTib = new THREE.Vector3(0.08, -0.48, 0.25);
      const pFem = new THREE.Vector3(-0.55, 0.15, -0.32);
      p.lerpVectors(pTib, pFem, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.12, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.12));
    } else if (ligType === 1) {
      // PCL: Posterior Cruciate Ligament (from posterior tibia to medial femoral condyle)
      const t = rand();
      const pTib = new THREE.Vector3(-0.05, -0.55, -0.45);
      const pFem = new THREE.Vector3(0.48, 0.12, 0.08);
      p.lerpVectors(pTib, pFem, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.12, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.12));
    } else if (ligType === 2) {
      // MCL: Medial Collateral Ligament (broad medial strap)
      const t = rand();
      const pFem = new THREE.Vector3(1.25, 0.45, 0.0);
      const pTib = new THREE.Vector3(1.22, -0.95, 0.0);
      p.lerpVectors(pFem, pTib, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.28));
    } else {
      // LCL: Lateral Collateral Ligament (cord from lateral femur to fibula head)
      const t = rand();
      const pFem = new THREE.Vector3(-1.25, 0.42, -0.05);
      const pFib = new THREE.Vector3(-1.18, -0.85, -0.25);
      p.lerpVectors(pFem, pFib, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08));
    }

    const idx = (offset + i) * 3;
    positions[idx] = p.x;
    positions[idx + 1] = p.y;
    positions[idx + 2] = p.z;

    // Glistening white dense collagen fibers
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.95 + rand() * 0.05;
    colors[cIdx + 1] = 0.94 + rand() * 0.05;
    colors[cIdx + 2] = 0.92 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 12.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 4.0; // Ligament dynamic stretch
    kinetics[kIdx + 3] = ligType;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Human Synovial Knee Joint',
    'SPECIMEN // 27-KNEE',
    'Human bicondylar synovial joint featuring distal femur condyles, proximal tibia plateau, patella sesamoid kneecap, ACL, PCL, and shock-absorbing crescent menisci.'
  );
}

// =========================================================================
// 28. MITOCHONDRION (Biology)
// Outer lipid membrane, intermembrane space, inner folded cristae baffles,
// aqueous matrix with circular mtDNA plasmids and ATP synthase enzyme complexes.
// =========================================================================
export function generateMitochondrion(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(303);

  const nOuter = 35000;
  const nCristae = 40000;
  const nMatrix = 15000;
  const nATPSynthase = count - (nOuter + nCristae + nMatrix);

  let offset = 0;

  // 1. Outer Membrane (Elongated capsule / spheroid with lipid pores)
  for (let i = 0; i < nOuter; i++) {
    const u = rand() * Math.PI * 2.0;
    const v = (rand() - 0.5) * Math.PI; // -pi/2 to pi/2
    const cosV = Math.cos(v);

    // Pill capsule elongation along Z
    const rx = 1.25 + (rand() - 0.5) * 0.05;
    const ry = 1.05 + (rand() - 0.5) * 0.05;
    const rz = 2.4;

    const x = Math.cos(u) * cosV * rx;
    const y = Math.sin(u) * cosV * ry;
    const z = Math.sin(v) * rz;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Translucent lipid bilayer amber-ochre
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.88 + rand() * 0.08;
    colors[cIdx + 1] = 0.58 + rand() * 0.08;
    colors[cIdx + 2] = 0.35 + rand() * 0.08;

    // Type 13: Mitochondrial respiration breathing
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 13.0;
    kinetics[kIdx + 1] = 1.2;
    kinetics[kIdx + 2] = 0.0; // outer membrane
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nOuter;

  // 2. Inner Folded Cristae Baffles (Extensive transverse invaginations)
  for (let i = 0; i < nCristae; i++) {
    // 14 distinct transverse cristae shelves along Z
    const shelfIdx = Math.floor(rand() * 14);
    const zBase = -1.8 + (shelfIdx / 13) * 3.6;

    // Baffle sheet folds in XY
    const u = (rand() - 0.5) * 2.0; // transverse span
    const sign = (shelfIdx % 2 === 0) ? 1.0 : -1.0;
    const reach = 0.85 * (1.0 - Math.pow(zBase / 2.3, 2.0));

    const x = u * reach * 0.95;
    const y = sign * (0.35 + rand() * reach * 0.65) * 0.85;
    // Small undulating ripples on the membrane fold
    const ripple = Math.sin(x * 5.0) * 0.08;
    const z = zBase + ripple + (rand() - 0.5) * 0.08;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Energetic crimson-orange inner cristae membrane
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.95 + rand() * 0.05;
    colors[cIdx + 1] = 0.32 + rand() * 0.08;
    colors[cIdx + 2] = 0.38 + rand() * 0.08;

    // Type 13: Cristae proton gradient oscillation
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 13.0;
    kinetics[kIdx + 1] = 1.6;
    kinetics[kIdx + 2] = 1.0; // cristae fold
    kinetics[kIdx + 3] = shelfIdx;
  }
  offset += nCristae;

  // 3. Mitochondrial Matrix & Circular mtDNA Plasmids
  for (let i = 0; i < nMatrix; i++) {
    const isPlasmid = rand() < 0.25;
    let x = 0, y = 0, z = 0;

    if (isPlasmid) {
      // Circular looped mtDNA ring
      const ringIdx = Math.floor(rand() * 4);
      const ringZ = -1.2 + ringIdx * 0.8;
      const theta = rand() * Math.PI * 2.0;
      const rRing = 0.28 + (rand() - 0.5) * 0.04;

      x = Math.cos(theta) * rRing + 0.2;
      y = Math.sin(theta) * rRing - 0.1;
      z = ringZ + (rand() - 0.5) * 0.05;
    } else {
      // Aqueous matrix granules and ribosome granules
      const u = rand() * Math.PI * 2.0;
      const v = (rand() - 0.5) * Math.PI;
      const rad = Math.cbrt(rand()) * 0.75;
      x = Math.cos(u) * Math.cos(v) * rad * 0.9;
      y = Math.sin(u) * Math.cos(v) * rad * 0.7;
      z = (rand() - 0.5) * 3.2;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    const cIdx = (offset + i) * 3;
    if (isPlasmid) {
      // Bright lime-green mtDNA
      colors[cIdx] = 0.45 + rand() * 0.1;
      colors[cIdx + 1] = 0.95;
      colors[cIdx + 2] = 0.55 + rand() * 0.1;
    } else {
      // Warm golden matrix fluid
      colors[cIdx] = 0.78 + rand() * 0.08;
      colors[cIdx + 1] = 0.65 + rand() * 0.08;
      colors[cIdx + 2] = 0.35 + rand() * 0.08;
    }

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 13.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 2.0; // matrix circulation
    kinetics[kIdx + 3] = isPlasmid ? 1.0 : 0.0;
  }
  offset += nMatrix;

  // 4. ATP Synthase Molecular Rotors (Studded along cristae ridges)
  for (let i = 0; i < nATPSynthase; i++) {
    const rotorIdx = i % 24;
    const thetaRotor = (rotorIdx / 24) * Math.PI * 2.0;
    const zRotor = -1.6 + ((i * 7) % 15) * 0.22;

    // Mushroom F0/F1 complex protruding into matrix
    const isHead = rand() > 0.4;
    const dist = isHead ? 0.22 : 0.08;

    const x = Math.cos(thetaRotor) * 0.45 + (rand() - 0.5) * 0.04;
    const y = Math.sin(thetaRotor) * 0.45 + (rand() - 0.5) * 0.04;
    const z = zRotor + (rand() - 0.5) * 0.04;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Glowing cyan-electric blue catalytic complexes
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.35 + rand() * 0.1;
    colors[cIdx + 1] = 0.88 + rand() * 0.1;
    colors[cIdx + 2] = 0.95;

    // Fast turbine spinning of ATP synthase rotor
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 13.0;
    kinetics[kIdx + 1] = 3.5; // rapid rotary catalysis
    kinetics[kIdx + 2] = 3.0; // ATP synthase
    kinetics[kIdx + 3] = thetaRotor;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Cellular Mitochondrion',
    'SPECIMEN // 28-MITOCHONDRION',
    'Cellular powerhouse organelle showing outer lipid membrane, deep transverse cristae folds, aqueous matrix, circular mtDNA plasmids, and rotating ATP synthase rotors.'
  );
}

// =========================================================================
// 29. CORONAVIRUS VIRION (Biology)
// Lipid envelope sphere, matrix M-proteins, helical nucleocapsid RNA core,
// and 72 radially protruding trimeric S (spike) glycoprotein complexes.
// =========================================================================
export function generateCoronavirus(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(404);

  const nLipid = 35000;
  const nCoreRNA = 20000;
  const nSpikes = count - (nLipid + nCoreRNA); // 45,000 points for detailed spikes

  let offset = 0;

  // 1. Lipid Bilayer Envelope Membrane
  const rEnvelope = 1.35;
  for (let i = 0; i < nLipid; i++) {
    const u = rand() * Math.PI * 2.0;
    const v = Math.acos(2.0 * rand() - 1.0) - Math.PI / 2.0;
    const r = rEnvelope + (rand() - 0.5) * 0.12;

    const x = r * Math.cos(v) * Math.cos(u);
    const y = r * Math.cos(v) * Math.sin(u);
    const z = r * Math.sin(v);

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Slate slate-blue viral membrane
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.42 + rand() * 0.08;
    colors[cIdx + 1] = 0.55 + rand() * 0.08;
    colors[cIdx + 2] = 0.68 + rand() * 0.08;

    // Type 14: Viral membrane thermal pulsation
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 14.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 0.0; // envelope
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nLipid;

  // 2. Helical Ribonucleoprotein (RNP) Core RNA Genome
  for (let i = 0; i < nCoreRNA; i++) {
    // Dense chaotic spherical ball of continuous helical single-stranded RNA
    const theta = rand() * Math.PI * 40.0;
    const rCore = Math.cbrt(rand()) * 0.95;
    const phi = Math.acos(2.0 * rand() - 1.0);

    const x = rCore * Math.sin(phi) * Math.cos(theta);
    const y = rCore * Math.sin(phi) * Math.sin(theta);
    const z = rCore * Math.cos(phi);

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Glowing amber-orange positive-sense ssRNA
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.95 + rand() * 0.05;
    colors[cIdx + 1] = 0.62 + rand() * 0.08;
    colors[cIdx + 2] = 0.25 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 14.0;
    kinetics[kIdx + 1] = 1.5;
    kinetics[kIdx + 2] = 1.0; // RNA core pulsation
    kinetics[kIdx + 3] = rCore;
  }
  offset += nCoreRNA;

  // 3. Trimeric S Spike Glycoproteins (72 evenly distributed spikes around sphere)
  const numSpikes = 72;
  const spikeDirections: THREE.Vector3[] = [];
  const goldenRatio = (1.0 + Math.sqrt(5.0)) / 2.0;

  for (let s = 0; s < numSpikes; s++) {
    const theta = 2.0 * Math.PI * s / goldenRatio;
    const phi = Math.acos(1.0 - 2.0 * (s + 0.5) / numSpikes);
    spikeDirections.push(new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    ));
  }

  const pointsPerSpike = Math.floor(nSpikes / numSpikes);
  for (let s = 0; s < numSpikes; s++) {
    const dir = spikeDirections[s];
    // Create tangent frame for trimer petals
    const up = Math.abs(dir.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    const tangent = new THREE.Vector3().crossVectors(dir, up).normalize();
    const bitangent = new THREE.Vector3().crossVectors(dir, tangent).normalize();

    for (let j = 0; j < pointsPerSpike; j++) {
      const h = rand(); // 0 at membrane (r=1.35), 1 at crown tip (r=2.5)
      const rDistance = rEnvelope + h * 1.15;

      // Stem is thin, head flares out into 3 distinct petals (trimer)
      let flare = 0.08 + Math.pow(h, 2.5) * 0.32;
      const petalAngle = (Math.floor(rand() * 3) / 3) * Math.PI * 2.0 + (rand() - 0.5) * 0.6;
      const lateralDist = flare * Math.sqrt(rand());

      const xLat = Math.cos(petalAngle) * lateralDist;
      const yLat = Math.sin(petalAngle) * lateralDist;

      const p = dir.clone().multiplyScalar(rDistance)
        .add(tangent.clone().multiplyScalar(xLat))
        .add(bitangent.clone().multiplyScalar(yLat));

      const idx = (offset + s * pointsPerSpike + j) * 3;
      positions[idx] = p.x;
      positions[idx + 1] = p.y;
      positions[idx + 2] = p.z;

      // Vivid crimson to rose trimeric crown
      const cIdx = (offset + s * pointsPerSpike + j) * 3;
      colors[cIdx] = THREE.MathUtils.lerp(0.92, 0.98, h);
      colors[cIdx + 1] = THREE.MathUtils.lerp(0.35, 0.45, h);
      colors[cIdx + 2] = THREE.MathUtils.lerp(0.42, 0.55, h);

      // Type 14: Spike flexible hinge swaying
      const kIdx = (offset + s * pointsPerSpike + j) * 4;
      kinetics[kIdx] = 14.0;
      kinetics[kIdx + 1] = 1.8;
      kinetics[kIdx + 2] = 2.0; // Spike trimer
      kinetics[kIdx + 3] = h; // higher sway at tip
    }
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Coronavirus Virion',
    'SPECIMEN // 29-VIRUS',
    'Enveloped viral particle comprising lipid bilayer envelope, internal ribonucleoprotein RNA core, and 72 radially protruding trimeric spike glycoprotein complexes.'
  );
}

// =========================================================================
// 30. MICROPROCESSOR DIE (Engineering / Technology)
// Silicon die substrate, multi-core CPU clusters, L3 cache SRAM arrays,
// high-speed interconnect bus traces, and peripheral wire-bond pads.
// =========================================================================
export function generateMicroprocessor(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(505);

  const nSubstrate = 25000;
  const nCores = 35000;
  const nCache = 20000;
  const nBuses = count - (nSubstrate + nCores + nCache);

  let offset = 0;

  // 1. Silicon Die Substrate & Peripheral Wire Bond Pads
  for (let i = 0; i < nSubstrate; i++) {
    const isPerimeter = rand() < 0.35;
    let x = 0, y = 0, z = 0;

    if (isPerimeter) {
      // Golden wire bond contact pads along the outer 4 edges
      const edge = Math.floor(rand() * 4);
      const span = (rand() - 0.5) * 4.6;
      const padStep = Math.round(span / 0.25) * 0.25;

      if (edge === 0) { x = padStep; y = (rand() - 0.5) * 0.08; z = 2.35; }
      else if (edge === 1) { x = padStep; y = (rand() - 0.5) * 0.08; z = -2.35; }
      else if (edge === 2) { x = 2.35; y = (rand() - 0.5) * 0.08; z = padStep; }
      else { x = -2.35; y = (rand() - 0.5) * 0.08; z = padStep; }
    } else {
      // Silicon wafer planar surface
      x = (rand() - 0.5) * 4.8;
      y = -0.15 + (rand() - 0.5) * 0.06;
      z = (rand() - 0.5) * 4.8;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Dark silicon iridescent grey-blue with golden bond pads
    const cIdx = (offset + i) * 3;
    if (isPerimeter) {
      colors[cIdx] = 0.95;
      colors[cIdx + 1] = 0.82;
      colors[cIdx + 2] = 0.42;
    } else {
      colors[cIdx] = 0.25 + rand() * 0.06;
      colors[cIdx + 1] = 0.32 + rand() * 0.08;
      colors[cIdx + 2] = 0.42 + rand() * 0.1;
    }

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 15.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 0.0; // static substrate
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nSubstrate;

  // 2. 8 Performance & Efficiency CPU Cores (Orthogonal ALU, registers, execution units)
  for (let i = 0; i < nCores; i++) {
    // 2 rows of 4 cores
    const coreIdx = Math.floor(rand() * 8);
    const row = Math.floor(coreIdx / 4);
    const col = coreIdx % 4;

    const coreCenterX = -1.65 + col * 1.1;
    const coreCenterZ = row === 0 ? 1.0 : -1.0;

    // Grid logic within core
    const u = (rand() - 0.5) * 0.85;
    const v = (rand() - 0.5) * 0.85;
    // Quantized circuit grid lines
    const gridX = Math.round(u * 14.0) / 14.0;
    const gridZ = Math.round(v * 14.0) / 14.0;

    const x = coreCenterX + gridX + (rand() - 0.5) * 0.02;
    const y = 0.02 + rand() * 0.12;
    const z = coreCenterZ + gridZ + (rand() - 0.5) * 0.02;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Cyan logic gate circuits
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.28 + rand() * 0.1;
    colors[cIdx + 1] = 0.82 + rand() * 0.15;
    colors[cIdx + 2] = 0.95;

    // Type 15: High-speed clock signal binary switching
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 15.0;
    kinetics[kIdx + 1] = 4.0;
    kinetics[kIdx + 2] = 1.0; // CPU core execution
    kinetics[kIdx + 3] = coreIdx;
  }
  offset += nCores;

  // 3. Central L3 Cache Shared SRAM Memory Array
  for (let i = 0; i < nCache; i++) {
    // Dense central rectangular strip between core rows
    const u = (rand() - 0.5) * 3.6;
    const v = (rand() - 0.5) * 0.65;
    const qx = Math.round(u * 28.0) / 28.0;
    const qz = Math.round(v * 28.0) / 28.0;

    const x = qx + (rand() - 0.5) * 0.015;
    const y = 0.05 + rand() * 0.08;
    const z = qz + (rand() - 0.5) * 0.015;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Dense violet-purple SRAM memory array
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.65 + rand() * 0.1;
    colors[cIdx + 1] = 0.45 + rand() * 0.1;
    colors[cIdx + 2] = 0.92 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 15.0;
    kinetics[kIdx + 1] = 2.0;
    kinetics[kIdx + 2] = 2.0; // Cache bus
    kinetics[kIdx + 3] = qx;
  }
  offset += nCache;

  // 4. Ultra-dense Interconnect Metal Bus Lines & Clock Tree
  for (let i = 0; i < nBuses; i++) {
    const isHorizontal = rand() > 0.5;
    let x = 0, y = 0, z = 0;

    if (isHorizontal) {
      // Horizontal copper metal bus
      const busZ = Math.round((rand() - 0.5) * 4.4 / 0.35) * 0.35;
      x = (rand() - 0.5) * 4.6;
      y = 0.12 + rand() * 0.06;
      z = busZ + (rand() - 0.5) * 0.02;
    } else {
      // Vertical metal interconnect bus
      const busX = Math.round((rand() - 0.5) * 4.4 / 0.35) * 0.35;
      x = busX + (rand() - 0.5) * 0.02;
      y = 0.12 + rand() * 0.06;
      z = (rand() - 0.5) * 4.6;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Electric amber-copper data bus lines
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.98;
    colors[cIdx + 1] = 0.72 + rand() * 0.1;
    colors[cIdx + 2] = 0.35 + rand() * 0.1;

    // Type 15: Digital electron data packets racing along bus traces
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 15.0;
    kinetics[kIdx + 1] = 5.0; // high speed data packets
    kinetics[kIdx + 2] = 3.0; // data bus
    kinetics[kIdx + 3] = isHorizontal ? 1.0 : 0.0;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Microprocessor Silicon Die',
    'SPECIMEN // 30-MICROPROCESSOR',
    'Integrated semiconductor silicon chip featuring 8 multi-core CPU clusters, central shared L3 cache SRAM array, peripheral wire-bond pads, and clock bus traces.'
  );
}

// =========================================================================
// 31. PARTICLE COLLIDER DETECTOR (Physics / Engineering)
// Inspired by CERN ATLAS / CMS: central beam vacuum pipe, inner silicon
// pixel vertex detector, electromagnetic LAr calorimeter, hadronic tile
// calorimeter, giant outer muon spectrometer toroid wheels, and collision tracks.
// =========================================================================
export function generateParticleCollider(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(606);

  const nBeamPipe = 10000;
  const nTracker = 20000;
  const nCalorimeter = 30000;
  const nMuonToroid = 25000;
  const nCollisionTracks = count - (nBeamPipe + nTracker + nCalorimeter + nMuonToroid);

  let offset = 0;

  // 1. Central Ultra-High Vacuum Beam Pipe
  for (let i = 0; i < nBeamPipe; i++) {
    const z = (rand() - 0.5) * 5.0;
    const theta = rand() * Math.PI * 2.0;
    const r = 0.15 + (rand() - 0.5) * 0.03;

    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Shiny beryllium metallic silver
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.88 + rand() * 0.1;
    colors[cIdx + 1] = 0.90 + rand() * 0.1;
    colors[cIdx + 2] = 0.95;

    // Type 16: Counter-propagating relativistic proton bunches
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 16.0;
    kinetics[kIdx + 1] = 6.0;
    kinetics[kIdx + 2] = 0.0; // beam pipe bunches
    kinetics[kIdx + 3] = z > 0 ? 1.0 : -1.0;
  }
  offset += nBeamPipe;

  // 2. Inner Silicon Pixel & Microstrip Vertex Tracker
  for (let i = 0; i < nTracker; i++) {
    // 4 concentric nested cylindrical barrel layers
    const layer = Math.floor(rand() * 4);
    const rLayer = 0.35 + layer * 0.22;
    const z = (rand() - 0.5) * (1.8 + layer * 0.5);
    const theta = rand() * Math.PI * 2.0;

    const x = Math.cos(theta) * rLayer;
    const y = Math.sin(theta) * rLayer;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Emerald-green silicon microstrip sensors
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.25 + rand() * 0.08;
    colors[cIdx + 1] = 0.92 + rand() * 0.08;
    colors[cIdx + 2] = 0.65 + rand() * 0.1;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 16.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 1.0; // silicon tracker layer
    kinetics[kIdx + 3] = layer;
  }
  offset += nTracker;

  // 3. Electromagnetic (Liquid Argon) & Hadronic Brass Calorimeter
  for (let i = 0; i < nCalorimeter; i++) {
    const isHadronic = rand() > 0.45;
    const r = isHadronic ? (1.55 + rand() * 0.55) : (1.15 + rand() * 0.35);
    const z = (rand() - 0.5) * 3.8;
    // Octagonal / faceted calorimeter wedges (8 sectors)
    const sector = Math.floor(rand() * 16);
    const theta = (sector / 16) * Math.PI * 2.0 + (rand() - 0.5) * 0.15;

    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    const cIdx = (offset + i) * 3;
    if (isHadronic) {
      // Golden brass hadronic absorber tiles
      colors[cIdx] = 0.92 + rand() * 0.08;
      colors[cIdx + 1] = 0.72 + rand() * 0.08;
      colors[cIdx + 2] = 0.32 + rand() * 0.08;
    } else {
      // Electric azure liquid argon cryostat
      colors[cIdx] = 0.35 + rand() * 0.1;
      colors[cIdx + 1] = 0.65 + rand() * 0.15;
      colors[cIdx + 2] = 0.98;
    }

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 16.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 2.0; // Calorimeter static shell
    kinetics[kIdx + 3] = isHadronic ? 1.0 : 0.0;
  }
  offset += nCalorimeter;

  // 4. Outer Superconducting Muon Spectrometer Toroid Magnet Coils
  for (let i = 0; i < nMuonToroid; i++) {
    // 8 massive racetrack coils surrounding the detector barrel
    const coilIdx = Math.floor(rand() * 8);
    const coilAngle = (coilIdx / 8) * Math.PI * 2.0;
    const t = rand(); // racetrack loop parameter

    // Racetrack dimensions: radius from 2.2 to 2.8, z from -2.4 to 2.4
    const z = (rand() - 0.5) * 4.8;
    const r = 2.45 + (rand() - 0.5) * 0.35;
    const dAngle = (rand() - 0.5) * 0.1;

    const x = Math.cos(coilAngle + dAngle) * r;
    const y = Math.sin(coilAngle + dAngle) * r;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Industrial structural grey with cobalt superconducting conduits
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.45 + rand() * 0.1;
    colors[cIdx + 1] = 0.55 + rand() * 0.1;
    colors[cIdx + 2] = 0.75 + rand() * 0.15;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 16.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 3.0; // Toroid coils
    kinetics[kIdx + 3] = coilIdx;
  }
  offset += nMuonToroid;

  // 5. Relativistic High-Energy Particle Collision Event Tracks
  for (let i = 0; i < nCollisionTracks; i++) {
    // 24 distinct helical collision debris tracks spraying from origin
    const trackIdx = i % 24;
    const tTrack = rand(); // 0 at interaction point, 1 at outer muon chambers
    const seed = trackIdx * 137.5;
    const thetaTrack = (trackIdx / 24) * Math.PI * 2.0;
    const pitch = Math.sin(trackIdx * 2.4) * 1.5;

    // Helical curvature due to 2-Tesla solenoid magnetic field
    const r = tTrack * 2.6;
    const curve = thetaTrack + tTrack * (trackIdx % 2 === 0 ? 1.5 : -1.5);

    const x = Math.cos(curve) * r;
    const y = Math.sin(curve) * r;
    const z = pitch * tTrack * 2.2;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Luminous magenta-yellow relativistic particle rays
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.98;
    colors[cIdx + 1] = 0.35 + rand() * 0.45;
    colors[cIdx + 2] = 0.85 + rand() * 0.15;

    // Type 16: Collision event particle expansion
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 16.0;
    kinetics[kIdx + 1] = 4.5; // fast relativistic burst
    kinetics[kIdx + 2] = 4.0; // collision track spray
    kinetics[kIdx + 3] = tTrack;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Particle Collider Detector',
    'SPECIMEN // 31-COLLIDER',
    'High-energy collider cylindrical detector showcasing ultra-high vacuum beam pipe, silicon vertex tracker, liquid argon calorimeter, superconducting muon toroid coils, and collision tracks.'
  );
}

// =========================================================================
// 32. JAMES WEBB SPACE TELESCOPE (JWST) (Cosmos / Engineering)
// 18 hexagonal beryllium-gold mirror segments in primary honeycomb array,
// secondary mirror tripod spider, spacecraft bus, and 5-layer tennis-court
// sized diamond kite sunshield membrane.
// =========================================================================
export function generateJWST(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(707);

  const nMirrors = 36000;
  const nTripod = 12000;
  const nSunshield = 40000;
  const nBus = count - (nMirrors + nTripod + nSunshield);

  let offset = 0;

  // 1. 18 Hexagonal Primary Mirror Segments (Honeycomb grid)
  const hexRadius = 0.36;
  const hexDistance = hexRadius * Math.sqrt(3.0);
  const hexCenters: { x: number; y: number }[] = [];

  // Ring 1 (6 hexes)
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2.0;
    hexCenters.push({ x: Math.cos(a) * hexDistance, y: Math.sin(a) * hexDistance });
  }
  // Ring 2 (12 hexes)
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2.0;
    const d = (k % 2 === 0) ? hexDistance * 2.0 : hexDistance * Math.sqrt(3.0);
    hexCenters.push({ x: Math.cos(a) * d, y: Math.sin(a) * d });
  }

  const pointsPerHex = Math.floor(nMirrors / 18);
  for (let h = 0; h < 18; h++) {
    const center = hexCenters[h];
    for (let j = 0; j < pointsPerHex; j++) {
      // Sample inside regular hexagon
      const angle = rand() * Math.PI * 2.0;
      const r = Math.sqrt(rand()) * hexRadius * 0.95;

      const x = center.x + Math.cos(angle) * r;
      const y = center.y + Math.sin(angle) * r;
      // Concave parabolic mirror curvature
      const rTotal = Math.sqrt(x * x + y * y);
      const z = 0.65 - (rTotal * rTotal) * 0.08 + (rand() - 0.5) * 0.02;

      const idx = (offset + h * pointsPerHex + j) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // Pure vapor-deposited gold luster (98% IR reflectivity)
      const cIdx = (offset + h * pointsPerHex + j) * 3;
      colors[cIdx] = 0.98;
      colors[cIdx + 1] = 0.82 + rand() * 0.08;
      colors[cIdx + 2] = 0.22 + rand() * 0.06;

      // Type 17: Primary mirror segment micro-actuator positioning
      const kIdx = (offset + h * pointsPerHex + j) * 4;
      kinetics[kIdx] = 17.0;
      kinetics[kIdx + 1] = 1.0;
      kinetics[kIdx + 2] = 1.0; // mirror segments
      kinetics[kIdx + 3] = h;
    }
  }
  offset += nMirrors;

  // 2. Secondary Mirror & Tripod Support Struts
  const secondaryPos = new THREE.Vector3(0.0, 0.0, 2.45);
  for (let i = 0; i < nTripod; i++) {
    if (i < nTripod * 0.25) {
      // Circular secondary mirror disc
      const phi = rand() * Math.PI * 2.0;
      const r = Math.sqrt(rand()) * 0.24;
      const x = Math.cos(phi) * r;
      const y = Math.sin(phi) * r;
      const z = secondaryPos.z + (rand() - 0.5) * 0.04;

      const idx = (offset + i) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      const cIdx = (offset + i) * 3;
      colors[cIdx] = 0.98;
      colors[cIdx + 1] = 0.84;
      colors[cIdx + 2] = 0.24;
    } else {
      // 3 Carbon fiber tubular tripod struts
      const strutIdx = i % 3;
      const strutAngle = (strutIdx / 3) * Math.PI * 2.0 + Math.PI / 6.0;
      const basePos = new THREE.Vector3(
        Math.cos(strutAngle) * 1.6,
        Math.sin(strutAngle) * 1.6,
        0.55
      );
      const t = rand();
      const p = new THREE.Vector3().lerpVectors(basePos, secondaryPos, t);
      p.add(new THREE.Vector3((rand() - 0.5) * 0.04, (rand() - 0.5) * 0.04, (rand() - 0.5) * 0.04));

      const idx = (offset + i) * 3;
      positions[idx] = p.x;
      positions[idx + 1] = p.y;
      positions[idx + 2] = p.z;

      // Matte black carbon-fiber composite
      const cIdx = (offset + i) * 3;
      colors[cIdx] = 0.22 + rand() * 0.06;
      colors[cIdx + 1] = 0.24 + rand() * 0.06;
      colors[cIdx + 2] = 0.28 + rand() * 0.06;
    }

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 17.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 2.0; // tripod struts
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nTripod;

  // 3. Five-Layer Diamond Sunshield Membrane (Kapton polyimide)
  for (let i = 0; i < nSunshield; i++) {
    const layer = Math.floor(rand() * 5); // 5 distinct heat shield layers
    const zLayer = -0.15 - layer * 0.12;

    // Diamond kite perimeter
    const u = (rand() - 0.5) * 2.0; // longitudinal axis
    const v = (rand() - 0.5) * 2.0; // transverse axis

    // Diamond shape equation: |u| / a + |v| / b <= 1
    const a = 1.6; // half-width
    const b = 2.4; // half-length
    if (Math.abs(u) + Math.abs(v) <= 1.0) {
      const x = u * a;
      const y = v * b;
      // Slight catenary sag between support booms
      const sag = Math.sin((u + 1.0) * Math.PI * 0.5) * 0.06;
      const z = zLayer + sag + (rand() - 0.5) * 0.03;

      const idx = (offset + i) * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      // Silvered aluminum on cold side, distinctive Kapton purple/pink on warm side
      const cIdx = (offset + i) * 3;
      if (layer === 4) {
        // Sun-facing bottom Kapton (warm silicon-doped purple/pink)
        colors[cIdx] = 0.78 + rand() * 0.1;
        colors[cIdx + 1] = 0.45 + rand() * 0.1;
        colors[cIdx + 2] = 0.65 + rand() * 0.1;
      } else {
        // Space-facing top layers (reflective silver-aluminum)
        colors[cIdx] = 0.85 + rand() * 0.1;
        colors[cIdx + 1] = 0.88 + rand() * 0.1;
        colors[cIdx + 2] = 0.94;
      }

      // Type 17: Sunshield membrane thermal ripple & solar photon pressure
      const kIdx = (offset + i) * 4;
      kinetics[kIdx] = 17.0;
      kinetics[kIdx + 1] = 1.0;
      kinetics[kIdx + 2] = 3.0; // sunshield layer
      kinetics[kIdx + 3] = layer;
    } else {
      i--;
    }
  }
  offset += nSunshield;

  // 4. Spacecraft Bus & Solar Array (Bottom sunward side)
  for (let i = 0; i < nBus; i++) {
    const isSolar = rand() < 0.4;
    let x = 0, y = 0, z = 0;

    if (isSolar) {
      // Tilted solar array wing extending along Y
      x = (rand() - 0.5) * 0.75;
      y = -2.1 - rand() * 1.0;
      z = -0.7 + (rand() - 0.5) * 0.15;
    } else {
      // Spacecraft equipment bus box
      x = (rand() - 0.5) * 0.95;
      y = (rand() - 0.5) * 0.95;
      z = -0.65 - rand() * 0.45;
    }

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    const cIdx = (offset + i) * 3;
    if (isSolar) {
      // Dark photovoltaic indigo blue
      colors[cIdx] = 0.22 + rand() * 0.08;
      colors[cIdx + 1] = 0.35 + rand() * 0.08;
      colors[cIdx + 2] = 0.75 + rand() * 0.15;
    } else {
      // Golden multi-layer insulation (MLI) thermal foil
      colors[cIdx] = 0.95;
      colors[cIdx + 1] = 0.78 + rand() * 0.08;
      colors[cIdx + 2] = 0.32 + rand() * 0.08;
    }

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 17.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 4.0; // spacecraft bus
    kinetics[kIdx + 3] = isSolar ? 1.0 : 0.0;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'James Webb Space Telescope',
    'SPECIMEN // 32-JWST',
    'Infrared space observatory displaying 18 hexagonal beryllium-gold primary mirror segments, secondary tripod, 5-layer diamond Kapton sunshield, and spacecraft bus.'
  );
}

// =========================================================================
// 33. EARTH MAGNETOSPHERE & VAN ALLEN BELTS (Cosmos / Physics)
// Central geomagnetic Earth, closed dipolar magnetic field line loops,
// supersonic solar wind bow shock front, magnetopause cavity, and trapped
// radiation belts.
// =========================================================================
export function generateEarthMagnetosphere(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(808);

  const nEarth = 12000;
  const nBelts = 28000;
  const nDipoleLoops = 35000;
  const nBowShock = count - (nEarth + nBelts + nDipoleLoops);

  let offset = 0;

  // 1. Central Terrestrial Earth
  const rEarth = 0.55;
  for (let i = 0; i < nEarth; i++) {
    const u = rand() * Math.PI * 2.0;
    const v = Math.acos(2.0 * rand() - 1.0) - Math.PI / 2.0;

    const x = rEarth * Math.cos(v) * Math.cos(u);
    const y = rEarth * Math.sin(v);
    const z = rEarth * Math.cos(v) * Math.sin(u);

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Ocean blue and terrestrial continent green
    const isContinent = Math.sin(u * 3.0) * Math.cos(v * 4.0) > 0.15;
    const cIdx = (offset + i) * 3;
    if (isContinent) {
      colors[cIdx] = 0.32 + rand() * 0.08;
      colors[cIdx + 1] = 0.75 + rand() * 0.1;
      colors[cIdx + 2] = 0.42 + rand() * 0.08;
    } else {
      colors[cIdx] = 0.22 + rand() * 0.08;
      colors[cIdx + 1] = 0.48 + rand() * 0.1;
      colors[cIdx + 2] = 0.88 + rand() * 0.1;
    }

    // Earth axial rotation
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 18.0;
    kinetics[kIdx + 1] = 1.0;
    kinetics[kIdx + 2] = 0.0; // Earth globe
    kinetics[kIdx + 3] = 0.0;
  }
  offset += nEarth;

  // 2. Van Allen Radiation Belts (Inner proton and outer electron toroids)
  for (let i = 0; i < nBelts; i++) {
    const isOuter = rand() > 0.4;
    const rTorus = isOuter ? 1.65 : 1.05;
    const rTube = isOuter ? 0.35 : 0.22;

    const theta = rand() * Math.PI * 2.0;
    const phi = rand() * Math.PI * 2.0;

    // Compressed on sunward (+X) side, extended on magnetotail (-X) side
    const stretch = 1.0 - 0.25 * Math.cos(theta);

    const x = (rTorus * stretch + Math.cos(phi) * rTube) * Math.cos(theta);
    const y = Math.sin(phi) * rTube * 0.75;
    const z = (rTorus * stretch + Math.cos(phi) * rTube) * Math.sin(theta);

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Energetic ultraviolet to electric cyan radiation belts
    const cIdx = (offset + i) * 3;
    if (isOuter) {
      colors[cIdx] = 0.35 + rand() * 0.1;
      colors[cIdx + 1] = 0.72 + rand() * 0.15;
      colors[cIdx + 2] = 0.98;
    } else {
      colors[cIdx] = 0.88 + rand() * 0.1;
      colors[cIdx + 1] = 0.38 + rand() * 0.1;
      colors[cIdx + 2] = 0.95;
    }

    // Type 18: Charged particle relativistic cyclotron drift
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 18.0;
    kinetics[kIdx + 1] = 2.5;
    kinetics[kIdx + 2] = 1.0; // Van Allen belt
    kinetics[kIdx + 3] = isOuter ? 1.0 : 0.0;
  }
  offset += nBelts;

  // 3. Dipolar Magnetic Field Lines (Arching from South to North magnetic poles)
  for (let i = 0; i < nDipoleLoops; i++) {
    // Dipole parameter equation: r = L * cos^2(lat)
    const L = 1.1 + rand() * 1.8; // L-shell shell parameter
    const lat = (rand() - 0.5) * Math.PI * 0.85; // latitude
    const azimuth = rand() * Math.PI * 2.0;

    const r = L * Math.pow(Math.cos(lat), 2.0);
    // Solar wind compression on +X
    const rDistorted = r * (1.0 - 0.35 * Math.cos(azimuth));

    const x = rDistorted * Math.cos(lat) * Math.cos(azimuth);
    const y = rDistorted * Math.sin(lat);
    const z = rDistorted * Math.cos(lat) * Math.sin(azimuth);

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Ethereal auroral green field lines
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.35 + rand() * 0.1;
    colors[cIdx + 1] = 0.92 + rand() * 0.08;
    colors[cIdx + 2] = 0.65 + rand() * 0.1;

    // Type 18: Helical particle motion streaming down to auroral ovals
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 18.0;
    kinetics[kIdx + 1] = 2.0;
    kinetics[kIdx + 2] = 2.0; // field line flow
    kinetics[kIdx + 3] = lat;
  }
  offset += nDipoleLoops;

  // 4. Supersonic Solar Wind Bow Shock Front & Magnetopause
  for (let i = 0; i < nBowShock; i++) {
    // Parabolic bow shock facing incoming solar wind (+X)
    const u = rand() * 2.8; // distance along parabola
    const phi = rand() * Math.PI * 2.0;

    const xStandOff = 2.2;
    const x = xStandOff - Math.pow(u, 1.8) * 0.45;
    const rParabola = u * 1.25 + 0.5;

    const y = Math.cos(phi) * rParabola;
    const z = Math.sin(phi) * rParabola;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Incandescent solar wind golden plasma
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.98;
    colors[cIdx + 1] = 0.78 + rand() * 0.12;
    colors[cIdx + 2] = 0.35 + rand() * 0.1;

    // Type 18: Hypersonic solar wind plasma deflection around bow shock
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 18.0;
    kinetics[kIdx + 1] = 3.5;
    kinetics[kIdx + 2] = 3.0; // solar wind stream
    kinetics[kIdx + 3] = u;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Earth Magnetosphere',
    'SPECIMEN // 33-MAGNETOSPHERE',
    'Terrestrial planetary geomagnetic shield exhibiting dipole field line arches, inner and outer Van Allen radiation belts, and supersonic solar wind bow shock front.'
  );
}

// =========================================================================
// 34. ATMOSPHERIC TORNADO (Physics / Earth Science)
// Mesocyclone wall cloud, rotating condensation funnel, central low-pressure
// core with vertical updraft, ground debris ring vortex, and helical inflow bands.
// =========================================================================
export function generateAtmosphericTornado(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(909);

  const nFunnel = 50000;
  const nWallCloud = 25000;
  const nDebrisRing = 15000;
  const nInflow = count - (nFunnel + nWallCloud + nDebrisRing);

  let offset = 0;

  // 1. Condensation Funnel (Hyperbolic funnel narrowing from cloud base to ground)
  for (let i = 0; i < nFunnel; i++) {
    const t = rand(); // 0 at ground (y = -2.2), 1 at cloud base (y = 1.4)
    const y = -2.2 + t * 3.6;

    // Hyperbolic radius expansion with height
    const rBase = 0.28 + Math.pow(t, 2.2) * 1.65;
    const thickness = 0.12 + t * 0.25;
    const r = rBase + (rand() - 0.5) * thickness;

    // Logarithmic spiral angle
    const theta = rand() * Math.PI * 2.0;

    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Deep stormy slate charcoal to misty condensation silver
    const cIdx = (offset + i) * 3;
    const shade = THREE.MathUtils.lerp(0.35, 0.72, t) + (rand() - 0.5) * 0.08;
    colors[cIdx] = shade * 0.95;
    colors[cIdx + 1] = shade * 0.98;
    colors[cIdx + 2] = shade * 1.05;

    // Type 19: High-speed cyclonic Rankine vortex rotation with vertical updraft
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 19.0;
    kinetics[kIdx + 1] = 4.2; // intense vortex spin
    kinetics[kIdx + 2] = 0.0; // funnel wall
    kinetics[kIdx + 3] = t; // height parameter
  }
  offset += nFunnel;

  // 2. Rotating Mesocyclone Wall Cloud (Upper broad supercell base)
  for (let i = 0; i < nWallCloud; i++) {
    const rCloud = 1.6 + Math.sqrt(rand()) * 1.6;
    const theta = rand() * Math.PI * 2.0;
    const y = 1.4 + rand() * 0.9 + Math.sin(rCloud * 2.0) * 0.15;

    const x = Math.cos(theta) * rCloud;
    const z = Math.sin(theta) * rCloud;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Dark ominous supercell slate blue
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.32 + rand() * 0.08;
    colors[cIdx + 1] = 0.36 + rand() * 0.08;
    colors[cIdx + 2] = 0.44 + rand() * 0.1;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 19.0;
    kinetics[kIdx + 1] = 1.4; // slower mesocyclone rotation
    kinetics[kIdx + 2] = 1.0; // wall cloud
    kinetics[kIdx + 3] = rCloud;
  }
  offset += nWallCloud;

  // 3. Ground Debris Ball & Violent Turbulent Surface Vortex
  for (let i = 0; i < nDebrisRing; i++) {
    const rDebris = 0.25 + rand() * 1.1;
    const theta = rand() * Math.PI * 2.0;
    const y = -2.2 + rand() * 0.65;

    const x = Math.cos(theta) * rDebris;
    const z = Math.sin(theta) * rDebris;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Earthy pulverized terra-cotta soil and dark dust
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.65 + rand() * 0.15;
    colors[cIdx + 1] = 0.48 + rand() * 0.12;
    colors[cIdx + 2] = 0.38 + rand() * 0.1;

    // Type 19: Violent ground surface suction vortex
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 19.0;
    kinetics[kIdx + 1] = 5.0; // extreme ground wind shear
    kinetics[kIdx + 2] = 2.0; // debris ball
    kinetics[kIdx + 3] = rDebris;
  }
  offset += nDebrisRing;

  // 4. Helical Inflow Feeder Bands (Warm moist air spiraling inwards)
  for (let i = 0; i < nInflow; i++) {
    const band = i % 3;
    const t = rand();
    const theta = t * Math.PI * 3.5 + (band * Math.PI * 2.0 / 3.0);
    const rInflow = 3.2 * (1.0 - t * 0.75);
    const y = -2.0 + t * 2.5;

    const x = Math.cos(theta) * rInflow + (rand() - 0.5) * 0.15;
    const z = Math.sin(theta) * rInflow + (rand() - 0.5) * 0.15;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Misty bluish moisture feeder bands
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.55 + rand() * 0.1;
    colors[cIdx + 1] = 0.65 + rand() * 0.1;
    colors[cIdx + 2] = 0.78 + rand() * 0.12;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 19.0;
    kinetics[kIdx + 1] = 3.0;
    kinetics[kIdx + 2] = 3.0; // inflow spiral
    kinetics[kIdx + 3] = t;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Atmospheric Tornado',
    'SPECIMEN // 34-TORNADO',
    'Severe convective cyclonic vortex showing upper rotating supercell wall cloud, condensation funnel, low-pressure core updraft, ground debris ring, and spiral inflow bands.'
  );
}

// =========================================================================
// 35. BIRD WING & FEATHER AERODYNAMICS (Zoology / Engineering)
// Avian skeletal articulation (humerus, radius, ulna, carpometacarpus, alula),
// primary flight remiges, secondary remiges, and overlapping coverts.
// =========================================================================
export function generateBirdWing(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(1010);

  const nBones = 18000;
  const nPrimaries = 38000;
  const nSecondaries = 24000;
  const nCoverts = count - (nBones + nPrimaries + nSecondaries);

  let offset = 0;

  // Joint landmarks (Wing spans along X axis)
  const shoulder = new THREE.Vector3(-2.2, 0.0, 0.0);
  const elbow = new THREE.Vector3(-0.9, 0.45, 0.25);
  const wrist = new THREE.Vector3(0.5, 0.35, -0.15);
  const wingtip = new THREE.Vector3(2.4, 0.1, -0.65);

  // 1. Avian Wing Skeleton (Humerus, Radius & Ulna, Carpometacarpus, Alula)
  for (let i = 0; i < nBones; i++) {
    const sub = i / nBones;
    let p = new THREE.Vector3();
    let rBone = 0.12;

    if (sub < 0.35) {
      // Humerus (shoulder to elbow)
      const t = rand();
      p.lerpVectors(shoulder, elbow, t);
      rBone = 0.14 - t * 0.03;
    } else if (sub < 0.75) {
      // Radius & Ulna forearm (elbow to wrist)
      const t = rand();
      const isUlna = rand() > 0.5;
      const offsetVec = new THREE.Vector3(0, (isUlna ? -0.08 : 0.08), 0);
      p.lerpVectors(elbow, wrist, t).add(offsetVec);
      rBone = 0.09;
    } else {
      // Hand bones: carpometacarpus and phalanges to wingtip
      const t = rand();
      p.lerpVectors(wrist, wingtip, t);
      rBone = 0.07 - t * 0.03;
    }

    const phi = rand() * Math.PI * 2.0;
    const r = Math.sqrt(rand()) * rBone;
    p.y += Math.sin(phi) * r;
    p.z += Math.cos(phi) * r;

    const idx = (offset + i) * 3;
    positions[idx] = p.x;
    positions[idx + 1] = p.y;
    positions[idx + 2] = p.z;

    // Bone ivory cream
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.94 + rand() * 0.05;
    colors[cIdx + 1] = 0.90 + rand() * 0.05;
    colors[cIdx + 2] = 0.80 + rand() * 0.08;

    // Type 20: Aerodynamic wing stroke articulation kinematics
    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 20.0;
    kinetics[kIdx + 1] = 1.4; // flapping wing stroke
    kinetics[kIdx + 2] = 0.0; // skeletal core
    kinetics[kIdx + 3] = p.x; // spanwise coordinate
  }
  offset += nBones;

  // 2. Primary Flight Remiges (10 long, stiff slotted feathers attached to hand)
  const numPrimaries = 10;
  const ptsPerPrimary = Math.floor(nPrimaries / numPrimaries);

  for (let f = 0; f < numPrimaries; f++) {
    const tOrigin = f / (numPrimaries - 1);
    const origin = new THREE.Vector3().lerpVectors(wrist, wingtip, tOrigin);

    // Primary feather shaft direction (swept back and outwards)
    const featherLen = 1.35 + (1.0 - Math.abs(tOrigin - 0.6)) * 0.55;
    const sweepAngle = -0.7 - tOrigin * 0.45;
    const featherDir = new THREE.Vector3(
      Math.sin(sweepAngle) * 0.45 + 0.25,
      -0.25 * (1.0 - tOrigin),
      -Math.cos(sweepAngle)
    ).normalize();

    for (let j = 0; j < ptsPerPrimary; j++) {
      const h = rand(); // distance along feather shaft (0 at calamus, 1 at tip)
      const shaftPos = origin.clone().add(featherDir.clone().multiplyScalar(h * featherLen));

      // Asymmetric vane (inner vane wider than outer vane for aerodynamic stability)
      const isInnerVane = rand() > 0.35;
      const vaneWidth = (isInnerVane ? 0.22 : 0.09) * Math.sin(h * Math.PI);
      const vaneAngle = (rand() - 0.5) * vaneWidth;

      const p = shaftPos.clone();
      p.x += vaneAngle;
      // Slight aerodynamic camber
      p.y += -Math.pow(vaneAngle / 0.22, 2.0) * 0.05;
      p.z += (rand() - 0.5) * 0.02;

      const idx = (offset + f * ptsPerPrimary + j) * 3;
      positions[idx] = p.x;
      positions[idx + 1] = p.y;
      positions[idx + 2] = p.z;

      // Deep falcon charcoal with iridescent slate tips
      const cIdx = (offset + f * ptsPerPrimary + j) * 3;
      colors[cIdx] = THREE.MathUtils.lerp(0.25, 0.45, h) + rand() * 0.05;
      colors[cIdx + 1] = THREE.MathUtils.lerp(0.30, 0.52, h) + rand() * 0.05;
      colors[cIdx + 2] = THREE.MathUtils.lerp(0.40, 0.65, h) + rand() * 0.08;

      // Type 20: Aerodynamic feather blade bending & lift torsion
      const kIdx = (offset + f * ptsPerPrimary + j) * 4;
      kinetics[kIdx] = 20.0;
      kinetics[kIdx + 1] = 1.4;
      kinetics[kIdx + 2] = 1.0; // primary remex
      kinetics[kIdx + 3] = h; // tip flexes most
    }
  }
  offset += nPrimaries;

  // 3. Secondary Flight Remiges (Attached to ulna forearm)
  const numSecondaries = 14;
  const ptsPerSecondary = Math.floor(nSecondaries / numSecondaries);

  for (let f = 0; f < numSecondaries; f++) {
    const tOrigin = f / (numSecondaries - 1);
    const origin = new THREE.Vector3().lerpVectors(elbow, wrist, tOrigin);
    const featherLen = 1.05 + 0.25 * Math.sin(tOrigin * Math.PI);
    const featherDir = new THREE.Vector3(0.05, -0.15, -1.0).normalize();

    for (let j = 0; j < ptsPerSecondary; j++) {
      const h = rand();
      const p = origin.clone().add(featherDir.clone().multiplyScalar(h * featherLen));
      const vaneWidth = 0.16 * Math.sin(h * Math.PI);
      p.x += (rand() - 0.5) * vaneWidth;
      p.y += (rand() - 0.5) * 0.03;

      const idx = (offset + f * ptsPerSecondary + j) * 3;
      positions[idx] = p.x;
      positions[idx + 1] = p.y;
      positions[idx + 2] = p.z;

      const cIdx = (offset + f * ptsPerSecondary + j) * 3;
      colors[cIdx] = 0.38 + rand() * 0.08;
      colors[cIdx + 1] = 0.42 + rand() * 0.08;
      colors[cIdx + 2] = 0.52 + rand() * 0.1;

      const kIdx = (offset + f * ptsPerSecondary + j) * 4;
      kinetics[kIdx] = 20.0;
      kinetics[kIdx + 1] = 1.4;
      kinetics[kIdx + 2] = 2.0; // secondary remex
      kinetics[kIdx + 3] = h;
    }
  }
  offset += nSecondaries;

  // 4. Overlapping Wing Coverts & Alula (Bastard wing)
  for (let i = 0; i < nCoverts; i++) {
    // Smooth aerodynamic camber covering forearm and upper wing
    const u = rand(); // spanwise 0 (shoulder) to 1 (wrist)
    const v = rand(); // chordwise
    const origin = new THREE.Vector3().lerpVectors(shoulder, wrist, u);

    const x = origin.x + (rand() - 0.5) * 0.15;
    const y = origin.y - v * 0.45 + (rand() - 0.5) * 0.04;
    const z = origin.z - v * 0.65 + (rand() - 0.5) * 0.04;

    const idx = (offset + i) * 3;
    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;

    // Warm plumage golden-buff and chestnut
    const cIdx = (offset + i) * 3;
    colors[cIdx] = 0.75 + rand() * 0.12;
    colors[cIdx + 1] = 0.58 + rand() * 0.1;
    colors[cIdx + 2] = 0.42 + rand() * 0.08;

    const kIdx = (offset + i) * 4;
    kinetics[kIdx] = 20.0;
    kinetics[kIdx + 1] = 1.4;
    kinetics[kIdx + 2] = 3.0; // covert feathers
    kinetics[kIdx + 3] = u;
  }

  normalizeSpecimenBounds(positions, count, 2.7);
  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Avian Wing & Aerodynamics',
    'SPECIMEN // 35-WING',
    'Aerodynamic avian flight apparatus exhibiting skeletal articulation (humerus, radius, ulna, manus), 10 slotted primary flight feathers, secondary remiges, and aerodynamic coverts.'
  );
}

// =========================================================================
// Normalization utility helper
// =========================================================================
function normalizeSpecimenBounds(positions: Float32Array, count: number, targetRadius: number) {
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

  for (let i = 0; i < count; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;

  let maxDist = 0;
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3] - cx;
    const y = positions[i * 3 + 1] - cy;
    const z = positions[i * 3 + 2] - cz;
    const d = Math.sqrt(x * x + y * y + z * z);
    if (d > maxDist) maxDist = d;
  }

  if (maxDist > 0.0001) {
    const scale = targetRadius / maxDist;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (positions[i * 3] - cx) * scale;
      positions[i * 3 + 1] = (positions[i * 3 + 1] - cy) * scale;
      positions[i * 3 + 2] = (positions[i * 3 + 2] - cz) * scale;
    }
  }
}

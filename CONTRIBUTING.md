# Contributing to Particle Specimen Atlas

Thank you for your interest in contributing to the Particle Specimen Atlas. This project is maintained as an open source educational resource and 3D scientific visualization tool. We welcome contributions of new procedural specimens, physics kinematic formulas, educational annotations, performance optimizations, and bug fixes.

---

## Code of Conduct & Core Principles

1. **Deterministic & Zero-Dependency:** All procedural specimens must generate points purely mathematically in code using deterministic pseudo-random generators. Do not introduce dependencies on external 3D file formats (e.g., glTF, OBJ) for core catalog entries.
2. **GPU Performance First:** Point clouds contain 100,000 vertices per specimen. Do not update or mutate large typed arrays on the CPU per frame. Physical animations must be evaluated analytically in the GPU vertex shader (`src/shaders/particleShaders.ts`).
3. **Factual Educational Integrity:** All anatomical, biological, physical, and mechanical descriptions must be scientifically accurate. Avoid vague conversational phrasing or generic marketing language.
4. **Editorial Standard:** Do not use em dashes anywhere in user-facing copy, code comments, or documentation. Use colons, parentheses, commas, or hyphens instead.

---

## How to Add a New Specimen

Adding a new specimen to the atlas involves four distinct steps:

### 1. Write the Procedural Generator Function

Create your generator in `src/generators/` (e.g., `proceduralGeometriesAdvanced.ts`). Your function must return a `ParticleCloudData` object containing:
- `positions`: `Float32Array(100_000 * 3)` in normalized space roughly within $[-2.7, 2.7]$
- `colors`: `Float32Array(100_000 * 3)` with RGB values in range $[0.0, 1.0]$
- `kinetics`: `Float32Array(100_000 * 4)` encoding `vec4(type, speed, param1, param2)`
- `delays`: `Float32Array(100_000)` transition delay values in range $[0.0, 1.0]$
- `scales`: `Float32Array(100_000)` point size multipliers in range $[0.5, 1.5]$
- `name`: Human-readable specimen title (e.g., `'Synovial Knee Joint'`)
- `catalogId`: Specimen serial string (e.g., `'SPECIMEN // 27-KNEE'`)
- `description`: A concise single-sentence summary of the structure
- `dimensions`: Object `{ x, y, z }` indicating the approximate bounding box scale

#### Template Generator Pattern

```typescript
import * as THREE from 'three';
import { ParticleCloudData } from './proceduralGeometries';

const POINT_COUNT = 100_000;

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2d679f);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateCustomSpecimen(count = POINT_COUNT): ParticleCloudData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const kinetics = new Float32Array(count * 4);
  const rand = mulberry32(12345);

  for (let i = 0; i < count; i++) {
    // 1. Calculate structural coordinates
    positions[i * 3] = (rand() - 0.5) * 4.0;
    positions[i * 3 + 1] = (rand() - 0.5) * 4.0;
    positions[i * 3 + 2] = (rand() - 0.5) * 4.0;

    // 2. Assign authentic RGB colors
    colors[i * 3] = 0.85;
    colors[i * 3 + 1] = 0.65;
    colors[i * 3 + 2] = 0.45;

    // 3. Assign kinematic parameters
    kinetics[i * 4] = 1.0; // motion type index
    kinetics[i * 4 + 1] = 1.2; // motion speed multiplier
    kinetics[i * 4 + 2] = 0.0; // component id or parameter 1
    kinetics[i * 4 + 3] = 0.0; // parameter 2
  }

  // Helper utility scales point cloud to fit standard viewport bounds
  normalizeSpecimenBounds(positions, count, 2.7);

  return finalizeParticleCloudData(
    positions,
    colors,
    kinetics,
    count,
    'Custom Specimen Name',
    'SPECIMEN // 36-CUSTOM',
    'Factual description of the specimen structure and function.'
  );
}
```

### 2. Implement or Assign GPU Vertex Kinematics

If your specimen requires unique physical motion, add a branch to `applyKinematicMotion` in `src/shaders/particleShaders.ts`:

```glsl
else if (type < 21.5) {
  // Type 21: Custom closed-form physical mechanics
  vec3 p = pos;
  float angle = time * speed;
  p.x += sin(angle) * 0.15;
  return p;
}
```

Ensure all float literals include decimal points (e.g., `1.0`, `0.0`) to avoid WebGL precision compilation errors across Safari and mobile devices.

### 3. Register the Specimen in the UI & Educational Database

1. **Specimen Identifier:** Add your shape ID to the `ShapeId` union in `src/components/SpecimenViewer.tsx`.
2. **Viewer Switch Case:** Add your generator to `getShapeData` in `src/components/SpecimenViewer.tsx`.
3. **UI Catalog Tab:** Add your specimen to `ALL_SPECIMENS` in `src/components/UIOverlay.tsx` with its category.
4. **Educational Annotations:** Add an entry to `SPECIMEN_EDUCATIONAL_DB` in `src/data/educationalAnnotations.ts`:
   - Set 3D landmark coordinates matching points in your geometry.
   - Write clear part titles, descriptions, and verified facts.
   - Adhere strictly to the zero em dashes guideline.

---

## Local Verification & Testing

Before submitting a pull request, run the following commands to ensure clean compilation and adherence to project standards:

```bash
# 1. Verify TypeScript types and production build
npm run build

# 2. Check that no em dashes exist anywhere in the codebase
python3 -c "import pathlib, sys; files = list(pathlib.Path('.').rglob('*.ts*')) + [pathlib.Path('README.md')]; bad = [str(f) for f in files if '\u2014' in f.read_text()]; sys.exit(1 if bad else 0)"

# 3. Start local development server
npm run dev
```

Navigate to `http://localhost:5173/?shape=your_shape_id` to inspect your specimen, test camera orbit controls, verify leader line projection, and observe kinematic movement.

---

## Submitting Pull Requests

1. Fork the repository and create a feature branch (`git checkout -b feature/specimen-name`).
2. Commit your changes with clear, descriptive commit messages.
3. Push to your branch and open a Pull Request against `main`.
4. Provide a screenshot or short description of your specimen in the Pull Request description.

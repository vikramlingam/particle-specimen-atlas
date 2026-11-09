# Particle Specimen Atlas

**Live Interactive Atlas:** [https://vikramlingam.github.io/particle-specimen-atlas/](https://vikramlingam.github.io/particle-specimen-atlas/)

An open source 3D scientific visualization atlas and interactive educational tool built with WebGL, Three.js, React, and TypeScript. The application renders 35 complex anatomical, biological, cosmological, physical, and engineering specimens at 100,000 points each, computed entirely procedurally in code with zero external 3D asset dependencies.

Each specimen features closed-form physical mechanics evaluated in the GPU vertex shader at 60 frames per second, divergence-free 3D curl noise turbulence, and an educational inspection interface featuring projected 3D connector pins, dynamic SVG blueprint leader lines, and slide-out scientific specification cards.

---

## Project Purpose

Most 3D web visualizations of complex systems (such as jet engines, human hearts, tokamaks, or spiral galaxies) rely on multi-megabyte 3D polygon meshes that are static, heavy to download, and opaque to inspect.

This project was built to solve that problem through three core design choices:
1. **Procedural Geometry Generation:** Every organ, mechanism, and cosmic structure is generated purely from mathematical formulas, parametric equations, and volumetric density sampling. The entire catalog of 35 structures requires zero 3D model downloads.
2. **GPU Vertex Shader Physics Kinematics:** Instead of spending CPU cycles updating hundreds of thousands of point coordinates each frame, closed-form physical equations run in parallel on the GPU. Turbofan blades revolve, pistons reciprocate with 4-stroke kinematics, hearts wring and twist in systole, and electrons orbit probability clouds with 0 ms CPU overhead per frame.
3. **Public Educational Access:** Designed for students, educators, and curious minds to explore how complex things work inside and out. Anyone can rotate, zoom, inspect anatomical landmarks, read verified facts, and understand the mechanical or biological principles behind each specimen.

---

## Visual Gallery

### Engineering & Machines
| Turbofan Aero Engine (`jet`) | Internal Combustion Piston (`piston`) |
| :---: | :---: |
| ![Turbofan Aero Engine](docs/screenshots/turbofan.png) | ![Internal Combustion Engine Piston](docs/screenshots/piston.png) |
| *Rotating 24 titanium fan blades and axial compressor spool* | *Four-stroke reciprocating slider-crank kinematics* |

| Microprocessor Silicon Die (`microchip`) | James Webb Space Telescope (`jwst`) |
| :---: | :---: |
| ![Microprocessor Silicon Die](docs/screenshots/microchip.png) | ![James Webb Space Telescope](docs/screenshots/jwst.png) |
| *8-core CPU clusters, L3 SRAM cache, and high-speed clock bus* | *18 hexagonal gold mirrors with 5-layer Kapton sunshield* |

---

### Physics & Cosmos
| Bohr-Rutherford Atom (`atom`) | Tokamak Fusion Reactor (`fusion`) |
| :---: | :---: |
| ![Bohr-Rutherford Atom](docs/screenshots/atom.png) | ![Tokamak Fusion Reactor](docs/screenshots/fusion.png) |
| *Proton-neutron nucleus with quantum probability shells* | *16 D-shaped toroidal coils with helical magnetic plasma stream* |

| Kerr Supermassive Black Hole (`blackhole`) | Earth Magnetosphere (`magnetosphere`) |
| :---: | :---: |
| ![Supermassive Black Hole](docs/screenshots/blackhole.png) | ![Earth Magnetosphere](docs/screenshots/magnetosphere.png) |
| *Relativistic Keplerian accretion swirl and polar plasma jets* | *Supersonic solar wind bow shock and Van Allen radiation belts* |

| Particle Collider Detector (`collider`) | Atmospheric Tornado (`tornado`) |
| :---: | :---: |
| ![Particle Collider Detector](docs/screenshots/collider.png) | ![Atmospheric Tornado](docs/screenshots/tornado.png) |
| *Silicon tracker, liquid argon calorimeter, and collision tracks* | *Mesocyclone wall cloud, suction funnel, and debris ring* |

---

### Anatomy & Medicine
| Human Ear & Cochlea (`ear`) | Human Synovial Knee (`knee`) |
| :---: | :---: |
| ![Human Ear and Cochlea](docs/screenshots/ear.png) | ![Human Synovial Knee Joint](docs/screenshots/knee.png) |
| *Tympanic membrane, ossicles chain, and 2.75-turn spiral cochlea* | *Bicondylar rolling runners, patella kneecap, ACL/PCL ligaments* |

| Anatomical Heart Inspection Card | Minimalist Light Mode Interface |
| :---: | :---: |
| ![Heart Hotspot Card](docs/screenshots/card_heart.png) | ![Light Theme View](docs/screenshots/card_light.png) |
| *Projected 3D connector pin, blueprint leader line, and fact card* | *Clean Swiss typography aesthetic in high-contrast light mode* |

---

### Biology & Zoology
| Cellular Mitochondrion (`mitochondrion`) | Coronavirus Virion (`virus`) |
| :---: | :---: |
| ![Cellular Mitochondrion](docs/screenshots/mitochondrion.png) | ![Coronavirus Virion](docs/screenshots/virus.png) |
| *Transverse cristae folds, matrix mtDNA, and ATP synthase rotors* | *Host lipid envelope, helical RNA core, and 72 trimeric spikes* |

| Blue Whale (`whale`) | Bird Flight Wing (`wing`) |
| :---: | :---: |
| ![Blue Whale Swimming](docs/screenshots/whale.png) | ![Bird Flight Wing](docs/screenshots/wing.png) |
| *Ventral pleats, baleen rostrum, and fluke swimming undulation* | *Avian skeletal joints, 10 primary flight remiges, and coverts* |

| Tyrannosaurus Rex Skull (`rex`) | Nautilus Shell (`nautilus`) |
| :---: | :---: |
| ![T-Rex Skull](docs/screenshots/rex.png) | ![Nautilus Shell](docs/screenshots/nautilus.png) |
| *Antorbital fenestra, orbit socket, and articulated dentary jaw* | *Logarithmic equiangular spiral shell and buoyancy gas chambers* |

---

## Architecture & Technical Overview

The rendering pipeline is implemented in a single custom GPU shader pipeline that handles shape interpolation, physical mechanics, and fluid curl noise entirely in the vertex shader.

```
                    ┌───────────────────────────────┐
                    │  35 Procedural Generators     │
                    │  (100,000 points per specimen)│
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ BufferGeometry Attributes:    │
                    │ - position & aTargetPosition  │
                    │ - aOriginColor & aTargetColor │
                    │ - aOriginKinetic / Target     │
                    │ - aDelay & aScale             │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ GPU Vertex Shader (particleShaders.ts)                                 │
│                                                                        │
│ 1. Evaluate origin kinematics: applyKinematicMotion(posOrigin, t)      │
│ 2. Evaluate target kinematics: applyKinematicMotion(posTarget, t)      │
│ 3. Hermite cubic interpolation: mix(originAnimated, targetAnimated, t) │
│ 4. Divergence-free 3D curl noise offset: curlNoise(p * scale + time)   │
│ 5. Perspective depth attenuation: gl_PointSize = size / -mvPosition.z │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ UI & Educational Interface Layer (React + SVG)                         │
│                                                                        │
│ - World-to-screen matrix projection (camera.project)                   │
│ - SVG blueprint leader lines connecting 3D pins to screen cards        │
│ - Category filter tabs & specimen selection                            │
│ - Telemetry HUD (FPS, camera position, bounding dimensions)            │
│ - Swiss editorial typography (#16181D / #F4F4F2)                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 35 Specimen Catalog Across 7 Disciplines

Every specimen is defined through analytical formulas, parametric surfaces, or rejection sampling algorithms:

### 1. Anatomy (8 Specimens)
- **Anatomical Heart (`heart`):** Four chambers (left/right ventricles and atria), ascending aortic arch with three branching arteries, pulmonary trunk, superior and inferior vena cava, coronary sulcus vessels. Kinetic motion: asymmetric cardiac cycle with apex wringing torsion and atrial diastolic filling.
- **Human Brain (`brain`):** Left and right folded cerebral hemispheres, cortical sulci and gyri convolutions, cerebellum with horizontal folia, brainstem (pons and medulla oblongata). Kinetic motion: rhythmic hemodynamic perfusion pulse.
- **Human Lungs (`lungs`):** Trachea with cartilaginous rings, primary and lobar bronchi, bronchial tree arborization, alveolar sacs, bilobed left lung with cardiac notch, trilobed right lung, subpulmonary diaphragm. Kinetic motion: respiratory tidal volume expansion and diaphragm descent.
- **Human Eye (`eye`):** Anterior corneal dome, pupil aperture, radial iris striations, spherical sclera shell, crystalline biconvex lens, optic nerve cable. Kinetic motion: saccadic micro-drift and pupillary light response.
- **Molar Tooth (`tooth`):** Occlusal enamel cusps, dentin core, pulp chamber, cementum, bifurcated root canals with apical foramina. Kinetic motion: masticatory structural micro-flexion.
- **Human Kidney (`kidney`):** Outer fibrous capsule, renal cortex, medullary pyramids, renal columns, minor and major calyces, renal pelvis, descending ureter. Kinetic motion: capillary filtration perfusion wave.
- **Ear & Cochlea (`ear`):** Outer cartilaginous auricle/pinna, curved auditory canal, conical tympanic membrane, three auditory ossicles (malleus, incus, stapes), and 2.75-turn logarithmic spiral cochlea with semicircular canals. Kinetic motion: acoustic wave traveling along basilar membrane and tympanic drumhead oscillation.
- **Synovial Knee (`knee`):** Distal femur with bicondylar articular runners, proximal tibia plateau with intercondylar spines, patella sesamoid kneecap, medial and lateral crescent menisci, anterior and posterior cruciate ligaments (ACL/PCL). Kinetic motion: bicondylar rolling and gliding joint articulation with patellar tracking.

### 2. Biology & Microbiology (6 Specimens)
- **DNA Double Helix (`dna`):** Right-handed antiparallel sugar-phosphate backbones, major and minor helical grooves, horizontal nitrogenous base pairs (adenine-thymine, guanine-cytosine). Kinetic motion: torsional helical breathing and axial rotation.
- **Bacteriophage T4 (`bacteriophage`):** Icosahedral capsid head packed with viral genome, cylindrical contractile tail sheath, hexagonal baseplate, six articulated tail fibers. Kinetic motion: baseplate flexing and sheath contraction.
- **Neuron & Synapse (`neuron`):** Multipolar pyramidal soma, nucleus, extensive dendritic arbor with spines, axon hillock, myelinated axon segments with Nodes of Ranvier, terminal synaptic boutons. Kinetic motion: directional action potential electrical pulses firing down the axon.
- **Plant Chloroplast (`chloroplast`):** Double-membrane lipid envelope, aqueous stroma fluid, stacked thylakoid grana discs, interconnecting stroma lamellae conduits, starch granules. Kinetic motion: cytoplasmic streaming and thylakoid metabolic oscillation.
- **Cellular Mitochondrion (`mitochondrion`):** Porous outer membrane, intermembrane space, inner membrane with deep transverse cristae folds, aqueous matrix, circular mtDNA plasmids, and rotating ATP synthase catalytic heads. Kinetic motion: cristae respiration oscillation and ATP synthase rotor rotation.
- **Coronavirus Virion (`virus`):** Spherical host-derived lipid envelope, internal helical ribonucleoprotein RNA core, and 72 radially arrayed trimeric spike glycoprotein complexes. Kinetic motion: lipid envelope micro-pulsation and spike stalk hinge flexing.

### 3. Physics & Earth Science (4 Specimens)
- **Bohr-Rutherford Atom (`atom`):** Dense central nucleus cluster of protons and neutrons, surrounded by four mutually inclined orbital probability shells with localized electron wavepackets. Kinetic motion: quantum electron orbital resonance with velocity scaling inversely with orbital radius.
- **Tokamak Fusion Reactor (`fusion`):** 16 D-shaped toroidal field coils, central solenoid magnet stack, inner and outer vacuum vessel walls, divertor plates, and continuous helical plasma core. Kinetic motion: dual toroidal and poloidal helical magnetic plasma circulation.
- **Particle Collider Detector (`collider`):** Inspired by CERN ATLAS and CMS detectors. Central beryllium vacuum beam pipe, four-layer silicon pixel vertex tracker, liquid argon electromagnetic calorimeter, hadronic brass tile calorimeter, outer muon spectrometer toroid wheels, and collision particle tracks. Kinetic motion: counter-circulating relativistic proton bunches and radial collision debris sprays.
- **Atmospheric Tornado (`tornado`):** Upper rotating mesocyclone wall cloud, hyperbolic condensation funnel narrowing to ground level, low-pressure core updraft, ground debris ring vortex, and spiral inflow bands. Kinetic motion: cyclonic Rankine vortex rotation with continuous vertical updraft.

### 4. Cosmos & Astrophysics (5 Specimens)
- **Earth Globe & Core (`earth`):** Terrestrial continental landmasses, bathymetric ocean floors, longitudinal and latitudinal grid coordinates, atmospheric stratosphere boundary. Kinetic motion: sidereal axial rotation on a 23.4-degree tilt.
- **Saturn & Rings (`saturn`):** Oblate gas giant sphere, Cassini division, high-density A, B, and C ring bands. Kinetic motion: differential Keplerian ring circulation where inner ring particles orbit faster than outer particles.
- **Spiral Galaxy (`galaxy`):** Dense galactic bulge core, dual logarithmic spiral arms, trailing stellar spur clusters, outer spherical stellar halo. Kinetic motion: differential galactic rotation with density wave perturbation.
- **Kerr Supermassive Black Hole (`blackhole`):** Opaque spherical event horizon, brilliant photon sphere ring, Keplerian relativistic accretion disk, and dual collimated astrophysical plasma jets along the rotational axis. Kinetic motion: relativistic differential accretion swirl ($v \propto r^{-0.5}$) and polar jet outflow.
- **Earth Magnetosphere (`magnetosphere`):** Central geomagnetic Earth, closed dipolar magnetic field line arches, inner and outer Van Allen radiation belts, and supersonic solar wind bow shock front. Kinetic motion: solar wind plasma deflection around bow shock, radiation belt cyclotron drift, and field line plasma streaming to auroral ovals.

### 5. Engineering & Technology (5 Specimens)
- **Turbofan Aero Engine (`jet`):** Aerodynamic nacelle casing, spinner cone, 24 wide-chord twisted titanium fan blades, multi-stage low and high pressure axial compressor discs, annular combustion chambers, turbine stages, and exhaust mixer nozzle. Kinetic motion: continuous high-speed axial rotation of fan blades and compressor spool inside a rigid stationary outer casing.
- **Internal Combustion Engine (`piston`):** Piston crown with compression ring grooves, wrist pin, I-beam connecting rod with bearings, rotating crankshaft counterweight, flywheel. Kinetic motion: exact four-stroke slider-crank kinematics with piston vertical translation, rod angular oscillation, and crankshaft rotation.
- **Saturn V Launch Rocket (`rocket`):** Multi-stage cylindrical fuselage, aerodynamic payload fairing, Apollo command/service module, grid fins, five F-1 bell engine nozzles, clustered exhaust plume. Kinetic motion: continuous hypersonic propulsion exhaust plume streaming downward with turbulent dispersion.
- **Microprocessor Silicon Die (`microchip`):** Silicon substrate wafer, eight multi-core CPU clusters with arithmetic logic grids, central shared L3 cache SRAM array, peripheral wire-bond contact pads, and multi-layer copper interconnect bus lines. Kinetic motion: high-speed clock bus binary data packet pulses racing across interconnect lines.
- **James Webb Space Telescope (`jwst`):** 18 hexagonal beryllium primary mirror segments coated in vapor-deposited gold, secondary mirror on a carbon-composite tripod truss, five-layer diamond Kapton sunshield membrane, and spacecraft service bus. Kinetic motion: primary mirror segment nanometer-scale micro-actuator positioning and sunshield solar radiation pressure ripple.

### 6. Zoology & Paleontology (4 Specimens)
- **Blue Whale (`whale`):** Streamlined hydrodynamic body, baleen rostrum, blowhole, ventral throat pleats, pectoral flippers, dorsal fin, caudal peduncle, and broad fluke tail. Kinetic motion: aquatic swimming undulation with traveling sinusoidal waves along the peduncle and fluke.
- **Tyrannosaurus Rex Skull (`rex`):** Premaxilla, maxilla, large antorbital fenestra weight-reduction cavity, forward-facing stereoscopic orbit socket, infratemporal fenestra, massive dentary mandible, recurved serrated teeth. Kinetic motion: articulated jaw opening and closing kinematics about the temporomandibular joint.
- **Nautilus Shell (`nautilus`):** Logarithmic equiangular spiral shell, internal mother-of-pearl septa partitions, gas buoyancy camera chambers, central siphuncle tube, outer living chamber. Kinetic motion: hydrostatic buoyancy pulsation and slow aquatic drift.
- **Bird Flight Wing (`wing`):** Avian skeleton (humerus, radius, ulna, carpometacarpus, digit alula), ten primary flight remiges, secondary remiges, and overlapping aerodynamic coverts. Kinetic motion: flapping wing stroke articulation with downstroke forward torsion and feather camber flexing.

### 7. Nature & Classical Form (3 Specimens)
- **Rose Bouquet (`rose`):** Grandi rhodonea mathematical parametric surface petals, tightly spiraled central bud core, slender stem, lateral leaves. Kinetic motion: botanical circadian bloom breathing.
- **Cumulus Cloud (`cloud`):** Volumetric clustered multi-octave simplex spheres with soft density roll-off. Kinetic motion: atmospheric thermal updraft convection.
- **Human Bust (`bust`):** Classical anatomical head and torso specimen with facial planes, nasal bridge, and shoulder girdle. Kinetic motion: subtle respiratory micro-motion.

---

## Kinematic Motion Engine

Physical movement is computed per-vertex in WebGL inside `src/shaders/particleShaders.ts` through the function `applyKinematicMotion(vec3 pos, vec4 kinetic, float time)`:

- **Zero CPU Particle Overhead:** The CPU never updates or copies 100,000 vertex coordinates per frame. All mathematics run in parallel on the GPU at 60 frames per second.
- **Persistence at Zero Turbulence:** Motion remains active when fluid curl turbulence (`uNoiseScale = 0.0`) is set to zero. Turbofan blades still revolve, pistons still reciprocate, hearts still beat, and atoms still orbit.
- **Component Masking:** The `kinetic.z` attribute stores part identifiers, allowing specific sections of a mesh (such as the outer casing of a jet engine or tokamak superconducting coils) to remain completely stationary while internal rotors or plasma streams move.
- **Smooth Morphing Transition:** Origin and target geometries are both evaluated through their respective kinematics equations at time $t$, then blended using an ease-in-out cubic curve:
  $$\text{pos}_{\text{morphed}} = \text{mix}\left(\text{kinematic}(\text{pos}_{\text{origin}}, t), \text{kinematic}(\text{pos}_{\text{target}}, t), \text{ease}(T)\right)$$

---

## Divergence-Free 3D Curl Noise

Fluid turbulence is calculated via the analytical curl of a 3D Simplex potential field:
$$\mathbf{v} = \nabla \times \mathbf{\Psi} = \left( \frac{\partial \Psi_z}{\partial y} - \frac{\partial \Psi_y}{\partial z}, \, \frac{\partial \Psi_x}{\partial z} - \frac{\partial \Psi_z}{\partial x}, \, \frac{\partial \Psi_y}{\partial x} - \frac{\partial \Psi_y}{\partial y} \right)$$
Because the divergence of the curl of any vector field is identically zero ($\nabla \cdot (\nabla \times \mathbf{\Psi}) = 0$), particles swirl along fluid stream contours without clumping into singular points or dispersing to infinity.

---

## Educational Annotation & Hotspot System

Each specimen includes four to five anatomical or mechanical landmarks defined in `src/data/educationalAnnotations.ts`:
1. **World-to-Screen Projection:** 3D coordinate vectors are projected each frame to normalized device coordinates using `vector.project(camera)` and converted to pixel coordinates:
   $$x_{\text{screen}} = (x_{\text{ndc}} \cdot 0.5 + 0.5) \cdot W, \quad y_{\text{screen}} = (-y_{\text{ndc}} \cdot 0.5 + 0.5) \cdot H$$
2. **Connector Pins:** Circular indicators with pulsing radial rings track their respective 3D landmarks.
3. **SVG Leader Lines:** Dynamic two-segment SVG polylines draw an architectural blueprint connection line from the active pin to the inspection card.
4. **Specification Card:** Displays the specimen catalog identifier, Latin or scientific classification, part name, functional description, and verified technical facts.
5. **Editorial Standards:** All descriptions, annotations, and UI copy adhere to factual language with zero em dashes and zero conversational filler phrases.

---

## Contributing to the Atlas

This project is open source and community-driven. We encourage contributors to design and submit new procedural specimens, improve kinematics equations, and add educational annotations.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete guide, including:
- Mathematical requirements for procedural point cloud generators
- GPU vertex shader kinematics assignment
- Registering new specimens in the user interface and educational database
- Pull request submission workflow and verification checklists

---

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation
```bash
git clone https://github.com/vikramlingam/particle-specimen-atlas.git
cd particle-specimen-atlas
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` (or the port reported in your terminal).

### Production Build
```bash
npm run build
```
Builds production-ready static assets to the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

---

## Project Structure

```
├── docs/
│   └── screenshots/            # Verified visual captures of specimens
├── src/
│   ├── components/
│   │   ├── ArchitecturalBoundingBox.ts # Thin blueprint wireframe box with corner ticks
│   │   ├── EducationalCard.tsx         # Slide-out technical inspection panel
│   │   ├── LeaderLine.tsx              # SVG architectural connector line
│   │   ├── MorphParticleSystem.ts      # Three.js ShaderMaterial & BufferGeometry manager
│   │   ├── SpecimenViewer.tsx          # 3D viewport, OrbitControls, and hotspot projection
│   │   └── UIOverlay.tsx               # Minimalist floating controls pill and category tabs
│   ├── data/
│   │   └── educationalAnnotations.ts   # Database of facts, landmarks, and descriptions
│   ├── generators/
│   │   ├── proceduralGeometries.ts     # Core generators (Heart, Brain, Lungs, Eye, Jet, Piston)
│   │   ├── proceduralGeometriesExtended.ts # Extended generators (Atom, Fusion, Black Hole, Whale, Rex)
│   │   ├── proceduralGeometriesAdvanced.ts # Advanced generators (Ear, Knee, Mitochondrion, Virus, JWST)
│   │   └── proceduralGeometriesLegacy.ts   # Celestial and legacy generators (Saturn, Earth, Galaxy)
│   ├── shaders/
│   │   └── particleShaders.ts          # GPU vertex & fragment shaders (kinematics + curl noise)
│   ├── App.tsx                         # Root application state & layout
│   └── main.tsx                        # Application mount point
├── CONTRIBUTING.md             # Guide for adding new specimens and contributing
├── LICENSE                     # MIT License
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## Design System

- **Typography:** Minimalist Swiss editorial aesthetic using system monospaced and clean sans-serif typefaces.
- **Light Theme:** Canvas background `#F8F7F4`, primary text `#16181D`, subtle blueprint accents.
- **Dark Theme:** Canvas background `#101114`, primary text `#F4F4F2`, luminescent particle blending.
- **Color Palettes:**
  - `0`: Natural Specimen (authentic anatomical/engineering colors)
  - `1`: Botanical Rose
  - `2`: Ethereal Dusk
  - `3`: Celestial Azure
  - `4`: Monochrome Blueprint
  - `5`: Acid Sage

---

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

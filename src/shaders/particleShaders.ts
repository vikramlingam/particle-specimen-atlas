export const particleVertexShader = /* glsl */ `
precision highp float;

attribute vec3 aTargetPosition;
attribute vec3 aOriginColor;
attribute vec3 aTargetColor;
attribute float aDelay;
attribute float aScale;
attribute vec4 aOriginKinetic; // x: type, y: speed, z: p1, w: p2
attribute vec4 aTargetKinetic; // x: type, y: speed, z: p1, w: p2

uniform float uTime;
uniform float uTransition;
uniform float uNoiseScale;
uniform float uNoiseSpeed;
uniform float uNoiseAmplitude;
uniform float uSize;
uniform float uPixelRatio;
uniform float uTheme; // 0.0 = dark, 1.0 = light
uniform float uColorPaletteMode; // 0=default, 1=botanical, 2=dusk, 3=azure, 4=blueprint, 5=sage

varying vec3 vColor;
varying float vAlpha;

// ==========================================
// 3D SIMPLEX NOISE (Ashima Arts)
// ==========================================
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// Divergence-Free 3D Curl Noise
vec3 curlNoise(vec3 p) {
  const float e = 0.015;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float p_x_y1 = snoise(p + dy + vec3(0.0, 17.1, 31.4));
  float p_x_y0 = snoise(p - dy + vec3(0.0, 17.1, 31.4));
  float p_x_z1 = snoise(p + dz + vec3(0.0, 17.1, 31.4));
  float p_x_z0 = snoise(p - dz + vec3(0.0, 17.1, 31.4));

  float p_y_x1 = snoise(p + dx + vec3(53.2, 0.0, 71.9));
  float p_y_x0 = snoise(p - dx + vec3(53.2, 0.0, 71.9));
  float p_y_z1 = snoise(p + dz + vec3(53.2, 0.0, 71.9));
  float p_y_z0 = snoise(p - dz + vec3(53.2, 0.0, 71.9));

  float p_z_x1 = snoise(p + dx + vec3(89.3, 43.7, 0.0));
  float p_z_x0 = snoise(p - dx + vec3(89.3, 43.7, 0.0));
  float p_z_y1 = snoise(p + dy + vec3(89.3, 43.7, 0.0));
  float p_z_y0 = snoise(p - dy + vec3(89.3, 43.7, 0.0));

  float x = (p_z_y1 - p_z_y0) - (p_y_z1 - p_y_z0);
  float y = (p_x_z1 - p_x_z0) - (p_z_x1 - p_z_x0);
  float z = (p_y_x1 - p_y_x0) - (p_x_y1 - p_x_y0);

  return vec3(x, y, z) / (2.0 * e);
}

vec3 getCustomPaletteColor(float mode, float t, vec3 defaultCol) {
  if (mode < 0.5) {
    return defaultCol;
  } else if (mode < 1.5) {
    // Botanical Rose
    vec3 c1 = vec3(0.85, 0.42, 0.45);
    vec3 c2 = vec3(0.95, 0.65, 0.68);
    vec3 c3 = vec3(0.50, 0.65, 0.52);
    vec3 c4 = vec3(0.98, 0.92, 0.88);
    return mix(mix(c1, c2, smoothstep(0.0, 0.5, t)), mix(c3, c4, smoothstep(0.5, 1.0, t)), t);
  } else if (mode < 2.5) {
    // Ethereal Dusk
    vec3 c1 = vec3(0.62, 0.50, 0.80);
    vec3 c2 = vec3(0.85, 0.55, 0.70);
    vec3 c3 = vec3(0.95, 0.78, 0.58);
    return mix(c1, mix(c2, c3, t), t);
  } else if (mode < 3.5) {
    // Celestial Azure
    vec3 c1 = vec3(0.32, 0.62, 0.90);
    vec3 c2 = vec3(0.18, 0.82, 0.80);
    vec3 c3 = vec3(0.88, 0.92, 0.98);
    return mix(c1, mix(c2, c3, t), t);
  } else if (mode < 4.5) {
    // Monochrome Blueprint
    vec3 c1 = vec3(0.32, 0.38, 0.45);
    vec3 c2 = vec3(0.68, 0.72, 0.80);
    vec3 c3 = vec3(0.96, 0.97, 1.00);
    return mix(c1, mix(c2, c3, t), t);
  } else {
    // Acid Sage
    vec3 c1 = vec3(0.45, 0.65, 0.50);
    vec3 c2 = vec3(0.70, 0.85, 0.52);
    vec3 c3 = vec3(0.92, 0.95, 0.86);
    return mix(c1, mix(c2, c3, t), t);
  }
}

// ==========================================
// KINEMATIC PHYSICAL MOTION FUNCTION
// Closed-form analytical dynamics executed per-vertex at 60 FPS
// ==========================================
vec3 applyKinematicMotion(vec3 pos, vec4 kinetic, float time) {
  float type = kinetic.x;
  float speed = kinetic.y;
  float p1 = kinetic.z;
  float p2 = kinetic.w;

  if (type < 0.5) {
    // Type 0: Static or subtle ambient breathing
    if (speed > 0.0) {
      float breathe = 1.0 + sin(time * speed) * 0.015;
      return pos * breathe;
    }
    return pos;
  }
  else if (type < 1.5) {
    // Type 1: Axial rotation around Z-axis (Turbofan Jet fan blades & compressor discs)
    float angle = time * speed;
    float cosA = cos(angle);
    float sinA = sin(angle);
    return vec3(pos.x * cosA - pos.y * sinA, pos.x * sinA + pos.y * cosA, pos.z);
  }
  else if (type < 2.5) {
    // Type 2: Keplerian / Axial rotation around Y-axis (Saturn rings, Earth, Galaxy)
    float r = max(length(pos.xz), 0.1);
    float angle = time * speed;
    if (p1 > 0.5) {
      // Differential Keplerian orbital rotation: inner particles orbit faster
      angle *= pow(2.8 / r, 0.85);
    }
    float cosA = cos(angle);
    float sinA = sin(angle);
    return vec3(pos.x * cosA - pos.z * sinA, pos.y, pos.x * sinA + pos.z * cosA);
  }
  else if (type < 3.5) {
    // Type 3: Reciprocating Engine Kinematics (Piston & Crankshaft)
    float theta = time * speed;
    float crankRadius = 1.15;
    float rodLength = 3.2;

    vec2 crankPin = vec2(sin(theta) * crankRadius, cos(theta) * crankRadius - 2.1);
    float wristY = -2.1 + cos(theta) * crankRadius + sqrt(rodLength * rodLength - crankPin.x * crankPin.x);

    if (p1 < 1.5) {
      // Piston Crown & Rings (oscillates purely vertically in Y)
      float baseTopY = 2.15;
      float dY = (wristY - 1.1) - baseTopY;
      return vec3(pos.x, pos.y + dY, pos.z);
    } else if (p1 < 2.5) {
      // Wrist pin
      float dY = (wristY - 1.1) - 1.05;
      return vec3(pos.x, pos.y + dY, pos.z);
    } else if (p1 < 3.5) {
      // Connecting rod
      float tRod = clamp(p2, 0.0, 1.0);
      vec2 restCrank = vec2(0.0, -0.95);
      vec2 restWrist = vec2(0.0, 2.25);
      vec2 curPos2D = mix(crankPin, vec2(0.0, wristY), tRod);
      vec2 restPos2D = mix(restCrank, restWrist, tRod);
      vec2 delta = curPos2D - restPos2D;
      return vec3(pos.x + delta.x, pos.y + delta.y, pos.z);
    } else {
      // Crankshaft revolving in XY plane
      vec2 center = vec2(0.0, -2.1);
      vec2 rel = pos.xy - center;
      float cosT = cos(theta);
      float sinT = sin(theta);
      vec2 rot = vec2(rel.x * cosT - rel.y * sinT, rel.x * sinT + rel.y * cosT);
      return vec3(center + rot, pos.z);
    }
  }
  else if (type < 4.5) {
    // Type 4: Anatomical Heartbeat Cardiac Cycle (Systole & Diastole with apex twist)
    float cycle = mod(time * speed, 1.0);
    float systole = sin(clamp((cycle - 0.1) / 0.25, 0.0, 1.0) * 3.14159);
    float atriaSystole = sin(clamp((cycle - 0.78) / 0.16, 0.0, 1.0) * 3.14159);

    float isVentricle = step(pos.y, 0.8);
    float isAtria = 1.0 - isVentricle;

    float vScale = 1.0 - systole * 0.13 * isVentricle;
    float aScale = 1.0 - atriaSystole * 0.08 * isAtria;

    float apexTwist = systole * 0.12 * (1.0 - clamp((pos.y + 2.5) / 3.2, 0.0, 1.0));
    float cosTwist = cos(apexTwist);
    float sinTwist = sin(apexTwist);

    vec3 p = pos;
    p.xz = vec2(p.x * cosTwist - p.z * sinTwist, p.x * sinTwist + p.z * cosTwist);
    p.xz *= (vScale * aScale);
    p.y *= (1.0 - systole * 0.06 * isVentricle);
    return p;
  }
  else if (type < 5.5) {
    // Type 5: Respiratory Lung Inhalation & Exhalation
    float breathPhase = mod(time * speed, 1.0);
    float breath = sin(breathPhase * 6.28318) * 0.5 + 0.5;
    float isLungs = step(pos.y, 1.8);
    float expansion = 1.0 + breath * 0.11 * isLungs;
    vec3 p = pos;
    p.x *= expansion;
    p.z *= (1.0 + breath * 0.09 * isLungs);
    p.y -= breath * 0.12 * isLungs;
    return p;
  }
  else if (type < 6.5) {
    // Type 6: Rocket Hypersonic Exhaust Propulsion Plume
    float stream = mod(time * speed * 3.5 + p1, 1.0);
    float yOffset = -stream * 4.8;
    float shock = sin(stream * 24.0) * 0.15;
    vec3 p = pos;
    p.y += yOffset;
    p.xz *= (1.0 + shock + stream * 0.8);
    return p;
  }
  else if (type < 7.5) {
    // Type 7: Tokamak Toroidal Helical Magnetic Plasma Flow
    float phi = atan(pos.z, pos.x) + time * speed;
    float R = length(pos.xz);
    float r_minor = length(vec2(R - 2.5, pos.y));
    float theta_pol = atan(pos.y, R - 2.5) + time * speed * 3.2;
    float newR = 2.5 + r_minor * cos(theta_pol);
    return vec3(newR * cos(phi), r_minor * sin(theta_pol), newR * sin(phi));
  }
  else if (type < 8.5) {
    // Type 8: Black Hole Relativistic Accretion Infall Swirl
    float r = max(length(pos.xz), 0.5);
    float omega = speed * pow(2.8 / r, 1.4);
    float angle = time * omega;
    float cosA = cos(angle);
    float sinA = sin(angle);
    return vec3(pos.x * cosA - pos.z * sinA, pos.y, pos.x * sinA + pos.z * cosA);
  }
  else if (type < 9.5) {
    // Type 9: Undulating Aquatic Swimming Wave (Blue Whale)
    float wave = sin(time * speed - pos.z * 1.1) * (clamp((-pos.z + 1.2) / 4.2, 0.0, 1.0));
    vec3 p = pos;
    p.y += wave * 0.45;
    return p;
  }
  else if (type < 10.5) {
    // Type 10: Quantum Orbital Resonance / Pulsar
    float phi = time * speed;
    float cosP = cos(phi);
    float sinP = sin(phi);
    vec3 p = pos;
    if (p1 > 0.5) {
      p.xz = vec2(p.x * cosP - p.z * sinP, p.x * sinP + p.z * cosP);
    } else {
      p.xy = vec2(p.x * cosP - p.y * sinP, p.x * sinP + p.y * cosP);
    }
    return p;
  }
  else if (type < 11.5) {
    // Type 11: Acoustic Traveling Wave & Tympanic Oscillation (Human Ear & Cochlea)
    vec3 p = pos;
    if (p1 > 3.5) {
      // Cochlear basilar membrane traveling wave: wavelength decreases towards apex
      float travel = sin(time * speed * 3.5 - p2 * 18.0);
      p.y += travel * 0.08 * (1.0 - p2 * 0.4);
    } else if (p1 > 1.5) {
      // Tympanic membrane drumhead acoustic vibration
      float drumVibe = sin(time * speed * 8.0) * 0.06 * p2;
      p.z += drumVibe;
    } else if (p1 > 0.5) {
      // Sound wave packet in ear canal
      float canalWave = sin(time * speed * 6.0 - p2 * 12.0) * 0.03;
      p.x += canalWave;
    }
    return p;
  }
  else if (type < 12.5) {
    // Type 12: Synovial Knee Joint Flexion-Extension Kinematics
    vec3 p = pos;
    float flexAngle = sin(time * speed * 1.5) * 0.35 + 0.35; // 0 to 0.7 radians (0 to 40 degrees)
    if (p1 > 0.5 && p1 < 1.5) {
      // Femur rolls and slides posteriorly during flexion
      float cosF = cos(flexAngle);
      float sinF = sin(flexAngle);
      vec2 relYZ = vec2(p.y - 0.4, p.z);
      vec2 rotYZ = vec2(relYZ.x * cosF - relYZ.y * sinF, relYZ.x * sinF + relYZ.y * cosF);
      p.y = 0.4 + rotYZ.x - sin(flexAngle) * 0.25;
      p.z = rotYZ.y - (1.0 - cos(flexAngle)) * 0.35;
    } else if (p1 > 1.5 && p1 < 2.5) {
      // Patella glides downward along femoral trochlea
      p.y -= flexAngle * 0.45;
      p.z += sin(flexAngle) * 0.15;
    }
    return p;
  }
  else if (type < 13.5) {
    // Type 13: Mitochondrial Cristae Respiration & ATP Synthase Rotation
    vec3 p = pos;
    if (p1 > 2.5) {
      // ATP synthase rotary motor spinning
      float angle = time * speed * 4.0 + p2;
      p.xy += vec2(cos(angle), sin(angle)) * 0.04;
    } else if (p1 > 0.5) {
      // Cristae undulating respiratory breathing
      float cristaeBreathe = sin(time * speed * 2.0 + p2 * 0.8) * 0.05;
      p.x += cristaeBreathe;
    } else {
      // Outer membrane subtle metabolic pulsation
      float pulse = 1.0 + sin(time * speed) * 0.018;
      p.xy *= pulse;
    }
    return p;
  }
  else if (type < 14.5) {
    // Type 14: Coronavirus Spike Glycoprotein Flexing & Envelope Thermal Oscillation
    vec3 p = pos;
    if (p1 > 1.5) {
      // Spike trimer stalk bending and crown swaying
      float sway = sin(time * speed * 2.2 + p.x * 3.0 + p.z * 3.0) * 0.12 * p2;
      p.x += sway;
      p.z += cos(time * speed * 2.2 + p.y * 3.0) * 0.12 * p2;
    } else {
      // Lipid bilayer envelope micro-pulsation
      float pulse = 1.0 + sin(time * speed * 1.5) * 0.015;
      p *= pulse;
    }
    return p;
  }
  else if (type < 15.5) {
    // Type 15: Microprocessor High-Speed Clock Bus Binary Electron Streaming
    vec3 p = pos;
    if (p1 > 2.5) {
      // Data bus packet pulses racing across interconnects
      float busStream = mod(time * speed * 2.5, 1.0);
      if (p2 > 0.5) {
        // Horizontal bus flow
        p.x = mod(pos.x + 2.3 + busStream * 4.6, 4.6) - 2.3;
      } else {
        // Vertical bus flow
        p.z = mod(pos.z + 2.3 + busStream * 4.6, 4.6) - 2.3;
      }
    } else if (p1 > 0.5) {
      // CPU core logic gate clock jitter
      float clock = sin(time * speed * 8.0 + p2 * 1.57);
      p.y += clock * 0.02;
    }
    return p;
  }
  else if (type < 16.5) {
    // Type 16: Particle Collider Relativistic Bunch Counter-rotation & Collision Spray
    vec3 p = pos;
    if (p1 > 3.5) {
      // Relativistic collision tracks expanding radially outward
      float burst = mod(time * speed * 0.8 + p2, 1.0);
      p *= (0.3 + burst * 1.1);
    } else if (p1 < 0.5) {
      // Beams circulating inside vacuum pipe
      float beamZ = mod(pos.z + 2.5 + time * speed * p2 * 3.0, 5.0) - 2.5;
      p.z = beamZ;
    }
    return p;
  }
  else if (type < 17.5) {
    // Type 17: JWST Primary Mirror Actuator Phasing & Sunshield Solar Radiation Ripple
    vec3 p = pos;
    if (p1 > 2.5) {
      // 5-layer sunshield membrane thermal ripple from solar wind
      float membraneWave = sin(time * speed * 1.2 + p.x * 2.0 + p.y * 1.5) * 0.035;
      p.z += membraneWave;
    } else if (p1 > 0.5 && p1 < 1.5) {
      // Hexagonal mirror nanometer-scale piston and tip-tilt micro-adjustment
      float microDrift = sin(time * speed * 0.8 + p2 * 0.6) * 0.015;
      p.z += microDrift;
    }
    return p;
  }
  else if (type < 18.5) {
    // Type 18: Earth Magnetosphere Solar Wind Deflection & Auroral Helical Infall
    vec3 p = pos;
    if (p1 > 2.5) {
      // Solar wind plasma streaming around bow shock
      float windStream = mod(time * speed * 2.0 + p2, 1.0);
      p.x -= windStream * 1.8;
      p.yz *= (1.0 + windStream * 0.35);
    } else if (p1 > 1.5) {
      // Dipolar field line plasma spiraling towards auroral poles
      float gyro = sin(time * speed * 3.5 + p2 * 4.0) * 0.04;
      p.x += gyro;
      p.z += cos(time * speed * 3.5 + p2 * 4.0) * 0.04;
    } else if (p1 > 0.5) {
      // Van Allen radiation belt cyclotron orbit
      float angle = time * speed * 2.0;
      float cosA = cos(angle);
      float sinA = sin(angle);
      p.xz = vec2(p.x * cosA - p.z * sinA, p.x * sinA + p.z * cosA);
    } else {
      // Earth axial rotation
      float angle = time * speed * 0.5;
      float cosA = cos(angle);
      float sinA = sin(angle);
      p.xz = vec2(p.x * cosA - p.z * sinA, p.x * sinA + p.z * cosA);
    }
    return p;
  }
  else if (type < 19.5) {
    // Type 19: Tornado Cyclonic Vortex & High-Speed Updraft
    vec3 p = pos;
    float r = max(length(p.xz), 0.15);
    // Rankine vortex: angular velocity increases as radius decreases
    float omega = speed * (1.8 / (r + 0.3));
    float angle = time * omega;
    float cosA = cos(angle);
    float sinA = sin(angle);
    p.xz = vec2(p.x * cosA - p.z * sinA, p.x * sinA + p.z * cosA);
    // Continuous vertical updraft
    float updraft = mod(time * speed * 1.4 + p.y + 2.2, 3.6);
    p.y = -2.2 + updraft;
    return p;
  }
  else {
    // Type 20: Avian Wing Flapping Aerodynamic Kinematics & Feather Camber Flexing
    vec3 p = pos;
    // Flapping stroke cycle: downstroke and upstroke
    float flapCycle = sin(time * speed * 2.2);
    float flapAngle = flapCycle * 0.35; // flap up/down
    float spanRatio = clamp((p.x + 2.2) / 4.6, 0.0, 1.0);

    // Dihedral flapping angle increases towards wingtip
    float cosFlap = cos(flapAngle * spanRatio);
    float sinFlap = sin(flapAngle * spanRatio);
    vec2 rotXY = vec2(p.x, p.y);
    p.y += sinFlap * p.x * 0.45;

    // Feather tips twist and flex during aerodynamic stroke (aeroelastic torsion)
    if (p1 > 0.5) {
      float featherFlex = cos(time * speed * 2.2) * 0.22 * p2;
      p.z += featherFlex;
      p.y += -sin(flapAngle) * 0.15 * p2;
    }
    return p;
  }
}

void main() {
  float stagger = aDelay * 0.30;
  float progress = clamp((uTransition - stagger) / (1.0 - 0.30), 0.0, 1.0);
  float easeT = progress * progress * (3.0 - 2.0 * progress);

  // Apply kinetic physical motion to origin and target geometries before morphing
  vec3 originAnimated = applyKinematicMotion(position, aOriginKinetic, uTime);
  vec3 targetAnimated = applyKinematicMotion(aTargetPosition, aTargetKinetic, uTime);
  vec3 morphedPos = mix(originAnimated, targetAnimated, easeT);

  // Divergence-free Curl Noise
  vec3 noiseCoord = morphedPos * uNoiseScale + vec3(uTime * uNoiseSpeed * 0.25);
  vec3 curl = curlNoise(noiseCoord);

  vec3 noiseOffset = curl * uNoiseAmplitude;
  vec3 finalPos = morphedPos + noiseOffset;

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Delicate micro-particle scale
  float pointSize = (uSize * aScale * uPixelRatio * 55.0) / -mvPosition.z;
  gl_PointSize = clamp(pointSize, 0.6, 12.0);

  vec3 baseColor = mix(aOriginColor, aTargetColor, easeT);
  float normDist = clamp(length(morphedPos) / 7.0, 0.0, 1.0);
  vec3 themedColor = getCustomPaletteColor(uColorPaletteMode, normDist, baseColor);

  if (uTheme > 0.5) {
    // Light mode
    vColor = themedColor * 0.75;
    vAlpha = 0.55;
  } else {
    // Dark mode: perfectly balanced luminescence for 100k points
    vColor = themedColor;
    vAlpha = 0.28;
  }
}
`;

export const particleFragmentShader = /* glsl */ `
precision highp float;

uniform float uTheme; // 0.0 = dark, 1.0 = light

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float dist = length(coord);

  if (dist > 0.5) {
    discard;
  }

  float edge = smoothstep(0.5, 0.08, dist);
  float alpha = pow(edge, 1.25) * vAlpha;

  if (uTheme > 0.5) {
    gl_FragColor = vec4(vColor, alpha * 0.85);
  } else {
    gl_FragColor = vec4(vColor, alpha);
  }
}
`;

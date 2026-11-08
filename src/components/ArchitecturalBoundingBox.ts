import * as THREE from 'three';

export interface BoundingBoxOptions {
  theme: 'dark' | 'light';
  showCenterGuide?: boolean;
}

export class ArchitecturalBoundingBox extends THREE.Group {
  private boxLines: THREE.LineSegments;
  private cornerTicks: THREE.LineSegments;
  private centerGuide: THREE.LineSegments;
  private currentSize: THREE.Vector3 = new THREE.Vector3(7.0, 8.5, 7.0);
  private targetSize: THREE.Vector3 = new THREE.Vector3(7.0, 8.5, 7.0);
  private lineMaterial: THREE.LineBasicMaterial;
  private tickMaterial: THREE.LineBasicMaterial;
  private guideMaterial: THREE.LineBasicMaterial;

  constructor(options: BoundingBoxOptions = { theme: 'dark', showCenterGuide: true }) {
    super();

    const isLight = options.theme === 'light';

    // Thin, architectural hairline materials
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: isLight ? 0x202428 : 0xFFFFFF,
      transparent: true,
      opacity: isLight ? 0.22 : 0.28,
      depthWrite: false,
    });

    this.tickMaterial = new THREE.LineBasicMaterial({
      color: isLight ? 0x1A1C20 : 0xFFFFFF,
      transparent: true,
      opacity: isLight ? 0.65 : 0.75,
      depthWrite: false,
    });

    this.guideMaterial = new THREE.LineBasicMaterial({
      color: isLight ? 0x606570 : 0xE0E0E0,
      transparent: true,
      opacity: isLight ? 0.25 : 0.35,
      depthWrite: false,
    });

    // Create wireframe bounding box
    const boxGeo = this.buildBoxGeometry(this.currentSize.x, this.currentSize.y, this.currentSize.z);
    this.boxLines = new THREE.LineSegments(boxGeo, this.lineMaterial);
    this.add(this.boxLines);

    // Create corner ticks (architectural brackets)
    const tickGeo = this.buildCornerTicksGeometry(this.currentSize.x, this.currentSize.y, this.currentSize.z, 0.45);
    this.cornerTicks = new THREE.LineSegments(tickGeo, this.tickMaterial);
    this.add(this.cornerTicks);

    // Create vertical center plumb line
    const guideGeo = this.buildCenterGuideGeometry(this.currentSize.y);
    this.centerGuide = new THREE.LineSegments(guideGeo, this.guideMaterial);
    this.centerGuide.visible = options.showCenterGuide !== false;
    this.add(this.centerGuide);
  }

  public setDimensions(x: number, y: number, z: number, immediate: boolean = false) {
    // Add padding around particles
    const pad = 1.6;
    this.targetSize.set(Math.max(x + pad, 5.0), Math.max(y + pad, 6.0), Math.max(z + pad, 5.0));

    if (immediate) {
      this.currentSize.copy(this.targetSize);
      this.rebuildGeometries();
    }
  }

  public update(delta: number) {
    // Smooth lerp to target size
    const lerpFactor = Math.min(1.0, delta * 3.5);
    if (this.currentSize.distanceTo(this.targetSize) > 0.01) {
      this.currentSize.lerp(this.targetSize, lerpFactor);
      this.rebuildGeometries();
    }
  }

  public setTheme(theme: 'dark' | 'light') {
    const isLight = theme === 'light';
    this.lineMaterial.color.setHex(isLight ? 0x1A1C22 : 0xFFFFFF);
    this.lineMaterial.opacity = isLight ? 0.20 : 0.28;

    this.tickMaterial.color.setHex(isLight ? 0x0D0E11 : 0xFFFFFF);
    this.tickMaterial.opacity = isLight ? 0.65 : 0.80;

    this.guideMaterial.color.setHex(isLight ? 0x4B5260 : 0xE5E5E5);
    this.guideMaterial.opacity = isLight ? 0.22 : 0.35;
  }

  public setGuideVisible(visible: boolean) {
    this.centerGuide.visible = visible;
  }

  private rebuildGeometries() {
    this.boxLines.geometry.dispose();
    this.boxLines.geometry = this.buildBoxGeometry(this.currentSize.x, this.currentSize.y, this.currentSize.z);

    this.cornerTicks.geometry.dispose();
    this.cornerTicks.geometry = this.buildCornerTicksGeometry(this.currentSize.x, this.currentSize.y, this.currentSize.z, 0.45);

    this.centerGuide.geometry.dispose();
    this.centerGuide.geometry = this.buildCenterGuideGeometry(this.currentSize.y);
  }

  private buildBoxGeometry(w: number, h: number, d: number): THREE.BufferGeometry {
    const hw = w * 0.5;
    const hh = h * 0.5;
    const hd = d * 0.5;

    // 12 edges = 24 vertices
    const vertices = new Float32Array([
      // Top 4 edges
      -hw, hh, -hd,  hw, hh, -hd,
       hw, hh, -hd,  hw, hh,  hd,
       hw, hh,  hd, -hw, hh,  hd,
      -hw, hh,  hd, -hw, hh, -hd,

      // Bottom 4 edges
      -hw, -hh, -hd,  hw, -hh, -hd,
       hw, -hh, -hd,  hw, -hh,  hd,
       hw, -hh,  hd, -hw, -hh,  hd,
      -hw, -hh,  hd, -hw, -hh, -hd,

      // Vertical 4 pillars
      -hw, -hh, -hd, -hw,  hh, -hd,
       hw, -hh, -hd,  hw,  hh, -hd,
       hw, -hh,  hd,  hw,  hh,  hd,
      -hw, -hh,  hd, -hw,  hh,  hd,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geo;
  }

  private buildCornerTicksGeometry(w: number, h: number, d: number, tickLen: number): THREE.BufferGeometry {
    const hw = w * 0.5;
    const hh = h * 0.5;
    const hd = d * 0.5;

    const vertices: number[] = [];

    // 8 corners: each corner has 3 tick segments along x, y, z
    const signs = [
      [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1],
      [-1,  1, -1], [1,  1, -1], [1,  1, 1], [-1,  1, 1]
    ];

    for (const [sx, sy, sz] of signs) {
      const cx = sx * hw;
      const cy = sy * hh;
      const cz = sz * hd;

      // Tick along X toward inside
      vertices.push(cx, cy, cz, cx - sx * tickLen, cy, cz);
      // Tick along Y toward inside
      vertices.push(cx, cy, cz, cx, cy - sy * tickLen, cz);
      // Tick along Z toward inside
      vertices.push(cx, cy, cz, cx, cy, cz - sz * tickLen);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    return geo;
  }

  private buildCenterGuideGeometry(h: number): THREE.BufferGeometry {
    const hh = h * 0.5;
    // Central plumb line extending slightly past top and bottom
    const ext = 0.5;
    const vertices = new Float32Array([
      0.0, -hh - ext, 0.0,
      0.0,  hh + ext, 0.0,
    ]);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geo;
  }
}


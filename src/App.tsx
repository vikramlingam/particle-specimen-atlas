import React, { useState, useRef, useCallback } from 'react';
import { SpecimenViewer, SpecimenViewerHandle, ShapeId, ProjectedHotspot } from './components/SpecimenViewer';
import { UIOverlay, TelemetryData } from './components/UIOverlay';
import { ParticleCloudData } from './generators/proceduralGeometries';
import { parseUploadedModel } from './utils/meshLoader';

export const App: React.FC = () => {
  const viewerRef = useRef<SpecimenViewerHandle>(null);

  // Parse initial state from URL query parameters (for deep-linking & testing)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const initialShape = (urlParams.get('shape') as ShapeId) || 'heart';
  const initialTheme = (urlParams.get('theme') as 'dark' | 'light') || 'dark';
  const initialHotspotParam = urlParams.get('hotspot');
  const initialHotspot = initialHotspotParam !== null ? parseInt(initialHotspotParam, 10) : null;

  // Particle System Parameters
  const [activeShape, setActiveShape] = useState<ShapeId>(initialShape);
  const [particleCount] = useState<number>(100000);
  const [noiseScale, setNoiseScale] = useState<number>(0.38);
  const [noiseSpeed, setNoiseSpeed] = useState<number>(0.55);
  const [noiseAmplitude, setNoiseAmplitude] = useState<number>(0.06);
  const [particleSize, setParticleSize] = useState<number>(1.2);
  const [colorPaletteMode, setColorPaletteMode] = useState<number>(0);
  const [theme, setTheme] = useState<'dark' | 'light'>(initialTheme);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [paused, setPaused] = useState<boolean>(false);
  const [showWireframe, setShowWireframe] = useState<boolean>(true);
  const [showCenterGuide, setShowCenterGuide] = useState<boolean>(true);
  const [customShapeData, setCustomShapeData] = useState<ParticleCloudData | null>(null);

  // Educational Annotations & Hotspots State
  const [hotspots, setHotspots] = useState<ProjectedHotspot[]>([]);
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number | null>(initialHotspot);

  // Drag-and-drop state
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);

  // Telemetry state
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    fps: 60,
    camX: 0,
    camY: 1.2,
    camZ: 14.5,
    zoom: 14.5,
    specimenName: 'Anatomical Human Heart',
    catalogId: 'SPECIMEN // 01-HEART',
    dimensions: { x: 5.6, y: 7.2, z: 5.2 }
  });

  const handleSelectShape = useCallback((shape: ShapeId) => {
    setActiveShape(shape);
    setSelectedHotspotIndex(null);
  }, []);

  const handleSelectHotspot = useCallback((index: number | null) => {
    setSelectedHotspotIndex(index);
    if (index !== null && hotspots[index]) {
      viewerRef.current?.focusOnHotspot(hotspots[index].position);
    }
  }, [hotspots]);

  // Handle uploaded 3D model
  const handleModelFile = useCallback(async (file: File) => {
    try {
      const parsedData = await parseUploadedModel(file, particleCount);
      setCustomShapeData(parsedData);
      setActiveShape('custom');
      setSelectedHotspotIndex(null);
    } catch (err: any) {
      alert(`Model loading error: ${err.message || 'Could not parse 3D file.'}`);
    }
  }, [particleCount]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleModelFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden ${
        theme === 'light' ? 'bg-[#F8F7F4]' : 'bg-[#101114]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 3D WebGL Canvas Layer */}
      <SpecimenViewer
        ref={viewerRef}
        activeShape={activeShape}
        particleCount={particleCount}
        noiseScale={noiseScale}
        noiseSpeed={noiseSpeed}
        noiseAmplitude={noiseAmplitude}
        particleSize={particleSize}
        colorPaletteMode={colorPaletteMode}
        theme={theme}
        autoRotate={autoRotate}
        paused={paused}
        showWireframe={showWireframe}
        showCenterGuide={showCenterGuide}
        customShapeData={customShapeData}
        onHotspotsUpdate={setHotspots}
        onTelemetryUpdate={setTelemetry}
      />

      {/* Floating UI Overlay */}
      <UIOverlay
        activeShape={activeShape}
        onSelectShape={handleSelectShape}
        noiseScale={noiseScale}
        onChangeNoiseScale={setNoiseScale}
        noiseSpeed={noiseSpeed}
        onChangeNoiseSpeed={setNoiseSpeed}
        noiseAmplitude={noiseAmplitude}
        onChangeNoiseAmplitude={setNoiseAmplitude}
        particleSize={particleSize}
        onChangeParticleSize={setParticleSize}
        colorPaletteMode={colorPaletteMode}
        onChangeColorPaletteMode={setColorPaletteMode}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        paused={paused}
        onTogglePause={() => setPaused(!paused)}
        showWireframe={showWireframe}
        onToggleWireframe={() => setShowWireframe(!showWireframe)}
        showCenterGuide={showCenterGuide}
        onToggleCenterGuide={() => setShowCenterGuide(!showCenterGuide)}
        onResetCamera={() => viewerRef.current?.resetCamera()}
        onCaptureSnapshot={() => viewerRef.current?.captureSnapshot()}
        onFileUpload={handleModelFile}
        telemetry={telemetry}
        hasCustomModel={!!customShapeData}
        hotspots={hotspots}
        selectedHotspotIndex={selectedHotspotIndex}
        onSelectHotspotIndex={handleSelectHotspot}
      />

      {/* Drag & Drop Visual Indicator */}
      {isDraggingFile && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center pointer-events-none">
          <div className="p-8 border-2 border-dashed border-white/60 rounded-3xl flex flex-col items-center gap-3 text-white">
            <div className="text-xl font-mono uppercase tracking-widest font-semibold">Drop 3D Geometry</div>
            <div className="text-sm font-sans opacity-75">Accepts .obj, .glb, or .gltf files to sample into particles</div>
          </div>
        </div>
      )}
    </div>
  );
};

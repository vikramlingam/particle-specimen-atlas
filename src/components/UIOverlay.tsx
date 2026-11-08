import React, { useState, useRef } from 'react';
import {
  RotateCcw,
  Play,
  Pause,
  Sun,
  Moon,
  Camera,
  Upload,
  Box,
  Compass,
  Sliders,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Eye
} from 'lucide-react';
import { ShapeId, ProjectedHotspot } from './SpecimenViewer';
import { EducationalCard } from './EducationalCard';
import { LeaderLine } from './LeaderLine';
import { SPECIMEN_EDUCATIONAL_DB } from '../data/educationalAnnotations';

export interface TelemetryData {
  fps: number;
  camX: number;
  camY: number;
  camZ: number;
  zoom: number;
  specimenName: string;
  catalogId: string;
  dimensions: { x: number; y: number; z: number };
}

export interface UIOverlayProps {
  activeShape: ShapeId;
  onSelectShape: (shape: ShapeId) => void;
  noiseScale: number;
  onChangeNoiseScale: (v: number) => void;
  noiseSpeed: number;
  onChangeNoiseSpeed: (v: number) => void;
  noiseAmplitude: number;
  onChangeNoiseAmplitude: (v: number) => void;
  particleSize: number;
  onChangeParticleSize: (v: number) => void;
  colorPaletteMode: number;
  onChangeColorPaletteMode: (v: number) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  paused: boolean;
  onTogglePause: () => void;
  showWireframe: boolean;
  onToggleWireframe: () => void;
  showCenterGuide: boolean;
  onToggleCenterGuide: () => void;
  onResetCamera: () => void;
  onCaptureSnapshot: () => void;
  onFileUpload: (file: File) => void;
  telemetry: TelemetryData;
  hasCustomModel: boolean;
  hotspots: ProjectedHotspot[];
  selectedHotspotIndex: number | null;
  onSelectHotspotIndex: (index: number | null) => void;
}

const ALL_SPECIMENS: { id: ShapeId; label: string; number: string; category: string }[] = [
  // Anatomy
  { id: 'heart', label: 'Anatomical Heart', number: '01', category: 'Anatomy' },
  { id: 'brain', label: 'Human Brain', number: '02', category: 'Anatomy' },
  { id: 'lungs', label: 'Lungs & Trachea', number: '03', category: 'Anatomy' },
  { id: 'eye', label: 'Human Eye', number: '04', category: 'Anatomy' },
  { id: 'tooth', label: 'Molar Tooth', number: '05', category: 'Anatomy' },
  { id: 'kidney', label: 'Human Kidney', number: '06', category: 'Anatomy' },
  { id: 'ear', label: 'Ear & Cochlea', number: '07', category: 'Anatomy' },
  { id: 'knee', label: 'Synovial Knee', number: '08', category: 'Anatomy' },

  // Biology
  { id: 'dna', label: 'DNA Double Helix', number: '09', category: 'Biology' },
  { id: 'bacteriophage', label: 'Bacteriophage T4', number: '10', category: 'Biology' },
  { id: 'neuron', label: 'Neuron & Synapse', number: '11', category: 'Biology' },
  { id: 'chloroplast', label: 'Plant Chloroplast', number: '12', category: 'Biology' },
  { id: 'mitochondrion', label: 'Mitochondrion', number: '13', category: 'Biology' },
  { id: 'virus', label: 'Coronavirus Virion', number: '14', category: 'Biology' },

  // Cosmos
  { id: 'earth', label: 'Earth & Core', number: '15', category: 'Cosmos' },
  { id: 'saturn', label: 'Saturn & Rings', number: '16', category: 'Cosmos' },
  { id: 'galaxy', label: 'Spiral Galaxy', number: '17', category: 'Cosmos' },
  { id: 'blackhole', label: 'Kerr Black Hole', number: '18', category: 'Cosmos' },
  { id: 'magnetosphere', label: 'Earth Magnetosphere', number: '19', category: 'Cosmos' },

  // Physics
  { id: 'atom', label: 'Bohr Atom', number: '20', category: 'Physics' },
  { id: 'fusion', label: 'Tokamak Fusion', number: '21', category: 'Physics' },
  { id: 'collider', label: 'Particle Collider', number: '22', category: 'Physics' },
  { id: 'tornado', label: 'Atmospheric Tornado', number: '23', category: 'Physics' },

  // Engineering
  { id: 'rocket', label: 'Launch Rocket', number: '24', category: 'Engineering' },
  { id: 'piston', label: 'Engine Piston', number: '25', category: 'Engineering' },
  { id: 'jet', label: 'Turbofan Jet', number: '26', category: 'Engineering' },
  { id: 'microchip', label: 'Microprocessor Die', number: '27', category: 'Engineering' },
  { id: 'jwst', label: 'Webb Space Telescope', number: '28', category: 'Engineering' },

  // Zoology
  { id: 'whale', label: 'Blue Whale', number: '29', category: 'Zoology' },
  { id: 'rex', label: 'T-Rex Skull', number: '30', category: 'Zoology' },
  { id: 'nautilus', label: 'Nautilus Shell', number: '31', category: 'Zoology' },
  { id: 'wing', label: 'Bird Flight Wing', number: '32', category: 'Zoology' },

  // Nature & Form
  { id: 'rose', label: 'Rose Bouquet', number: '33', category: 'Nature' },
  { id: 'cloud', label: 'Cumulus Cloud', number: '34', category: 'Nature' },
  { id: 'bust', label: 'Human Bust', number: '35', category: 'Nature' },
];

const CATEGORIES = ['All', 'Anatomy', 'Biology', 'Cosmos', 'Physics', 'Engineering', 'Zoology', 'Nature'];

const PALETTE_OPTIONS = [
  { id: 0, label: 'Natural Specimen' },
  { id: 1, label: 'Botanical Rose' },
  { id: 2, label: 'Ethereal Dusk' },
  { id: 3, label: 'Celestial Azure' },
  { id: 4, label: 'Monochrome Blueprint' },
  { id: 5, label: 'Acid Sage' },
];

export const UIOverlay: React.FC<UIOverlayProps> = ({
  activeShape,
  onSelectShape,
  noiseScale,
  onChangeNoiseScale,
  noiseSpeed,
  onChangeNoiseSpeed,
  noiseAmplitude,
  onChangeNoiseAmplitude,
  particleSize,
  onChangeParticleSize,
  colorPaletteMode,
  onChangeColorPaletteMode,
  theme,
  onToggleTheme,
  autoRotate,
  onToggleAutoRotate,
  paused,
  onTogglePause,
  showWireframe,
  onToggleWireframe,
  showCenterGuide,
  onToggleCenterGuide,
  onResetCamera,
  onCaptureSnapshot,
  onFileUpload,
  telemetry,
  hasCustomModel,
  hotspots,
  selectedHotspotIndex,
  onSelectHotspotIndex
}) => {
  const [controlsExpanded, setControlsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabStripRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  const scrollTabs = (offset: number) => {
    if (tabStripRef.current) {
      tabStripRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const filteredSpecimens = activeCategory === 'All'
    ? ALL_SPECIMENS
    : ALL_SPECIMENS.filter((s) => s.category === activeCategory);

  const currentSpecimenMeta = ALL_SPECIMENS.find((s) => s.id === activeShape);
  const eduData = SPECIMEN_EDUCATIONAL_DB[activeShape];
  const rawHotspot = selectedHotspotIndex !== null && eduData?.hotspots
    ? eduData.hotspots[selectedHotspotIndex]
    : null;
  const projectedHs = selectedHotspotIndex !== null ? hotspots[selectedHotspotIndex] : null;
  const activeHotspot: ProjectedHotspot | null = rawHotspot
    ? {
        ...rawHotspot,
        screenX: projectedHs?.screenX ?? (typeof window !== 'undefined' ? window.innerWidth * 0.48 : 500),
        screenY: projectedHs?.screenY ?? (typeof window !== 'undefined' ? window.innerHeight * 0.5 : 400),
        visible: projectedHs?.visible ?? true,
      }
    : null;

  return (
    <div className={`pointer-events-none absolute inset-0 select-none overflow-hidden transition-colors duration-500 ${
      isLight ? 'text-[#16181D]' : 'text-[#F4F4F2]'
    }`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".obj,.gltf,.glb"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* SVG CONNECTING LEADER LINE */}
      <LeaderLine hotspot={activeHotspot} theme={theme} />

      {/* 3D HOTSPOT CONNECTOR PINS OVER CANVAS */}
      {(eduData?.hotspots || []).map((hs, i) => {
        const projected = hotspots[i];
        if (projected && !projected.visible) return null;
        const screenX = projected ? projected.screenX : null;
        const screenY = projected ? projected.screenY : null;
        if (screenX === null || screenY === null) return null;
        const isSelected = selectedHotspotIndex === i;

        return (
          <div
            key={hs.id}
            style={{ left: screenX, top: screenY }}
            className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
            onClick={() => onSelectHotspotIndex(isSelected ? null : i)}
          >
            {/* Outer pulse indicator */}
            <div className={`absolute -inset-2.5 rounded-full border transition-all ${
              isSelected
                ? isLight ? 'border-[#16181D] scale-125' : 'border-white scale-125'
                : 'border-current/25 group-hover:scale-110 group-hover:border-current/50'
            }`} />

            {/* Inner pin button */}
            <div className={`relative flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-mono font-bold shadow-lg transition-all ${
              isSelected
                ? isLight
                  ? 'bg-[#16181D] text-white ring-2 ring-black/20'
                  : 'bg-white text-black ring-2 ring-white/30'
                : isLight
                  ? 'bg-white/95 text-[#16181D] border border-black/25 group-hover:bg-[#16181D] group-hover:text-white'
                  : 'bg-[#181A1F]/95 text-[#F4F4F2] border border-white/25 group-hover:bg-white group-hover:text-black'
            }`}>
              {String(i + 1).padStart(2, '0')}
            </div>

            {/* Hover tooltip label */}
            <div className={`pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase border shadow-md transition-all opacity-0 group-hover:opacity-100 ${
              isLight ? 'bg-white/95 border-black/10 text-black' : 'bg-[#181A1F]/95 border-white/10 text-white'
            }`}>
              {hs.name}
            </div>
          </div>
        );
      })}

      {/* SLIDE-OUT EDUCATIONAL INSPECTION CARD */}
      {activeHotspot && eduData && (
        <EducationalCard
          hotspot={activeHotspot}
          specimenName={eduData.scientificName}
          category={eduData.category}
          totalHotspots={eduData.hotspots.length}
          currentIndex={selectedHotspotIndex || 0}
          onSelectIndex={onSelectHotspotIndex}
          onClose={() => onSelectHotspotIndex(null)}
          theme={theme}
        />
      )}

      {/* TOP LEFT BRANDING & SPECIMEN METADATA */}
      <div className="absolute top-6 left-6 flex items-start gap-3 pointer-events-auto">
        <div className={`w-2.5 h-2.5 border-t-2 border-l-2 ${isLight ? 'border-[#1A1C20]/40' : 'border-white/40'}`} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.2em] font-semibold opacity-60">MORPH ATLAS</span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full border border-current opacity-40">
              {eduData?.category || 'EDUCATIONAL'}
            </span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight uppercase font-mono mt-0.5">
            {currentSpecimenMeta
              ? `SPECIMEN // ${currentSpecimenMeta.number}-${currentSpecimenMeta.label.toUpperCase().replace(/\s+/g, '_')}`
              : (telemetry.catalogId || 'SPECIMEN // SPECIMEN')}
          </h1>
          <p className="text-[11px] font-sans opacity-60 mt-0.5 max-w-[320px] truncate">
            {eduData?.scientificName || telemetry.specimenName}
          </p>

          {/* Quick Guide Trigger Button */}
          {hotspots.length > 0 && selectedHotspotIndex === null && (
            <button
              onClick={() => onSelectHotspotIndex(0)}
              className={`mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border transition-all w-fit ${
                isLight
                  ? 'bg-white/80 hover:bg-white border-black/15'
                  : 'bg-[#181A1F]/80 hover:bg-[#20232A] border-white/15'
              }`}
            >
              <BookOpen size={11} />
              <span>Inspect {hotspots.length} Features</span>
            </button>
          )}
        </div>
      </div>

      {/* TOP RIGHT TELEMETRY & TOOLBAR */}
      <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-auto">
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider border ${
          isLight ? 'bg-white/70 border-black/10' : 'bg-[#181A1F]/70 border-white/10'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>100,000 PTS</span>
        </div>

        <div className={`hidden md:flex items-center px-2 py-1 rounded-full text-[10px] font-mono border ${
          isLight ? 'bg-white/70 border-black/10' : 'bg-[#181A1F]/70 border-white/10'
        }`}>
          <span>{telemetry.fps} FPS</span>
        </div>

        {/* Wireframe Toggle */}
        <button
          onClick={onToggleWireframe}
          title={showWireframe ? 'Hide Bounding Wireframe' : 'Show Bounding Wireframe'}
          className={`p-2 rounded-full border transition-all ${
            showWireframe
              ? isLight ? 'bg-[#1A1C20] text-white border-transparent' : 'bg-white text-black border-transparent'
              : isLight ? 'bg-white/70 hover:bg-white border-black/10' : 'bg-[#181A1F]/70 hover:bg-[#20232A] border-white/10'
          }`}
        >
          <Box size={14} />
        </button>

        {/* Plumb Axis Guide Toggle */}
        <button
          onClick={onToggleCenterGuide}
          title={showCenterGuide ? 'Hide Plumb Guide' : 'Show Plumb Guide'}
          className={`p-2 rounded-full border transition-all ${
            showCenterGuide
              ? isLight ? 'bg-[#1A1C20] text-white border-transparent' : 'bg-white text-black border-transparent'
              : isLight ? 'bg-white/70 hover:bg-white border-black/10' : 'bg-[#181A1F]/70 hover:bg-[#20232A] border-white/10'
          }`}
        >
          <Compass size={14} />
        </button>

        {/* Custom 3D Model Upload (.obj / .glb) */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import Custom 3D Mesh (.obj, .glb, .gltf)"
          className={`p-2 rounded-full border transition-all ${
            isLight ? 'bg-white/70 hover:bg-white border-black/10' : 'bg-[#181A1F]/70 hover:bg-[#20232A] border-white/10'
          }`}
        >
          <Upload size={14} />
        </button>

        {/* Snapshot Capture */}
        <button
          onClick={onCaptureSnapshot}
          title="Export Specimen Snapshot (PNG)"
          className={`p-2 rounded-full border transition-all ${
            isLight ? 'bg-white/70 hover:bg-white border-black/10' : 'bg-[#181A1F]/70 hover:bg-[#20232A] border-white/10'
          }`}
        >
          <Camera size={14} />
        </button>

        {/* Dark / Light Canvas Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${isLight ? 'Dark Obsidian' : 'Light Canvas'} Mode`}
          className={`p-2 rounded-full border transition-all ${
            isLight ? 'bg-white/70 hover:bg-white border-black/10' : 'bg-[#181A1F]/70 hover:bg-[#20232A] border-white/10'
          }`}
        >
          {isLight ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>

      {/* BOTTOM LEFT ARCHITECTURAL COORDINATES */}
      <div className="absolute bottom-6 left-6 hidden lg:flex flex-col gap-1 pointer-events-auto">
        <div className={`text-[9px] font-mono tracking-widest uppercase opacity-50 flex items-center gap-2`}>
          <span>VIEWPORT TELEMETRY</span>
          <div className="w-8 h-[1px] bg-current opacity-30" />
        </div>
        <div className="text-[10px] font-mono opacity-70 leading-relaxed">
          X: {telemetry.camX >= 0 ? `+${telemetry.camX.toFixed(2)}` : telemetry.camX.toFixed(2)} &nbsp;
          Y: {telemetry.camY >= 0 ? `+${telemetry.camY.toFixed(2)}` : telemetry.camY.toFixed(2)} &nbsp;
          Z: {telemetry.camZ >= 0 ? `+${telemetry.camZ.toFixed(2)}` : telemetry.camZ.toFixed(2)}
        </div>
        <div className="text-[9px] font-mono opacity-50">
          BOUNDS: {telemetry.dimensions.x.toFixed(1)} × {telemetry.dimensions.y.toFixed(1)} × {telemetry.dimensions.z.toFixed(1)} UNITS
        </div>
      </div>

      {/* FLOATING GLASSMORHPIC CONTROL PILL (CENTER BOTTOM) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto w-[96%] sm:w-[92%] md:w-auto max-w-4xl z-20">
        
        {/* EXPANDABLE SLIDER DRAWER */}
        {controlsExpanded && (
          <div className={`w-full mb-3 p-4 rounded-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
            isLight ? 'glass-panel-light' : 'glass-panel-dark'
          }`}>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
              <div className="flex items-center gap-2">
                <Sliders size={13} className="opacity-70" />
                <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">CURL DYNAMICS & RENDERING</span>
              </div>
              <button
                onClick={() => setControlsExpanded(false)}
                className="text-[10px] font-mono opacity-50 hover:opacity-100 uppercase"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="opacity-70">Flow Speed</span>
                  <span className="font-semibold">{noiseSpeed.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={noiseSpeed}
                  onChange={(e) => onChangeNoiseSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="opacity-70">Noise Scale</span>
                  <span className="font-semibold">{noiseScale.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.2"
                  step="0.02"
                  value={noiseScale}
                  onChange={(e) => onChangeNoiseScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="opacity-70">Turbulence Force</span>
                  <span className="font-semibold">{noiseAmplitude.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.02"
                  value={noiseAmplitude}
                  onChange={(e) => onChangeNoiseAmplitude(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="opacity-70">Point Size</span>
                  <span className="font-semibold">{particleSize.toFixed(1)}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="3.5"
                  step="0.1"
                  value={particleSize}
                  onChange={(e) => onChangeParticleSize(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Color Scheme Palette Selector */}
            <div className="mt-4 pt-3 border-t border-current/10">
              <div className="text-[10px] font-mono tracking-widest uppercase opacity-70 mb-2">
                Color Palette
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
                {PALETTE_OPTIONS.map((pal) => (
                  <button
                    key={pal.id}
                    onClick={() => onChangeColorPaletteMode(pal.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-center transition-all border ${
                      colorPaletteMode === pal.id
                        ? isLight
                          ? 'bg-[#1A1C20] text-white border-transparent'
                          : 'bg-white text-black border-transparent font-medium'
                        : isLight
                          ? 'hover:bg-black/5 border-black/10'
                          : 'hover:bg-white/5 border-white/10'
                    }`}
                  >
                    {pal.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORY SELECTOR CHIPS */}
        <div className="flex items-center gap-1 mb-2 px-2 py-1 rounded-full border text-[10px] font-mono backdrop-blur-md overflow-x-auto no-scrollbar max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? isLight
                    ? 'bg-[#16181D] text-white font-semibold'
                    : 'bg-white text-black font-semibold'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRIMARY FLOATING GLASS PILL WITH SPECIMEN TABS */}
        <div className={`flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full border shadow-2xl transition-all max-w-full ${
          isLight ? 'glass-panel-light' : 'glass-panel-dark'
        }`}>
          <button
            onClick={() => scrollTabs(-160)}
            className="p-1 rounded-full hover:bg-current/10 opacity-60 hover:opacity-100 flex-shrink-0"
            title="Scroll Left"
          >
            <ChevronLeft size={13} />
          </button>

          <div
            ref={tabStripRef}
            className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar scroll-smooth px-1"
          >
            {filteredSpecimens.map((tab) => {
              const isSelected = activeShape === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onSelectShape(tab.id);
                    onSelectHotspotIndex(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    isSelected
                      ? isLight
                        ? 'bg-[#1A1C20] text-white shadow-sm font-medium'
                        : 'bg-white text-black shadow-sm font-semibold'
                      : isLight
                        ? 'text-[#4A4D55] hover:text-black hover:bg-black/5'
                        : 'text-[#9A9EA6] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-[9px] opacity-40 font-mono">{tab.number}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {hasCustomModel && (
              <button
                onClick={() => {
                  onSelectShape('custom');
                  onSelectHotspotIndex(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeShape === 'custom'
                    ? isLight
                      ? 'bg-[#1A1C20] text-white shadow-sm font-medium'
                      : 'bg-white text-black shadow-sm font-semibold'
                    : isLight
                      ? 'text-[#4A4D55] hover:text-black hover:bg-black/5'
                      : 'text-[#9A9EA6] hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[9px] opacity-40 font-mono">USR</span>
                <span>Custom</span>
              </button>
            )}
          </div>

          <button
            onClick={() => scrollTabs(160)}
            className="p-1 rounded-full hover:bg-current/10 opacity-60 hover:opacity-100 flex-shrink-0"
            title="Scroll Right"
          >
            <ChevronRight size={13} />
          </button>

          <div className="w-[1px] h-5 bg-current opacity-15 mx-0.5 flex-shrink-0" />

          {/* Quick Slider Expansion Toggle */}
          <button
            onClick={() => setControlsExpanded(!controlsExpanded)}
            title="Adjust Curl, Size & Color Sliders"
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              controlsExpanded
                ? isLight ? 'bg-black/10' : 'bg-white/15'
                : 'hover:bg-current/10'
            }`}
          >
            <Sliders size={14} />
          </button>

          {/* Play / Pause Curl Animation */}
          <button
            onClick={onTogglePause}
            title={paused ? 'Resume Curl Dynamics' : 'Pause Simulation'}
            className="p-2 rounded-full hover:bg-current/10 transition-all flex-shrink-0"
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Disable Orbit Auto-Rotate' : 'Enable Orbit Auto-Rotate'}
            className={`p-2 rounded-full transition-all flex-shrink-0 ${
              autoRotate
                ? isLight ? 'bg-[#1A1C20] text-white' : 'bg-white text-black'
                : 'hover:bg-current/10'
            }`}
          >
            <RotateCcw size={14} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          </button>

          {/* Reset Camera View */}
          <button
            onClick={onResetCamera}
            title="Reset Camera View"
            className="p-2 rounded-full hover:bg-current/10 transition-all flex-shrink-0"
          >
            <Compass size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Lightbulb } from 'lucide-react';
import { SpecimenHotspot } from '../data/educationalAnnotations';

export interface EducationalCardProps {
  hotspot: SpecimenHotspot | null;
  specimenName: string;
  category: string;
  totalHotspots: number;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export const EducationalCard: React.FC<EducationalCardProps> = ({
  hotspot,
  specimenName,
  category,
  totalHotspots,
  currentIndex,
  onSelectIndex,
  onClose,
  theme
}) => {
  if (!hotspot) return null;

  const isLight = theme === 'light';

  return (
    <div
      id="educational-card-container"
      className={`pointer-events-auto absolute top-20 right-6 sm:right-8 w-[92%] sm:w-96 max-w-full p-5 rounded-2xl border shadow-2xl transition-all duration-300 z-30 animate-in fade-in slide-in-from-right-4 ${
        isLight ? 'glass-panel-light text-[#16181D]' : 'glass-panel-dark text-[#F4F4F2]'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border border-current/20 opacity-80">
            {category}
          </span>
          <span className="text-[10px] font-mono opacity-50">
            FEATURE {currentIndex + 1} OF {totalHotspots}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-current/10 opacity-60 hover:opacity-100 transition-all"
          title="Close Feature Details"
        >
          <X size={14} />
        </button>
      </div>

      {/* Part Title & Subtitle */}
      <div className="mb-3">
        <div className="text-[10px] font-mono tracking-widest uppercase opacity-50 mb-0.5">
          {specimenName}
        </div>
        <h2 className="text-base font-bold font-mono tracking-tight uppercase">
          {hotspot.name}
        </h2>
        <div className="text-xs font-sans font-medium opacity-70 mt-0.5">
          {hotspot.sub}
        </div>
      </div>

      {/* Primary Description (Plain language, zero AI buzzwords, zero em dashes) */}
      <p className="text-xs font-sans leading-relaxed opacity-85 mb-4">
        {hotspot.description}
      </p>

      {/* Did You Know / Key Fact Callout */}
      <div className={`p-3 rounded-xl border mb-4 ${
        isLight ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.04] border-white/10'
      }`}>
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wider uppercase opacity-80 mb-1">
          <Lightbulb size={12} className="text-amber-500" />
          <span>Did You Know?</span>
        </div>
        <p className="text-[11px] font-sans leading-relaxed opacity-75">
          {hotspot.fact}
        </p>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-current/10">
        <button
          onClick={() => onSelectIndex((currentIndex - 1 + totalHotspots) % totalHotspots)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            isLight ? 'hover:bg-black/5 border-black/10' : 'hover:bg-white/5 border-white/10'
          }`}
          title="Previous Feature"
        >
          <ChevronLeft size={13} />
          <span>Previous</span>
        </button>

        <span className="text-[10px] font-mono opacity-40">
          {currentIndex + 1} / {totalHotspots}
        </span>

        <button
          onClick={() => onSelectIndex((currentIndex + 1) % totalHotspots)}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono border transition-all ${
            isLight ? 'hover:bg-black/5 border-black/10' : 'hover:bg-white/5 border-white/10'
          }`}
          title="Next Feature"
        >
          <span>Next</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};


import React from 'react';
import { ProjectedHotspot } from './SpecimenViewer';

export interface LeaderLineProps {
  hotspot: ProjectedHotspot | null;
  theme: 'dark' | 'light';
}

export const LeaderLine: React.FC<LeaderLineProps> = ({ hotspot, theme }) => {
  if (!hotspot || !hotspot.visible) return null;

  const isLight = theme === 'light';
  const lineColor = isLight ? '#16181D' : '#F4F4F2';

  // Card anchor point (approximate left border of #educational-card-container)
  // On desktop, card is top-20 right-6/8 (around window.innerWidth - 380px, top ~140px)
  const cardElem = typeof document !== 'undefined' ? document.getElementById('educational-card-container') : null;
  let targetX = typeof window !== 'undefined' ? window.innerWidth - 384 : 1000;
  let targetY = 160;

  if (cardElem) {
    const rect = cardElem.getBoundingClientRect();
    targetX = rect.left;
    targetY = rect.top + 60;
  }

  const startX = hotspot.screenX;
  const startY = hotspot.screenY;

  // Architectural dog-leg path:
  // Starts at hotspot (startX, startY), extends right/left, then bends toward target
  const midX = startX < targetX ? startX + Math.max(30, (targetX - startX) * 0.45) : startX - 40;

  const pathD = `M ${startX} ${startY} L ${midX} ${startY} L ${targetX} ${targetY}`;

  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full z-25 overflow-visible">
      {/* Outer subtle shadow/glow */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeOpacity={isLight ? 0.08 : 0.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Primary hairline blueprint stroke */}
      <path
        d={pathD}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.2"
        strokeOpacity={isLight ? 0.45 : 0.65}
        strokeDasharray="4 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pulsing origin connector dot */}
      <circle
        cx={startX}
        cy={startY}
        r="4.5"
        fill={lineColor}
        fillOpacity={isLight ? 0.85 : 0.95}
      />
      <circle
        cx={startX}
        cy={startY}
        r="9"
        fill="none"
        stroke={lineColor}
        strokeWidth="1.2"
        strokeOpacity={isLight ? 0.35 : 0.45}
        className="animate-ping"
        style={{ animationDuration: '2.5s' }}
      />
      {/* Target anchor terminal dot */}
      <circle
        cx={targetX}
        cy={targetY}
        r="3"
        fill={lineColor}
        fillOpacity={isLight ? 0.6 : 0.75}
      />
    </svg>
  );
};


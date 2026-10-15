import React, { useState } from 'react';
import { SupportedLanguage } from '../../types';

interface Props {
  language: SupportedLanguage;
}

export const CircleVisualizer: React.FC<Props> = ({ language }) => {
  const [h, setH] = useState<number>(1);
  const [k, setK] = useState<number>(2);
  const [radius, setRadius] = useState<number>(4);
  const [centralAngle, setCentralAngle] = useState<number>(90);

  const cx = 150;
  const cy = 150;
  const scale = 18;

  const svgH = cx + h * scale;
  const svgK = cy - k * scale;
  const svgR = radius * scale;

  // Arc endpoint calculations for central angle (starting at angle 0 along +x axis)
  const angleRad = (centralAngle * Math.PI) / 180;
  const arcEndX = svgH + svgR * Math.cos(angleRad);
  const arcEndY = svgK - svgR * Math.sin(angleRad); // SVG y is inverted
  const arcStartX = svgH + svgR;
  const arcStartY = svgK;

  const largeArcFlag = centralAngle > 180 ? 1 : 0;
  const arcPath = `M ${svgH} ${svgK} L ${arcStartX} ${arcStartY} A ${svgR} ${svgR} 0 ${largeArcFlag} 0 ${arcEndX} ${arcEndY} Z`;

  // Math calculations
  const arcLengthPi = (centralAngle / 360) * 2 * radius;
  const sectorAreaPi = (centralAngle / 360) * Math.pow(radius, 2);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white">Circle Equation & Arc Length Explorer</h4>
          <p className="text-xs text-slate-400">Standard Form: (x - h)² + (y - k)² = r². Radius r = √Constant.</p>
        </div>
        <div className="text-right font-mono text-sm px-3 py-1 bg-slate-800 rounded border border-slate-700 text-sky-300">
          (x {h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})² + (y {k >= 0 ? `- ${k}` : `+ ${Math.abs(k)}`})² = {Math.pow(radius, 2)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-center">
        {/* SVG Canvas */}
        <div className="md:col-span-7 flex justify-center bg-slate-950 rounded-lg p-2 border border-slate-800/80">
          <svg width="300" height="300" className="overflow-hidden">
            {/* Grid */}
            {[-6, -4, -2, 2, 4, 6].map(tick => (
              <React.Fragment key={tick}>
                <line x1={cx + tick * scale} y1={10} x2={cx + tick * scale} y2={290} stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />
                <line x1={10} y1={cy + tick * scale} x2={290} y2={cy + tick * scale} stroke="#334155" strokeWidth="0.75" strokeDasharray="2 2" />
              </React.Fragment>
            ))}

            {/* Axes */}
            <line x1={10} y1={cy} x2={290} y2={cy} stroke="#64748b" strokeWidth="1.5" />
            <line x1={cx} y1={10} x2={cx} y2={290} stroke="#64748b" strokeWidth="1.5" />

            {/* Sector / Central Angle shaded */}
            <path d={arcPath} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="1.5" />

            {/* Full Circle outline */}
            <circle cx={svgH} cy={svgK} r={svgR} fill="none" stroke="#60a5fa" strokeWidth="2" strokeDasharray="3 3" />

            {/* Center Point */}
            <circle cx={svgH} cy={svgK} r="4" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
            <text x={svgH + 6} y={svgK - 6} fill="#7dd3fc" fontSize="10" className="font-mono font-medium">
              ({h}, {k})
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Center X-coordinate (h)</span>
              <span className="font-mono font-bold text-sky-400">{h}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="1"
              value={h}
              onChange={e => setH(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Center Y-coordinate (k)</span>
              <span className="font-mono font-bold text-sky-400">{k}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="1"
              value={k}
              onChange={e => setK(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Radius (r)</span>
              <span className="font-mono font-bold text-indigo-400">{radius} (r² = {Math.pow(radius, 2)})</span>
            </div>
            <input
              type="range"
              min="2"
              max="6"
              step="1"
              value={radius}
              onChange={e => setRadius(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Central Angle (θ)</span>
              <span className="font-mono font-bold text-amber-400">{centralAngle}°</span>
            </div>
            <input
              type="range"
              min="30"
              max="360"
              step="15"
              value={centralAngle}
              onChange={e => setCentralAngle(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Computed Arc metrics */}
          <div className="p-3 bg-slate-800/70 rounded-lg text-xs space-y-1.5 border border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Arc Length:</span>
              <span className="font-mono font-semibold text-sky-300">
                ({centralAngle}/360) · 2π({radius}) = {arcLengthPi % 1 === 0 ? arcLengthPi : arcLengthPi.toFixed(2)}π
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Sector Area:</span>
              <span className="font-mono font-semibold text-amber-300">
                ({centralAngle}/360) · π({radius}²) = {sectorAreaPi % 1 === 0 ? sectorAreaPi : sectorAreaPi.toFixed(2)}π
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

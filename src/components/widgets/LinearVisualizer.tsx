import React, { useState } from 'react';
import { SupportedLanguage } from '../../types';

interface Props {
  language: SupportedLanguage;
}

export const LinearVisualizer: React.FC<Props> = ({ language }) => {
  const [slope, setSlope] = useState<number>(2);
  const [intercept, setIntercept] = useState<number>(1);
  const [showPerpendicular, setShowPerpendicular] = useState<boolean>(false);

  // SVG dimensions & scale: center (150, 150), scale 20px per 1 unit
  const cx = 150;
  const cy = 150;
  const scale = 22;

  // Line points from x = -5 to x = 5
  const x1 = -5.5;
  const y1 = slope * x1 + intercept;
  const x2 = 5.5;
  const y2 = slope * x2 + intercept;

  const svgX1 = cx + x1 * scale;
  const svgY1 = cy - y1 * scale;
  const svgX2 = cx + x2 * scale;
  const svgY2 = cy - y2 * scale;

  // Perpendicular line
  const perpSlope = slope !== 0 ? -1 / slope : 0;
  const perpX1 = -5.5;
  const perpY1 = perpSlope * perpX1 + intercept;
  const perpX2 = 5.5;
  const perpY2 = perpSlope * perpX2 + intercept;

  const svgPerpX1 = cx + perpX1 * scale;
  const svgPerpY1 = cy - perpY1 * scale;
  const svgPerpX2 = cx + perpX2 * scale;
  const svgPerpY2 = cy - perpY2 * scale;

  const interceptSvgY = cy - intercept * scale;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white">Interactive Slope & Rate of Change Sandbox</h4>
          <p className="text-xs text-slate-400">Observe how slope controls steepness and y-intercept shifts the line vertically.</p>
        </div>
        <div className="text-right font-mono text-sm px-3 py-1 bg-slate-800 rounded border border-slate-700 text-indigo-300">
          y = {slope}x {intercept >= 0 ? `+ ${intercept}` : `- ${Math.abs(intercept)}`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-center">
        {/* SVG Canvas */}
        <div className="md:col-span-7 flex justify-center bg-slate-950 rounded-lg p-2 border border-slate-800/80">
          <svg width="300" height="300" className="overflow-hidden">
            {/* Grid lines */}
            {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5].map(tick => (
              <React.Fragment key={tick}>
                <line
                  x1={cx + tick * scale}
                  y1={10}
                  x2={cx + tick * scale}
                  y2={290}
                  stroke="#334155"
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                />
                <line
                  x1={10}
                  y1={cy + tick * scale}
                  x2={290}
                  y2={cy + tick * scale}
                  stroke="#334155"
                  strokeWidth="0.75"
                  strokeDasharray="2 2"
                />
              </React.Fragment>
            ))}

            {/* Axes */}
            <line x1={10} y1={cy} x2={290} y2={cy} stroke="#64748b" strokeWidth="1.5" />
            <line x1={cx} y1={10} x2={cx} y2={290} stroke="#64748b" strokeWidth="1.5" />
            <text x={280} y={cy - 6} fill="#94a3b8" fontSize="10" className="font-mono">x</text>
            <text x={cx + 6} y={20} fill="#94a3b8" fontSize="10" className="font-mono">y</text>

            {/* Perpendicular Line */}
            {showPerpendicular && slope !== 0 && (
              <line
                x1={svgPerpX1}
                y1={svgPerpY1}
                x2={svgPerpX2}
                y2={svgPerpY2}
                stroke="#f43f5e"
                strokeWidth="2"
                strokeDasharray="4 3"
              />
            )}

            {/* Main Line */}
            <line
              x1={svgX1}
              y1={svgY1}
              x2={svgX2}
              y2={svgY2}
              stroke="#6366f1"
              strokeWidth="2.5"
            />

            {/* Y-intercept point */}
            <circle cx={cx} cy={interceptSvgY} r="5" fill="#38bdf8" stroke="#0f172a" strokeWidth="1.5" />
            <text x={cx + 8} y={interceptSvgY + 4} fill="#38bdf8" fontSize="10" className="font-mono font-medium">
              (0, {intercept})
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Slope (m = rate of change)</span>
              <span className="font-mono font-bold text-indigo-400">{slope}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="0.5"
              value={slope}
              onChange={e => setSlope(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-4 (Downhill)</span>
              <span>0 (Flat)</span>
              <span>+4 (Uphill)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Y-Intercept (b = starting value)</span>
              <span className="font-mono font-bold text-sky-400">{intercept}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="1"
              value={intercept}
              onChange={e => setIntercept(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-4</span>
              <span>0</span>
              <span>+4</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={showPerpendicular}
                onChange={e => setShowPerpendicular(e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span>Show Perpendicular Line (slope = {perpSlope !== 0 ? perpSlope.toFixed(2) : 'undef'})</span>
            </label>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-lg text-xs space-y-1 text-slate-300 border border-slate-700/60">
            <div className="font-medium text-white">SAT Key Takeaway:</div>
            <p>
              When slope is positive, y grows as x increases. When two lines are perpendicular, their slopes multiply to -1: ({slope}) · ({perpSlope.toFixed(2)}) = -1.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

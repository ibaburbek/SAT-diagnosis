import React, { useState } from 'react';
import { SupportedLanguage } from '../../types';

interface Props {
  language: SupportedLanguage;
}

export const QuadraticVisualizer: React.FC<Props> = ({ language }) => {
  const [a, setA] = useState<number>(1);
  const [h, setH] = useState<number>(2);
  const [k, setK] = useState<number>(-3);

  // SVG coordinate system: 300x300, center (150, 150), scale 18px per unit
  const cx = 150;
  const cy = 150;
  const scale = 18;

  // Vertex in SVG space
  const svgVx = cx + h * scale;
  const svgVy = cy - k * scale;

  // Build points for parabola
  const points: string[] = [];
  for (let x = -7; x <= 7; x += 0.2) {
    const y = a * Math.pow(x - h, 2) + k;
    const px = cx + x * scale;
    const py = cy - y * scale;
    if (py >= -50 && py <= 350) {
      points.push(`${px},${py}`);
    }
  }

  // Calculate standard form coefficients: y = a(x² - 2hx + h²) + k = ax² - 2ah x + (ah² + k)
  const bCoeff = -2 * a * h;
  const cCoeff = a * Math.pow(h, 2) + k;
  const discriminant = Math.pow(bCoeff, 2) - 4 * a * cCoeff;

  let rootCountDesc = '';
  if (discriminant > 0) rootCountDesc = '2 Distinct Real Roots (Crosses x-axis twice)';
  else if (Math.abs(discriminant) < 0.001) rootCountDesc = '1 Real Root (Tangent vertex touches x-axis)';
  else rootCountDesc = 'No Real Roots (Does not intersect x-axis)';

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white">Parabola Vertex & Discriminant Explorer</h4>
          <p className="text-xs text-slate-400">Vertex Form: y = a(x - h)² + k. Notice how the vertex is at (h, k).</p>
        </div>
        <div className="text-right font-mono text-sm px-3 py-1 bg-slate-800 rounded border border-slate-700 text-emerald-300">
          y = {a !== 1 ? (a === -1 ? '-' : a) : ''}(x {h >= 0 ? `- ${h}` : `+ ${Math.abs(h)}`})² {k >= 0 ? `+ ${k}` : `- ${Math.abs(k)}`}
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

            {/* Axis of Symmetry */}
            <line x1={svgVx} y1={10} x2={svgVx} y2={290} stroke="#eab308" strokeWidth="1" strokeDasharray="3 3" />

            {/* Parabola Curve */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={points.join(' ')}
              />
            )}

            {/* Vertex Point */}
            <circle cx={svgVx} cy={svgVy} r="5" fill="#f59e0b" stroke="#0f172a" strokeWidth="1.5" />
            <text x={svgVx + 8} y={svgVy - 6} fill="#fbbf24" fontSize="11" className="font-mono font-medium">
              V({h}, {k})
            </text>
          </svg>
        </div>

        {/* Controls */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Leading Coefficient (a: orientation)</span>
              <span className="font-mono font-bold text-emerald-400">{a}</span>
            </div>
            <input
              type="range"
              min="-2"
              max="2"
              step="0.5"
              value={a}
              onChange={e => {
                const val = parseFloat(e.target.value);
                setA(val === 0 ? 0.5 : val); // Avoid completely flat a=0
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>-2 (Opens Down)</span>
              <span>+2 (Opens Up)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Horizontal Shift (h)</span>
              <span className="font-mono font-bold text-amber-400">{h}</span>
            </div>
            <input
              type="range"
              min="-4"
              max="4"
              step="1"
              value={h}
              onChange={e => setH(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Vertical Shift / Extremum (k)</span>
              <span className="font-mono font-bold text-amber-400">{k}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="5"
              step="1"
              value={k}
              onChange={e => setK(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Discriminant Display */}
          <div className="p-3 bg-slate-800/80 rounded-lg text-xs space-y-1.5 border border-slate-700">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Discriminant (b² - 4ac):</span>
              <span className="font-mono font-bold text-sky-300">{discriminant.toFixed(1)}</span>
            </div>
            <div className="text-emerald-300 font-medium">
              ● {rootCountDesc}
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              SAT Tip: If a parabola opens up (a &gt; 0) and has vertex below the x-axis (k &lt; 0), it must have 2 real x-intercepts!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

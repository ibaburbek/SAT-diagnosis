import React, { useState } from 'react';
import { SupportedLanguage } from '../../types';

interface Props {
  language: SupportedLanguage;
}

export const RatioVisualizer: React.FC<Props> = ({ language }) => {
  const [initialAmount, setInitialAmount] = useState<number>(100);
  const [firstChange, setFirstChange] = useState<number>(20); // +20%
  const [secondChange, setSecondChange] = useState<number>(-20); // -20%

  // Multipliers
  const mult1 = 1 + firstChange / 100;
  const afterFirst = initialAmount * mult1;

  const mult2 = 1 + secondChange / 100;
  const finalAmount = afterFirst * mult2;

  const overallNetChangePercent = ((finalAmount - initialAmount) / initialAmount) * 100;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-5 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div>
          <h4 className="text-base font-semibold text-white">Percent Multiplier & Consecutive Changes Simulator</h4>
          <p className="text-xs text-slate-400">Demystifies why +20% followed by -20% does NOT return to 0%.</p>
        </div>
        <div className="font-mono text-xs px-3 py-1 bg-slate-800 rounded border border-slate-700 text-indigo-300">
          Base: ${initialAmount}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Step-by-Step Interactive Flow */}
        <div className="space-y-4">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">1st Change:</span>
              <span className={`font-mono font-bold ${firstChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {firstChange >= 0 ? `+${firstChange}%` : `${firstChange}%`} (Multiplier: ×{mult1.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={firstChange}
              onChange={e => setFirstChange(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              ${initialAmount} × {mult1.toFixed(2)} = <strong className="text-white font-mono">${afterFirst.toFixed(2)}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="text-slate-300">2nd Change (Applied to NEW intermediate amount):</span>
              <span className={`font-mono font-bold ${secondChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {secondChange >= 0 ? `+${secondChange}%` : `${secondChange}%`} (Multiplier: ×{mult2.toFixed(2)})
              </span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="5"
              value={secondChange}
              onChange={e => setSecondChange(parseInt(e.target.value, 10))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="text-[11px] text-slate-400 mt-1">
              ${afterFirst.toFixed(2)} × {mult2.toFixed(2)} = <strong className="text-white font-mono">${finalAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Visual Outcome Comparison */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Net Overall Outcome:</div>
            
            <div className="grid grid-cols-3 gap-2 text-center py-2">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">START</div>
                <div className="font-mono text-base font-bold text-white">${initialAmount}</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">STAGE 1</div>
                <div className="font-mono text-base font-bold text-sky-400">${afterFirst.toFixed(1)}</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500">FINAL</div>
                <div className="font-mono text-base font-bold text-amber-400">${finalAmount.toFixed(1)}</div>
              </div>
            </div>

            <div className="mt-3 p-3 bg-slate-900/90 rounded border border-slate-800">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Total Net Percentage Change:</span>
                <span className={`font-mono text-sm font-bold ${overallNetChangePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {overallNetChangePercent >= 0 ? `+${overallNetChangePercent.toFixed(1)}%` : `${overallNetChangePercent.toFixed(1)}%`}
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            <strong>SAT Rule:</strong> Percentages do NOT simply add together. When an item increases by 20% and drops by 20%, you multiply (1.20)(0.80) = 0.96, which is a <strong>4% net decrease</strong>!
          </div>
        </div>
      </div>
    </div>
  );
};

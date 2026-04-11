import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PROTEIN_GOAL, MEAL_PLAN, getDateKey } from '../data/workouts';
import { Plus, Trash2, Check } from 'lucide-react';

const QUICK_ADDS = [
  { label: 'Protein Shake', grams: 25 },
  { label: 'Chicken 150g', grams: 45 },
  { label: 'Eggs × 4', grams: 28 },
  { label: 'Greek Yogurt', grams: 17 },
  { label: 'Cottage Cheese', grams: 14 },
  { label: 'Tuna can', grams: 25 },
  { label: 'White Fish', grams: 40 },
  { label: 'Whey Scoop', grams: 22 },
];

function ProteinArc({ current, goal }) {
  const pct = Math.min(current / goal, 1);
  const r = 70;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const remaining = Math.max(0, goal - current);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-44 h-44">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#1e293b" strokeWidth="14" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={pct >= 1 ? '#22c55e' : '#22c55e'}
            strokeWidth="14"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            opacity={pct >= 1 ? 1 : 0.85}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{current}</span>
          <span className="text-slate-400 text-sm">/ {goal}g</span>
          {pct >= 1 ? (
            <span className="text-green-400 text-xs font-semibold mt-0.5">Goal Met! 🎉</span>
          ) : (
            <span className="text-slate-400 text-xs mt-0.5">{remaining}g left</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProteinTracker() {
  const todayKey = getDateKey();
  const [proteinLogs, setProteinLogs] = useLocalStorage('protein_logs', {});
  const [customLabel, setCustomLabel] = useState('');
  const [customGrams, setCustomGrams] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const todayLog = proteinLogs[todayKey] || { entries: [], total: 0 };
  const entries = todayLog.entries || [];
  const total = entries.reduce((s, e) => s + e.grams, 0);

  function addEntry(label, grams) {
    const entry = { id: Date.now(), label, grams, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setProteinLogs(prev => ({
      ...prev,
      [todayKey]: { entries: [...(prev[todayKey]?.entries || []), entry], total: total + grams },
    }));
  }

  function removeEntry(id) {
    setProteinLogs(prev => {
      const filtered = (prev[todayKey]?.entries || []).filter(e => e.id !== id);
      return { ...prev, [todayKey]: { entries: filtered, total: filtered.reduce((s, e) => s + e.grams, 0) } };
    });
  }

  function handleCustomAdd() {
    const g = parseInt(customGrams);
    if (!g || g <= 0) return;
    addEntry(customLabel || 'Custom', g);
    setCustomLabel('');
    setCustomGrams('');
    setShowCustom(false);
  }

  return (
    <div className="p-4 pb-2 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Protein Tracker</h2>
        <p className="text-sm text-slate-400">Daily goal: {PROTEIN_GOAL}g · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
      </div>

      {/* Ring */}
      <div className="flex justify-center">
        <ProteinArc current={total} goal={PROTEIN_GOAL} />
      </div>

      {/* Quick Add */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Add</p>
        <div className="grid grid-cols-4 gap-2">
          {QUICK_ADDS.map(({ label, grams }) => (
            <button
              key={label}
              onClick={() => addEntry(label, grams)}
              className="bg-slate-800/70 border border-slate-700/50 rounded-xl p-2 text-center active:scale-95 transition-transform hover:border-green-500/40"
            >
              <div className="text-white font-bold text-sm">{grams}g</div>
              <div className="text-slate-400 text-xs leading-tight mt-0.5">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom entry */}
      <div>
        {!showCustom ? (
          <button
            onClick={() => setShowCustom(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-slate-600 text-slate-400 hover:border-green-500/50 hover:text-green-400 transition-colors"
          >
            <Plus size={16} />
            <span className="text-sm">Add custom item</span>
          </button>
        ) : (
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50 space-y-3">
            <input
              type="text"
              placeholder="Food/drink name (optional)"
              value={customLabel}
              onChange={e => setCustomLabel(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Protein grams"
                value={customGrams}
                onChange={e => setCustomGrams(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-green-500"
              />
              <button
                onClick={handleCustomAdd}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Today's log */}
      {entries.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Today's Log</p>
          <div className="space-y-2">
            {[...entries].reverse().map(entry => (
              <div key={entry.id} className="flex items-center gap-3 bg-slate-800/50 rounded-xl px-3 py-2.5 border border-slate-700/30">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs flex-shrink-0">
                  {entry.grams}g
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{entry.label}</p>
                  <p className="text-xs text-slate-500">{entry.time}</p>
                </div>
                <button onClick={() => removeEntry(entry.id)} className="p-1.5 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Plan guide */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">No-Gap Meal Plan Guide</p>
        <div className="space-y-2">
          {MEAL_PLAN.map((meal, i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30 flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{meal.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-white font-semibold text-sm">{meal.meal}</span>
                  <span className="text-green-400 font-bold text-sm flex-shrink-0">~{meal.protein}g</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{meal.time}</p>
                <ul className="space-y-0.5">
                  {meal.options.map((opt, j) => (
                    <li key={j} className="text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-slate-600 flex-shrink-0" />
                      {opt}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => addEntry(meal.meal, meal.protein)}
                className="w-7 h-7 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0 hover:bg-green-500/30 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">Total: ~170–180g protein daily</p>
      </div>
    </div>
  );
}

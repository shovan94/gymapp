import { useLocalStorage } from '../hooks/useLocalStorage';
import { WEEK_SCHEDULE, getDateKey } from '../data/workouts';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const WORKOUT_DAYS = WEEK_SCHEDULE.filter(d => d.type === 'workout');

function getTrend(arr) {
  const nums = arr.filter(v => v != null && v > 0);
  if (nums.length < 2) return null;
  const diff = nums[nums.length - 1] - nums[nums.length - 2];
  return diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
}

function getLastUsedWeight(logs, exerciseId, dayOfWeek) {
  // Look through recent weeks for this exercise
  const results = [];
  for (let weekOffset = 0; weekOffset >= -8; weekOffset--) {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + (weekOffset * 7));
    baseDate.setDate(baseDate.getDate() - baseDate.getDay() + dayOfWeek);
    const key = baseDate.toISOString().split('T')[0];
    const log = logs[key];
    if (log?.[exerciseId]) {
      const weights = Object.values(log[exerciseId])
        .filter(s => s?.done && s?.weight > 0)
        .map(s => s.weight);
      if (weights.length > 0) {
        results.push({ key, weight: Math.max(...weights), date: baseDate });
      }
    }
  }
  return results.slice(0, 6).reverse();
}

function ExerciseProgress({ exercise, dayOfWeek, logs }) {
  const history = getLastUsedWeight(logs, exercise.id, dayOfWeek);
  const trend = getTrend(history.map(h => h.weight));
  const latest = history[history.length - 1]?.weight;

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-slate-700/30 last:border-0">
        <span className="text-sm text-slate-300">{exercise.name}</span>
        <span className="text-xs text-slate-500">No data yet</span>
      </div>
    );
  }

  const maxH = Math.max(...history.map(h => h.weight), 1);
  const minH = Math.min(...history.map(h => h.weight));

  return (
    <div className="py-3 border-b border-slate-700/30 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-white font-medium">{exercise.name}</span>
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp size={14} className="text-green-400" />}
          {trend === 'down' && <TrendingDown size={14} className="text-red-400" />}
          {trend === 'flat' && <Minus size={14} className="text-slate-400" />}
          {latest != null && (
            <span className={`text-sm font-bold ${exercise.unit === 'kg' ? 'text-white' : 'text-slate-300'}`}>
              {latest}{exercise.unit === 'kg' ? 'kg' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1 h-8">
        {history.map((h, i) => {
          const heightPct = maxH > minH ? ((h.weight - minH) / (maxH - minH)) * 70 + 30 : 100;
          const isLatest = i === history.length - 1;
          return (
            <div key={h.key} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t transition-all ${isLatest ? 'bg-green-500' : 'bg-slate-600'}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-1 text-xs text-slate-600">
        <span>Week 1</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function DayCard({ day, logs }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-slate-800/60 rounded-2xl border border-slate-700/50 overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{day.icon}</span>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">{day.title}</p>
            <p className="text-xs text-slate-400">{day.label} · {day.exercises.length} exercises</p>
          </div>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          {day.exercises.map(ex => (
            <ExerciseProgress key={ex.id} exercise={ex} dayOfWeek={day.dayOfWeek} logs={logs} />
          ))}
        </div>
      )}
    </div>
  );
}

function WeeklyProteinBar({ proteinLogs }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    const key = d.toISOString().split('T')[0];
    const log = proteinLogs[key];
    const total = log?.entries?.reduce((s, e) => s + e.grams, 0) ?? 0;
    return { key, label: d.toLocaleDateString('en-US', { weekday: 'short' }), total };
  });

  const maxVal = Math.max(...days.map(d => d.total), 180);
  const todayKey = getDateKey();

  return (
    <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
      <p className="text-sm font-semibold text-white mb-3">7-Day Protein</p>
      <div className="flex items-end gap-2 h-20">
        {days.map(d => {
          const h = d.total > 0 ? Math.max((d.total / maxVal) * 100, 8) : 8;
          const isGoal = d.total >= 180;
          const isToday = d.key === todayKey;
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1">
              {d.total > 0 && (
                <span className="text-xs text-slate-500">{d.total}</span>
              )}
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t transition-all ${isGoal ? 'bg-green-500' : isToday ? 'bg-yellow-500' : 'bg-slate-600'}`}
                  style={{ height: `${h}%` }}
                />
              </div>
              <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-slate-500'}`}>{d.label}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-green-500 inline-block" /> Goal met (180g)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-yellow-500 inline-block" /> Today</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-slate-600 inline-block" /> Under goal</span>
      </div>
    </div>
  );
}

export default function Progress() {
  const [logs] = useLocalStorage('workout_logs', {});
  const [proteinLogs] = useLocalStorage('protein_logs', {});

  return (
    <div className="p-4 pb-2 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Progress</h2>
        <p className="text-sm text-slate-400">Track your strength & nutrition gains</p>
      </div>

      {/* Protein 7-day */}
      <WeeklyProteinBar proteinLogs={proteinLogs} />

      {/* Per-exercise progress */}
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Strength Progress</p>
        <p className="text-xs text-slate-500 mb-3">Aim for +1.25–2.5kg per lift each week (fine-tuning phase)</p>
        <div className="space-y-3">
          {WORKOUT_DAYS.map(day => (
            <DayCard key={day.dayOfWeek} day={day} logs={logs} />
          ))}
        </div>
      </div>

      {/* Tips card */}
      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
        <p className="text-green-400 font-semibold text-sm mb-2">Progressive Overload Reminder</p>
        <ul className="space-y-1.5 text-sm text-slate-300">
          <li className="flex gap-2"><span className="text-green-400 flex-shrink-0">→</span> Add 1.25–2.5kg per exercise each week</li>
          <li className="flex gap-2"><span className="text-green-400 flex-shrink-0">→</span> Or add 1–2 extra reps if you can't add weight</li>
          <li className="flex gap-2"><span className="text-green-400 flex-shrink-0">→</span> 7–8 hrs sleep = protein turns into muscle</li>
          <li className="flex gap-2"><span className="text-green-400 flex-shrink-0">→</span> Protein on rest days is non-negotiable</li>
        </ul>
      </div>
    </div>
  );
}

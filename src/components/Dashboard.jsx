import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTodaySchedule, getDateKey, PROTEIN_GOAL, COLOR_MAP, WEEK_SCHEDULE } from '../data/workouts';
import { CheckCircle2, Clock, Flame, Dumbbell, ChevronRight, BedDouble, Footprints } from 'lucide-react';

function ProteinRing({ current, goal }) {
  const pct = Math.min(current / goal, 1);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="relative flex items-center justify-center w-28 h-28">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke="#22c55e" strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-2xl font-bold text-white leading-none">{current}</div>
        <div className="text-xs text-slate-400">/ {goal}g</div>
      </div>
    </div>
  );
}

export default function Dashboard({ onNavigate }) {
  const today = getTodaySchedule();
  const todayKey = getDateKey();
  const colors = COLOR_MAP[today.color];

  const [logs] = useLocalStorage('workout_logs', {});
  const [proteinLogs] = useLocalStorage('protein_logs', {});

  const todayLog = logs[todayKey] || {};
  const todayProtein = proteinLogs[todayKey] || { entries: [], total: 0 };

  // Count completed sets
  const totalSets = today.exercises?.reduce((sum, ex) => sum + ex.sets, 0) ?? 0;
  const completedSets = Object.values(todayLog).reduce((sum, setData) => {
    if (!setData) return sum;
    return sum + Object.values(setData).filter(v => v?.done).length;
  }, 0);

  const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  // Week completion snapshot
  const weeklyProgress = WEEK_SCHEDULE.filter(d => d.type === 'workout').map(d => {
    const key = getDateKey(d.dayOfWeek - new Date().getDay());
    const log = logs[key] || {};
    const total = d.exercises.reduce((s, e) => s + e.sets, 0);
    const done = Object.values(log).reduce((s, sd) => {
      if (!sd) return s;
      return s + Object.values(sd).filter(v => v?.done).length;
    }, 0);
    return { ...d, done, total, isToday: d.dayOfWeek === new Date().getDay() };
  });

  return (
    <div className="p-4 pb-2 space-y-4">
      {/* Header */}
      <div>
        <p className="text-slate-400 text-sm">{dayOfWeek}</p>
        <h1 className="text-2xl font-bold text-white">{dateStr}</h1>
        <p className="text-slate-400 text-sm mt-0.5">Week 2 — Fine-Tuning Phase</p>
      </div>

      {/* Today's Focus */}
      <div
        className={`rounded-2xl p-4 border ${colors.bg} ${colors.border} cursor-pointer active:scale-[0.98] transition-transform`}
        onClick={() => onNavigate('workout')}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{today.icon}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                {today.type === 'workout' ? 'GYM DAY' : today.type === 'recovery' ? 'RECOVERY' : 'REST DAY'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{today.title}</h2>
            <p className={`text-sm ${colors.text}`}>{today.subtitle}</p>
            {today.gymTime && (
              <div className="flex items-center gap-1 mt-2 text-slate-400 text-sm">
                <Clock size={13} />
                <span>{today.gymTime} · {today.gym}</span>
              </div>
            )}
          </div>
          <ChevronRight size={20} className="text-slate-500 mt-1" />
        </div>

        {today.type === 'workout' && totalSets > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Sets completed</span>
              <span>{completedSets}/{totalSets}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.dot}`}
                style={{ width: totalSets ? `${(completedSets / totalSets) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        {(today.type === 'rest' || today.type === 'recovery') && (
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">{today.proteinNote || today.activity}</p>
        )}
      </div>

      {/* Protein + Quick Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50 flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => onNavigate('protein')}
        >
          <ProteinRing current={todayProtein.total || 0} goal={PROTEIN_GOAL} />
          <div className="text-center">
            <p className="text-sm font-semibold text-white">Protein</p>
            <p className="text-xs text-slate-400">Daily Goal</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={16} className="text-orange-400" />
              <span className="text-xs text-slate-400">Streak</span>
            </div>
            <p className="text-2xl font-bold text-white">2<span className="text-sm font-normal text-slate-400"> days</span></p>
          </div>

          <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Dumbbell size={16} className="text-blue-400" />
              <span className="text-xs text-slate-400">This week</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {weeklyProgress.filter(d => d.done >= d.total && d.total > 0).length}
              <span className="text-sm font-normal text-slate-400">/5</span>
            </p>
          </div>
        </div>
      </div>

      {/* Week mini-strip */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
        <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Week at a Glance</p>
        <div className="grid grid-cols-7 gap-1">
          {WEEK_SCHEDULE.sort((a, b) => {
            const order = [1,2,3,4,5,6,0];
            return order.indexOf(a.dayOfWeek) - order.indexOf(b.dayOfWeek);
          }).map(d => {
            const isToday = d.dayOfWeek === new Date().getDay();
            const key = getDateKey(d.dayOfWeek - new Date().getDay());
            const log = logs[key] || {};
            const total = d.exercises?.reduce((s, e) => s + e.sets, 0) ?? 0;
            const done = Object.values(log).reduce((s, sd) => {
              if (!sd) return s;
              return s + Object.values(sd).filter(v => v?.done).length;
            }, 0);
            const c = COLOR_MAP[d.color];
            const isComplete = total > 0 && done >= total;
            const isRest = d.type === 'rest' || d.type === 'recovery';

            return (
              <div key={d.dayOfWeek} className="flex flex-col items-center gap-1">
                <span className={`text-xs ${isToday ? 'text-white font-bold' : 'text-slate-500'}`}>{d.shortLabel}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-base
                  ${isToday ? `ring-2 ring-offset-2 ring-offset-slate-900 ${isRest ? 'ring-slate-500' : `ring-${d.color}-500`}` : ''}
                  ${isComplete ? c.dot : 'bg-slate-700'}
                `}>
                  {isRest ? (d.type === 'recovery' ? '🚶' : '😴') : (isComplete ? '✓' : d.icon)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip card */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
        <p className="text-xs font-semibold text-amber-400 mb-1">TECHNIQUE TIP</p>
        <p className="text-sm text-slate-300">
          Search YouTube for <span className="text-amber-300 font-medium">"Jeff Nippard Chest Press Cues"</span> or <span className="text-amber-300 font-medium">"Squat University World's Greatest Stretch"</span> to prep before each session.
        </p>
      </div>
    </div>
  );
}

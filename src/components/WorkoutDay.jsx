import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getTodaySchedule, WEEK_SCHEDULE, COLOR_MAP, getDateKey } from '../data/workouts';
import { ChevronDown, ChevronUp, Info, Check, Dumbbell, Timer, Play, RotateCcw } from 'lucide-react';

function SetRow({ setNum, setData, onChange, unit, repsMin, repsMax }) {
  return (
    <div className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
      setData?.done ? 'bg-green-500/10 border border-green-500/20' : 'bg-slate-800/40 border border-slate-700/30'
    }`}>
      <button
        onClick={() => onChange({ ...setData, done: !setData?.done })}
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          setData?.done ? 'bg-green-500 text-white' : 'border-2 border-slate-600 text-transparent'
        }`}
      >
        <Check size={14} strokeWidth={3} />
      </button>

      <span className="text-slate-400 text-sm w-10 flex-shrink-0">Set {setNum}</span>

      <div className="flex items-center gap-2 flex-1">
        {unit !== 'sec' && unit !== 'reps' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChange({ ...setData, weight: Math.max(0, (setData?.weight || 0) - 2.5) })}
              className="w-7 h-7 bg-slate-700 rounded-lg text-slate-300 flex items-center justify-center font-bold text-sm"
            >−</button>
            <div className="w-16 text-center">
              <span className="text-white font-semibold">{setData?.weight ?? 0}</span>
              <span className="text-slate-400 text-xs ml-0.5">kg</span>
            </div>
            <button
              onClick={() => onChange({ ...setData, weight: (setData?.weight || 0) + 2.5 })}
              className="w-7 h-7 bg-slate-700 rounded-lg text-slate-300 flex items-center justify-center font-bold text-sm"
            >+</button>
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onChange({ ...setData, reps: Math.max(0, (setData?.reps || repsMin) - 1) })}
            className="w-7 h-7 bg-slate-700 rounded-lg text-slate-300 flex items-center justify-center font-bold text-sm"
          >−</button>
          <div className="w-14 text-center">
            <span className="text-white font-semibold">{setData?.reps ?? repsMin}</span>
            <span className="text-slate-400 text-xs ml-0.5">{unit === 'sec' ? 's' : unit === 'reps' ? '' : 'r'}</span>
          </div>
          <button
            onClick={() => onChange({ ...setData, reps: (setData?.reps || repsMin) + 1 })}
            className="w-7 h-7 bg-slate-700 rounded-lg text-slate-300 flex items-center justify-center font-bold text-sm"
          >+</button>
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise, log, onUpdate, colors }) {
  const [expanded, setExpanded] = useState(false);
  const [showTip, setShowTip] = useState(false);

  const doneSets = Array.from({ length: exercise.sets }, (_, i) => i + 1)
    .filter(s => log?.[s]?.done).length;
  const allDone = doneSets === exercise.sets;

  return (
    <div className={`rounded-2xl border transition-all ${
      allDone ? 'bg-green-500/5 border-green-500/25' : 'bg-slate-800/50 border-slate-700/40'
    }`}>
      <button
        className="w-full flex items-center justify-between p-4"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
            allDone ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-300'
          }`}>
            {allDone ? '✓' : <Dumbbell size={18} />}
          </div>
          <div className="text-left">
            <p className={`font-semibold ${allDone ? 'text-green-400' : 'text-white'}`}>{exercise.name}</p>
            <p className="text-xs text-slate-400">
              {exercise.sets} sets ×{' '}
              {exercise.repsMin === exercise.repsMax
                ? `${exercise.repsMin}`
                : `${exercise.repsMin}–${exercise.repsMax}`}{' '}
              {exercise.unit === 'sec' ? 'sec' : exercise.unit === 'reps' ? 'reps' : 'reps'}
              {exercise.unit === 'kg' && ' · track weight'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${allDone ? 'text-green-400' : 'text-slate-400'}`}>
            {doneSets}/{exercise.sets}
          </span>
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {exercise.tips && (
            <div className={`flex gap-2 p-3 rounded-xl text-xs transition-all overflow-hidden ${
              showTip ? 'bg-amber-500/10 border border-amber-500/20' : ''
            }`}>
              <button
                onClick={() => setShowTip(s => !s)}
                className="flex items-center gap-1.5 text-amber-400 font-medium flex-shrink-0"
              >
                <Info size={13} />
                <span>Form tip</span>
              </button>
              {showTip && (
                <p className="text-slate-300 leading-relaxed">{exercise.tips}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 px-3 mb-1">
            <span>Set</span>
            <span>{exercise.unit === 'kg' ? 'Weight' : ''}</span>
            <span>Reps{exercise.unit === 'sec' ? '/Time' : ''}</span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: exercise.sets }, (_, i) => i + 1).map(setNum => (
              <SetRow
                key={setNum}
                setNum={setNum}
                setData={log?.[setNum]}
                repsMin={exercise.repsMin}
                repsMax={exercise.repsMax}
                unit={exercise.unit}
                onChange={data => onUpdate(setNum, data)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkoutDay({ selectedDay }) {
  const day = selectedDay || getTodaySchedule();
  const c = COLOR_MAP[day.color];
  const todayKey = getDateKey(day.dayOfWeek - new Date().getDay());

  const [logs, setLogs] = useLocalStorage('workout_logs', {});
  const dayLog = logs[todayKey] || {};

  function updateSet(exerciseId, setNum, data) {
    setLogs(prev => ({
      ...prev,
      [todayKey]: {
        ...(prev[todayKey] || {}),
        [exerciseId]: {
          ...((prev[todayKey] || {})[exerciseId] || {}),
          [setNum]: data,
        },
      },
    }));
  }

  function resetDay() {
    setLogs(prev => {
      const next = { ...prev };
      delete next[todayKey];
      return next;
    });
  }

  const totalSets = day.exercises?.reduce((s, e) => s + e.sets, 0) ?? 0;
  const doneSets = Object.values(dayLog).reduce((s, sd) => {
    if (!sd) return s;
    return s + Object.values(sd).filter(v => v?.done).length;
  }, 0);
  const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0;

  if (day.type === 'rest') {
    return (
      <div className="p-4 flex flex-col items-center justify-center text-center gap-4 pt-16">
        <div className="text-6xl">😴</div>
        <h2 className="text-2xl font-bold text-white">Rest Day</h2>
        <p className="text-slate-400 leading-relaxed max-w-xs">
          Today is a rest day. Your muscles are repairing and growing. Keep protein at 180g to support recovery.
        </p>
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-left max-w-xs">
          <p className="text-green-400 font-semibold text-sm mb-1">Don't skip protein!</p>
          <p className="text-slate-300 text-sm">Muscle protein synthesis peaks 24–48 hours after your last workout. Rest days are prime building time.</p>
        </div>
      </div>
    );
  }

  if (day.type === 'recovery') {
    return (
      <div className="p-4 space-y-4">
        <div className={`rounded-2xl p-4 border ${c.bg} ${c.border}`}>
          <span className="text-3xl">{day.icon}</span>
          <h2 className="text-xl font-bold text-white mt-2">{day.title}</h2>
          <p className={`text-sm ${c.text}`}>{day.subtitle}</p>
        </div>
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <p className="text-sm font-semibold text-white mb-2">Today's Activity</p>
          <p className="text-slate-300 text-sm leading-relaxed">{day.activity}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4">
          <p className="text-green-400 font-semibold text-sm mb-1">Protein Reminder</p>
          <p className="text-slate-300 text-sm leading-relaxed">{day.proteinNote}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-2 space-y-4">
      {/* Header */}
      <div className={`rounded-2xl p-4 border ${c.bg} ${c.border}`}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-3xl">{day.icon}</span>
            <h2 className="text-xl font-bold text-white mt-1">{day.title}</h2>
            <p className={`text-sm ${c.text}`}>{day.subtitle}</p>
            {day.gymTime && (
              <p className="text-slate-400 text-xs mt-1">{day.gymTime} · {day.gym}</p>
            )}
          </div>
          <button onClick={resetDay} className="p-2 rounded-xl bg-slate-800/60 text-slate-500 hover:text-slate-300">
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Progress bar */}
        {totalSets > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>{doneSets} of {totalSets} sets done</span>
              <span className={pct === 100 ? 'text-green-400 font-semibold' : ''}>{pct}%</span>
            </div>
            <div className="h-2.5 bg-slate-800/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : c.dot}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Warmup */}
      {day.warmup?.length > 0 && (
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Play size={14} className="text-yellow-400" />
            <p className="text-sm font-semibold text-white">Warmup</p>
            {day.wakeTime && <span className="text-xs text-slate-500 ml-auto">{day.wakeTime} wake · {day.gymTime} gym</span>}
          </div>
          <ul className="space-y-1">
            {day.warmup.map((item, i) => (
              <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Exercises</p>
        {day.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            log={dayLog[exercise.id]}
            colors={c}
            onUpdate={(setNum, data) => updateSet(exercise.id, setNum, data)}
          />
        ))}
      </div>

      {/* Cardio */}
      {day.cardio && (
        <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Timer size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Cardio Finisher</p>
                <p className="text-slate-400 text-xs">{day.cardio.name}</p>
              </div>
            </div>
            <span className="text-cyan-400 font-bold">{day.cardio.duration} min</span>
          </div>
        </div>
      )}

      {/* Completion banner */}
      {pct === 100 && (
        <div className="bg-green-500/15 border border-green-500/40 rounded-2xl p-4 text-center">
          <p className="text-2xl mb-1">🎉</p>
          <p className="text-green-400 font-bold">Workout Complete!</p>
          <p className="text-slate-400 text-sm">Great session — don't forget your post-workout protein!</p>
        </div>
      )}

      {/* YouTube tip */}
      {day.youtubeSearch && (
        <div className="bg-slate-800/60 rounded-2xl p-3 border border-slate-700/50">
          <p className="text-xs text-slate-400">
            Form reference: search <span className="text-blue-400 font-medium">"{day.youtubeSearch}"</span> on YouTube
          </p>
        </div>
      )}
    </div>
  );
}

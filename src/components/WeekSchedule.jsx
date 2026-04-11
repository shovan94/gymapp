import { WEEK_SCHEDULE, COLOR_MAP, getDateKey } from '../data/workouts';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Clock, MapPin, ChevronRight, Check } from 'lucide-react';

const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function WeekSchedule({ onSelectDay }) {
  const [logs] = useLocalStorage('workout_logs', {});
  const todayDow = new Date().getDay();

  const sorted = DAY_ORDER.map(dow => WEEK_SCHEDULE.find(d => d.dayOfWeek === dow));

  return (
    <div className="p-4 pb-2 space-y-3">
      <div>
        <h2 className="text-xl font-bold text-white">Weekly Schedule</h2>
        <p className="text-sm text-slate-400">Week 2 · Apr 13 – Apr 19 · Fine-Tuning Phase</p>
      </div>

      <div className="space-y-2">
        {sorted.map(day => {
          const c = COLOR_MAP[day.color];
          const isToday = day.dayOfWeek === todayDow;
          const offsetDays = day.dayOfWeek - todayDow;
          const key = getDateKey(offsetDays);
          const log = logs[key] || {};

          const totalSets = day.exercises?.reduce((s, e) => s + e.sets, 0) ?? 0;
          const doneSets = Object.values(log).reduce((s, sd) => {
            if (!sd) return s;
            return s + Object.values(sd).filter(v => v?.done).length;
          }, 0);
          const isComplete = totalSets > 0 && doneSets >= totalSets;

          const date = new Date();
          date.setDate(date.getDate() + offsetDays);
          const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          return (
            <div
              key={day.dayOfWeek}
              onClick={() => day.exercises && onSelectDay(day)}
              className={`rounded-xl border p-4 transition-all ${c.bg} ${c.border} ${
                day.exercises ? 'cursor-pointer active:scale-[0.98]' : ''
              } ${isToday ? 'ring-1 ring-white/20' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    isComplete ? 'bg-green-500/20' : 'bg-slate-800/60'
                  }`}>
                    {isComplete ? '✅' : day.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{day.label}</span>
                      <span className="text-xs text-slate-500">{dateLabel}</span>
                      {isToday && (
                        <span className="text-xs font-semibold bg-white/10 text-white px-2 py-0.5 rounded-full">TODAY</span>
                      )}
                    </div>
                    <p className={`font-semibold ${c.text}`}>{day.title}</p>
                    <p className="text-xs text-slate-400">{day.subtitle}</p>
                  </div>
                </div>
                {day.exercises?.length > 0 && (
                  <ChevronRight size={18} className="text-slate-500 mt-1" />
                )}
              </div>

              {day.type === 'workout' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {day.gymTime && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={11} />
                      <span>{day.gymTime}</span>
                    </div>
                  )}
                  {day.gym && (
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={11} />
                      <span>{day.gym}</span>
                    </div>
                  )}
                  {totalSets > 0 && (
                    <div className="ml-auto flex items-center gap-1 text-xs text-slate-400">
                      {isComplete && <Check size={11} className="text-green-400" />}
                      <span className={isComplete ? 'text-green-400' : ''}>{doneSets}/{totalSets} sets</span>
                    </div>
                  )}
                </div>
              )}

              {day.type === 'workout' && totalSets > 0 && (
                <div className="mt-2 h-1.5 bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-green-500' : c.dot}`}
                    style={{ width: `${(doneSets / totalSets) * 100}%` }}
                  />
                </div>
              )}

              {day.type === 'workout' && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {day.exercises.map(ex => (
                    <span key={ex.id} className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>
                      {ex.name}
                    </span>
                  ))}
                </div>
              )}

              {(day.type === 'rest' || day.type === 'recovery') && (
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  {day.proteinNote || day.activity}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

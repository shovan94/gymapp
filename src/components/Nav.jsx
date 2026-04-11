import { Home, Calendar, Dumbbell, Beef, TrendingUp } from 'lucide-react';

const tabs = [
  { id: 'dashboard',  label: 'Today',    Icon: Home },
  { id: 'schedule',   label: 'Schedule', Icon: Calendar },
  { id: 'workout',    label: 'Workout',  Icon: Dumbbell },
  { id: 'protein',    label: 'Protein',  Icon: Beef },
  { id: 'progress',   label: 'Progress', Icon: TrendingUp },
];

export default function Nav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs transition-colors ${
                isActive ? 'text-green-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

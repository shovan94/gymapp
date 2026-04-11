import { useState } from 'react';
import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import WeekSchedule from './components/WeekSchedule';
import WorkoutDay from './components/WorkoutDay';
import ProteinTracker from './components/ProteinTracker';
import Progress from './components/Progress';

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [selectedDay, setSelectedDay] = useState(null);

  function handleNavigate(dest) {
    setTab(dest);
    if (dest !== 'workout') setSelectedDay(null);
  }

  function handleSelectDay(day) {
    setSelectedDay(day);
    setTab('workout');
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* App header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏋️</span>
            <span className="font-bold text-white tracking-tight">GymApp</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Wedding Prep · Week 2
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-lg mx-auto w-full overflow-y-auto pb-24">
        {tab === 'dashboard' && (
          <Dashboard onNavigate={handleNavigate} />
        )}
        {tab === 'schedule' && (
          <WeekSchedule onSelectDay={handleSelectDay} />
        )}
        {tab === 'workout' && (
          <WorkoutDay selectedDay={selectedDay} />
        )}
        {tab === 'protein' && (
          <ProteinTracker />
        )}
        {tab === 'progress' && (
          <Progress />
        )}
      </main>

      {/* Bottom nav */}
      <div className="max-w-lg mx-auto w-full">
        <Nav active={tab} onChange={handleNavigate} />
      </div>
    </div>
  );
}

// Workout schedule data based on the 5-day split
// Days: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun

export const PROTEIN_GOAL = 180;

export const WEEK_SCHEDULE = [
  {
    dayOfWeek: 1,
    label: 'Monday',
    shortLabel: 'Mon',
    type: 'workout',
    title: 'Upper Body A',
    subtitle: 'Push Focus',
    icon: '💪',
    color: 'blue',
    wakeTime: '05:00 AM',
    gymTime: '06:00 AM',
    gym: 'Anytime Fitness Carling',
    warmup: ['Cat-Cow stretches', 'Arm Circles'],
    exercises: [
      { id: 'chest_press',       name: 'Chest Press',       sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: 'Drive through the chest, not just arms. Controlled descent.' },
      { id: 'lat_pulldown',      name: 'Lat Pulldowns',     sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: 'Pull elbows to hips. Slight lean back. Full stretch at top.' },
      { id: 'shoulder_press',    name: 'Shoulder Press',    sets: 3, repsMin: 10, repsMax: 10, unit: 'kg', tips: 'Don\'t lock out overhead. Keep core tight. Press up and slightly forward.' },
      { id: 'seated_row',        name: 'Seated Row',        sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: 'Pull to belly button. Shoulders back and down. Don\'t round.' },
      { id: 'tricep_pushdown',   name: 'Tricep Pushdowns',  sets: 3, repsMin: 12, repsMax: 15, unit: 'kg', tips: 'Keep elbows pinned to sides. Full extension at bottom.' },
    ],
    cardio: { name: 'Incline Treadmill Walk', duration: 15, unit: 'min' },
    youtubeSearch: 'Jeff Nippard Chest Press Cues',
  },
  {
    dayOfWeek: 2,
    label: 'Tuesday',
    shortLabel: 'Tue',
    type: 'workout',
    title: 'Lower Body A',
    subtitle: 'Quad Focus',
    icon: '🦵',
    color: 'purple',
    wakeTime: null,
    gymTime: '06:00 AM',
    gym: 'Anytime Fitness Carling',
    warmup: ['Leg swings', 'Hip circles'],
    exercises: [
      { id: 'goblet_squat',    name: 'Goblet Squat',     sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: 'Hold dumbbell at chest. Sit into heels. Chest up.' },
      { id: 'leg_press',       name: 'Leg Press',        sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: 'Feet shoulder-width, toes slightly out. Don\'t lock knees at top.' },
      { id: 'leg_extensions',  name: 'Leg Extensions',   sets: 3, repsMin: 12, repsMax: 15, unit: 'kg', tips: 'Full extension and full return. Controlled tempo.' },
      { id: 'calf_raises',     name: 'Calf Raises',      sets: 4, repsMin: 15, repsMax: 15, unit: 'kg', tips: 'Full range: deep stretch at bottom, full rise at top. Pause at top.' },
      { id: 'plank',           name: 'Plank',            sets: 3, repsMin: 45, repsMax: 60, unit: 'sec', tips: 'Straight line head to toe. Squeeze glutes and core. Breathe.' },
    ],
    cardio: { name: 'Elliptical', duration: 15, unit: 'min' },
    youtubeSearch: 'Squat University Goblet Squat form',
  },
  {
    dayOfWeek: 3,
    label: 'Wednesday',
    shortLabel: 'Wed',
    type: 'recovery',
    title: 'Active Recovery',
    subtitle: 'Rest & Rebuild',
    icon: '🚶',
    color: 'green',
    proteinNote: 'Goal: 180g Protein — muscle repair peaks 24–48 hours post-workout. Don\'t drop protein today.',
    activity: '30-minute brisk walk around Croydon/Carling area — keep blood moving to reduce soreness.',
    exercises: [],
  },
  {
    dayOfWeek: 4,
    label: 'Thursday',
    shortLabel: 'Thu',
    type: 'workout',
    title: 'Upper Body B',
    subtitle: 'Pull & Posture',
    icon: '🏋️',
    color: 'orange',
    wakeTime: null,
    gymTime: '06:00 AM',
    gym: 'Anytime Fitness Carling',
    warmup: ['Shoulder rotations', 'Band pull-aparts'],
    exercises: [
      { id: 'one_arm_row',      name: 'One-Arm Row',      sets: 3, repsMin: 10, repsMax: 10, unit: 'kg', tips: 'Brace on bench. Pull elbow to ceiling. Don\'t rotate torso.' },
      { id: 'incline_db_press', name: 'Incline DB Press', sets: 3, repsMin: 10, repsMax: 12, unit: 'kg', tips: '30–45° incline. Touch chest, press up and in. Controlled down.' },
      { id: 'face_pulls',       name: 'Face Pulls',       sets: 3, repsMin: 15, repsMax: 15, unit: 'kg', tips: 'Keep shoulders down & back. Pull to face level. External rotate at end.' },
      { id: 'lateral_raises',   name: 'Lateral Raises',   sets: 3, repsMin: 15, repsMax: 15, unit: 'kg', tips: 'Slight bend in elbow. Lead with elbows, not wrists. Stop at shoulder height.' },
      { id: 'bicep_curls',      name: 'Bicep Curls',      sets: 3, repsMin: 12, repsMax: 12, unit: 'kg', tips: 'Keep elbows pinned at sides. Full extension. Supinate at top.' },
    ],
    cardio: { name: 'Incline Treadmill Walk', duration: 15, unit: 'min' },
    youtubeSearch: 'Jeff Nippard face pulls proper form',
  },
  {
    dayOfWeek: 5,
    label: 'Friday',
    shortLabel: 'Fri',
    type: 'workout',
    title: 'Lower Body B',
    subtitle: 'Hamstring & Glute',
    icon: '🍑',
    color: 'red',
    wakeTime: null,
    gymTime: '06:00 AM',
    gym: 'Anytime Fitness Carling',
    warmup: ['Hip flexor stretch', 'Glute activation band walks'],
    exercises: [
      { id: 'rdl',              name: 'Romanian Deadlift', sets: 3, repsMin: 10, repsMax: 10, unit: 'kg', tips: 'Hip hinge — push hips back, not down. Soft knees. Bar close to legs.' },
      { id: 'leg_curls',        name: 'Leg Curls',         sets: 3, repsMin: 12, repsMax: 15, unit: 'kg', tips: 'Slow down phase (3 sec). Don\'t let hips lift. Full range.' },
      { id: 'lunges',           name: 'Lunges',            sets: 3, repsMin: 10, repsMax: 10, unit: 'kg', tips: '10 reps per leg. Front knee over toes. Upright torso. Push through heel.' },
      { id: 'glute_bridges',    name: 'Glute Bridges',     sets: 3, repsMin: 15, repsMax: 15, unit: 'kg', tips: 'Drive through heels. Squeeze hard at top. Slow down. Can add weight on hips.' },
      { id: 'knee_tucks',       name: 'Hanging Knee Tucks', sets: 3, repsMin: 12, repsMax: 12, unit: 'reps', tips: 'Controlled swing. Pull knees to chest. Lower slowly. Engage core throughout.' },
    ],
    cardio: { name: 'Stairmaster', duration: 15, unit: 'min' },
    youtubeSearch: 'Squat University Romanian Deadlift hip hinge',
  },
  {
    dayOfWeek: 6,
    label: 'Saturday',
    shortLabel: 'Sat',
    type: 'rest',
    title: 'Rest Day',
    subtitle: 'Recover & Refuel',
    icon: '😴',
    color: 'slate',
    proteinNote: 'Keep protein at 180g even on rest days. Muscle synthesis peaks 24–48h post-workout.',
    exercises: [],
  },
  {
    dayOfWeek: 0,
    label: 'Sunday',
    shortLabel: 'Sun',
    type: 'rest',
    title: 'Rest Day',
    subtitle: 'Recover & Refuel',
    icon: '😴',
    color: 'slate',
    proteinNote: 'Keep protein at 180g even on rest days. Muscle synthesis peaks 24–48h post-workout.',
    exercises: [],
  },
];

export const MEAL_PLAN = [
  { time: '8:00 AM',   meal: 'Breakfast',      icon: '🍳', options: ['4 Eggs scrambled / omelette', '175g Greek Yogurt + Protein Powder scoop'], protein: 35 },
  { time: '12:30 PM',  meal: 'Lunch',          icon: '🍗', options: ['150g Chicken breast + large salad', '150g White fish + large salad'], protein: 45 },
  { time: '3:30 PM',   meal: 'Snack',          icon: '🥤', options: ['Protein shake (whey/casein)', '1 can of tuna + crackers'], protein: 25 },
  { time: '7:00 PM',   meal: 'Dinner',         icon: '🍽️', options: ['150g Lean poultry + steamed veggies', '150g Seafood + steamed veggies'], protein: 40 },
  { time: '9:30 PM',   meal: 'Pre-Bed Snack',  icon: '🌙', options: ['100g Cottage cheese', 'Small casein protein shake'], protein: 25 },
];

export const COLOR_MAP = {
  blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   badge: 'bg-blue-500/20 text-blue-300',   dot: 'bg-blue-500',   ring: '#3b82f6' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', badge: 'bg-purple-500/20 text-purple-300', dot: 'bg-purple-500', ring: '#a855f7' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  badge: 'bg-green-500/20 text-green-300',  dot: 'bg-green-500',  ring: '#22c55e' },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', badge: 'bg-orange-500/20 text-orange-300', dot: 'bg-orange-500', ring: '#f97316' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    badge: 'bg-red-500/20 text-red-300',    dot: 'bg-red-500',    ring: '#ef4444' },
  slate:  { bg: 'bg-slate-500/10',  border: 'border-slate-500/30',  text: 'text-slate-400',  badge: 'bg-slate-500/20 text-slate-300',  dot: 'bg-slate-500',  ring: '#64748b' },
};

export function getTodaySchedule() {
  const dow = new Date().getDay();
  return WEEK_SCHEDULE.find(d => d.dayOfWeek === dow) ?? WEEK_SCHEDULE[6];
}

export function getDateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

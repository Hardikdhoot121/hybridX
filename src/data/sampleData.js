const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();
const dateKey = (day) =>
  `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

export const dashboardData = {
  dailyGoal: { correct: 10, incorrect: 0, target: 15 },
  attendance: {
    month: currentMonth, 
    year: currentYear,
    days: {
      [dateKey(2)]: 'present',
      [dateKey(3)]: 'absent',
      [dateKey(6)]: 'absent',
      [dateKey(7)]: 'present',
      [dateKey(8)]: 'present',
    },
  },
  tests: [
    { id: 't1', name: 'PCM - Major Test 01', examType: 'JEE Main', date: '03 Dec 2025' },
    { id: 't2', name: 'Physics Minor Test', examType: 'JEE Main', date: '03 Dec 2025' },
    { id: 't3', name: 'PCM - Major Test 02', examType: 'JEE Adv', date: '03 Dec 2025' },
  ],
  overview: {
    overallScore: { scored: 52, total: 100 },
    subjects: {
      physics: { scored: 52, total: 100 },
    },
    percentile: 95.29,
    stats: [
      { key: 'attempted', label: 'QS Attempted', value: 25, total: 30 },
      { key: 'accuracy', label: 'Accuracy', value: 80, suffix: '%' },
      { key: 'positive', label: 'Positive Score', value: 68, total: 100 },
      { key: 'lost', label: 'Marks Lost', value: 12, total: 100 },
      { key: 'time', label: 'Time Taken', value: 70, suffix: 'mins' },
      { key: 'top', label: 'Top Marks Obtained', value: 92, total: 100 },
    ],
  },
  dpps: [
    {
      id: 'd1',
      title: 'Motion in 1D',
      examType: 'JEE Main',
      date: '03 Dec 2025',
      attempted: true,
      correct: 18,
      incorrect: 5,
      accuracy: 78,
    },
    {
      id: 'd2',
      title: 'Trigonometry',
      examType: 'JEE Main',
      date: '03 Dec 2025',
      attempted: true,
      correct: 15,
      incorrect: 8,
      accuracy: 65,
    },
    {
      id: 'd3',
      title: 'Chemical Bonding',
      examType: 'JEE Adv',
      date: '03 Dec 2025',
      attempted: false,
    },
  ],
  tasks: [
    { id: 'task-1', title: 'Cengage - Integration', status: 'in-progress' },
    { id: 'task-2', title: 'Capacitor P.G.', status: 'pending' },
  ],
};
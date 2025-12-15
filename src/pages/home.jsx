import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardData } from '../data/sampleData.js';

const getMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeks = [];
  let current = 1 - firstDay;
  for (let w = 0; w < 6; w += 1) {
    const week = [];
    for (let d = 0; d < 7; d += 1) {
      if (current < 1 || current > daysInMonth) {
        week.push(null);
      } else {
        week.push(current);
      }
      current += 1;
    }
    weeks.push(week);
  }
  return weeks;
};

const Home = () => {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(dashboardData.dailyGoal);
  const [showModal, setShowModal] = useState(false);
  const [inputTarget, setInputTarget] = useState(dashboardData.dailyGoal.target);
  const [tasks, setTasks] = useState(dashboardData.tasks || []);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [monthYear, setMonthYear] = useState({
    month: dashboardData.attendance.month,
    year: dashboardData.attendance.year,
  });

  const attendanceDays = dashboardData.attendance.days;
  const monthLabel = useMemo(
    () =>
      new Date(monthYear.year, monthYear.month).toLocaleDateString('en', {
        month: 'long',
        year: 'numeric',
      }),
    [monthYear]
  );

  const grid = useMemo(
    () => getMonthGrid(monthYear.year, monthYear.month),
    [monthYear.year, monthYear.month]
  );

  const today = new Date();
  const isToday = (day) =>
    day &&
    monthYear.month === today.getMonth() &&
    monthYear.year === today.getFullYear() &&
    day === today.getDate();

  const dayStatus = (day) => {
    if (!day) return null;
    const key = `${monthYear.year}-${String(monthYear.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceDays[key];
  };

  const handleMonthChange = (delta) => {
    setMonthYear((prev) => {
      const date = new Date(prev.year, prev.month + delta, 1);
      return { month: date.getMonth(), year: date.getFullYear() };
    });
  };

  const handleSaveGoal = () => {
    const target = Number(inputTarget);
    if (Number.isNaN(target) || target <= 0) return;
    setDailyGoal((prev) => ({
      ...prev,
      target,
      solved: Math.min(prev.solved, target),
    }));
    setShowModal(false);
  };

  const progress = Math.min(100, Math.round((dailyGoal.solved / dailyGoal.target) * 100));

  const openTaskModal = (task) => {
    if (task) {
      setTaskInput(task.title);
      setEditingTaskId(task.id);
    } else {
      setTaskInput('');
      setEditingTaskId(null);
    }
    setShowTaskModal(true);
  };

  const handleSaveTask = () => {
    const title = taskInput.trim();
    if (!title) return;

    if (editingTaskId) {
      setTasks((prev) => prev.map((t) => (t.id === editingTaskId ? { ...t, title } : t)));
    } else {
      setTasks((prev) => [...prev, { id: `task-${Date.now()}`, title, status: 'pending' }]);
    }

    setShowTaskModal(false);
    setTaskInput('');
    setEditingTaskId(null);
  };

  const handleDeleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <main className="page">
      <section className="dashboard-grid">
        <div className="left-panel">
          <div className="card goal-card">
            <div className="card-header">
              <h3>Daily Goal</h3>
              <button className="pill-button" onClick={() => setShowModal(true)}>
                Edit
              </button>
            </div>
            <div className="goal-progress">
              <span>Solved</span>
              <span className="muted">
                {dailyGoal.solved}/{dailyGoal.target}
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="card calendar-card">
            <div className="calendar-header">
              <h4>Attendance</h4>
              <div className="calendar-nav">
                <button className="icon-button" onClick={() => handleMonthChange(-1)}>
                  ‹
                </button>
                <span>{monthLabel}</span>
                <button className="icon-button" onClick={() => handleMonthChange(1)}>
                  ›
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              <div className="calendar-row days-row">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              {grid.map((week, wi) => (
                <div className="calendar-row" key={wi}>
                  {week.map((day, di) => {
                    const status = dayStatus(day);
                    const classes = ['calendar-day'];
                    if (status === 'present') classes.push('present');
                    if (status === 'absent') classes.push('absent');
                    if (isToday(day)) classes.push('today');
                    return (
                      <span key={`${wi}-${di}`} className={classes.join(' ')}>
                        {day || ''}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="card tasks-card">
            <div className="tasks-header">
              <h4>Tasks</h4>
              <button className="pill-button small" onClick={() => openTaskModal()}>
                Create New Task
              </button>
            </div>
            <div className="tasks-list">
              {tasks.length === 0 ? (
                <p className="muted small">No tasks yet.</p>
              ) : (
                tasks.map((task, idx) => (
                  <div key={task.id} className="task-row">
                    <span className="task-index">{idx + 1}</span>
                    <span className="task-title">{task.title}</span>
                    <div className="task-actions">
                      <button
                        className="icon-button small"
                        aria-label="Edit task"
                        onClick={() => openTaskModal(task)}
                      >
                        ✎
                      </button>
                      <button
                        className="icon-button small"
                        aria-label="Delete task"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="right-panel">
          <section className="section-block">
            <div className="section-header">
              <h2>Test Analysis</h2>
              <div className="filter-row">
                <button className="chip active">All</button>
                <button className="chip">Upcoming</button>
              </div>
            </div>
            <div className="list">
              {dashboardData.tests.map((test) => (
                <article key={test.id} className="list-card">
                  <div>
                    <h4>{test.name}</h4>
                    <p className="muted">
                      {test.examType} • {test.date}
                    </p>
                  </div>
                  <button className="link-button" onClick={() => navigate('/test')}>
                    View Analysis →
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block">
            <div className="section-header">
              <h2>DPP Analysis</h2>
              <div className="filter-row">
                <button className="chip active">All</button>
                <button className="chip">Upcoming</button>
              </div>
            </div>
            <div className="list">
              {dashboardData.dpps.map((dpp) => (
                <article key={dpp.id} className="list-card">
                  <div>
                    <h4>{dpp.title}</h4>
                    <p className="muted">
                      {dpp.examType} • {dpp.date}
                    </p>
                  </div>
                  {dpp.attempted ? (
                    <button className="link-button" onClick={() => navigate(`/dpp/${dpp.id}`)}>
                      View Analysis →
                    </button>
                  ) : (
                    <button className="pill-button attempt">Attempt</button>
                  )}
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Daily Target</h3>
            <label className="input-label" htmlFor="target">
              Daily Target
            </label>
            <input
              id="target"
              type="number"
              min="1"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
            />
            <div className="modal-actions">
              <button className="pill-button ghost" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="pill-button" onClick={handleSaveGoal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="modal-backdrop" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{editingTaskId ? 'Edit Task' : 'Add Task'}</h3>
            {tasks.length >= 3 && !editingTaskId && (
              <p className="muted tiny">
                You already have multiple tasks. Edit existing ones or add a new task below.
              </p>
            )}
            <label className="input-label" htmlFor="task-title">
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="Enter task name"
            />
            <div className="modal-actions">
              <button className="pill-button ghost" onClick={() => setShowTaskModal(false)}>
                Cancel
              </button>
              <button className="pill-button" onClick={handleSaveTask}>
                {editingTaskId ? 'Save' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;

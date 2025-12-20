import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { dashboardData } from '../data/sampleData.js';

const Dashboard = () => {
  const navigate = useNavigate();
  const [dailyGoal, setDailyGoal] = useState(dashboardData.dailyGoal);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(dailyGoal.target);
  const [currentMonth, setCurrentMonth] = useState(dashboardData.attendance.month);
  const [currentYear, setCurrentYear] = useState(dashboardData.attendance.year);
  const [tasks, setTasks] = useState(dashboardData.tasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Calendar logic
  const calendarData = useMemo(() => {
    // Adjust first day: Monday = 0, Sunday = 6
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Convert Sunday=0 to Sunday=6, others shift by 1
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const today = new Date();
      const isToday = today.getDate() === day && 
                      today.getMonth() === currentMonth && 
                      today.getFullYear() === currentYear;
      const status = dashboardData.attendance.days[dateKey] || null;
      
      days.push({ day, status, isToday });
    }
    
    // Fill remaining cells to complete the last week (if needed)
    const remainingCells = 7 - (days.length % 7);
    if (remainingCells < 7) {
      for (let i = 0; i < remainingCells; i++) {
        days.push(null);
      }
    }
    
    return days;
  }, [currentMonth, currentYear]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleSaveGoal = () => {
    setDailyGoal({ ...dailyGoal, target: parseInt(goalInput) || 15 });
    setShowGoalModal(false);
  };

  const handleCancelGoal = () => {
    setGoalInput(dailyGoal.target);
    setShowGoalModal(false);
  };

  const progressPercentage = (dailyGoal.solved / dailyGoal.target) * 100;

  const handleViewAnalysis = (test) => {
    navigate('/overview', { state: { testData: test } });
  };

  const handleViewDppAnalysis = (dpp) => {
    navigate(`/dpp/${dpp.id}`);
  };

  const handleCreateTask = () => {
    setShowTaskModal(true);
    setEditingTaskId(null);
    setTaskInput('');
  };

  const handleSaveTask = () => {
    if (taskInput.trim()) {
      if (editingTaskId) {
        // Edit existing task
        setTasks(tasks.map(task => 
          task.id === editingTaskId 
            ? { ...task, title: taskInput.trim() }
            : task
        ));
      } else {
        // Add new task
        const newTask = {
          id: `task-${Date.now()}`,
          title: taskInput.trim(),
          status: 'pending'
        };
        setTasks([...tasks, newTask]);
      }
      setShowTaskModal(false);
      setTaskInput('');
      setEditingTaskId(null);
    }
  };

  const handleCancelTask = () => {
    setShowTaskModal(false);
    setTaskInput('');
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setTaskInput(task.title);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="page">
      <div className="dashboard-grid">
        {/* LEFT PANEL */}
        <div className="left-panel">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="icon-button"
            style={{ alignSelf: 'flex-start', marginBottom: '8px' }}
          >
            <ArrowLeft size={18} />
          </button>

          {/* Daily Goal Card */}
          <div className="card goal-card">
            <div className="card-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Daily Goal</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Solved</span>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {dailyGoal.solved} / {dailyGoal.target}
                </span>
                <button
                  className="pill-button small"
                  onClick={() => setShowGoalModal(true)}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Attendance Calendar */}
          <div className="card calendar-card">
            <h4 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: 600 }}>Attendance</h4>
            <div className="calendar-header">
              <div className="calendar-nav">
                <button
                  onClick={handlePrevMonth}
                  className="icon-button small"
                  style={{ background: 'transparent', border: 'none', color: '#c5cfdd' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: '14px', fontWeight: 600, minWidth: '120px', textAlign: 'center' }}>
                  {monthNames[currentMonth]} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="icon-button small"
                  style={{ background: 'transparent', border: 'none', color: '#c5cfdd' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div className="calendar-grid">
              <div className="calendar-row days-row">
                {dayNames.map((day, idx) => (
                  <span key={idx} style={{ color: '#ff6b35', fontWeight: 500 }}>{day}</span>
                ))}
              </div>
              {Array.from({ length: Math.ceil(calendarData.length / 7) }).map((_, weekIdx) => (
                <div key={weekIdx} className="calendar-row">
                  {calendarData.slice(weekIdx * 7, (weekIdx + 1) * 7).map((date, dayIdx) => {
                    if (date === null) {
                      return <div key={`empty-${weekIdx}-${dayIdx}`} style={{ padding: '6px 0' }} />;
                    }
                    const dayClasses = ['calendar-day'];
                    if (date.status === 'present') dayClasses.push('present');
                    if (date.status === 'absent') dayClasses.push('absent');
                    if (date.isToday) dayClasses.push('today');
                    
                    return (
                      <div
                        key={`day-${date.day}`}
                        className={dayClasses.join(' ')}
                        style={{ cursor: 'default' }}
                      >
                        {date.day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="card tasks-card">
            <h4 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>Tasks</h4>
            <div className="tasks-list">
              {tasks.map((task, idx) => (
                <div key={task.id} className="task-row">
                  <div className="task-index">{idx + 1}</div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-actions">
                    <button 
                      className="icon-button small"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      className="icon-button small"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="pill-button" 
              style={{ marginTop: '12px', width: '100%' }}
              onClick={handleCreateTask}
            >
              Create New Task
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Test Analysis Section */}
          <div className="section-block">
            <div className="section-header">
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>Test Analysis</h3>
              <div className="filter-row">
                <button className="chip active">All</button>
                <button className="chip">Upcoming</button>
              </div>
            </div>
            <div className="list">
              {dashboardData.tests.map((test) => (
                <div key={test.id} className="list-card">
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
                      {test.name}
                    </h4>
                    <p className="muted" style={{ margin: 0, fontSize: '13px' }}>
                      {test.examType} • {test.date}
                    </p>
                  </div>
                  <button
                    className="link-button"
                    onClick={() => handleViewAnalysis(test)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    View Analysis
                    <ArrowRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* DPP Analysis Section */}
          <div className="section-block">
            <div className="section-header">
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600 }}>DPP Analysis</h3>
              <div className="filter-row">
                <button className="chip active">All</button>
                <button className="chip">Upcoming</button>
              </div>
            </div>
            <div className="list">
              {dashboardData.dpps.map((dpp) => (
                <div key={dpp.id} className="list-card">
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, marginBottom: '6px', fontSize: '16px', fontWeight: 600 }}>
                      {dpp.title}
                    </h4>
                    <p className="muted" style={{ margin: 0, fontSize: '13px' }}>
                      {dpp.examType} • {dpp.date}
                    </p>
                  </div>
                  {dpp.attempted ? (
                    <button
                      className="link-button"
                      onClick={() => handleViewDppAnalysis(dpp)}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View Analysis
                      <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="pill-button attempt small">
                      Attempt
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Goal Modal */}
      {showGoalModal && (
        <div className="modal-backdrop" onClick={handleCancelGoal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Edit Daily Goal</h3>
            <div>
              <label className="input-label">Target (number of problems)</label>
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                min="1"
                style={{ width: '100%', marginTop: '8px' }}
              />
            </div>
            <div className="modal-actions">
              <button className="pill-button ghost small" onClick={handleCancelGoal}>
                Cancel
              </button>
              <button className="pill-button small" onClick={handleSaveGoal}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Task Modal */}
      {showTaskModal && (
        <div className="modal-backdrop" onClick={handleCancelTask}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
              {editingTaskId ? 'Edit Task' : 'Create New Task'}
            </h3>
            <div>
              <label className="input-label">Task Title</label>
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Enter task title"
                style={{ width: '100%', marginTop: '8px' }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveTask();
                  }
                }}
              />
            </div>
            <div className="modal-actions">
              <button className="pill-button ghost small" onClick={handleCancelTask}>
                Cancel
              </button>
              <button 
                className="pill-button small" 
                onClick={handleSaveTask}
                disabled={!taskInput.trim()}
                style={{ opacity: !taskInput.trim() ? 0.5 : 1 }}
              >
                {editingTaskId ? 'Save' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

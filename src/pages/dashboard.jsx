import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { dashboardData } from '../data/sampleData.js';
import DailyGoalProgress from '../components/DailyGoalProgress';
import StudentProfile from '../components/StudentProfile';
import { useDailyGoal } from '../context/DailyGoalContext.jsx';

const Dashboard = () => {
  const navigate = useNavigate();
  const { target, correct, incorrect, setTarget } = useDailyGoal();
  const [currentMonth, setCurrentMonth] = useState(dashboardData.attendance.month);
  const [currentYear, setCurrentYear] = useState(dashboardData.attendance.year);
  const [tasks, setTasks] = useState(dashboardData.tasks);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const calendarData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const firstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const today = new Date();
      const isToday = today.getDate() === day && 
                      today.getMonth() === currentMonth && 
                      today.getFullYear() === currentYear;
      const status = dashboardData.attendance.days[dateKey] || null;
      
      days.push({ day, status, isToday });
    }
    
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

  const handleCreateTask = () => {
    setShowTaskModal(true);
    setEditingTaskId(null);
    setTaskInput('');
  };

  const handleSaveTask = () => {
    if (taskInput.trim()) {
      if (editingTaskId) {
        setTasks(tasks.map(task => 
          task.id === editingTaskId 
            ? { ...task, title: taskInput.trim() }
            : task
        ));
      } else {
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
        <div className="left-panel">
          <button
            onClick={() => navigate('/')}
            className="icon-button"
            style={{ alignSelf: 'flex-start', marginBottom: '8px' }}
          >
            <ArrowLeft size={18} />
          </button>

          <DailyGoalProgress
            dailyGoal={target}
            correct={correct}
            incorrect={incorrect}
            onGoalChange={setTarget}
          />

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

        <div className="right-panel">
          <StudentProfile />
        </div>
      </div>

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

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home.jsx';
import TestOverview from './pages/test.jsx';
import DppResult from './pages/dppResult.jsx';
import CodePushBar from '../CodePushBar.jsx';

const App = () => {
  const [pushStatus, setPushStatus] = useState('idle');
  const [pushMessage, setPushMessage] = useState('');

  const handleCodePush = () => {
    if (pushStatus === 'pushing') return; // Prevent multiple pushes
    
    setPushStatus('pushing');
    setPushMessage('Pushing code...');
    
    // Simulate push operation
    setTimeout(() => {
      setPushStatus('success');
      setPushMessage('Code pushed successfully!');
      
      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setPushStatus('idle');
        setPushMessage('');
      }, 3000);
    }, 2000);
  };

  const handleDismiss = () => {
    setPushStatus('idle');
    setPushMessage('');
  };

  // Keyboard shortcut: Ctrl/Cmd + Shift + P to trigger push
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        if (pushStatus !== 'pushing') {
          handleCodePush();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushStatus]);

  return (
    <div className={`app-shell ${pushStatus !== 'idle' ? 'push-bar-visible' : ''}`}>
      <CodePushBar status={pushStatus} message={pushMessage} onDismiss={handleDismiss} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<TestOverview />} />
        <Route path="/dpp/:id" element={<DppResult />} />
      </Routes>
    </div>
  );
};

export default App;


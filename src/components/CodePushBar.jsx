import { useState, useEffect } from 'react';

const CodePushBar = ({ status = 'idle', message = '', onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    if (status !== 'idle') {
      if (isMounted) {
        setIsVisible(true);
      }
    } else {
      if (isMounted) {
        setIsVisible(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [status]);

  if (!isVisible) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'pushing':
        return {
          bg: '#1c2533',
          border: '#26c1ff',
          icon: '⏳',
          text: message || 'Pushing code...',
        };
      case 'success':
        return {
          bg: '#1a3a2a',
          border: '#2bbd8a',
          icon: '✓',
          text: message || 'Code pushed successfully!',
        };
      case 'error':
        return {
          bg: '#3a1f1f',
          border: '#d9534f',
          icon: '✗',
          text: message || 'Push failed. Please try again.',
        };
      default:
        return {
          bg: '#1c2533',
          border: '#2a3241',
          icon: 'ℹ',
          text: message || 'Code push status',
        };
    }
  };

  const config = getStatusConfig();

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="code-push-bar" style={{ '--push-bg': config.bg, '--push-border': config.border }}>
      <div className="code-push-content">
        <span className="code-push-icon">{config.icon}</span>
        <span className="code-push-text">{config.text}</span>
        {status === 'pushing' && (
          <div className="code-push-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <button className="code-push-close" onClick={handleDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
};

export default CodePushBar;


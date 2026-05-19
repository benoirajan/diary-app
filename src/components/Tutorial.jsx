import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Joyride, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

const Tutorial = () => {
  const { profile } = useAuth();
  const [run, setRun] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  const uidRef = useRef(profile?.uid);
  
  useEffect(() => {
    uidRef.current = profile?.uid;
  }, [profile?.uid]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const currentUid = profile?.uid;
    
    if (currentUid) {
      const storageKey = `soulscript_tour_${currentUid}`;
      const tourCompleted = localStorage.getItem(storageKey);
      
      if (!tourCompleted) {
        const timer = setTimeout(() => {
          setRun(true);
        }, 2000);
        return () => clearTimeout(timer);
      } else {
        setRun(false);
      }
    } else {
      setRun(false);
    }
  }, [profile?.uid]);

  const steps = useMemo(() => [
    {
      target: 'body',
      placement: 'center',
      content: (
        <div className="text-left space-y-2">
          <h3 className="text-xl font-black">Welcome to SoulScript ✨</h3>
          <p className="text-[var(--text-secondary)] font-medium">
            Let's take a quick tour to help you get started with your digital soul journal.
          </p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '[data-tour="new-entry"]',
      content: (
        <div className="text-left space-y-2">
          <h3 className="text-lg font-bold">Start Writing ✍️</h3>
          <p className="text-[var(--text-secondary)]">
            Click here to create your first entry. SoulScript uses AI to help discover your mood and encrypts your thoughts for total privacy.
          </p>
        </div>
      ),
    },
    {
      target: isMobile ? '[data-tour="mobile-nav-habits"]' : '[data-tour="sidebar-nav-habits"]',
      content: (
        <div className="text-left space-y-2">
          <h3 className="text-lg font-bold">Track Your Habits ⚡</h3>
          <p className="text-[var(--text-secondary)]">
            Build consistency by tracking daily habits. Small steps lead to big emotional growth.
          </p>
        </div>
      ),
    },
    {
      target: isMobile ? '[data-tour="mobile-nav-analytics"]' : '[data-tour="sidebar-nav-analytics"]',
      content: (
        <div className="text-left space-y-2">
          <h3 className="text-lg font-bold">Soul Insights 📊</h3>
          <p className="text-[var(--text-secondary)]">
            Visualize your emotional journey and get AI-powered insights into your well-being.
          </p>
        </div>
      ),
    },
  ], [isMobile]);

  const handleJoyrideCallback = useCallback((data) => {
    const { status, type, action } = data;

    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    const isTourEnd = finishedStatuses.includes(status) || type === EVENTS.TOUR_END;
    const isManualStop = action === ACTIONS.CLOSE || action === ACTIONS.STOP;

    if (isTourEnd || isManualStop) {
      const currentUid = uidRef.current;
      
      setRun(false);
      if (currentUid) {
        const storageKey = `soulscript_tour_${currentUid}`;
        localStorage.setItem(storageKey, 'true');
      }
    }
  }, []);

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      onEvent={handleJoyrideCallback}
      disableScrolling={isMobile}
      floaterProps={{
        disableAnimation: true,
      }}
      styles={{
        options: {
          arrowColor: 'var(--bg-card)',
          backgroundColor: 'var(--bg-card)',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          primaryColor: 'var(--accent-main)',
          textColor: 'var(--text-primary)',
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid var(--bg-soft)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        buttonNext: {
          backgroundColor: 'var(--accent-main)',
          color: '#000',
          borderRadius: '12px',
          padding: '12px 24px',
          fontWeight: '900',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        },
        buttonBack: {
          color: 'var(--text-secondary)',
          marginRight: '12px',
          fontWeight: 'bold',
        },
        buttonSkip: {
          color: 'var(--text-secondary)',
          fontWeight: 'bold',
        },
      }}
    />
  );
};

export default Tutorial;

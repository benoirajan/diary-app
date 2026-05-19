import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import { useAuth } from '../context/AuthContext';

const Tutorial = () => {
  const { profile } = useAuth();
  const [run, setRun] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (profile?.uid) {
      const tourCompleted = localStorage.getItem(`soulscript_tour_${profile.uid}`);
      if (!tourCompleted) {
        // Delay slightly to ensure elements are rendered and animate-in finishes
        const timer = setTimeout(() => {
          setRun(true);
          
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [profile]);

  const steps = [
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
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      if (profile?.uid) {
        localStorage.setItem(`soulscript_tour_${profile.uid}`, 'true');
      }
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
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
        spotlight: {
          borderRadius: '24px',
        },
      }}
    />
  );
};

export default Tutorial;
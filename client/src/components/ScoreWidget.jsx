import React, { useState, useEffect } from 'react';
import { fetchScore } from '../services/api';
import { Award, Star, CheckCircle2, TrendingUp } from 'lucide-react';

const ScoreWidget = ({ tasks }) => {
  const [score, setScore] = useState(0);
  const [breakdown, setBreakdown] = useState({ completedRegular: 0, completedImportant: 0 });

  useEffect(() => {
    const getScore = async () => {
      try {
        const data = await fetchScore();
        setScore(data.value);
        if (data.breakdown) setBreakdown(data.breakdown);
      } catch (err) {
        console.error('Error fetching score:', err);
      }
    };
    getScore();
  }, [tasks]);

  // Determine badge label based on score
  const getStatusLabel = () => {
    if (score === 0)   return { label: 'Getting Started', color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' };
    if (score < 50)    return { label: 'Building Momentum', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' };
    if (score < 150)   return { label: 'On a Roll!', color: '#4ade80', bg: 'rgba(74,222,128,0.15)' };
    return               { label: 'High Achiever 🔥', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
  };

  const status = getStatusLabel();

  return (
    <div className="score-hero-card">
      <div className="score-hero-left">
        <h2>Your Productivity</h2>
        <div className="score-big">
          {score}
          <span>pts</span>
        </div>

        <div className="score-breakdown">
          <div className="score-stat">
            <CheckCircle2 size={15} />
            <span>{breakdown.completedRegular} regular × 10 pts</span>
          </div>
          <div className="score-stat">
            <Star size={15} fill="currentColor" />
            <span>{breakdown.completedImportant} important × 25 pts</span>
          </div>
        </div>
      </div>

      <div className="score-hero-right">
        <div
          className="status-badge"
          style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}33` }}
        >
          <TrendingUp size={16} />
          {status.label}
        </div>
        <div className="logo-icon" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white', marginTop: '1rem' }}>
          <Award size={48} />
        </div>
      </div>
    </div>
  );
};

export default ScoreWidget;

import React, { useState } from 'react';
import { createTask } from '../services/api';
import { Plus, Star } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await createTask(title, isImportant);
      setTitle('');
      setIsImportant(false);
      onTaskCreated();
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  return (
    <div className="form-card animate-fade">
      <h4>Create New Task</h4>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Focus on what matters..."
            className="styled-input"
          />
        </div>

        <div className="importance-toggle" onClick={() => setIsImportant(prev => !prev)}>
          <Star
            size={18}
            fill={isImportant ? '#f59e0b' : 'none'}
            color={isImportant ? '#f59e0b' : '#94a3b8'}
          />
          <span style={{ color: isImportant ? '#f59e0b' : '#94a3b8', fontWeight: 600, fontSize: '0.9rem' }}>
            {isImportant ? 'Marked as Important (+25 pts)' : 'Mark as Important'}
          </span>
        </div>

        <button type="submit" className="primary-button">
          <Plus size={20} strokeWidth={3} />
          <span>Quick Add</span>
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          <strong>How scoring works:</strong><br />
          ✓ Regular task completed → <strong>+10 pts</strong><br />
          ⭐ Important task completed → <strong>+25 pts</strong>
        </p>
      </div>
    </div>
  );
};

export default TaskForm;

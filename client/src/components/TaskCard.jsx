import React from 'react';
import { updateTaskStatus, updateTaskImportance, deleteTaskFromApi } from '../services/api';
import { Trash2, Check, Star } from 'lucide-react';

const TaskCard = ({ task, onTaskUpdated }) => {
  const handleToggle = async () => {
    try {
      await updateTaskStatus(task.id, !task.completed);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleImportantToggle = async () => {
    try {
      await updateTaskImportance(task.id, !task.isImportant);
      onTaskUpdated();
    } catch (err) {
      console.error('Error updating task importance:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTaskFromApi(task.id);
      onTaskUpdated();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className={`task-card-v2 animate-fade ${task.completed ? 'completed' : ''} ${task.isImportant ? 'important' : ''}`}>
      <div className="task-main">
        <div
          className={`custom-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={handleToggle}
        >
          {task.completed && <Check size={16} strokeWidth={4} />}
        </div>

        <div className="task-info">
          <span className="task-text">{task.title}</span>
          {task.isImportant && (
            <span className="important-badge">Important</span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={handleImportantToggle}
          className={`action-btn important-btn ${task.isImportant ? 'active' : ''}`}
          title={task.isImportant ? 'Unmark as important' : 'Mark as important'}
        >
          <Star size={18} fill={task.isImportant ? 'currentColor' : 'none'} />
        </button>
        <button onClick={handleDelete} className="action-btn" title="Delete Task">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;

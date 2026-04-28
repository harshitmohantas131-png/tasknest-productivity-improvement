const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  return response.json();
};

export const createTask = async (title, isImportant = false) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isImportant })
  });
  return response.json();
};

export const updateTaskStatus = async (id, completed) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  return response.json();
};

export const updateTaskImportance = async (id, isImportant) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isImportant })
  });
  return response.json();
};

export const deleteTaskFromApi = async (id) => {
  await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
};

export const fetchScore = async () => {
  const response = await fetch(`${API_URL}/score`);
  return response.json();
};

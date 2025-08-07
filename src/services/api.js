const API_BASE = 'http://localhost:3001';

export const api = {
  getTasks() {
    return fetch(`${API_BASE}/tasks`)
        .then(response => {
          if (!response.ok) throw new Error('Ошибка загрузки задач');
          return response.json();
        });
  },

  createTask(taskData) {
    return fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
        .then(response => {
          if (!response.ok) throw new Error('Ошибка создания задачи');
          return response.json();
        });
  },

  updateTask(id, changes) {
    return fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changes)
    })
        .then(response => {
          if (!response.ok) {
            return response.text().then(errorText => {
              throw new Error(`Ошибка обновления: ${response.status} - ${errorText}`);
            });
          }
          return response.json();
        });
  },

  deleteTask(id) {
    return fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE'
    })
        .then(response => {
          if (!response.ok) throw new Error('Ошибка удаления задачи');
          return response.json();
        });
  }
};

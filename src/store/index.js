import { createStore } from 'vuex';
import { api } from '../services/api';

export default createStore({
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },

    SET_ERROR(state, error) {
      state.error = error;
    },

    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },

    ADD_TASK(state, task) {
      const taskWithDate = {
        ...task,
        date: task.date || new Date().toISOString()
      };
      state.tasks.unshift(taskWithDate);
    },

    UPDATE_TASK(state, { id, changes }) {
      const index = state.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...changes,
          date: changes.date || state.tasks[index].date || new Date().toISOString()
        };
      }
    },

    DELETE_TASK(state, id) {
      state.tasks = state.tasks.filter(t => t.id !== id);
    }
  },

  actions: {
    fetchTasks({ commit }) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      return api.getTasks()
          .then(tasks => {
            const validTasks = tasks.map(task => ({
              ...task,
              date: task.date || new Date().toISOString()
            }));
            commit('SET_TASKS', validTasks);
          })
          .catch(error => {
            commit('SET_ERROR', error.message);
          })
          .finally(() => {
            commit('SET_LOADING', false);
          });
    },

    createTask({ commit }, taskData) {
      return api.createTask(taskData)
          .then(newTask => {
            commit('ADD_TASK', newTask);
            return newTask;
          })
          .catch(error => {
            commit('SET_ERROR', error.message);
            throw error;
          });
    },

    updateTask({ commit, dispatch }, { id, changes }) {
      commit('UPDATE_TASK', { id, changes });

      return api.updateTask(id, changes)
          .then(updatedTask => {
            return updatedTask;
          })
          .catch(error => {
            commit('SET_ERROR', error.message);
            dispatch('fetchTasks');
            throw error;
          });
    },

    deleteTask({ commit }, id) {
      return api.deleteTask(id)
          .then(() => {
            commit('DELETE_TASK', id);
          })
          .catch(error => {
            commit('SET_ERROR', error.message);
            throw error;
          });
    }
  },

  getters: {
    allTasks: state => state.tasks,
    isLoading: state => state.loading,
    error: state => state.error,

    today: () => new Date().toISOString().slice(0, 10),

    tomorrow: () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date.toISOString().slice(0, 10);
    },

    getTaskDate: () => (task) => {
      if (!task || !task.date || typeof task.date !== 'string') return null;
      const dateStr = task.date.slice(0, 10);
      return dateStr.length === 10 ? dateStr : null;
    },

    tasksByColumn: (state, getters) => {
      const todayStr = getters.today;
      const tomorrowStr = getters.tomorrow;
      const getTaskDate = getters.getTaskDate;

      return {
        today: state.tasks.filter(t => {
          const taskDate = getTaskDate(t);
          return taskDate === todayStr;
        }),

        tomorrow: state.tasks.filter(t => {
          const taskDate = getTaskDate(t);
          return taskDate === tomorrowStr;
        }),

        later: state.tasks
            .filter(t => {
              const taskDate = getTaskDate(t);
              return taskDate && taskDate !== todayStr && taskDate !== tomorrowStr && taskDate > todayStr;
            })
            .sort((a, b) => {
              const dateA = getTaskDate(a);
              const dateB = getTaskDate(b);
              if (!dateA || !dateB) return 0;
              return dateA.localeCompare(dateB);
            })
      };
    },

    countToday: (state, getters) => {
      const getTaskDate = getters.getTaskDate;
      return state.tasks.filter(task => {
        const taskDate = getTaskDate(task);
        return taskDate === getters.today && task.stage !== 1;
      }).length;
    },

    countTomorrow: (state, getters) => {
      const getTaskDate = getters.getTaskDate;
      return state.tasks.filter(task => {
        const taskDate = getTaskDate(task);
        return taskDate === getters.tomorrow && task.stage !== 1;
      }).length;
    }
  }
});

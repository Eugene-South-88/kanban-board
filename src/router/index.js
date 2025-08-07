import { createRouter, createWebHistory } from 'vue-router';

import TaskListPage from '../pages/TaskListPage.vue';
import KanbanBoardPage from '../pages/KanbanBoardPage.vue';

const routes = [
  { path: '/', component: TaskListPage },
  { path: '/kanban', component: KanbanBoardPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

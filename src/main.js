import { createApp } from 'vue';
import './assets/styles/normalize.css';
import './assets/styles/style.scss';
import App from './App.vue';
import router from './router/index.js';
import store from './store';

createApp(App).use(store).use(router).mount('#app');

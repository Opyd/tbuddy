import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import 'vfonts/Lato.css';
import 'vfonts/FiraCode.css';
import naive from 'naive-ui';
import './styles/app.css';
const app = createApp(App);

app.use(naive);
app.use(router);

app.mount('#app');

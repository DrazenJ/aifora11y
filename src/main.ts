import App from './App.vue'
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import Noir from './assets/presets/noir.js';

const app = createApp(App);
app.use(PrimeVue, {
    theme: {
        preset: Noir,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

app.mount("#app");
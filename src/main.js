// Plugins
import vuetify from "@/vuetify";
import pinia from "@/stores";
import router from "@/router";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { useAuthStore } from "./stores/AuthStore";

const app = createApp(App);

app.use(vuetify);

app.use(pinia);

// Intialize the state of authStore before registering router plugin because navigation guards depends on it
await useAuthStore().refreshToken();

app.use(router);

app.mount("#app");

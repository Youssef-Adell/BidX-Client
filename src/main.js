// Plugins
import vuetify from "@/vuetify";
import pinia from "@/stores";
import router from "@/router";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { useAuthStore } from "./stores/AuthStore";
import { useSignalRStore } from "./stores/SignalRStore";

async function initializeApp() {
  const app = createApp(App);

  app.use(vuetify);
  app.use(pinia);

  // Intialize the state of authStore before registering router plugin because navigation guards & signalR depends on it
  const authStore = useAuthStore();
  await authStore.refreshToken();

  const signalRStore = useSignalRStore();
  await signalRStore.startConnection();
  app.onUnmount(() => signalRStore.stopConnection());

  app.use(router);
  app.mount("#app");
}

initializeApp();

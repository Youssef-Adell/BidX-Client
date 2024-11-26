<script setup>
import ConnectionStateBar from "./components/ConnectionStateBar.vue";
import Navbar from "./components/Navbar.vue";
import LoadingScreen from "./components/LoadingScreen.vue";
import Footer from "./components/Footer.vue";
import signalrClient from "./api/signalrClient";
import { useTheme } from "vuetify";
import { useAuthStore } from "./stores/AuthStore";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

const authStore = useAuthStore();
const theme = useTheme();

const appInitializing = ref(true);
const appInitializationFailed = ref(false);

const initializeApp = async () => {
  try {
    appInitializing.value = true;
    appInitializationFailed.value = false;

    await authStore.refreshToken();
    await signalrClient.startConnection();
    appInitializing.value = false;
  } catch {
    appInitializationFailed.value = true;
  }
};

onBeforeMount(async () => {
  const savedTheme = localStorage.getItem("selectedTheme");
  if (savedTheme) {
    theme.global.name.value = savedTheme;
  }

  await initializeApp();
});

onBeforeUnmount(() => {
  signalrClient.stopConnection();
});
</script>

<template>
  <VApp>
    <!-- Loading screen while initializing -->
    <template v-if="appInitializing">
      <LoadingScreen :failed="appInitializationFailed" @retry="initializeApp" />
    </template>

    <!-- Main application UI -->
    <template v-else>
      <ConnectionStateBar />
      <Navbar />
      <VMain>
        <RouterView />
      </VMain>
      <Footer />
    </template>
  </VApp>
</template>

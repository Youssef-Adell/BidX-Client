<script setup>
import ConnectionStateBar from "./components/ConnectionStateBar.vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import signalrClient from "./api/signalrClient";
import { useTheme } from "vuetify";
import { useAuthStore } from "./stores/AuthStore";
import { onBeforeMount, onBeforeUnmount, ref } from "vue";

const authStore = useAuthStore();
const theme = useTheme();

const isAppInitialized = ref(false);
const isAppInitializationFailed = ref(false);

onBeforeMount(async () => {
  const selectedTheme = localStorage.getItem("selectedTheme");
  if (selectedTheme) theme.global.name.value = selectedTheme;

  try {
    await authStore.refreshToken();
    await signalrClient.startConnection();
    isAppInitialized.value = true;
  } catch {
    isAppInitializationFailed.value = true;
  }
});

onBeforeUnmount(() => {
  signalrClient.stopConnection();
});
</script>

<template>
  <VApp>
    <template v-if="!isAppInitialized">
      <div class="d-flex align-center justify-center text-center h-100">
        <div v-if="isAppInitializationFailed">
          Connection failed!<br />Please reload the page.
        </div>
        <div v-else>Loading...</div>
      </div>
    </template>

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

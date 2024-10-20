<script setup>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import { useTheme } from "vuetify";
import { useAuthStore } from "./stores/AuthStore";

const theme = useTheme();
const authStore = useAuthStore();

const selectedTheme = localStorage.getItem("selectedTheme");
if (selectedTheme) theme.global.name.value = selectedTheme;

authStore.refreshToken(); //Calling here in setup is equal to calling in onCreated hook
</script>

<template>
  <VApp>
    <Navbar />
    <VMain>
      <RouterView />
    </VMain>
    <Footer />
  </VApp>
</template>

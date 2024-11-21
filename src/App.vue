<script setup>
import ConnectionStateBar from "./components/ConnectionStateBar.vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const selectedTheme = localStorage.getItem("selectedTheme");
if (selectedTheme) theme.global.name.value = selectedTheme;
</script>

<template>
  <VApp>
    <ConnectionStateBar />
    <Navbar />
    <VMain>
      <RouterView />
    </VMain>
    <Footer />
  </VApp>
</template>

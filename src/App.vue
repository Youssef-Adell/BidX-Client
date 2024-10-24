<script setup>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import { useTheme } from "vuetify";

const theme = useTheme();
const selectedTheme = localStorage.getItem("selectedTheme");
if (selectedTheme) theme.global.name.value = selectedTheme;
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

<script setup>
import { useTheme } from "vuetify";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";

const theme = useTheme();
theme.global.name.value = localStorage.getItem("selectedTheme") ?? "dark";
</script>

<template>
  <VApp>
    <Navbar />
    <VMain min-height="1500"> </VMain>
    <Footer />
  </VApp>
</template>

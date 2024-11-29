<script setup>
import whiteLogo from "@/assets/bidx-logo-fill-white.svg";
import blackLogo from "@/assets/bidx-logo-fill-black.svg";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { useTheme } from "vuetify";
import { computed } from "vue";

defineProps({
  failed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["retry"]);

const theme = useTheme();

const logo = computed(() => {
  return theme.global.current.value.dark ? whiteLogo : blackLogo;
});

const loaderColor = computed(() => {
  return theme.global.current.value.dark ? "white" : "black";
});

const retryInitialization = () => {
  emit("retry");
};
</script>

<template>
  <div class="d-flex flex-column justify-center align-center h-100 pb-20">
    <template v-if="failed">
      <VBtn
        icon="mdi-reload"
        variant="text"
        size="x-large"
        density="comfortable"
        @click="retryInitialization"
      />
      <div class="text-caption">Connection failed, try again</div>
    </template>

    <template v-else>
      <img :src="logo" :width="120" alt="logo" draggable="false" />
      <PulseLoader :color="loaderColor" size="8px" />
    </template>
  </div>
</template>

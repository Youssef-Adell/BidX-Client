<script setup>
import { useSignalrStateStore } from "@/stores/SignalrStateStore";
import { computed, ref, watch } from "vue";

const signalrStateStore = useSignalrStateStore();
const isReconnected = ref(false);

const shouldDisplayStatusBar = computed(
  () =>
    signalrStateStore.isReconnecting ||
    signalrStateStore.isDisconnected ||
    isReconnected.value
);

const bgColor = computed(() => {
  if (signalrStateStore.isReconnecting) return "bg-warning";
  if (signalrStateStore.isDisconnected) return "bg-error";
  if (isReconnected.value) return "bg-primary";
  return "";
});

// Show "reconnected" message for 1 second when connection reconnected
watch(
  () => signalrStateStore.isReconnecting,
  (isReconnecting, wasReconnecting) => {
    if (wasReconnecting && signalrStateStore.isConnected) {
      isReconnected.value = true;
      setTimeout(() => {
        isReconnected.value = false;
      }, 3000);
    }
  }
);
</script>

<template>
  <VSystemBar
    v-if="shouldDisplayStatusBar"
    :class="`d-flex justify-center align-center ${bgColor}`"
  >
    <!-- Reconnecting -->
    <template v-if="signalrStateStore.isReconnecting">
      <div class="d-flex align-center ga-1">
        <VProgressCircular size="14" width="1" indeterminate />
        <span>Reconnecting...</span>
      </div>
    </template>

    <!-- Reconnected -->
    <template v-else-if="isReconnected">
      <span>Reconnected</span>
    </template>

    <!-- Disconnected -->
    <template v-else-if="signalrStateStore.isDisconnected">
      <span>Disconnected - Please reload the page </span>
    </template>
  </VSystemBar>
</template>

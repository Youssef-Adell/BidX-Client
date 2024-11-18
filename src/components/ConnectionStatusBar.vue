<script setup>
import { useSignalRStore } from "@/stores/SignalRStore";
import { computed, ref, watch } from "vue";

const signalRStore = useSignalRStore();
const isReconnected = ref(false);

const shouldDisplayStatusBar = computed(
  () =>
    signalRStore.isReconnecting ||
    signalRStore.isDisconnected ||
    isReconnected.value
);

const bgColor = computed(() => {
  if (signalRStore.isReconnecting) return "bg-warning";
  if (signalRStore.isDisconnected) return "bg-error";
  if (isReconnected.value) return "bg-primary";
  return "";
});

// Show "reconnected" message for 1 second when connection reconnected
watch(
  () => signalRStore.isReconnecting,
  (isReconnecting, wasReconnecting) => {
    if (wasReconnecting && signalRStore.isConnected) {
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
    <template v-if="signalRStore.isReconnecting">
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
    <template v-else-if="signalRStore.isDisconnected">
      <span>Disconnected - Please reload the page </span>
    </template>
  </VSystemBar>
</template>

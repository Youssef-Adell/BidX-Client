<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { computed, ref } from "vue";

const authStore = useAuthStore();

const disabled = ref(false);
const loading = ref(false);
const error = ref(null);
const countdown = ref(0);
let interval = null;

const resendConfirmationEmail = async () => {
  try {
    error.value = null;
    loading.value = true;
    await authStore.resendConfirmationEmail(props.email);

    // disable the button for 120 seconds
    disabled.value = true;
    countdown.value = 120;
    interval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(interval);
        disabled.value = false;
      }
    }, 1000);
  } catch (errorResponse) {
    error.value = errorResponse;
  } finally {
    loading.value = false;
  }
};

const buttonText = computed(() => {
  return countdown.value > 0 ? `Resend again in ${countdown.value}s` : "Resend";
});

const props = defineProps(["email"]);
</script>

<template>
  <VSheet class="px-10 py-6 text-center" elevation="4" max-width="500" rounded>
    <!--Error Box-->
    <div v-if="error" class="bg-error py-1 rounded text-caption">
      <span v-for="errorMessage in error.errorMessages">
        {{ errorMessage }}
      </span>
    </div>

    <!--Title-->
    <VIcon icon="mdi-email-check-outline" size="100" color="primary" />
    <span class="d-block text-h5 mb-3 text-high-emphasis font-weight-bold">
      Verify your email
    </span>

    <!--Paragraph-->
    We've sent an email to
    <span class="text-high-emphasis">{{ email }}</span>
    to verify your email address and activate your account. The link in the
    email will expire in 24 hours.

    <!--Resend Button-->
    <VBtn
      :text="buttonText"
      @click="resendConfirmationEmail"
      variant="tonal"
      color="primary"
      size="small"
      class="mt-5"
      :disabled="disabled"
      :loading="loading"
      block
    />

    <span class="d-block mt-1 text-caption">
      Didn't get an email? click the button above
    </span>
  </VSheet>
</template>

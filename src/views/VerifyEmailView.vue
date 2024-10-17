<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const authStore = useAuthStore();
const route = useRoute();

const disabled = ref(false);
const loading = ref(false);
const countdown = ref(0);
const email = ref("");
let interval = null;

const resendConfirmationEmail = async () => {
  try {
    loading.value = true;
    await authStore.resendConfirmationEmail(email.value);
  } catch (errorResponse) {
  } finally {
    // disable the button for 120 seconds
    loading.value = false;
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
  }
};

onMounted(() => {
  email.value = route.query.email;
});
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VSheet
      class="px-10 py-6 text-center"
      elevation="4"
      max-width="500"
      rounded
    >
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
        :text="countdown > 0 ? `Resend again in ${countdown}s` : 'Resend'"
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
  </VContainer>
</template>

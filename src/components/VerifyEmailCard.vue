<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { computed, ref } from "vue";
import ErrorBox from "./ErrorBox.vue";

const props = defineProps(["email"]);

const authStore = useAuthStore();

const form = ref({
  error: null,
  loading: false,
  disabled: false,
});

const countdown = ref(0);
let interval = null;

const buttonText = computed(() => {
  return countdown.value > 0 ? `Resend again in ${countdown.value}s` : "Resend";
});

const resendConfirmationEmail = async () => {
  try {
    form.value.loading = true;
    form.value.error = null;

    await authStore.resendConfirmationEmail(props.email);

    // disable the button for 120 seconds
    form.value.disabled = true;
    countdown.value = 120;
    interval = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(interval);
        form.value.disabled = false;
      }
    }, 1000);
  } catch (errorResponse) {
    form.value.error = errorResponse;
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <VSheet class="px-10 py-6 text-center" elevation="4" max-width="500" rounded>
    <!--Error Box-->
    <ErrorBox :error="form.error" centered="true" />

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
      :disabled="form.disabled"
      :loading="form.loading"
      block
    />

    <span class="d-block mt-1 text-caption">
      Didn't get an email? click the button above
    </span>
  </VSheet>
</template>

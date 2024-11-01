<script setup>
import ErrorBox from "@/components/ErrorBox.vue";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const loading = ref(false);
const error = ref(null);
const inputRules = {
  required: (value) => {
    return value ? true : "Required.";
  },
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid E-mail.";
  },
};

const forgotPassword = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    loading.value = true;
    await authStore.forgotPassword(email.value);
    router.push("/login");
  } catch (errorResponse) {
    console.log(errorResponse);
    error.value = errorResponse;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <VSheet
      class="px-7 pt-6 pb-4 flex-grow-1"
      elevation="4"
      max-width="400"
      rounded
    >
      <!--Title-->
      <div class="text-h5 mb-3 text-high-emphasis font-weight-bold">
        <span>Forgot Password ?</span>
        <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
      </div>

      <!--Error Box-->
      <ErrorBox :error="error" />

      <div class="py-2">
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </div>

      <!--Forgot Password Form-->
      <VForm @submit.prevent="forgotPassword">
        <VTextField
          v-model="email"
          placeholder="Email Address"
          prepend-inner-icon="mdi-email-outline"
          variant="underlined"
          :rules="[inputRules.required, inputRules.email]"
        />

        <VBtn
          text="Submit"
          class="mt-8 mb-6"
          color="primary"
          size="large"
          variant="flat"
          type="submit"
          :loading="loading"
          block
        />
      </VForm>

      <!--Register Link-->
      <div class="text-center text-caption">
        Don't have an account?
        <RouterLink class="text-primary text-decoration-none" to="/register">
          Register
        </RouterLink>
      </div>
    </VSheet>
  </VContainer>
</template>

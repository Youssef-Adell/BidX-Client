<script setup>
import ErrorBox from "./ErrorBox.vue";
import { ErrorCode } from "@/api/errorCodes";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["emailNotConfirmed"]);

const authStore = useAuthStore();
const router = useRouter();

const credentials = ref({
  email: "",
  password: "",
});

const form = ref({
  error: null,
  loading: false,
  passwordVisible: false,
});

const inputRules = {
  required: (value) => {
    return value ? true : "Required.";
  },
  email: (value) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(value) || "Invalid E-mail.";
  },
  passwordLength: (value) => {
    return value.length >= 8 || "Password must be at least 8 characters.";
  },
};

const login = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.loading = true;
    form.value.error = null;
    await authStore.login(credentials.value.email, credentials.value.password);
    router.replace({ path: "/" });
  } catch (errorResponse) {
    errorResponse.errorCode === ErrorCode.AUTH_EMAIL_NOT_CONFIRMED
      ? emit("emailNotConfirmed", credentials.value.email)
      : (form.value.error = errorResponse);
  } finally {
    form.value.loading = false;
  }
};
</script>

<template>
  <VSheet
    class="px-7 pt-6 pb-4 flex-grow-1"
    elevation="4"
    max-width="400"
    rounded
  >
    <!--Title-->
    <div class="text-h5 mb-3 text-high-emphasis font-weight-bold">
      <span>Login</span>
      <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
    </div>

    <!--Error Box-->
    <ErrorBox :error="form.error" />

    <!--Login Form-->
    <VForm @submit.prevent="login">
      <VTextField
        v-model="credentials.email"
        placeholder="Email Address"
        prepend-inner-icon="mdi-email-outline"
        variant="underlined"
        :rules="[inputRules.required, inputRules.email]"
      />

      <VTextField
        v-model="credentials.password"
        placeholder="Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="form.passwordVisible = !form.passwordVisible"
        :append-inner-icon="form.passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="form.passwordVisible ? 'text' : 'password'"
        :rules="[inputRules.required, inputRules.passwordLength]"
      />

      <RouterLink
        to="forgot-password"
        class="text-caption text-decoration-none text-primary"
      >
        Forgot Password?
      </RouterLink>

      <VBtn
        text="Login"
        class="mt-8 mb-6"
        color="primary"
        size="large"
        variant="flat"
        type="submit"
        :loading="form.loading"
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
</template>

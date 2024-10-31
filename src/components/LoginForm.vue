<script setup>
import { ErrorCode } from "@/api/errorCodes";
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

const emit = defineEmits(["emailNotConfirmed"]);

const authStore = useAuthStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
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
  passwordLength: (value) => {
    return value.length >= 8 || "Password must be at least 8 characters.";
  },
};

const login = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    error.value = null;
    loading.value = true;
    await authStore.login(email.value, password.value);
    router.replace({ path: "/" });
  } catch (errorResponse) {
    if (errorResponse.errorCode === ErrorCode.AUTH_EMAIL_NOT_CONFIRMED) {
      emit("emailNotConfirmed", email.value);
    } else {
      error.value = errorResponse;
    }
  } finally {
    loading.value = false;
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
    <div v-if="error" class="bg-error py-2 pl-3 rounded text-caption">
      <span v-for="errorMessage in error.errorMessages">
        {{ errorMessage }}
      </span>
    </div>

    <!--Login Form-->
    <VForm @submit.prevent="login">
      <VTextField
        v-model="email"
        placeholder="Email Address"
        prepend-inner-icon="mdi-email-outline"
        variant="underlined"
        :rules="[inputRules.required, inputRules.email]"
      />

      <VTextField
        v-model="password"
        placeholder="Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="passwordVisible = !passwordVisible"
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisible ? 'text' : 'password'"
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
</template>

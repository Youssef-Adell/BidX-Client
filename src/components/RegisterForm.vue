<script setup>
import { useAuthStore } from "@/stores/AuthStore";
import { ref } from "vue";

const emit = defineEmits(["registerDone"]);

const authStore = useAuthStore();
const user = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
});
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
  password: (value) => {
    return value.length >= 8 || "Password must be at least 8 characters.";
  },
  passwordMatch: (value) => {
    return value === user.value.password || "Passwords don't match.";
  },
};

const register = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    error.value = null;
    loading.value = true;
    await authStore.register(user.value);
    emit("registerDone", user.value.email);
  } catch (errorResponse) {
    error.value = errorResponse;
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
      <span>Register</span>
      <VDivider thickness="4" length="1.6rem" color="primary" opacity="0.5" />
    </div>

    <!--Error Box-->
    <div v-if="error" class="bg-error py-2 pl-3 rounded text-caption">
      <span v-for="errorMessage in error.errorMessages">
        {{ errorMessage }}
      </span>
    </div>

    <!--Register Form-->
    <VForm @submit.prevent="register">
      <VTextField
        v-model="user.firstname"
        placeholder="First Name"
        prepend-inner-icon="mdi-account-outline"
        variant="underlined"
        :rules="[inputRules.required]"
      />

      <VTextField
        v-model="user.lastname"
        placeholder="Last Name"
        prepend-inner-icon="mdi-account-outline"
        variant="underlined"
        :rules="[inputRules.required]"
      />

      <VTextField
        v-model="user.email"
        placeholder="Email Address"
        prepend-inner-icon="mdi-email-outline"
        variant="underlined"
        :rules="[inputRules.required, inputRules.email]"
      />

      <VTextField
        v-model="user.password"
        placeholder="Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="passwordVisible = !passwordVisible"
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisible ? 'text' : 'password'"
        :rules="[inputRules.required, inputRules.passwordLength]"
      />

      <VTextField
        v-model="user.confirmPassword"
        placeholder="Confirm Password"
        prepend-inner-icon="mdi-lock-outline"
        variant="underlined"
        @click:append-inner="passwordVisible = !passwordVisible"
        :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisible ? 'text' : 'password'"
        :rules="[
          inputRules.required,
          inputRules.passwordLength,
          inputRules.passwordMatch,
        ]"
      />

      <VBtn
        text="Register"
        class="mt-8 mb-6"
        color="primary"
        size="large"
        variant="flat"
        type="submit"
        :loading="loading"
        block
      />
    </VForm>

    <!--Login Link-->
    <div class="text-center text-caption">
      Already have an account?
      <RouterLink class="text-primary text-decoration-none" to="/login">
        Login
      </RouterLink>
    </div>
  </VSheet>
</template>

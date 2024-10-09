<script setup>
import { ref } from "vue";
import { useDisplay, useTheme } from "vuetify";

const { xs } = useDisplay();
const theme = useTheme();

const isDarkThemeEnabled = ref(theme.global.current.value.dark);

const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  isDarkThemeEnabled.value = theme.global.current.value.dark;
  localStorage.setItem("selectedTheme", theme.global.name.value);
};
</script>

<template>
  <VMenu width="250">
    <template #activator="{ props }">
      <VBtn icon v-bind="props" :density="xs ? 'comfortable' : 'default'">
        <VAvatar
          image="https://cdn.vuetifyjs.com/images/john.png"
          :density="xs ? 'comfortable' : 'default'"
        />
      </VBtn>
    </template>

    <!--List of Options-->
    <VList>
      <VListItem
        @click=""
        prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
        append-icon="mdi-open-in-new"
        title="Youssef Adel"
        subtitle="Jox@gmail.com"
        class="py-3"
      />
      <VDivider class="mb-2" />

      <VListItem @click="toggleTheme">
        <v-switch
          true-icon="mdi-weather-night"
          false-icon="mdi-white-balance-sunny"
          v-model="isDarkThemeEnabled"
          color="primary"
          label="Dark Mode"
          hide-spin-buttons
          hide-details
        />
      </VListItem>
      <VListItem @click="" prepend-icon="mdi-cog" title="Settings" />
      <VListItem @click="" prepend-icon="mdi-logout" title="Logout" />
    </VList>
  </VMenu>
</template>

<script setup>
import { useDisplay } from "vuetify";

const { xs } = useDisplay();
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
        subtitle="jox@gmail.com"
        class="py-3"
      />
      <VDivider class="mb-2" />

      <VListItem @click="" prepend-icon="mdi-cog" title="Settings" />
      <VListItem @click="" prepend-icon="mdi-logout" title="Logout" />
    </VList>
  </VMenu>
</template>

<script setup>
import { useDisplay } from "vuetify";
import UserProfileSummary from "./UserProfileSummary.vue";

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const { xs } = useDisplay();
</script>

<template>
  <div class="d-flex flex-column pb-4">
    <div class="d-flex justify-space-between align-center">
      <UserProfileSummary :profile="review.reviewer" />
      <VRating
        :model-value="review.rating"
        color="yellow-darken-2"
        density="compact"
        :size="xs ? 'small' : 'default'"
        readonly
      />
    </div>

    <p class="text-body-2 pl-12">
      {{ review.comment }}
    </p>
  </div>
</template>

<script setup>
import { useDisplay } from "vuetify";
import UserProfileSummary from "./UserProfileSummary.vue";
import { formatDate } from "@/utils/dateTimeUtils";

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
        half-increments
        readonly
      />
    </div>

    <p class="text-body-2 pl-12">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam odio id
      quidem eveniet sequi ipsa, repellat soluta excepturi architecto, deserunt
      impedit mollitia? Atque reprehenderit odio ipsa eligendi repudiandae!
      Voluptas, saepe.
    </p>

    <span class="text-caption font-weight-light align-self-end">{{
      formatDate(review.createdAt)
    }}</span>
  </div>
</template>

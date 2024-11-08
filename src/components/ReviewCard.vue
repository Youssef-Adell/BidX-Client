<script setup>
import { addReview, deleteMyReview } from "@/api/services/reviewsService";
import { computed, onBeforeMount, ref } from "vue";

const props = defineProps({
  amIAuctioneer: {
    type: Boolean,
    required: true,
  },
  amIWinner: {
    type: Boolean,
    required: true,
  },
  auctioneerId: {
    type: Number,
    required: true,
  },
  winnerId: {
    type: Number,
    required: true,
  },
});

const review = ref({
  rating: 1,
  comment: "",
});

const form = ref({
  loading: false,
  submitted: false,
  isEditing: false,
});

const placeholder = props.amIAuctioneer
  ? "Share your experience with the winner: Did he finalize the purchase as expected?"
  : "Share your experience with the auctioneer: Did he complete the sale as expected?";

const revieweeId = props.amIAuctioneer ? props.winnerId : props.auctioneerId;

const handleSubmit = async () => {
  try {
    form.value.loading = true;

    if (form.value.isEditing) {
      //   await updateMyReview(revieweeId, review.value);
    } else {
      //   review.value = await addReview(revieweeId, review.value);
    }

    setTimeout(() => {
      form.value.submitted = true;
      form.value.isEditing = false;
    }, 1000);
  } catch {
  } finally {
    setTimeout(() => {
      form.value.loading = false;
    }, 1000);
  }
};

const editReview = () => {
  form.value.isEditing = true;
  form.value.submitted = false;
};

const deleteReview = async () => {
  try {
    form.value.loading = true;

    // await deleteMyReview(revieweeId);

    setTimeout(() => {
      review.value.rating = 1;
      review.value.comment = "";
      form.value.submitted = false;
    }, 1000);
  } catch {
  } finally {
    setTimeout(() => {
      form.value.loading = false;
    }, 1000);
  }
};

onBeforeMount(async () => {
  try {
    // review.value = await fetchMyReview(revieweeId);
  } catch {}
});
</script>

<template>
  <div class="d-flex mt-4 justify-md-end">
    <VSheet class="w-100 w-md-50 pa-5" elevation="4" rounded>
      <section>
        <h2 class="text-subtitle-2 text-high-emphasis mb-2">Your Review</h2>

        <VForm
          @submit.prevent="handleSubmit"
          class="d-flex flex-column align-center"
        >
          <VRating
            v-model="review.rating"
            length="5"
            color="yellow-darken-3"
            hover
            :readonly="form.submitted"
          />

          <VTextarea
            v-model="review.comment"
            class="mt-2 w-100"
            density="compact"
            variant="outlined"
            :placeholder="placeholder"
            hide-details
            no-resize
            :disabled="form.submitted"
          />

          <div v-if="form.submitted" class="d-flex align-self-end mt-4">
            <VBtn
              text="Delete"
              @click="deleteReview"
              :loading="form.loading"
              color="error"
              size="small"
              variant="outlined"
              class="mr-1"
            />
            <VBtn
              text="Edit"
              @click="editReview"
              color="primary"
              size="small"
              variant="outlined"
              class="ml-1"
            />
          </div>

          <VBtn
            v-else
            :text="form.isEditing ? 'Update' : 'Submit'"
            :loading="form.loading"
            type="submit"
            class="mt-4 align-self-end"
            color="primary"
            size="small"
            variant="flat"
          />
        </VForm>
      </section>
    </VSheet>
  </div>
</template>

<script setup>
import { addReview, updateMyReview } from "@/api/services/reviewsService";
import { useAuctionStore } from "@/stores/AuctionStore";
import { onBeforeMount, ref } from "vue";

const auctionStore = useAuctionStore();

const form = ref({
  loading: false,
  submitted: false,
  isEditing: false,
});

const placeholder = auctionStore.amIAuctioneer
  ? "Share your experience with the winner: Did he finalize the purchase as expected?"
  : "Share your experience with the auctioneer: Did he complete the sale as expected?";

const revieweeId = auctionStore.amIAuctioneer
  ? auctionStore.auction?.winnerId
  : auctionStore.auction?.auctioneer.id;

const handleSubmit = async () => {
  try {
    form.value.loading = true;

    if (form.value.isEditing) {
      await updateMyReview(revieweeId, auctionStore.myReview);
    } else {
      await addReview(revieweeId, auctionStore.myReview);
    }

    form.value.submitted = true;
    form.value.isEditing = false;
  } catch (error) {
    console.log(error);
  } finally {
    form.value.loading = false;
  }
};

const editReview = () => {
  form.value.isEditing = true;
  form.value.submitted = false;
};

const deleteReview = async () => {
  try {
    form.value.loading = true;
    await auctionStore.deleteMyReview();
    form.value.submitted = false;
  } catch {
  } finally {
    form.value.loading = false;
  }
};

onBeforeMount(() => {
  form.value.submitted = auctionStore.didIReview;
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
            v-model="auctionStore.myReview.rating"
            length="5"
            color="yellow-darken-3"
            hover
            :readonly="form.submitted"
          />

          <VTextarea
            v-if="
              !form.submitted ||
              (form.submitted && auctionStore.myReview.comment)
            "
            v-model="auctionStore.myReview.comment"
            class="mt-2 w-100"
            density="compact"
            variant="outlined"
            :placeholder="placeholder"
            hide-details
            no-resize
            :disabled="form.submitted"
          />

          <!--Buttons Shows If I Reviewed-->
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

          <!--Button Shows If I didn't Reviewed or While Editing My Review-->
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

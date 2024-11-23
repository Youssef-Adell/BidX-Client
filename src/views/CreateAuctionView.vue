<script setup>
import ErrorBox from "@/components/ErrorBox.vue";
import ImagePicker from "@/components/ImagePicker.vue";
import categoriesService from "@/api/services/categoriesService";
import citiesService from "@/api/services/citiesService";
import auctionsService from "@/api/services/auctionsService";
import { durationToSeconds } from "@/utils/dateTimeUtils";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const router = useRouter();
const { smAndDown, mdAndUp } = useDisplay();

const auction = ref({
  productImages: [],
  productName: "",
  productDescription: null,
  productCondition: null,
  durationInSeconds: null,
  startingPrice: null,
  minBidIncrement: null,
  categoryId: null,
  cityId: null,
});

const duration = ref({
  days: null,
  hours: null,
  minutes: null,
});

const form = ref({
  loading: false,
  error: null,
  productConditions: ["New", "Used"],
  categories: [],
  cities: [],
});

const inputRules = {
  required: (value) => {
    return value !== null && value !== undefined && value !== ""
      ? true
      : "Required.";
  },
};

const updateProductImages = (pickedImages) => {
  auction.value.productImages = pickedImages;
};

const createAuction = async (event) => {
  // ensure that the input satisfies the rules
  const { valid } = await event;
  if (!valid) return;

  try {
    form.value.error = null;
    form.value.loading = true;

    auction.value.durationInSeconds = durationToSeconds(duration.value);
    const res = await auctionsService.addAuction(auction.value);
    console.log(res);
  } catch (errorResponse) {
    form.value.error = errorResponse;
  } finally {
    form.value.loading = false;
    auction.value = null;
  }
};

onMounted(async () => {
  form.value.categories = await categoriesService.fetchCategories();
  form.value.cities = await citiesService.fetchCities();
});
</script>

<template>
  <VContainer class="d-flex justify-center align-center h-100">
    <!--Loader-->
    <VOverlay
      :model-value="form.loading"
      class="align-center justify-center"
      persistent
    >
      <VProgressCircular color="primary" size="40" indeterminate />
    </VOverlay>

    <VForm @submit.prevent="createAuction" class="w-100">
      <VSheet class="pa-4 pb-3 pa-md-8 pb-md-6" elevation="4" rounded>
        <!--Error Box-->
        <ErrorBox :error="form.error" class="mb-3" />

        <!--Details fields-->
        <VRow justify="space-between">
          <!--Product details fields-->
          <VCol cols="12" md="6" class="pr-md-8">
            <span
              class="d-block text-subtitle-1 mb-3 text-high-emphasis font-weight-bold"
            >
              Product details
            </span>

            <div class="text-caption text-medium-emphasis">Product Images</div>
            <ImagePicker
              @picked-images-changed="updateProductImages"
              class="mb-5"
            />

            <div class="text-caption text-medium-emphasis">Product Name</div>
            <VTextField
              v-model="auction.productName"
              placeholder="e.g., Vintage Camera"
              density="comfortable"
              variant="outlined"
              class="mb-1"
              :rules="[inputRules.required]"
            />

            <div class="text-caption text-medium-emphasis">Description</div>
            <VTextarea
              v-model="auction.productDescription"
              placeholder="e.g., brand, specifications, unique features"
              density="comfortable"
              variant="outlined"
              class="mb-1"
            />

            <div class="text-caption text-medium-emphasis">Condition</div>
            <VSelect
              v-model="auction.productCondition"
              :items="form.productConditions"
              placeholder="Select condition"
              density="comfortable"
              variant="outlined"
              :rules="[inputRules.required]"
            />
          </VCol>

          <VDivider :vertical="mdAndUp" :class="mdAndUp ? 'my-12' : 'mx-8'" />

          <!--Auction details fields-->
          <VCol cols="12" md="6" class="pl-md-8">
            <span
              class="d-block text-subtitle-1 mb-3 text-high-emphasis font-weight-bold"
            >
              Auction details
            </span>

            <div class="text-caption text-medium-emphasis">Duration</div>
            <div class="d-flex mb-1">
              <VNumberInput
                v-model="duration.days"
                placeholder="Days"
                density="comfortable"
                variant="outlined"
                controlVariant="stacked"
                class="mr-2"
                suffix="D"
                :min="Number(0)"
                :max="Number(29)"
                :rules="[inputRules.required]"
              />
              <VNumberInput
                v-model="duration.hours"
                placeholder="Hours"
                density="comfortable"
                variant="outlined"
                controlVariant="stacked"
                class="mr-2"
                suffix="H"
                :min="Number(0)"
                :max="Number(23)"
                :rules="[inputRules.required]"
              />
              <VNumberInput
                v-model="duration.minutes"
                placeholder="Minutes"
                density="comfortable"
                variant="outlined"
                controlVariant="stacked"
                suffix="M"
                :min="Number(1)"
                :max="Number(59)"
                :rules="[inputRules.required]"
              />
            </div>

            <div class="text-caption text-medium-emphasis">Starting Price</div>
            <VNumberInput
              v-model="auction.startingPrice"
              placeholder="e.g., 500 EGP"
              density="comfortable"
              variant="outlined"
              controlVariant="stacked"
              class="mb-1"
              suffix="EGP"
              :min="Number(10)"
              :rules="[inputRules.required]"
            />

            <div class="text-caption text-medium-emphasis">
              Min. Bid Increment
            </div>
            <VNumberInput
              v-model="auction.minBidIncrement"
              placeholder="e.g., 50 EGP"
              density="comfortable"
              variant="outlined"
              controlVariant="stacked"
              class="mb-1"
              suffix="EGP"
              :min="Number(1)"
              :rules="[inputRules.required]"
            />

            <div class="text-caption text-medium-emphasis">Category</div>
            <VSelect
              v-model="auction.categoryId"
              :items="form.categories"
              item-value="id"
              item-title="name"
              placeholder="Select category"
              density="comfortable"
              variant="outlined"
              :rules="[inputRules.required]"
            />

            <div class="text-caption text-medium-emphasis">City</div>
            <VSelect
              v-model="auction.cityId"
              :items="form.cities"
              item-value="id"
              item-title="name"
              placeholder="Select city"
              density="comfortable"
              variant="outlined"
              :rules="[inputRules.required]"
            />
          </VCol>
        </VRow>

        <!--Buttons-->
        <div
          class="d-flex flex-column-reverse mt-4 flex-md-row justify-md-end mt-md-6"
        >
          <VBtn
            text="Cancel"
            @click="router.replace('/')"
            variant="outlined"
            color="secondary"
            class="mr-md-3"
            :block="smAndDown"
          />

          <VBtn
            text="Create"
            variant="flat"
            color="primary"
            type="submit"
            class="mb-2 mb-md-0"
            :block="smAndDown"
          />
        </div>
      </VSheet>
    </VForm>
  </VContainer>
</template>

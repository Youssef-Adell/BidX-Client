<script setup>
import { useCategoriesStore } from "@/stores/CategoriesStore";
import { useCitiesStore } from "@/stores/CitiesStore";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  initialFilters: {
    type: Object,
    required: true,
  },
  disableCategoryFilter: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["apply-filters"]);

const { xs } = useDisplay();
const categoriesStore = useCategoriesStore();
const citiesStore = useCitiesStore();
const dialogOpened = ref(false);

const form = reactive({
  auctionState: [
    { title: "All", value: false },
    { title: "Active", value: true },
  ],
  productConditions: ["New", "Used"],
  categories: computed(() => categoriesStore.categories),
  cities: computed(() => citiesStore.citi),
});

const selectedFilters = reactive({
  activeOnly: props.initialFilters?.activeOnly,
  productCondition: props.initialFilters?.productCondition,
  categoryId: props.initialFilters?.categoryId,
  cityId: props.initialFilters?.cityId,
});

const applyFilters = () => {
  emit("apply-filters", { ...selectedFilters });
  dialogOpened.value = false;
};

const resetFilters = () => {
  Object.keys(selectedFilters).forEach((key) => {
    selectedFilters[key] = null;
  });
};

onBeforeMount(async () => {
  await Promise.all([categoriesStore.load(), citiesStore.load()]);
});
</script>

<template>
  <VDialog v-model="dialogOpened" max-width="350">
    <template #activator="{ props }">
      <VBtn
        v-bind:="props"
        icon="mdi-filter"
        density="comfortable"
        variant="text"
        :size="xs ? 'small' : 'default'"
      />
    </template>

    <template #default>
      <VSheet class="pa-4 h-100" rounded>
        <!--Dialog Header-->
        <div class="d-flex ga-1 align-center mb-6">
          <!--Title-->
          <VIcon icon="mdi-filter" size="small" class="text-high-emphasis" />
          <span class="text-subtitle-1 text-high-emphasis font-weight-bold">
            Filter Auctions
          </span>
          <!--Close button-->
          <VSpacer />
          <VBtn
            icon="mdi-close"
            @click="dialogOpened = false"
            variant="plain"
            density="compact"
            :ripple="false"
          />
        </div>

        <!--Criteria Form-->
        <VForm @submit.prevent="applyFilters">
          <VSelect
            v-model="selectedFilters.activeOnly"
            label="Auction State"
            :items="form.auctionState"
            density="compact"
            variant="outlined"
            class="mb-4"
            hide-details
          />
          <VSelect
            v-model="selectedFilters.productCondition"
            label="Product Condition"
            :items="form.productConditions"
            item-title="title"
            item-value="value"
            density="compact"
            variant="outlined"
            class="mb-4"
            hide-details
          />
          <VSelect
            v-if="!disableCategoryFilter"
            v-model="selectedFilters.categoryId"
            label="Category"
            :items="form.categories"
            item-title="name"
            item-value="id"
            density="compact"
            variant="outlined"
            class="mb-4"
            hide-details
          />
          <VSelect
            v-model="selectedFilters.cityId"
            label="City"
            :items="form.cities"
            item-title="name"
            item-value="id"
            density="compact"
            variant="outlined"
            class="mb-6"
            hide-details
          />

          <!--Action Buttons-->
          <div class="d-flex justify-end align-center">
            <VBtn
              text="Reset"
              @click="resetFilters"
              variant="outlined"
              class="mr-2"
              :size="xs ? 'small' : 'default'"
            />
            <VBtn
              text="Apply"
              type="submit"
              variant="flat"
              color="primary"
              :size="xs ? 'small' : 'default'"
            />
          </div>
        </VForm>
      </VSheet>
    </template>
  </VDialog>
</template>

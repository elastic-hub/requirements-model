<template>
  <div :class="ui.wrapper">
    <div :class="ui.inner">

      <!-- Header Section -->
      <div :class="ui.header">
        <div :class="ui.title">
          <MDC :value="title" />
          <hr :class="ui.underline">
        </div>
        <div :class="ui.subtitle">
          <MDC :value="subtitle" />
        </div>
        <div :class="ui.text">
          <MDC :value="text" />
        </div>
      </div>
      <!-- /Header Section -->

      <!-- Tag Section -->
      <div title="Filter cards by tags" :class="ui.tagSection" @click="isOpen = true">
        <div v-if="tags" :class="ui.tags.title">{{ 'Tags' }}
          <div v-if="selectedTags.length > 0">{{ ':' }}</div>
          <div v-if="selectedTags.length > 0" class="">{{ selectedTags.length }}</div>
          <UIcon name="system-uicons:tags" class="ml-3 text-3xl" />
        </div>
        <USlideover v-model="isOpen" :ui="{ overlay: { background: 'dark:bg-golden/[0.2] backdrop-blur-sm' } }">
          <UCard class="flex flex-col flex-1"
            :ui="{ background: 'dark:bg-neutral-900', body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              <div class="flex h-8 justify-between items-center">
                <div class="dark:text-golden text-xl">{{ 'Tags for ' + tagsInscription }}</div>
                <div class="flex items-center">
                  <UIcon name="material-symbols-light:right-panel-close" dynamic @click="isOpen = false"
                    class="text-4xl mb-2 text-slate-600 dark:text-golden hover:text-red-500 dark:hover:text-red-500 cursor-pointer" />
                </div>
              </div>
            </template>
            <div class="h-full">
              <div class="block flex-col space-y-3">
                <span v-for="tag in tags" :key="tag" @click="toggleTag(tag)" :class="[ui.tags.list,
                {
                  [ui.tags.selected]: selectedTags.includes(tag)
                }
                ]">
                  <span>{{ tag }}</span>
                  <UIcon v-if="selectedTags.includes(tag)" name="i-line-md:close-circle" dynamic
                    class="hover:text-gray-500 duration-100 text-xl ml-auto" />
                </span>
              </div>
              <div class="flex justify-center mt-5 mb-5">
                <button v-if="selectedTags.length" @click="clearTags" :class="ui.tags.clear">
                  Clear All
                  <UIcon name="i-line-md:filter-remove-twotone" dynamic class="ml-1 animate-pulse"></UIcon>
                </button>
              </div>
            </div>
            <template #footer>
              <div class="flex h-8 justify-center text-golden">{{ 'TAGS' }}</div>
            </template>
          </UCard>
        </USlideover>
      </div>
    </div>
    <!-- /Tag Section -->

    <!-- Cards Section -->
    <div :class="[ui.base, ui.gap, gridClass]">
      <template v-for="(card, index) in filteredCards" :key="index">
        <ShCard :title="card.title" :subtitle="card.subtitle" :excerpt="card" :urlImage="card.urlImage"
          :urlUpperBase="card._path" :article="card._path" :leftLabel="card.leftLabel" :rightLabel="card.rightLabel"
          :centerLabel="card.centerLabel" />
      </template>
    </div>
    <!-- /Cards Section -->
  </div>
</template>

<script setup lang="ts">
import { listCards as config, gridSizes } from "@/ui.config";

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    title?: string;
    subtitle?: string;
    text?: string;
    cols?: number;
    class?: any;
    description?: string;
    cardID?: number[];
    allTags?: string[];
  }>(),
  {
    ui: () => ({}),
    title: "",
    subtitle: "",
    text: "",
    cols: config.default.cols,
    class: undefined,
    description: "",
  }
);

const { ui, attrs } = useUI(
  "eh-list-cards",
  toRef(props, "ui"),
  config,
  toRef(props, "class")
);

const isOpen = ref(false)

const windowWidth = ref(0);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const gridClass = computed(() => {
  const cols = props.cols ?? config.default.cols;

  if (windowWidth.value >= 1300) {
    return ["grid", gridSizes.gridCols[cols]].join(' ');
  } else if (windowWidth.value < 640) {
    return ["grid", "grid-cols-1"].join(' ');
  } else if (windowWidth.value > 640 && windowWidth.value < 980) {
    return ["grid", "grid-cols-2"].join(' ');
  } else {
    return ["grid", "grid-cols-3"].join(' ');
  }
});

const route = useRoute();
const tagsInscription = computed(() => {
  const segments = route.path.toUpperCase().split('/').filter(Boolean);
  return segments.pop() || 'Unknown'; // Fallback in case the path is empty
});

const { data: page } = await useAsyncData(() => queryContent(route.path).findOne());

const cards = ref<any[]>([]);
const tags = ref<string[]>([]);
const selectedTags = ref<string[]>([]);

// Fetch cards and sort by cardID prop order
const getCards = async () => {
  const result = await queryContent('media/articles')
    .where({ cardID: { $in: props.cardID } })
    .find();

  // Sort cards based on the order of cardID prop
  return result.sort((a, b) => {
    return props.cardID.indexOf(a.cardID) - props.cardID.indexOf(b.cardID);
  });
}

const tagStac = () => {
  if (cards.value.length > 0) {
    const uniqueTags = new Set<string>();
    cards.value.forEach(el => {
      el.tags?.forEach(tag => {
        if (tag !== null && tag.length > 0) {
          uniqueTags.add(tag)
        }
      });
    })
    tags.value = Array.from(uniqueTags)
  } else {
    tags.value = []
  }
}

const updateData = async () => {
  cards.value = await getCards();
  tagStac();
}

const filteredCards = computed(() => {
  if (selectedTags.value.length === 0) {
    return cards.value;
  }
  return cards.value.filter(card => {
    let belongs = false;
    card.tags?.forEach(tag => {
      if (tag !== null && tag.length > 0 && selectedTags.value.includes(tag)) {
        belongs = true;
      }
    });
    return belongs;
  });
});

const toggleTag = (tag: string) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter(t => t !== tag);
  } else {
    selectedTags.value.push(tag);
  }
};

const clearTags = () => {
  selectedTags.value = [];
};

updateData();
</script>

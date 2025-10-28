<template>
  <div :class="ui.wrapper">
    <div class="p-16">
      <div class="overflow-hidden relative">
        <div :class="ui.title">
          <MDC :value="title" />
        </div>
        <div :class="ui.subtitle">
          <MDC :value="subtitle" />
        </div>
        <div :class="ui.inner" :style="{ transform: `translateX(-${activeIndex * 100}%)`, transition: transitionStyle }" @transitionend="handleTransitionEnd">
          
          <!-- Clone the last slide and put it in the front for infinite loop -->
          <div v-if="allItems.length" class="min-w-full">
            <component v-if="lastSlide.component" :is="lastSlide.component" v-bind="lastSlide.props">
              <template v-if="lastSlide.slotContent">
                <slot name="default">{{ lastSlide.slotContent }}</slot>
              </template>
            </component>
            <img v-else-if="lastSlide.urlImage" :src="lastSlide.urlImage" :alt="lastSlide.altImage" :class="ui.image" />
          </div>

          <div v-for="(item, index) in allItems" :key="index" class="min-w-full">
            <component v-if="item.component" :is="item.component" v-bind="item.props">
              <template v-if="item.slotContent">
                <slot name="default">{{ item.slotContent }}</slot>
              </template>
            </component>
            <img v-else-if="item.urlImage" :src="item.urlImage" :alt="item.altImage" :class="ui.image" />
          </div>

          <!-- Clone the first slide and put it at the end for infinite loop -->
          <div v-if="allItems.length" class="min-w-full">
            <component v-if="firstSlide.component" :is="firstSlide.component" v-bind="firstSlide.props">
              <template v-if="firstSlide.slotContent">
                <slot name="default">{{ firstSlide.slotContent }}</slot>
              </template>
            </component>
            <img v-else-if="firstSlide.urlImage" :src="firstSlide.urlImage" :alt="firstSlide.altImage" :class="ui.image" />
          </div>
        </div>
        <div :class="ui.indicators">
          <span v-for="(item, index) in allItems" :key="index" class="indicator" :class="{ active: index === realActiveIndex }" @click="goToSlide(index)"></span>
        </div>
      </div>
    </div>
    <button class="col-start-1 cols-span-1 absolute top-1/2 left-2 transform -translate-y-1/2 text-4xl cursor-pointer" @click="prevSlide">
      <UIcon name="i-mdi:chevron-left-circle" dynamic :class="ui.icon" />
    </button>
    <button class="col-start-3 cols-span-1 absolute top-1/2 right-2 transform -translate-y-1/2 text-4xl cursor-pointer" @click="nextSlide">
      <UIcon name="i-mdi:chevron-right-circle" dynamic :class="ui.icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { carousel as config } from '@/ui.config';

interface CarouselItem {
  component?: any;
  props?: Record<string, any>;
  slotContent?: string;
  urlImage?: string;
  altImage?: string;
}

const props = defineProps<{
  items?: CarouselItem[];
  ui?: Partial<typeof config>;
  title: string;
  subtitle: string;
}>();

const { ui } = useUI(
  "eh-carousel",
  toRef(props, "ui"),
  config,
);

const activeIndex = ref(1); // Start with the 1st real slide (index 1)
const transitionStyle = ref('transform 0.5s ease-in-out');
let interval: number | null = null;

const allItems = computed(() => {
  const itemsList = [];
  if (props.items) {
    itemsList.push(...props.items);
  }
  return itemsList.length ? itemsList : [];
});

const firstSlide = computed(() => allItems.value[0]);
const lastSlide = computed(() => allItems.value[allItems.value.length - 1]);
const realActiveIndex = computed(() => (activeIndex.value - 1 + allItems.value.length) % allItems.value.length);

const nextSlide = () => {
  if (activeIndex.value < allItems.value.length + 1) {
    activeIndex.value += 1;
  }
  transitionStyle.value = 'transform 0.5s ease-in-out'; // Enable animation
};

const prevSlide = () => {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1;
  }
  transitionStyle.value = 'transform 0.5s ease-in-out'; // Enable animation
};

const goToSlide = (index: number) => {
  activeIndex.value = index + 1;
  transitionStyle.value = 'transform 0.5s ease-in-out'; // Enable animation
};

const handleTransitionEnd = () => {
  // After jumping to clones, reset to the corresponding real slide
  if (activeIndex.value === allItems.value.length + 1) {
    activeIndex.value = 1; // Wrap from last clone to first real slide
    transitionStyle.value = 'none'; // Disable animation to avoid flicker
  } else if (activeIndex.value === 0) {
    activeIndex.value = allItems.value.length; // Wrap from first clone to last real slide
    transitionStyle.value = 'none'; // Disable animation to avoid flicker
  }
};

const startAutoSlide = () => {
  interval = window.setInterval(nextSlide, 3000);
};

const stopAutoSlide = () => {
  if (interval) {
    clearInterval(interval);
  }
};

onMounted(() => {
  startAutoSlide();
});

onUnmounted(() => {
  stopAutoSlide();
});
</script>

<style scoped>
.indicator {
  display: inline-block;
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #ccc;
  border-radius: 50%;
  cursor: pointer;
}

.indicator.active {
  background-color: #333;
}

.dark .indicator.active {
  background-color: #BC3C38;
}
</style>

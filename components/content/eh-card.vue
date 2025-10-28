<template>
  <div :class="ui.wrapper">
    <img v-if="props.coverImage && !coverText && !coverIcon" :src="props.coverImage"
      :class="[ui.coverImage, coverEffectClass]" />
    <div v-if="props.coverIcon && !coverText && !coverImage" :class="[ui.coverIconWrapper, coverEffectClass]">
      <UIcon :name="props.coverIcon" :class="ui.coverIcon" dynamic />
    </div>
    <div v-if="coverText && !coverImage && !coverIcon" :class="[ui.coverText, coverEffectClass]">
      <MDC :value="coverText" class="px-4" />
    </div>
    <div :class="ui.upperBase" :style="backgroundClass">
      <a v-if="urlUpperBase" :href="urlUpperBase" :target="target" class="not-prose">
        <div v-if="urlImage" class="h-80 w-full flex justify-center items-center">
          <img :src="urlImage" :class="ui.image" :alt="altImage" />
        </div>
        <MDC v-else :value="upperBaseText" :class="ui.upperBaseText" />
      </a>
      <div v-else class="not-prose">
        <div v-if="urlImage" class="h-80 w-full flex justify-center items-center">
          <img :src="urlImage" :class="ui.image" :alt="altImage" />
        </div>
        <MDC v-else :value="upperBaseText" :class="ui.upperBaseText" />
      </div>
    </div>
    <div :class="ui.lowerBase">
      <div :class="ui.content">
        <div :class="ui.title">
          <MDC :value="title" />
        </div>
        <div :class="ui.subtitle">
          <MDC :value="subtitle" />
        </div>
        <div :class="ui.text">
          <MDC v-if="text" :value="text" />
          <div v-else-if="excerpt" class="dark:text-golden">
            <ContentRenderer :value="excerpt" />
          </div>
        </div>
      </div>
      <div v-if="route.path.includes('/media/blog') || route.path.includes('/media/news')" :class="ui.readMore">
        <a :href="articleURL" target="_self" class="flex items-center">
          Read More
          <UIcon name="i-material-symbols:read-more-rounded" dynamic class="ml-1 text-2xl" />
        </a>
      </div>
      <div class="border-t mt-16">
        <div :class="ui.labels">
          <div :class="ui.leftLabel">
            <MDC :value="leftLabel" />
          </div>
          <div :class="ui.centerLabel">
            <MDC :value="centerLabel" />
          </div>
          <div :class="ui.rightLabel">
            <MDC :value="rightLabel" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { card as config } from '@/ui.config' // Import the config file

const route = useRoute()

const props = withDefaults(
  defineProps<{
    coverImage?: string;
    coverIcon?: string;
    coverText?: string;
    opacity?: boolean;
    urlUpperBase?: string;
    upperBaseText?: string;
    urlImage?: string;
    target?: string;
    altImage?: string;
    title?: string;
    subtitle?: string;
    text?: string;
    excerpt?: object;
    leftLabel?: string;
    centerLabel?: string;
    rightLabel?: string;
    imageBackground?: string;
    articleURL?: string;
    description?: string;
    ui?: Partial<typeof config>;
  }>(),
  {
    ui: () => ({}),
    description: "",
    coverImage: "",
    coverIcon: "",
    coverText: "",
    opacity: false,
    urlUpperBase: "",
    upperBaseText: "",
    urlImage: "",
    target: "_self",
    altImage: "",
    title: "",
    subtitle: "",
    text: "",
    leftLabel: "",
    centerLabel: "",
    rightLabel: "",
    imageBackground: "",
  }
);

const { ui } = useUI(
  "eh-card",
  toRef(props, "ui"),
  config
);
const backgroundClass = computed(() => {
  if (props.imageBackground) {
    return "background-image: url(" + props.imageBackground + ")";
  }
});

const coverEffectClass = computed(() => {
  if (props.opacity === true) {
    return "transition-opacity duration-700 group-hover:opacity-0";
  }
  else {
    return "transition-transform duration-700 group-hover:-translate-y-full";
  }
});
</script>

<template>
  <component :is="layout === 'cta' ? 'div' : NuxtLinkComponent"
    v-bind="layout === 'cta' ? {} : { to: props.urlWrapper, target: props.target }"
    :class="['not-prose', uiLayout.wrapper]" :target="layout === 'cta' ? undefined : props.target">
    <img v-if="!coverText && !coverIcon && layout!=='flat'" :class="[uiLayout.coverImage]"
      :src="props.coverImage || (layout === 'teaser' || 'default' ? '/images/landing-hero/lh-2.jpeg' : '')" />
    <div v-if="props.coverIcon && !coverText && !coverImage && layout !== 'flat'" :class="[uiLayout.coverIconWrapper]">
      <UIcon :name="props.coverIcon" :class="uiLayout.coverIcon" dynamic />
    </div>
    <div v-if="props.coverText && !coverImage && !coverIcon && layout !== 'flat'" :class="[uiLayout.coverText]">
      <MDC :value="coverText" class="px-4" />
    </div>
    <div>
      <div class="relative group">
        <img v-if="urlImage" :src="urlImage" :class="uiLayout.image" :alt="altImage" />
        <UIcon v-if="icon" :name="icon" :alt="altIcon" dynamic :class="uiLayout.icon" />
        <div class="relative">
          <MDC v-if="title"
            :class="[uiLayout.title, layout === 'cta' && title && !subtitle ? uiLayout.underline : '', 'transition-opacity duration-300', { 'group-hover:text-transparent': clipboard === true }]"
            :value="title" />
          <MDC v-if="subtitle"
            :class="[uiLayout.subtitle, layout === 'cta' && subtitle ? uiLayout.underline : '', 'transition-opacity duration-300']"
            :value="subtitle" />
          <MDC v-if="text" :class="[uiLayout.text, 'transition-opacity duration-300']" :value="text" />
          <div v-if="layout === 'cta'" class="flex justify-start">
            <NuxtLink :to="urlButton" :target="target" class="inline-block">
              <UIcon name="line-md:chevron-right-circle" :class="uiLayout.button" />
            </NuxtLink>
          </div>
        </div>
        <div v-if="clipboard"
          class="absolute inset-0 flex items-start justify-center opacity-0 group-hover:opacity-100 group-hover:cursor-pointer transition-opacity duration-300">
          <button @click="toast.add({ title: 'Copied! Click here to check clipboard!', click: onClick })">
            <UIcon @click="copyToClipboard" name="i-line-md:clipboard-arrow" alt="cliboard-icon" dynamic
              class="text-5xl text-black" />
          </button>
        </div>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { microCard as config } from '@/ui.config' // Importing the config file
const NuxtLinkComponent = resolveComponent("NuxtLink"); //dynamically resolving the NuxtLink component to avoid build errors

const props = withDefaults(
  defineProps<{
    description?: string;
    layout?: string;
    coverImage?: string;
    coverIcon?: string;
    coverText?: string;
    urlWrapper?: string;
    urlButton?: string;
    target?: string;
    urlImage?: string;
    altImage?: string;
    icon?: string;
    altIcon?: string;
    title?: string;
    subtitle?: string;
    text?: string;
    clipboard?: boolean; // Add clipboard prop
    ui?: Partial<typeof config>;
  }>(),
  {
    ui: () => ({}),
    description: "",
    layout: "default",
    coverImage: "",
    coverIcon: "",
    coverText: "",
    urlWrapper: "",
    urlButton: "",
    target: "_self",
    urlImage: "",
    altImage: "",
    icon: "",
    altIcon: "",
    title: "",
    subtitle: "",
    text: "",
    clipboard: false,
  });

const { ui } = useUI(
  "eh-micro-card",
  toRef(props, "ui"),
  config
);

const uiLayout = computed(() => {
  return ui.value?.[props.layout] ?? ui.value?.default ?? {};
});


const toast = useToast()
const colorName = ref(props.title);

const copyToClipboard = () => {
  navigator.clipboard.writeText(colorName.value);
};

function onClick() {
  alert('Currently copied: ' + colorName.value);
}
</script>

<style scoped>
a {
  color: inherit;
}

a:hover {
  color: inherit;
}
</style>
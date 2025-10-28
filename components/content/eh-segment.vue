<template>
  <div :class="ui.wrapper" :style="[backgroundUrl, backgroundClass]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {segment as config } from "@/ui.config"

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    imageBackground?: string;
    imageBackgroundClass?: string;
    description?: string;
  }>(),
  {
    ui: () => ({}),
    description: "",
  });

const { ui, attrs } = useUI(
  "eh-segment",
  toRef(props, "ui"),
  config
)
const backgroundUrl = computed(() => {
  if (props.imageBackground) {
    return "background: url(" + props.imageBackground + ")";
  }
});

const backgroundClass = computed(() => {
  if (props.imageBackgroundClass) {
    return props.imageBackgroundClass;
  }
});
</script>

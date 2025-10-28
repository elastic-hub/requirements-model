<template>
  <div :class="[ui.wrapper, sizeClass]" v-bind="attrs">
    <div v-if="title || subtitle" :class="ui.header.wrapper">
      <MDC v-if="title" :value="title" :class="ui.header.title" />
      <MDC v-if="subtitle" :value="subtitle" :class="ui.header.subtitle" />
    </div>

    <div :class="ui.main">
      <slot />
    </div>

    <div v-if="footerText" :class="ui.footer">
      <MDC :value="footerText" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {column as config, gridSizes } from "@/ui.config"
  
const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    description?: string;
    title?: string;
    subtitle?: string;
    footerText?: string;
    size?: number;
    class?: any;
  }>(),
  {
    ui: () => ({}),
    description: "",
    title: "",
    subtitle: "",
    footerText: "",
    size: () => config.default.size,
    class: () => undefined
  });

const { ui, attrs } = useUI(
  "eh-column",
  toRef(props, "ui"),
  config,
  toRef(props, "class")
)

const sizeClass = computed(() => {
  const size = props.size ? props.size : config.default.size
  return gridSizes.colSpan[size]
})

</script>

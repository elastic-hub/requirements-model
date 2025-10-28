<template>
  <ULink :class="buttonClass" type="button" :disabled="props.disabled" :to="props.urlButton" :target="props.target" v-bind="{...attrs}">
  <div :class="ui.inner">
    <span v-if="labelButton"><MDC :value="labelButton" /></span>
    <slot v-else />
  </div>
  </ULink>
</template>

<script setup lang="ts">
import { twMerge, twJoin } from "tailwind-merge"
import {button as config } from "@/ui.config"

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    description?: string;
    urlButton: string;
    target?: string;
    colorButton?: string;
    size?: string;
    disabled?: boolean;
    styleButton?: string;
    fullWidth?: boolean;
    labelButton?: string
    class?: any;
  }>(),
  {
    ui: () => ({}),
    description: "",
    urlButton: () => "",
    target: () => config.default.target,
    colorButton: () => config.default.colorButton,
    size: () => config.default.size,
    disabled: () => false,
    styleButton: () => config.default.styleButton,
    fullWidth: false,
    labelButton: "",
    class: () => "",
  });

const { ui, attrs } = useUI(
  "eh-button",
  toRef(props, "ui"),
  config,
)

const buttonClass = computed(() => {
  const textSize = ui.value.size[props.size]
  const padding = ui.value.padding[props.size]
  const styleButton = ui.value.colorButton?.[props.colorButton as string]?.[props.styleButton as string] || ui.value.styleButton[props.styleButton]

  return twMerge(twJoin(
    ui.value.rounded,
    padding, 
    props.fullWidth ? ui.value.fullWidth : ui.value.inline,
    textSize,
    styleButton.replaceAll( "{colorButton}",props.colorButton),
    ui.value.wrapper),
    props.class)
})
</script>


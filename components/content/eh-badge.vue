<template>
  <div :class="[ui.wrapper, 'w-fit rounded-3xl px-2 py-1']">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, toRef } from 'vue'
import { badge as config } from '@/ui.config' // Importing the config file

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    description?: string;
  }>(),
  {
    ui: () => ({}),
    description: "",
  });

const { ui } = useUI(
  "eh-badge",
  toRef(props, "ui"),
  config
);
</script>

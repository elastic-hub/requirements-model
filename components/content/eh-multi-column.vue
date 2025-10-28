<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div :class="gridClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { multiColumn as config } from "@/ui.config";

const VALID_COLS = [
  "2xl:grid-cols-none",
  "2xl:grid-cols-1",
  "2xl:grid-cols-2",
  "2xl:grid-cols-3",
  "2xl:grid-cols-4",
  "2xl:grid-cols-5",
  "2xl:grid-cols-6",
  "2xl:grid-cols-7",
  "2xl:grid-cols-8",
  "2xl:grid-cols-9",
  "2xl:grid-cols-10",
  "2xl:grid-cols-11",
  "2xl:grid-cols-12"
];

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    description?: string;
    cols: number;
    gap?: string;
    class?: any;
  }>(),
  {
    ui: () => ({}),
    cols: () => config.default.size,
    gap: () => config.default.gap,
    class: () => undefined,
    description: "",
  }
);

const { ui, attrs } = useUI(
  "eh-multi-column",
  toRef(props, "ui"),
  config,
  toRef(props, "class")
);

const gridClass = computed(() => {
  return ["grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2", VALID_COLS[props.cols], props.gap].join(' ');
});
</script>

<template>
  <div :class="ui.wrapper"  v-bind="attrs" >
    <div :class="gridClass">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {twoColumns as config } from "@/ui.config"

const VALID_SIZES = {
  "2XS": "md:grid-cols-10 [&>*:nth-child(odd)]:col-span-1 [&>*:nth-child(even)]:col-span-9",
  "XS": "md:grid-cols-5 [&>*:nth-child(odd)]:col-span-1 [&>*:nth-child(even)]:col-span-4",
  "S": "md:grid-cols-4 [&>*:nth-child(odd)]:col-span-1 [&>*:nth-child(even)]:col-span-3",
  "M": "md:grid-cols-3 [&>*:nth-child(odd)]:col-span-1 [&>*:nth-child(even)]:col-span-2",
  "L": "md:grid-cols-2 [&>*:nth-child(odd)]:col-span-1 [&>*:nth-child(even)]:col-span-1",
  "XL": "md:grid-cols-3 [&>*:nth-child(odd)]:col-span-2 [&>*:nth-child(even)]:col-span-1",
  "2XL": "md:grid-cols-4 [&>*:nth-child(odd)]:col-span-3 [&>*:nth-child(even)]:col-span-1",
  "3XL": "md:grid-cols-5 [&>*:nth-child(odd)]:col-span-4 [&>*:nth-child(even)]:col-span-1",
  "4XL": "md:grid-cols-10 [&>*:nth-child(odd)]:col-span-9 [&>*:nth-child(even)]:col-span-1",
}

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    description?: String;
    size?: String;
    gap?: String;
    class?: any;
  }>(),
  {
    ui: () => ({}),
    size: () => config.default.size,
    gap: () => config.default.gap,
    class: () => undefined,
    description: () => "",
  });

const { ui, attrs } = useUI(
  "eh-two-columns",
  toRef(props, "ui"),
  config,
  toRef(props, "class")
)

const gridClass = computed(() => {
  const selectedSize = props.size != undefined ? props.size : config.default.size
  return ["flex flex-col md:grid", VALID_SIZES[selectedSize], props.gap].join(' ')
})
</script>

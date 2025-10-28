<template>
  <div :class="[ui.wrapper, Status]">
    <div v-if="urlImage" class="lg:grid lg:grid-cols-4 lg:grid-rows-1 lg:grid-flow-col lg:gap-10">
      <img :src="urlImage" :alt="altImage" :class="[imgPositionClass, imgSpanClass, ui.image]" />
      <div :class="[positionTextClass, spanTextClass, alignTextClass, 'content-center']">
        <MDC v-if="title" :class="ui.title" :value="title" />
        <hr v-if="title" :class="ui.underline" />
        <MDC v-if="subtitle" :class="ui.subtitle" :value="subtitle" />
        <MDC v-if="text" :class="ui.text" :value="text" />
      </div>
    </div>
    <div v-else class="grid grid-cols-1 grid-rows-1">
      <div :class="[alignTextClass]">
        <MDC v-if="title" :class="ui.title" :value="title" />
        <hr v-if="title" :class="ui.underline" />
        <MDC v-if="subtitle" :class="ui.subtitle" :value="subtitle" />
        <MDC v-if="text" :class="[ui.text, 'items-center']" :value="text" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { textImg as config } from '@/ui.config' // Import the config file

const props = withDefaults(
  defineProps<{
    description?: string;
    positionText?: string;
    spanText?: string;
    alignText?: string;
    title?: string;
    subtitle?: string;
    text?: string;
    urlImage?: string;
    altImage?: string;
    status?: string;
    ui?: Partial<typeof config>;
  }>(),
  {
    ui: () => ({}),
    description: "",
    positionText: "right",
    spanText: "m",
    alignText: "center",
    title: "",
    subtitle: "",
    text: "",
    urlImage: "",
    altImage: "",
    status: "",
  }
);

const { ui } = useUI(
  "eh-text-img",
  toRef(props, "ui"),
  config
);

const positionText = toRef(props, 'positionText');
const spanText = toRef(props, 'spanText');
const alignText = toRef(props, 'alignText');
const status = toRef(props, 'status');

const COL_START_VALUES = [
  '',
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4'
]

const positionTextClass = computed(() => {
  if (positionText.value === 'right' && spanText.value === 'l') {
    return COL_START_VALUES[2]
  } else if (positionText.value === 'left') {
    return COL_START_VALUES[1]
  } else {
    return COL_START_VALUES[3]
  }
});

const spanTextClass = computed(() => {
  switch (spanText.value) {
    case 's':
      if (positionText.value === 'left') {
        return 'col-start-1 col-span-1'
      } else {
        return 'col-start-4 col-span-1'
      }
    case 'm':
      return 'col-span-2'
    case 'l':
      if (positionText.value === 'left') {
        return 'col-start-1 col-span-3'
      } else {
        return 'col-start-2 col-span-3'
      }
    default:
      return 'col-span-2'
  }
});

const alignTextClass = computed(() => {
  switch (alignText.value) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    default:
      return 'text-center'
  }
});

//depending on the textPosition, the image will be placed on the opposite side
const imgPositionClass = computed(() => {
  if (positionText.value === 'left' && spanText.value === 's') {
    return 'col-start-2'
  } else if (positionText.value === 'right') {
    return 'col-start-1'
  }
});

//depending on the spanText and textPosition, the image will take the remaining space
const imgSpanClass = computed(() => {
  if (spanText.value === 'l' && positionText.value === 'left') {
    return 'col-start-4 col-span-1'
  } else if (spanText.value === 'l' && positionText.value === 'right') {
    return 'col-start-1 col-span-1'
  } else if (spanText.value === 's' && positionText.value === 'left') {
    return 'col-start-2 col-span-3'
  } else if (spanText.value === 's' && positionText.value === 'right') {
    return 'col-start-1 col-span-3'
  } else {
    return 'col-span-2'
  }
});

//classes for styling the container background depending on the status
const Status = computed(() => {
  switch (status.value) {
    case 'a':
      return config.status.a
    case 'b':
      return config.status.b
    case 'c':
      return config.status.c
    case 'd':
      return config.status.d
    default:
      return config.status.default
  }
});
</script>

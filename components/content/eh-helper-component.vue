<template>
  <div :class="ui.wrapper">
    <div :class="ui.inner">
      <div :class="ui.firstLogo">
        <img v-if="computedLogoSrc && firstLogoDark" :src="firstLogoDark" :class="ui.firstLogoDark" />
        <img v-if="!computedLogoSrc && firstLogoLight" :src="firstLogoLight" :class="ui.firstLogoLight" />
      </div>
      <div :class="ui.secondLogo">
        <img v-if="computedLogoSrc && secondLogoDark" :src="secondLogoDark" :class="ui.secondLogoDark" />
        <img v-if="!computedLogoSrc && secondLogoDark" :src="secondLogoLight" :class="ui.secondLogoLight" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { helperComponent as config } from '@/ui.config' // Import the config file

const props = withDefaults(
  defineProps<{
    description?: string;
    firstLogoDark?: string;
    firstLogoLight?: string;
    secondLogoDark?: string;
    secondLogoLight?: string;
    ui?: Partial<typeof config>;
  }>(),
  {
    ui: () => ({}),
    firstLogoDark: "/logo-dark.png",
    firstLogoLight: "/logo-light.png",
    secondLogoDark: "/images/oma2.png",
    secondLogoLight: "",
    description: "",
  }
);

const { ui } = useUI(
  "eh-helper-component",
  toRef(props, "ui"),
  config
);

const theme = useColorMode();

const computedLogoSrc = computed(() => {
    return theme.value === 'dark';
});
</script>
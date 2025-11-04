<template>
    <div :class="ui.wrapper">
        <!-- <SvgHero :class="ui.svg" /> -->
        <UIcon v-if="ui.icon" :name="icon" :class="ui.icon" />
        <div v-if="title" :class="ui.title">
            <MDC :value="title" />
        </div>
        <div v-if="subtitle" :class="ui.subtitle">
            <MDC :value="subtitle" />
        </div>
        <img :src="heroLogoSrc" :class="[ui.svg, 'opacity-20 pointer-events-none']" />
    </div>
</template>

<script setup lang="ts">
import { hero as config } from "@/ui.config";

const runtimeConfig = useRuntimeConfig();

// Helper function to handle base URL for images
const withBase = (path: string) => {
  if (!path) return path;
  const base = runtimeConfig.app.baseURL;
  if (path.startsWith('http') || path.startsWith(base)) return path;
  return `${base}${path}`.replace(/\/+/g, '/');
};

const heroLogoSrc = computed(() => withBase('img/focus_logo_notext.svg'));

const props = withDefaults(
    defineProps<{
        title?: string;
        subtitle?: string;
        icon?: string;
        description?: string;
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
        description: "",
        icon: "",//material-symbols:auto-mode
        title: "",
        subtitle: "",
    }
);

const { ui } = useUI(
    "eh-hero",
    toRef(props, "ui"),
    config
);
</script>
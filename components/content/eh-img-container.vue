<template>
    <div :class="ui.wrapper">
        <div :class="ui.inner">
            <figure :class="ui.base">
                <img :src="urlImage" :alt="altImage" :class="ui.image">
            </figure>
        </div>
        <div :class="ui.figcaption">
            <MDC :value="figcaption" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { imgContainer as config } from '@/ui.config' // Importing the config file

const props = withDefaults(
    defineProps<{
        description?: string;
        urlImage?: string;
        altImage?: string;
        figcaption?: string;
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
        description: "",
    });

const { ui } = useUI(
    "eh-img-container",
    toRef(props, "ui"),
    config
);
</script>
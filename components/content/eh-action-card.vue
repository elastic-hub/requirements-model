<template>
    <div :class="ui.wrapper" :style="backgroundClass">
        <div class="grid grid-cols-5 gap-4">
            <img v-if="urlImage" :class="ui.image" :src="urlImage" :alt="altImage" />
            <div class="col-start-2 col-span-3 flex-col">
                <MDC :class="ui.title" :value="title" />
                <MDC v-if="subtitle" :class="ui.subtitle" :value="subtitle" />
                <MDC v-if="text" :class="ui.text" :value="text" />
                <UFormGroup class="pb-4" error size="xl">
                    <UInput placeholder="you@example.com" icon="i-heroicons-envelope" class="dark:invert"/>
                </UFormGroup>
            </div>
            <UButton :to="urlButton" target="_blank" :label="labelButton" :color="colorButton" size="xl" :class="ui.button" :variant="styleButton" />
            <UIcon :name="icon" dynamic size="lg" :class="ui.icon" :alt="altIcon" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, toRef, computed } from 'vue'
import { actionCard as config } from '@/ui.config' // Import the config file

const props = withDefaults(
    defineProps<{
        description?: string;
        title: string;
        subtitle?: string;
        text?: string;
        urlImage?: string;
        altImage?: string;
        urlButton?: string;
        labelButton?: string;
        colorButton?: string;
        styleButton?: string;
        icon?: string;
        altIcon?: string;
        imageBackground?: string;
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
        description: "",
        title: "",
        subtitle: "",
        text: "",
        urlImage: "",
        altImage: "",
        urlButton: "",
        labelButton: "",
        colorButton: "",
        styleButton: "solid",
        icon: "",
        altIcon: "",
        imageBackground: "",
    }
);

const { ui } = useUI(
    "eh-action-card",
    toRef(props, "ui"),
    config
);

const backgroundClass = computed(() => {
    if (props.imageBackground) {
        return "background-image: url(" + props.imageBackground + ")";
    }
});
</script>

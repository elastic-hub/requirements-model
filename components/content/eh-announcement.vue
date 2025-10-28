<template>
    <div v-if="visible" :class="mergedConfig.wrapper">
        <div :class="mergedConfig.base">
            <ContentQuery path="/announcement" v-slot="{ data }">
                <div class="flex-1">
                    <ContentRenderer :value="item" v-for="item in data" :key="item._id" />
                </div>
            </ContentQuery>
            <button @click="hideAnnouncement" :class="mergedConfig.button">
                <UIcon name="i-line-md:close-small" dynamic :class="mergedConfig.icon" />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection';

const config = {
    wrapper: 'bg-red-600 dark:bg-red-700 p-1 sm:p-3 text-center text-white',
    base: 'flex items-center justify-between',
    button: 'ml-4 hover:scale-125 duration-700',
    icon: 'text-3xl mr-4 text-white',
};

const props = withDefaults(
    defineProps<{
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
    },
);

// Merge user-provided UI config with defaults
const mergedConfig = computed(() => ({
    wrapper: props.ui?.wrapper || config.wrapper,
    base: props.ui?.base || config.base,
    button: props.ui?.button || config.button,
    icon: props.ui?.icon || config.icon,
}));

const visible = ref(false);

const { data, pending } = await useAsyncData('announcement', () =>
    useQueryCollection('/announcement').first()
);

watchEffect(() => {
    if (!pending.value && data.value) {
        visible.value = data.value.visible === true;
    }
});

const hideAnnouncement = () => {
    visible.value = false;
};
</script>

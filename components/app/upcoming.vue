<template>
    <UAccordion :items="accordionItems" default-open :ui="{ wrapper: 'w-full' }">
        <template #default="{ item, open }">
            <div class="flex items-center cursor-pointer w-full">
                <div class="text-xl font-bold mb-4 dark:text-white">
                    {{ item.label }}
                </div>
                <span class="flex-1"></span>
                <UIcon name="i-heroicons-chevron-right-20-solid"
                    class="w-5 h-5 text-white -mt-4 transform transition-transform duration-200"
                    :class="[open && 'rotate-90']" />
            </div>
        </template>
        <template #latest-list>
            <section class="">
                <ul class="divide-y divide-gray-200 dark:divide-neutral-700">
                    <li v-for="file in reorderedFiles" :key="file.path" class="py-3">
                        <NuxtLink :to="file.path" :class="{ 'bg-blue-100 dark:bg-blue-800': isActive(file.path) }"
                            class="flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900 rounded px-2 py-1 transition-colors">
                            <span
                                class="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-200">
                                {{ (file.title || file.path).toUpperCase() }}
                            </span>
                        </NuxtLink>
                    </li>
                </ul>
            </section>
        </template>
    </UAccordion>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'

const route = useRoute();

const accordionItems = [
  {
    label: ('upcoming agenda').toUpperCase(),
    slot: 'latest-list'
  }
];

const { data: files } = await useAsyncData('upcoming_agenda', () => {
    return useQueryCollection('content').all().then(allFiles => {
        return allFiles.filter(file => file.path && file.path.startsWith('/meetings/upcoming_agenda/'));
    });
});

// Move the second element to the fourth position in the files array
const reorderedFiles = computed(() => {
    if (!files.value || !Array.isArray(files.value)) return files.value || [];
    const arr = [...files.value];
    if (arr.length > 3) {
        const second = arr.splice(1, 1)[0];
        arr.splice(3, 0, second);
    }
    return arr;
});

const isActive = (path: string) => {
    return route.path === path
}
</script>
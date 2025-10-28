<template>
  <UAccordion :items="accordionItems" :ui="{ wrapper: 'w-full' }">
    <template #default="{ item, open }">
      <div class="flex items-center cursor-pointer w-full">
        <div class="text-xl font-bold mb-4 dark:text-white">
          {{ item.label }}
        </div>
        <span class="flex-1"></span>
        <UIcon name="i-heroicons-chevron-right-20-solid"
          class="w-5 h-5 text-white -mt-4 transform transition-transform duration-200" :class="[open && 'rotate-90']" />
      </div>
    </template>
    <template #documents-list>
      <section class="">
        <ul>
          <li v-for="file in filteredFiles" :key="file.path" class="py-3" :ref="el => setFileRef(file.path, el)">
            <NuxtLink :to="file.path"
              class="flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900 rounded px-2 py-1 transition-colors"
              :class="{ 'bg-blue-100 dark:bg-blue-800': isActive(file.path) }">
              <span
                class="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-200">
                {{ file.title || file.path }}
              </span>
            </NuxtLink>
          </li>
        </ul>
        <div v-if="filteredFiles.length === 0" class="text-gray-400 italic px-2 py-4">No documents found in /meetings/v*
        </div>
      </section>
    </template>
  </UAccordion>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useAccordionDefaultOpen } from '~/composables/nuxt/utils/accordionDefaultOpen';
import { useScrollIntoView } from '~/composables/nuxt/utils/scrollIntoView';

const route = useRoute();

const { data: files } = await useAsyncData('documents', () => {
  return useQueryCollection('content').all().then(allFiles => {
    return allFiles.filter(file => file.path && file.path.startsWith('/meetings/v'));
  });
});

const filteredFiles = computed(() => {
  return Array.isArray(files.value) ? files.value : [];
});

const folderName = computed(() => {
  // Find the first /meetings/v* folder name from the filtered files
  const first = filteredFiles.value[0]?.path;
  if (first) {
    const match = first.match(/^\/meetings\/(v[^/]+)/i);
    if (match && match[1]) return match[1].toUpperCase();
  }
  return 'DOCUMENTS';
});

const {
  keywordRefs: fileRefs,
  setKeywordRef: setFileRef,
  scrollActiveIntoView: scrollFileIntoView
} = useScrollIntoView(
  () => {
    // Find the active file by path
    const active = filteredFiles.value.find(file => isActive(file.path));
    return active?.path;
  },
  (file: any) => file.path
);

const { isDefaultOpen } = useAccordionDefaultOpen(
  filteredFiles.value,
  (file: any) => file.path,
  (path: string | undefined) => !!path && isActive(path)
);

const accordionItems = computed(() => [
  {
    label: folderName.value,
    slot: 'documents-list',
    defaultOpen: isDefaultOpen.value
  }
]);

const isActive = (path: string) => {
  return route.path === path
}

onMounted(() => {
  scrollFileIntoView(filteredFiles.value);
});

watch(() => route.path, () => {
  scrollFileIntoView(filteredFiles.value);
});
</script>

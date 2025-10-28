<template>
        <UAccordion :key="accordionKey" :items="accordionItems" :ui="{ wrapper: 'w-full' }"> <!-- default-open -->
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
                        <li v-for="keyword in orderedKeywords" :key="keyword" class="py-3"
                            :ref="el => setKeywordRef(keyword, el)">
                            <template v-if="loading">
                                <span class="flex items-center w-full text-gray-400 italic px-2 py-1">
                                    <span class="w-32 font-semibold animate-pulse">Loading...</span>
                                    <span class="flex-1 animate-pulse">&nbsp;</span>
                                </span>
                            </template>
                            <template v-else>
                                <NuxtLink v-if="latest[keyword]" :to="latest[keyword].path || latest[keyword]._path"
                                    :title="latest[keyword].extractedDate.toLocaleDateString()"
                                    class="flex items-center group hover:bg-blue-50 dark:hover:bg-blue-900 rounded px-2 py-1 transition-colors"
                                    :class="{ 'bg-blue-100 dark:bg-blue-800': isActive(latest[keyword].path) }">
                                    <span
                                        class="w-32 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-200">
                                        {{ keyword.toUpperCase() }}
                                    </span>
                                </NuxtLink>
                                <span v-else class="flex items-center w-full text-gray-400 italic px-2 py-1">
                                    <span class="w-32 font-semibold">{{ keyword.toUpperCase() }}</span>
                                    <span class="flex-1">No file found</span>
                                </span>
                            </template>
                        </li>
                    </ul>
                </section>
            </template>
        </UAccordion>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useScrollIntoView } from '~/composables/nuxt/utils/scrollIntoView';
import { useAccordionDefaultOpen } from '~/composables/nuxt/utils/accordionDefaultOpen';

const route = useRoute();

const {
  keywordRefs,
  setKeywordRef,
  scrollActiveIntoView
} = useScrollIntoView(
  () => {
    // Find the active key based on latest and route
    for (const keyword of orderedKeywords) {
      if (latest[keyword] && isActive(latest[keyword].path)) {
        return keyword;
      }
    }
    return undefined;
  },
  (keyword: string) => keyword
);

function scrollAfterUpdate() {
  scrollActiveIntoView(orderedKeywords);
}

const props = withDefaults(
    defineProps<{
        //ui?: Partial<typeof config>;
        class?: any;
    }>(),
    {
        ui: () => ({}),
        class: undefined,
    },
);

// const { ui, attrs } = useUI(
//     "SideMenu",
//     toRef(props, "ui"),
//     config,
//     toRef(props, "class"),
//     true,
// );

const formattedPath = (() => {
    const firstSegment = route.path.replace(/^\//, '').split('/')[0] || '';
    return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
})();

const latest = reactive({} as Record<string, any>);
const orderedKeywords = ['maintainers', 'tf-1', 'tf-2', 'members', 'tf-3'];
const loading = ref(true); // Add loading state
const accordionKey = ref(0);

const { isDefaultOpen } = useAccordionDefaultOpen(
  orderedKeywords,
  (keyword: string) => latest[keyword]?.path || latest[keyword]?._path,
  (path: string | undefined) => !!path && isActive(path)
);

const buildAccordionItems = () => [
  {
    label: ('latest ' + formattedPath).toUpperCase(),
    slot: 'latest-list',
    defaultOpen: isDefaultOpen.value
  }
];

const accordionItems = ref(buildAccordionItems());

/**
 * Function to parse the date from the filename
 * Example filename: "FOCUS_TF-1_20250405_Minutes.md"
 * Date format: YYYYMMDD
 */
const extractDateFromFilename = (filename: string) => {
    const datePattern = /_(\d{8})_/;
    const match = filename.match(datePattern);

    if (match && match[1]) {
        // Parse as YYYYMMDD
        const year = parseInt(match[1].slice(0, 4), 10);
        const month = parseInt(match[1].slice(4, 6), 10) - 1; // JS months are 0-based
        const day = parseInt(match[1].slice(6, 8), 10);
        return new Date(year, month, day);
    }
    return null;
};

const fetchMeetings = async () => {
    loading.value = true;
    // Always target all files, then filter for /meetings
    const { data: files } = await useAsyncData('latest-meetings', () => {
        return useQueryCollection('content').all();
    });
    // Initialize the object to keep only the latest meeting per group
    orderedKeywords.forEach(keyword => (latest[keyword] = null));
    const arr = Array.isArray(files.value)
        ? files.value
        : files.value
            ? [files.value]
            : [];
    arr
        .filter(file => {
            // Only files in /meetings and matching a keyword
            let filename = (file as any)._file;
            let filePath = (file as any).path || (file as any)._path;
            if (!filename && filePath) {
                const pathParts = filePath.split('/');
                filename = pathParts[pathParts.length - 1];
            }
            return (
                filePath && filePath.startsWith('/meetings') &&
                filename && orderedKeywords.some(keyword => filename.toLowerCase().includes(keyword))
            );
        })
        .map(file => {
            let filename = (file as any)._file;
            let filePath = (file as any).path || (file as any)._path;
            if (!filename && filePath) {
                const pathParts = filePath.split('/');
                filename = pathParts[pathParts.length - 1];
            }
            const extractedDate = filename ? extractDateFromFilename(filename) : null;
            return { ...file, extractedDate, _filename: filename };
        })
        .filter(file => file && file.extractedDate !== null)
        .forEach(file => {
            // Find the keyword that matches this file (case-insensitive)
            const keyword = orderedKeywords.find(kw => file._filename && file._filename.toLowerCase().includes(kw.toLowerCase())); if (keyword && file.extractedDate !== null) {
                // Only replace if this is the latest date
                if (
                    !latest[keyword] ||
                    (latest[keyword].extractedDate !== null && file.extractedDate > latest[keyword].extractedDate)
                ) {
                    latest[keyword] = file;
                }
            }
        });
    loading.value = false;
    await forceAccordionRemount();
    await nextTick();
    scrollAfterUpdate();
};

const forceAccordionRemount = async () => {
  accordionItems.value = buildAccordionItems();
  accordionKey.value++;
  await nextTick();
  scrollAfterUpdate();
};

onMounted(async () => {
    await fetchMeetings();
});

// Watch route.path to force remount on navigation
watch(() => route.path, async () => {
  await forceAccordionRemount();
});

const isActive = (path: string) => {
    return route.path === path
}

// Add after script setup imports and before other logic

</script>
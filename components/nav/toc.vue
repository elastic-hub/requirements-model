<template>
  <div v-if="page?.body?.toc?.links?.length > 0"
    class="overflow-y-auto max-h-[calc(100vh-50vh)] w-full max-w-xs mx-auto">
    <nav>
      <button
        class="flex sticky top-0 z-10 items-center gap-1.5 lg:cursor-text lg:select-text w-full group dark:bg-[#10121A] pb-4">
        <span class="font-semibold text-sm/6 truncate w-full">
          <div class="dark:text-white font-extrabold">{{ ('Table of Contents').toUpperCase() }}</div>
        </span>
      </button>
      <ul class="space-y-1 lg:block pl-0 break-words">
        <li v-for="(link, index) in page.body.toc.links" :key="index" class="space-y-1 lg:block"
          :class="[isActive(link.id) ? ui.active : ui.normal]">
          <ULink :id="`toc-${link.id}`" :to="`${page._path}#${link.id}`"
            :class="[ui.shadow, isActive(link.id) ? ui.link.active : ui.link.normal]"
            class="not-prose pl-1 pr-1 text-black dark:text-blue-300" @click.prevent="handleTocClick(link.id)">
            {{ link.text }}
          </ULink>
          <ul v-if="link.children?.length > 0"
            class="space-y-1 hidden lg:block ml-4 border-l border-gray-200 dark:border-neutral-700 pl-2">
            <li v-for="(subLink, subIndex) in link.children" :key="subIndex" class="space-y-1 lg:block"
              :class="[isActive(subLink.id) ? ui.active : ui.normal]">
              <ULink :id="`toc-${subLink.id}`" :to="`${page._path}#${subLink.id}`"
                :class="[ui.shadow, isActive(subLink.id) ? ui.link.active : ui.link.normal]"
                class="not-prose pl-1 pr-1 text-black dark:text-blue-300" @click.prevent="handleTocClick(subLink.id)">
                {{ subLink.text }}
              </ULink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
const config = {
  shadow: 'hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:text-blue-200 hover:rounded-lg pt-2 pb-2 hover:w-fit',
  active: 'p-2',
  normal: 'w-full ',
  link: {
    active: 'bg-blue-100 dark:bg-blue-800 text-black dark:text-white rounded-lg pt-2 pb-2',
    normal: 'w-full block text-black dark:text-white hover:text-black dark:hover:text-blue-200'
  }
};


const props = withDefaults(defineProps<{
  page: any,
  ui?: Partial<typeof config>
}>(),
  {
    page: [],
    ui: () => ({}),
  });

const { ui } = useUI("toc", toRef(props, "ui"), config);

const activeSection = ref<string | null>(null);

const isActive = (id: string) => {
  return activeSection.value === id;
};

const handleTocClick = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeSection.value = id;
    // Update the hash in the URL without reloading
    if (history.pushState) {
      history.pushState(null, '', `#${id}`);
    } else {
      location.hash = `#${id}`;
    }
  }
};

const setActiveSectionFromHash = () => {
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    activeSection.value = hash;
  } else {
    activeSection.value = null;
  }
};

onMounted(() => {
  setActiveSectionFromHash();
  window.addEventListener('hashchange', setActiveSectionFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', setActiveSectionFromHash);
});
</script>

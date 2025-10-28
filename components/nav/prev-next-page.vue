<template>
  <hr class="border-2 dark:border-golden rounded-r-xl rounded-l-xl" />
  <div class="grid grid-cols-2 mt-10 mx-auto max-w-max min-w-full not-prose">
    <NuxtLink v-if="prev && prev._path !== '/'" :to="prev._path" :class="['col-start-1 justify-start text-left items-start lg:mr-20 sm:mr-5', ui.button]">
      <UIcon name="i-vaadin:chevron-circle-left-o" dynamic :class="ui.icon" />
      <div :class="ui.title">{{ prev.title }}</div>
      <div v-if="showDescription && prev.description" :class="['text-left', ui.description]">{{ prev.description }}
      </div>
    </NuxtLink>
    <NuxtLink v-if="next && next._path !== '/'" :to="next._path" :class="['col-start-2 justify-end text-right items-end lg:ml-20 sm:ml-5', ui.button]">
      <UIcon name="i-vaadin:chevron-circle-right-o" dynamic :class="ui.icon" />
      <div :class="ui.title">{{ next.title }}</div>
      <div v-if="showDescription && next.description" :class="['text-right', ui.description]">{{ next.description }}
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const excludedPaths = [
  "/announcement",
  "/landing-page-floaters",
  "/landing-page-menu",
  "/test-guide",
];

const guidelinesPaths = [
  "/guidelines",
  "/guidelines/looks-feel",
  "/guidelines/components",
  "/guidelines/components/sh",
];

const excludedDirectoryRegex = guidelinesPaths.some(path => route.path.includes(path)) ? '' : /^\/guidelines(\/|$)/;

// Adjust the query to exclude specific paths
const [prev, next] = await queryContent()
  .where({
    _path: { $not: /\/_dir$/ }, // Exclude _dir directories
    _partial: false,           // Exclude partial content (this could be used instead of the _dir exlusion above)
    $and: [
      { _path: { $not: { $in: excludedPaths } } }, // Exclude specific files
      { _path: { $not: excludedDirectoryRegex } }, // Exclude specific directory; -> think about adding all of this to app.config.ts
    ]
  })
  .findSurround(route.path);

const config = {
  button: 'flex flex-col border-[3px] dark:border-golden p-4 rounded-xl hover:border-[3px] hover:border-primary/[0.6] dark:hover:saturate-[350%] hover:bg-primary/[0.3] dark:hover:bg-neutral-50/[0.01] transition-colors mx-1',
  icon: 'text-3xl hover:scale-105 text-black dark:text-golden mb-8',
  title: 'text-lg sm:text-3xl font-semibold text-black dark:text-golden mb-3 break-words',
  description: 'text-sm sm:text-lg font-normal mt-2 text-gray-700 dark:text-golden/[0.4] break-words',
};

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    showDescription?: boolean;
  }>(),
  {
    ui: () => ({}),
    showDescription: true,
  }
);

const { ui } = useUI(
  "prev-next-page",
  toRef(props, "ui"),
  config
);
</script>

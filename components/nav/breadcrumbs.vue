<template>
  <div :class="ui.wrapper">
    <div :class="ui.inner">
      <NuxtLink v-if="route.path !== '/index'" to="/"
        :class="[ui.linkCrumb, { 'hidden': breadcrumbs.length > 2, 'lg:flex': breadcrumbs.length > 2 }]">
        <UIcon :name="iconHome" dynamic :class="ui.iconHome" />
        HOME
      </NuxtLink>
      <span v-for="(crumb, index) in breadcrumbs" :key="index" :class="ui.crumbsWrapper">
        <div v-if="route.path !== '/index'">
          <UIcon :name="iconNext" dynamic :class="[ui.iconNext, index === 0
            ? (breadcrumbs.length > 2 ? 'hidden lg:inline-flex' : 'inline-flex')
            : 'inline-flex']" />
        </div>
        <NuxtLink v-if="crumb.to != route.path" :to="crumb.to"
          :class="{ [ui.linkCrumb]: isBreadcrumbActive(crumb, index) }">
          <UIcon v-if="route.path !== '/index'" :name="iconCrumb" dynamic :class="ui.iconCrumb" />
          <UIcon v-else :name="iconHome" dynamic :class="ui.iconHome" />
          {{ crumb.label.toUpperCase() }}
        </NuxtLink>
        <span v-else :class="[ui.activeCrumb, { '': isBreadcrumbActive(crumb, index) }]">
          <UIcon v-if="route.path === '/index'" :name="iconHome" dynamic :class="ui.iconHome" />
          <UIcon v-else :name="iconCrumb" dynamic :class="ui.iconCrumb" />
          {{ crumb.label.toUpperCase() }}
        </span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">

const config = {
  wrapper: 'w-full flex italic 2xl:justify-center items-center',
  inner: 'flex items-center mr-0 lg:mx-auto mt-2 border rounded-xl dark:bg-[#161924] pl-5 pr-5',
  crumbsWrapper: 'flex items-center text-primary/[0.7] dark:text-primary/[0.8]',
  iconNext: 'text-3xl flex items-center mt-1',
  iconHome: 'hidden md:inline-flex items-center mr-1',
  iconCrumb: 'hidden md:inline-flex items-center mr-1',
  linkCrumb: 'text-[15px] font-normal text-primary/[0.7] hover:text-black dark:text-primary/[0.8] dark:hover:text-white duration-300 ease-out',
  activeCrumb: 'text-[15px] font-normal text-black dark:text-white',
};


const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    iconNext?: string;
    iconCrumb?: string;
    iconHome?: string;
  }>(),
  {
    ui: () => ({}),
    iconNext: 'material-symbols:arrow-right-rounded',
    iconCrumb: 'solar:folder-path-connect-linear',
    iconHome: 'line-md:home-twotone',
  },
);

const { ui } = useUI(
  "breadcrumbs",
  toRef(props, "ui"),
  config
);
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const route = useRoute();

//const frontmatter = ref<any[]>([]);

// watchEffect(async () => {
//   frontmatter.value = await queryContent(route.path).where({ icon: { $exists: true } }).find();
//   console.log(frontmatter.value[0].icon);
// });

const breadcrumbs = computed(() => {
  const pathSegments = route.path.split('/').filter(segment => segment !== '');
  return pathSegments.map((segment, index) => {
    const to = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = capitalize(segment);
    return { to, label };
  });
});

const isBreadcrumbActive = (crumb: { to: string }, index: number) => {
  const currentPath = `/${route.path.split('/').filter(segment => segment !== '').slice(0, index + 1).join('/')}`;
  return crumb.to === currentPath;
};

// Return frontmatter and other reactive properties to template
defineExpose({
  //frontmatter,
  breadcrumbs,
  isBreadcrumbActive
});
</script>
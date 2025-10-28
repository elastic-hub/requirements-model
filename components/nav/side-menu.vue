<template>
  <div v-if="sideMenuItems && sideMenuItems.length > 0" :class="ui.wrapper">
    <aside class="not-prose text-wrap">
      <nav v-if="sideMenuItems" class="">
        <AppUpcoming v-if="route.path.startsWith('/meetings')" />
        <AppLatest v-if="route.path.startsWith('/meetings')" />
        <AppDocuments v-if="route.path.startsWith('/meetings')" />
        <ul v-if="!route.path.startsWith('/meetings')" class="">
          <li v-for="(link, index) in sideMenuItems" :key="index">
            <div :class="[ui.shadow, isActive(link.to) ? ui.active : ui.normal]">
              <NuxtLink :to="link.to" :class="isActive(link.to) ? ui.link.active : ui.link.normal"
                class="dark:hover:text-oma-blue-100">
                <span :class="[getIndent(link.depth), 'text-nowrap w-full']">{{ link.title }}</span>
              </NuxtLink>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const config = {
  wrapper: 'max-h-[calc(100vh-20rem)] overflow-y-scroll border-r border-gray-600 p-3 pr-1',
  shadow: 'hover:bg-primary-200/[0.7] dark:hover:bg-primary-600 rounded-r-lg hover:rounded-lg p-1',
  active: 'block border-l-4 rounded-e-sm rounded-s-sm dark:border-blue-200 border-blue-400 bg-primary-200 dark:bg-primary-600/[0.7]',
  normal: 'block border-l-2 dark:border-neutral-700 border-gray-100-ml-px w-full',
  link: {
    active: 'text-blue-500 dark:text-blue-200 font-bold',
    normal: 'w-full block text-black dark:text-golden'
  }
};

// Add explicit types to fix implicit any errors
interface MenuItem {
  to: string;
  title: string;
  depth: number;
  children?: boolean;
  childrenList?: MenuItem[];
  defaultOpen?: boolean; // Add defaultOpen property
}

const addMenuItems = (list: any[], depth: number, prevEl: string | null, outList: MenuItem[]) => {
  if (list.length > 0 && depth < 4) {
    list.forEach((el: any) => {
      if (prevEl != el.path) {
        outList.push({
          to: el.path,
          title: el.title,
          depth: depth,
          children: el.children?.length > 0
        })
      }
      if (el.children?.length > 0) {
        addMenuItems(el.children, depth + 1, el.path, outList)
      }
    });
  }
}

const sideMenuItems = computed<MenuItem[]>(() => {
  const menuItems: MenuItem[] = []
  if (props.items?.length > 0) {
    addMenuItems(props.items, 0, null, menuItems)
  }
  // Attach childrenList and defaultOpen for depth 1 items
  menuItems.forEach((item: MenuItem, idx: number) => {
    if (item.depth === 1 && item.children) {
      item.childrenList = menuItems.filter((child: MenuItem) => child.depth === 2 && child.to.startsWith(item.to))
      // Default open if not a 'v' folder
      item.defaultOpen = !item.title.toLowerCase().startsWith('v')
    }
  })
  return menuItems
})

const props = withDefaults(
  defineProps<{
    ui?: Partial<typeof config>;
    class?: any;
    items: [];
  }>(),
  {
    ui: () => ({}),
    class: undefined,
    items: undefined
  },
);

const { ui, attrs } = useUI(
  "SideMenu",
  toRef(props, "ui"),
  config,
  toRef(props, "class"),
  true,
);

const isActive = (path: string) => {
  return route.path === path
}

const CONST_INDENT = ['pl-2 font-semibold', 'pl-4', 'pl-8', 'pl-12']

const getIndent = (depth: number) => {
  return CONST_INDENT[depth]
}
</script>


<template>
    <ul :class="ui.wrapper">
        <div v-if="compact === true" class="flex flex-row truncate">
            <li v-for="(item, index) in menuData.items" :key="index" class="group/item relative">
                <!-- Root Menu Item -->
                <button type="button" @click="() => handleClick(item)" :class="[
                    item.label === 'HOME'
                        ? 'hover:rounded-lg cursor-pointer'
                        : 'hover:rounded-lg cursor-pointer',
                    ui.rootMenuButton
                ]">
                    <span class="flex items-center space-x-2">
                        <span :class="[ui.rootMenuLabel, isActive(item) ? ui.rootActive : '']">
                            {{ item.label.toUpperCase() }}
                        </span>
                    </span>
                    <!-- <UIcon v-if="item.children" name="mdi:chevron-right" :class="ui.chevronIcon" /> -->
                </button>

                <!-- Submenu -->
                <!-- <ul v-if="item.children" :class="[ui.submenuUl, 'hidden group-hover/item:flex']">
                    <li v-for="(child, childIndex) in item.children" :key="childIndex" class="group/sub relative">
                        <button type="button" @click="() => handleClick(child)" :class="[
                        'cursor-pointer',
                        ui.button,
                        isActive(child) ? ui.submenuActive : '',
                    ]">
                            <span :class="ui.label">{{ child.label }}</span>
                        </button>
                    </li>
                </ul> -->
            </li>
        </div>
        <div v-else>
            <li v-for="(item, index) in menuData.items" :key="index" class="">
                <ul v-if="item.children" class="flex flex-row text-lg overflow-hidden">
                    <li v-for="(child, childIndex) in item.children" :key="childIndex">
                        <button type="button" @click="() => handleClick(child)" :class="[
                            'cursor-pointer duration-0',
                            ui.button,
                            isActive(child) ? ui.submenuActive : '',
                        ]">
                            <span :class="ui.label">{{ child.label }}</span>
                        </button>
                    </li>
                </ul>
            </li>
        </div>
    </ul>

    <div class="flex ml-14">
        <NuxtLink v-for="file in localContent" :key="file.path" :to="file.path"
            :class="[ui.rootMenuButton, 'truncate']">
            <span :class="[ui.rootMenuLabel, isActive(file) ? ui.rootActive : '', 'flex items-center']">
                {{ file.title.toUpperCase() }}
            </span>
        </NuxtLink>
    </div>

</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useQueryCollectionNavigation } from '~/composables/nuxt/nav/useQueryCollectionNavigation'

const menus = useAppConfig().menus
const routes = menus.routes
const menu_order = menus.menu_order

const config = {
    wrapper: 'w-fit flex items-center',
    rootMenuButton: 'w-fit flex items-center justify-start px-3 py-2 text-left hover:bg-white dark:hover:bg-gray-800 hover:rounded-lg cursor-pointer',
    rootMenuLabel: 'font-medium text-xl text-gray-900 dark:text-gray-100',
    rootActive: 'relative after:content-[\'\'] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[5px] after:bg-[#0269BD] after:dark:bg-[#0269BD] after:rounded-full',
    submenuActive: 'underline underline-offset-4 decoration-4 decoration-[#0269BD] dark:decoration-[#0269BD]',
    submenuUl: 'absolute top-10 left-0 flex-col shadow-lg mt-0 z-10 bg-white dark:bg-gray-800 rounded-tl-none rounded-b-lg rounded-tr-lg hover:rounded-tl-lg',
    ul: 'absolute left-full top-0 flex-col shadow-lg rounded-lg mt-0 z-10 bg-white dark:bg-gray-800',
    button: 'w-full flex items-center px-4 py-2 text-left hover:rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600',
    label: 'font-small text-gray-900 dark:text-gray-100 truncate',
    contentIcon: '',
    chevronIcon: 'ml-auto',
}

const props = withDefaults(
    defineProps<{
        ui?: Partial<typeof config>
        compact?: boolean
    }>(),
    {
        ui: () => ({}),
        compact: true,
    }
)

const { ui } = useUI('menus', toRef(props, 'ui'), config, undefined, true)

const router = useRouter()
const route = useRoute()

const { data: navArray } = await useQueryCollectionNavigation()


const navigation = computed(() => {
    const arr = [...(navArray.value || [])]
    const alwaysAtEnd = menu_order

    const endItems = []
    for (const path of alwaysAtEnd) {
        const idx = arr.findIndex((item: any) => item.path === path)
        if (idx !== -1) {
            endItems.push(arr.splice(idx, 1)[0])
        }
    }
    // Add them at the end, in order
    arr.push(...endItems)
    return arr
})



const { data: localContent } = await useAsyncData(() => {
    return queryCollectionNavigation('localContent')
})

const excludedTitles: string[] = routes.titles.ignore ? routes.titles.ignore : [] //app.config.menus.routes.titles.ignore
const excludedPaths: string[] = routes.ignore ? routes.ignore : [] //app.config.menus.routes.ignore

function filterExcludedPaths(navItem: any): boolean {
    if (excludedPaths.includes(navItem.path)) return false
    if (navItem.children) {
        navItem.children = navItem.children.filter(filterExcludedPaths)
    }
    return true
}

const filteredNavigation = computed(() =>
    navigation.value?.filter(
        (navItem: any) =>
            filterExcludedPaths(navItem) &&
            !excludedTitles.includes(navItem.title)
    )
)

interface MenuItem {
    label: string
    path?: string
    onClick?: () => void
    children?: MenuItem[] | null
}

function processNavigationItem(navItem: any): MenuItem {
    if (navItem.children?.length === 1) {
        const singleChild = navItem.children[0]
        return {
            label: navItem.title,
            path: singleChild.path,
        }
    }

    return {
        label: navItem.title,
        path: navItem.path,
        children: navItem.children?.map(processNavigationItem) || null,
    }
}

const menuData = computed(() => {
    const items: MenuItem[] = []
    for (const navItem of filteredNavigation.value || []) {
        items.push(processNavigationItem(navItem))
    }
    return { items }
})

const currentPath = computed(() => route.path)

function isActive(item: MenuItem | { path?: string }): boolean {
    // Support both MenuItem and file objects
    const itemPath = item.path || '';
    // For localContent files, ensure the prefix matches the generated link
    if (itemPath) {
        // If the path is already prefixed, compare directly
        if (currentPath.value === itemPath) return true;
        // If the current path starts with /localContent, check for match
        if (currentPath.value.startsWith('/localContent')) {
            // Remove /localContent prefix for comparison
            const current = currentPath.value.replace(/^\/localContent/, '');
            const itemClean = itemPath.replace(/^\/localContent/, '');
            if (current === itemClean) return true;
        }
    }
    // For menu items with children
    if ('children' in item && item.children && item.children.length) {
        return item.children.some(isActive);
    }
    return false;
}

function handleClick(item: MenuItem) {
    if (item.onClick) {
        item.onClick()
    } else if (item.path) {
        router.push(item.path)
    }
}
</script>

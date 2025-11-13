<template>
    <div>
        <UIcon name="pajamas:hamburger" dynamic @click="isOpen = true" title="Open sidemenu"
            class="text-3xl hover:scale-105 duration-300" />

        <USlideover v-model="isOpen">
            <UCard class="flex flex-col flex-1"
                :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex h-8 justify-between items-center">
                        <AppSocialLinks class="text-2xl space-x-1" />
                        <div class="flex items-center space-x-4">
                            <!-- <AppColorMode class="" /> -->
                            <AppLogin class="flex sm:hidden mt-1" />
                            <UIcon name="material-symbols-light:right-panel-close" title="Close sidemenu" dynamic
                                @click="isOpen = false"
                                class="text-4xl hover:text-red-500 dark:hover:text-red-500 cursor-pointer" />
                        </div>
                    </div>
                    <hr v-if="showBreadcrumbs" class="flex md:hidden border-golden/35 mt-5 mb-2 w-[95%] mx-auto">
                    <NavBreadcrumbs class="flex md:hidden" />
                </template>

                <div class="h-full overscroll-contain overflow-y-auto max-h-[calc(100vh-8rem)]">
                    <UAccordion :items="menuData.items" multiple>
                        <template #default="{ item, open }">
                            <div>
                                <!-- Root Menu Button -->
                                <button @click="item.onClick"
                                    :class="[ui.rootMenuButton, isActive(item) ? ui.rootActive : '']">
                                    <span class="flex items-center space-x-2">
                                        <span :class="ui.rootMenuLabel">{{ item.label.toUpperCase() }}</span>
                                    </span>
                                    <UIcon v-if="item.children" :name="open ? 'mdi:chevron-down' : 'mdi:chevron-right'"
                                        :class="ui.chevronIcon" />
                                </button>

                                <!-- Submenu (Opens when root menu item is clicked) -->
                                <UAccordion v-if="open && item.children" :items="item.children" multiple>
                                    <template #default="{ item: child }">
                                        <button @click="child.onClick"
                                            :class="[ui.button, 'ml-5 border-l rounded-l-none rounded-e-lg brightness-75 hover:brightness-100', isActive(child) ? ui.submenuActive : '']">
                                            <span :class="ui.label">{{ child.label.toUpperCase() }}</span>
                                        </button>
                                    </template>
                                </UAccordion>
                            </div>
                        </template>
                    </UAccordion>

                    <div class="mt-8">
                        <NuxtLink v-for="file in localContent" :key="file.path" :to="file.path"
                            :class="[ui.rootMenuButton, 'truncate', file.path === route.path ? ui.rootActive : '']">
                            <span :class="[ui.rootMenuLabel]">
                                {{ file.title.toUpperCase() }}
                            </span>
                        </NuxtLink>
                    </div>

                </div>

                <template #footer>
                    <div class="flex h-8 justify-center" :style="{
                        fontFamily: hamburgerMenu.footer.brand?.name?.font?.type || hamburgerMenu.footer.brand?.tagline?.font?.type || site.brand?.name?.font?.type,
                        fontSize: hamburgerMenu.footer.brand?.name?.font?.size || hamburgerMenu.footer.brand?.tagline?.font?.size || site.brand?.name?.font?.size
                    }"><em>{{ hamburgerMenu.footer.brand.name.value || hamburgerMenu.footer.brand.tagline.value ||
                            site.brand.name.value }} &copy; {{ year }}</em></div>
                </template>
            </UCard>
        </USlideover>
    </div>
</template>

<script setup lang="ts">
const showBreadcrumbs = computed(() => route.path !== '/')

const site = useAppConfig().site
const hamburgerMenu = useAppConfig().hamburgerMenu
const routes = useAppConfig().routes

const isOpen = ref(false)

const MOBILE_BREAKPOINT = 768

function handleResize() {
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
        isOpen.value = false
    }
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const date = new Date();
const year = date.getFullYear();

//Fetch navigation data only once.
// const { data: navigation } = await useAsyncData('navigation', () =>
//     useQueryCollectionNavigation('content')
// )
import { useQueryCollectionNavigation } from '~/composables/nuxt/nav/useQueryCollectionNavigation'
const {data: navigation} = await useQueryCollectionNavigation()
const { data: localContent } = await useAsyncData(() => {
    return queryCollectionNavigation('localContent')
})

const router = useRouter()
const route = useRoute()

const config = {
    rootMenuButton:
        'w-full flex items-center justify-start px-3 py-2 text-left hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg',
    rootMenuLabel: 'font-medium text-xl text-gray-900 dark:text-gray-100',
    rootActive:
        'relative after:content-[" "] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[3px] after:bg-[#0269BD] after:rounded-full',
    submenuActive: 'underline underline-offset-4 decoration-2 decoration-[#0269BD]',
    button:
        'w-full flex items-center px-4 py-2 text-left hover:bg-white dark:hover:bg-gray-800 transition duration-200 rounded-lg',
    label: 'font-small text-gray-900 dark:text-gray-100 truncate',
    chevronIcon: 'ml-auto',
}

const props = withDefaults(
    defineProps<{
        ui?: Partial<typeof config>
    }>(),
    {
        ui: () => ({}),
    }
)

const { ui } = useUI(
    'hamburger-menu',
    toRef(props, 'ui'),
    config,
    undefined,
    true
)

interface MenuItem {
    label: string
    path: string
    children: MenuItem[] | null
    onClick: () => void
}

function transformNavigation(navItems: any[], isChild = false): MenuItem[] {
    

    const items = navItems
        .map(item => {
            let children = item.children ? transformNavigation(item.children, true) : null

            // Only add the index file if it's not already the first child
            if (!isChild && children && children.length > 0) {
                if (!children.some(child => child.path === item.path)) {
                    children.unshift({
                        label: item.title,
                        path: item.path,
                        children: null,
                        onClick: () => {
                            router.push(item.path)
                            isOpen.value = false
                        }
                    })
                }
            }

            return {
                label: item.title,
                path: item.path,
                children,
                onClick: () => {
                    if (isChild || (!children || children.length === 0)) {
                        router.push(item.path)
                        isOpen.value = false
                    }
                }
            }
        })

    // Sort the index page (/) to the top
    return items.sort((a, b) => {
        if (a.path === '/' || a.path === '/index') return -1
        if (b.path === '/' || b.path === '/index') return 1
        return 0
    })
}

const menuData = computed(() => {
    const items = navigation.value ? transformNavigation(navigation.value) : []

    // Add the Home button at the top of the menu
    // items.unshift({
    //     label: 'Home',
    //     path: '/',
    //     children: null,
    //     onClick: () => {
    //         router.push('/')
    //         isOpen.value = false
    //     }
    // })

    return { items }
})


const isActive = (item: MenuItem): boolean =>
    route.path === item.path || (item.children ? item.children.some(child => isActive(child)) : false)

</script>
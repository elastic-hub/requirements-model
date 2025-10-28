<template>
    <div class="grid grid-cols-12 relative ml-5 mr-5 mb-10">
        <div class="lg:col-start-1 lg:col-span-2 hidden lg:block overflow-auto h-screen fixed top-40 z-50">
            <NavSideMenu :items="displayNavigation" class="h-[calc(100vh-9rem)] overflow-auto" />
        </div>


        <section :class="[displayNavigation && displayNavigation.length > 0 ? 'lg:col-start-3 lg:col-span-7 lg:ml-24 xl:ml-10' : 'lg:col-span-9 xl:col-span-10 pr-14 xl:pr-16 2xl:pr-0' ,'col-start-1 col-span-12 w-full overflow-auto']">
            <h1 class="mt-16">
                {{ page?.meta.title || page?.title }}
            </h1>
            <ContentRenderer v-if="page" :value="page" :style="{ fontSize: main.font.size }" class="par mt-8 pb-10">
                <!--par is custom class for paragraph-->
            </ContentRenderer>
            <!-- <NavPrevNextPage v-if="route.path !== '/'" /> -->
        </section>


        <div
            class="col-start-12 col-span-1 hidden lg:block mt-0 fixed top-24 z-50 overflow-y-auto h-[calc(100vh-6rem)] -right-5 w-full max-w-xs"
        >
            <NavToc :page="page" class="block mt-20 w-full" />
            <hr v-if="(page?.body?.toc?.links?.length ?? 0) > 0" class="border-t border-gray-200 dark:border-neutral-700 my-4" />
            <AppUsefulLinks :class="[(page?.body?.toc?.links?.length ?? 0) > 0 ? '' : 'mt-20' ]" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useQueryCollectionNavigation } from '~/composables/nuxt/nav/useQueryCollectionNavigation'
import { useThrow404 } from '~/composables/nuxt/error/useThrow404'

const config = {
    shadow: 'hover:bg-primary-500 focus:bg-primary-200/[0.6] hover:focus:bg-primary-100 dark:hover:bg-neutral-500 dark:focus:bg-primary-600[0.6] dark:hover:focus:bg-neutral-500 rounded-lg',
};

const props = withDefaults(
    defineProps<{
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
    },
);

const { ui, attrs } = useUI(
    "doc",
    toRef(props, "ui"),
    config,
);

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
    return useQueryCollection('content').path(route.path).first()
})
const { data: navigation } = await useQueryCollectionNavigation()
useThrow404(page)

const main = useAppConfig().main

const routeDepth = route.path.split('/').length
const minDepth = routeDepth - 4 > 0 ? routeDepth - 4 : 0

const contentClass = computed(() => {
    if (page?.value?.meta.layout === 'doc') {
        return (page.value.body?.toc?.links?.length ?? 0) > 0 ? "mr-64" : ""
    } else {
        return ""
    }
})

const comparePathsForBranch = (path1: string, path2: string) => {
    const path1Parts = path1.split('/');
    const path2Parts = path2.split('/');

    if (path1Parts.length < path2Parts.length) {
        return false;
    }

    for (let i = 0; i < path2Parts.length; i++) {
        if (path1Parts[i] !== path2Parts[i]) {
            return false;
        }
    }

    return true;
}

const filterNavigation = (list: Array<any>, path: string) => {
    if (list?.length > 0) {
        const branchList = list.reduce((prev, curr) => {
            if (comparePathsForBranch(path, curr.path)) {
                prev.push(curr)
            }
            return prev
        }, [])

        return branchList

    } else {
        return list
    }
}

const displayNavigation = computed(() => {
    let res = page.value ? filterNavigation(navigation.value ?? [], page.value.path) : []
    if (minDepth > 0) {
        let depth = minDepth

        while (depth > 0) {
            let childResult = []
            depth -= 1
            if (res[0].children?.length > 0) {
                if (page.value) {
                    childResult = filterNavigation(res[0].children, page.value.path)
                }
                childResult = childResult.filter((item: { path: string; }) => {
                    const itemDepth = item.path.split('/')
                    return itemDepth.length >= routeDepth - 1
                })
                res = childResult.length > 0 ? childResult : res
            }
        }
    }
    return res
})
</script>
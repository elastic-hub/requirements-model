<template>
    <div class="grid grid-cols-12 relative ml-5 mr-5 mb-10">
        <div class="col-start-1 col-span-12 lg:col-start-1 lg:col-span-12 w-full lg:w-full overflow-auto">
            <ContentRenderer v-if="page" :value="page" :style="{ fontSize: main.font.size }"
                class="par pb-10 pl-4 pr-4 sm:pl-8 sm:pr-8 2xl:pl-36 2xl:pr-36">
            </ContentRenderer>
            <!-- <NavPrevNextPage v-if="route.path !== '/'" /> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useThrow404 } from '~/composables/nuxt/error/useThrow404'

const route = useRoute()

// First check if the content exists in localContent collection
const { data: localContent } = await useAsyncData(`localContent-${route.path}`, () => {
    return queryCollection('localContent').path(route.path).first().catch(() => null)
})
const pageID = localContent.value?.id

// Query the appropriate collection based on whether localContent exists
let page: any
if (pageID?.startsWith('localContent')) {
    const { data } = await useAsyncData(`web-${route.path}`, () => {
        return queryCollection('localContent').path(route.path).first()
    })
    page = data
} else {
    const { data } = await useAsyncData(`web-content-${route.path}`, () => {
        return queryCollection('content').path(route.path).first()
    })
    page = data
}

useThrow404(page)

const main = useAppConfig().main
</script>
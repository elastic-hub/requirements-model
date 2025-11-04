<template>
    <div class="prose w-full max-w-full">
        <LayoutsWeb v-if="page?.meta.layout === 'web'" />
        <LayoutsDoc v-else-if="page?.meta.layout === 'doc'" />
        <div v-else>
            <ContentRenderer v-if="page" :value="page" class="ml-5 mr-5 mb-10 mt-24" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useThrow404 } from '~/composables/nuxt/error/useThrow404'
const route = useRoute()

const { data: localContent } = await useAsyncData(`localContent-${route.path}`, () => {
    return queryCollection('localContent').path(route.path).first()
})
const pageID = localContent.value?.id

let page: any
if (pageID?.startsWith('localContent')) {
    const { data } = await useAsyncData(`${route.path}`, () => {
        return queryCollection('localContent').path(route.path).first()
    })
    page = data
} else {
    const { data } = await useAsyncData(`content-${route.path}`, () => {
        return queryCollection('content').path(route.path).first()
    })
    page = data
}

useThrow404(page)

useHead({
    title: page.value?.title,
})
</script>
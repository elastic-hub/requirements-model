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

// Try to fetch from localContent first
const { data: localContentPage } = await useAsyncData(`localContent-${route.path}`, () => {
    return queryCollection('localContent').path(route.path).first()
})

// If not found in localContent, try content collection
const { data: contentPage } = await useAsyncData(`content-${route.path}`, async () => {
    // Only query content if localContent didn't return anything
    if (localContentPage.value) return Promise.resolve(null)
    return queryCollection('content').path(route.path).first()
})

// Use whichever was found
const page: any = computed(() => localContentPage.value || contentPage.value)

useThrow404(page)

useHead({
    title: page.value?.title || 'Page',
})
</script>
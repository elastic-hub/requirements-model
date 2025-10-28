<template>
  <!-- <div class="relative">
    <SvgWave class="z-0 brightness-75" />
     <ContentRenderer v-if="home" :value="home" class="relative z-10" />
  </div> -->
  <div class="prose w-full max-w-full">
    <LayoutsWeb v-if="home?.meta.layout === 'web'" />
    <LayoutsDoc v-else-if="home?.meta.layout === 'doc'" />
    <div v-else>
      <ContentRenderer v-if="home" :value="home" class="ml-5 mr-5 mb-10" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useThrow404 } from '~/composables/nuxt/error/useThrow404'

const route = useRoute()

const { data: home } = await useAsyncData(`${route.path}`, () => {
  return useQueryCollection('content').path('/readme').first()
})

useSeoMeta({
  title: home.value?.title,
  description: home.value?.description,
})

const router = useRouter()
//await router.replace('/readme') // if you want to redirect to the readme page or any other page

useThrow404(home)
</script>
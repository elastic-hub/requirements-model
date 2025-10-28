<template>
    <div class="w-full group">
        <p class="dark:text-white">
            <b>{{ heading }}</b>
        </p>
        <ul>
            <li v-for="usefulLink in usefulLinks" :key="usefulLink.title">
                <NuxtLink :to="usefulLink.url" :class="['not-prose flex mb-3 text-black dark:text-white space-x-1']">
                    <div class="flex items-center space-x-3">
                        <UIcon v-if="usefulLink.icon" :name="usefulLink.icon" dynamic class="text-xl" />
                        <div>{{ usefulLink.title }}</div>
                    </div>
                    <UIcon name="ph:arrow-up-right" dynamic />
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const usefulLinksConfig = useAppConfig().usefulLinks;

const heading = usefulLinksConfig.heading;

const usefulLinks = Object.keys(usefulLinksConfig)
  .filter(key => key !== 'heading')
  .map(key => (usefulLinksConfig as any)[key]);
</script>
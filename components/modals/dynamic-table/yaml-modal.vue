<template>
    <UModal
        :ui="{ overlay: { background: 'dark:bg-[#10121A]/75' }, width: 'w-full sm:max-w-7xl', container: 'items-center' }">
        <UCard
            :ui="{ ring: 'ring-gray-200 dark:ring-neutral-700', background: 'bg-white dark:bg-[#10121A]', divide: 'divide-y divide-gray-100 dark:divide-neutral-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold">
                        {{ title }}
                    </h3>
                    <ModalsClose />
                </div>
            </template>
            <div class="flex items-center justify-between">
                <span class="font-mono underline underline-offset-4 text-xl">{{ itemId }}</span>
                <div class="flex items-center justify-end space-x-2">
                    <AppDownload :download="formattedYAML" :filename="filename" title="Download YAML file" />
                    <AppCopyToClipboard :text-to-copy="formattedYAML" title="Copy YAML to clipboard" />
                </div>
            </div>
            <div class="overflow-auto">
                <pre class="-mt-9"><code>{{ formattedYAML }}</code></pre>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">
import yaml from 'js-yaml'

interface Props {
    itemToConvert?: any
    title?: string
    filename?: string
    itemId?: string
}

const props = withDefaults(defineProps<Props>(), {
    title: 'Formatted as YAML',
    filename: 'data.yaml',
})

const rawJSON = props.itemToConvert || {'Message': 'No data provided'}
const formattedYAML = computed(() => yaml.dump(rawJSON))
</script>

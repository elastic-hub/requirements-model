<template>
    <UButton :label="props.label || 'Download'" variant="ghost" :icon="icon || 'i-heroicons-arrow-down-tray'" @click="downloadFile" />
</template>

<script setup lang="ts">
const props = defineProps<{
    label?: string,
    icon?: string,
    filename: string, // The name of the file to be downloaded, mandatory
    download: string
}>()

const downloadFile = () => {
    const blob = new Blob([props.download], { type: `${props.filename.split('.').pop()}` })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
</script>
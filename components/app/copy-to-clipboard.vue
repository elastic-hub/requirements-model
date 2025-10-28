<template>
  <UButton
    icon="i-heroicons-clipboard-document"
    variant="ghost"
    size="sm"
    @click="copyToClipboard"
    :disabled="copying"
  >
    {{ copying ? 'Copied!' : 'Copy' }}
  </UButton>
</template>

<script setup lang="ts">

const props = defineProps < {
    textToCopy: string
} >()

const copying = ref(false)

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(props.textToCopy)
        copying.value = true
        setTimeout(() => {
            copying.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy to clipboard:', err)
    }
}
</script>
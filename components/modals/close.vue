<template>
    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" @click="modal.close()" />
</template>

<script setup lang="ts">
const modal = useModal()
</script>
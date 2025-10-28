<template>
  <div>
    <button title="Toggle color mode"
      class="pl-3 pr-3 transition-colors"
      @click="cycleTheme">
      <UIcon :name="iconForTheme" class="hover:text-primary-600 dark:hover:text-primary-400 text-2xl" dynamic />
    </button>
  </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const themes = ['system', 'light', 'dark'] // Removed sepia
const themeIcons = {
  system: 'mdi:theme-light-dark',
  light: 'i-heroicons-sun-20-solid',
  dark: 'i-heroicons-moon-20-solid',
}

// Function to cycle through themes
const cycleTheme = () => {
  const currentIndex = themes.indexOf(colorMode.preference)
  const nextIndex = (currentIndex + 1) % themes.length
  colorMode.preference = themes[nextIndex]
}

// Computed property for the current icon
const iconForTheme = computed(() => themeIcons[colorMode.preference as keyof typeof themeIcons])
</script>

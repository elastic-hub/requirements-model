<template>
  <div class="relative rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">

    <!-- Toolbar -->
    <div
      class="absolute top-2 right-2 z-10 flex gap-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-md p-1 shadow-sm border border-gray-200 dark:border-gray-700">
      <UButton icon="i-material-symbols:zoom-in" size="xs" variant="ghost" title="Zoom in" @click="zoomIn" />
      <UButton icon="i-material-symbols:zoom-out" size="xs" variant="ghost" title="Zoom out" @click="zoomOut" />
      <UButton icon="i-material-symbols:fit-screen" size="xs" variant="ghost" title="Fit to screen" @click="fit" />
      <UButton icon="i-material-symbols:settings-backup-restore" size="xs" variant="ghost" title="Reset"
        @click="reset" />
    </div>

    <!-- Canvas -->
    <div ref="container" class="overflow-hidden cursor-grab active:cursor-grabbing select-none" :style="{ height }">
      <div v-if="error" class="p-4 text-red-500 text-sm">
        <pre>{{ error }}</pre>
      </div>
      <div v-else ref="el" />
    </div>

  </div>
</template>

<script setup lang="ts">
import mermaid from 'mermaid'
import Panzoom from '@panzoom/panzoom'
import type { PanzoomObject } from '@panzoom/panzoom'

const props = defineProps({
  code: { type: String, required: true },
  height: { type: String, default: 'default' },
})

const el = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const error = ref<string | null>(null)
let panzoom: PanzoomObject | null = null

const colorMode = useColorMode()
const mermaidTheme = computed(() => colorMode.value === 'dark' ? 'dark' : 'default')

async function render(code: string, preserveView = false) {
  if (!el.value) return
  error.value = null

  // snapshot current position before destroying panzoom
  const savedScale = preserveView ? (panzoom?.getScale() ?? null) : null
  const savedPan = preserveView ? (panzoom?.getPan() ?? null) : null

  try {
    mermaid.initialize({ startOnLoad: false, theme: mermaidTheme.value })

    const { svg } = await mermaid.render(`mermaid-${crypto.randomUUID()}`, code)
    el.value.innerHTML = svg
    await nextTick()
    initPanzoom()
    await nextTick()

    if (preserveView && savedScale !== null && savedPan !== null) {
      // restore silently — no animation, no visible jump
      panzoom?.zoom(savedScale, { animate: false })
      panzoom?.pan(savedPan.x, savedPan.y, { animate: false })
    } else {
      fit()
    }
  } catch (e: any) {
    error.value = e.message ?? 'Render error'
  }
}

function initPanzoom() {
  if (!el.value) return
  panzoom?.destroy()
  container.value?.removeEventListener('wheel', onWheel)
  panzoom = Panzoom(el.value, { maxScale: 5, minScale: 0.1, step: 0.3 })
  container.value?.addEventListener('wheel', onWheel, { passive: false })
}

function onWheel(e: WheelEvent) { panzoom?.zoomWithWheel(e) }
function zoomIn() { panzoom?.zoomIn() }
function zoomOut() { panzoom?.zoomOut() }
function reset() { panzoom?.reset({ animate: true }) }

function fit() {
  if (!panzoom || !el.value || !container.value) return
  const svg = el.value.querySelector('svg')
  if (!svg) return

  panzoom.reset({ animate: false })

  const { width: sw, height: sh } = svg.getBoundingClientRect()
  const { width: cw, height: ch } = container.value.getBoundingClientRect()
  if (!sw || !sh) return

  panzoom.zoom(Math.min(cw / sw, ch / sh) * 0.92, { animate: true })
}

onMounted(() => render(props.code))
watch(() => props.code, () => render(props.code))
watch(mermaidTheme, () => render(props.code, true)) // ← preserves zoom/pan on theme switch

onBeforeUnmount(() => {
  container.value?.removeEventListener('wheel', onWheel)
  panzoom?.destroy()
})
</script>
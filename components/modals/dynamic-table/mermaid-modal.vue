<template>
    <UModal
        :ui="{ overlay: { background: 'dark:bg-[#10121A]/75' }, width: 'w-full sm:max-w-7xl', container: 'items-center' }">
        <UCard
            :ui="{ ring: 'ring-gray-200 dark:ring-neutral-700', background: 'bg-white dark:bg-[#10121A]', divide: 'divide-y divide-gray-100 dark:divide-neutral-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3>
                        <span class="font-mono underline underline-offset-4 text-xl">{{ itemId }}</span>
                        <span class="text-lg font-semibold"> Converted to Mermaid Diagram</span>
                    </h3>
                    <ModalsClose />
                </div>
            </template>
            <div class="flex items-center justify-end">
                <div class="flex items-center justify-end space-x-2">

                    <UDropdown :items="downloadMenus" :ui="{ background: 'dark:bg-[#10121A]'}" :popper="{ placement: 'bottom-start' }">
                        <UButton label="Download" size="md" variant="ghost" icon="flowbite:chevron-right-outline" trailing
                            :ui="{ base: 'group', icon: { base: 'group-hover:transition-transform group-hover:rotate-90 duration-700 ease-out' } }" />
                    </UDropdown>

                    <AppCopyToClipboard :text-to-copy="mermaidCode" title="Copy Mermaid code to clipboard" />
                </div>
            </div>
            <div class="overflow-auto">
                <div ref="mermaidContainer" class="mermaid text-sm leading-tight"></div>
            </div>
        </UCard>
    </UModal>
</template>

<script setup lang="ts">

interface Props {
    code?: string
    itemToConvert?: any
    filename?: string
    itemId?: string
}
const props = withDefaults(defineProps<Props>(), {
    itemToConvert: {},
})
const rawJSON = props.itemToConvert

function jsonToMermaid(obj: Record<string, any>, rootName = 'Root') {
    let output: string[] = ['flowchart TD'];
    let nodeCounter = 0;
    const connections: string[] = [];

    function traverse(value: any, parentId: string, key?: string) {
        nodeCounter++;
        const nodeId = 'N' + nodeCounter;

        // Create readable label
        let label = key ? `${key}: ` : '';
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            label += value;
            output.push(`${nodeId}["${escapeLabel(label)}"]`);
            connections.push(`${parentId} --> ${nodeId}`);
        } else if (Array.isArray(value)) {
            label += '[Array]';
            output.push(`${nodeId}["${escapeLabel(label)}"]`);
            connections.push(`${parentId} --> ${nodeId}`);
            value.forEach((item, idx) => traverse(item, nodeId, `${key}[${idx}]`));
        } else if (typeof value === 'object' && value !== null) {
            label += '{Object}';
            output.push(`${nodeId}["${escapeLabel(label)}"]`);
            connections.push(`${parentId} --> ${nodeId}`);
            Object.entries(value).forEach(([k, v]) => traverse(v, nodeId, k));
        } else {
            label += 'null';
            output.push(`${nodeId}["${escapeLabel(label)}"]`);
            connections.push(`${parentId} --> ${nodeId}`);
        }
    }

    function escapeLabel(str: string) {
        return str.replace(/"/g, '\\"');
    }

    // Root node
    const rootId = 'N0';
    output.push(`${rootId}["${escapeLabel(rootName)}"]`);

    // Traverse
    Object.entries(obj).forEach(([key, value]) => traverse(value, rootId, key));

    // Combine
    return [...output, ...connections].join('\n');
}

// Compute the Mermaid code from rawJSON
const mermaidCode = computed(() => {
    if (props.itemToConvert) {
        const rootName = props.itemId || 'Root';
        return jsonToMermaid(props.itemToConvert, rootName);
    }
    return 'flowchart TD\n  A[No data to display]';
});

const mermaidContainer = ref<HTMLElement | null>(null)
const { $mermaid } = useNuxtApp()

const renderMermaid = async () => {
    if (!mermaidContainer.value) return

    try {
        // Clear the container first
        mermaidContainer.value.innerHTML = ''

        // Initialize mermaid with proper settings
        await $mermaid.initialize({ 
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose'
        })

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`

        // Render the mermaid diagram
        const { svg } = await $mermaid.render(id, mermaidCode.value)

        // Insert the SVG into the container
        mermaidContainer.value.innerHTML = svg
    } catch (err) {
        console.error('Mermaid render error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        if (mermaidContainer.value) {
            mermaidContainer.value.innerHTML = `<p class="text-red-500">Error rendering diagram: ${errorMessage}</p>`
        }
    }
}

onMounted(async () => {
    await nextTick()
    renderMermaid()
})

// Watch for changes in mermaidCode and re-render
watch(mermaidCode, renderMermaid)

const downloadAs = (format: 'svg' | 'png') => {
    const svgEl = mermaidContainer.value?.querySelector('svg')
    if (!svgEl) return

    if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(svgEl)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const link = document.createElement('a')
        link.href = svgUrl
        link.download = `${props.itemId || 'diagram'}.svg`
        link.click()
        URL.revokeObjectURL(svgUrl)
    } else if (format === 'png') {
        try {
            // Clone the SVG to avoid modifying the original
            const svgClone = svgEl.cloneNode(true) as SVGElement
            
            // Ensure SVG has proper dimensions
            const svgRect = svgEl.getBoundingClientRect()
            const width = svgRect.width || parseInt(svgEl.getAttribute('width') || '800')
            const height = svgRect.height || parseInt(svgEl.getAttribute('height') || '600')
            
            svgClone.setAttribute('width', width.toString())
            svgClone.setAttribute('height', height.toString())
            
            // Add XML declaration and proper namespace
            const svgData = `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(svgClone)}`
            
            // Create a data URL instead of blob URL to avoid CORS issues
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`
            
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const pixelRatio = window.devicePixelRatio || 1
                
                // Set canvas size with pixel ratio for better quality
                canvas.width = width * pixelRatio
                canvas.height = height * pixelRatio
                
                const ctx = canvas.getContext('2d')!
                ctx.scale(pixelRatio, pixelRatio)
                
                // Keep transparent background for PNG
                // Do not fill with white - let it stay transparent
                
                // Draw the SVG
                ctx.drawImage(img, 0, 0, width, height)
                
                // Convert to PNG blob with transparent background
                canvas.toBlob(blob => {
                    if (blob) {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${props.itemId || 'diagram'}.png`
                        link.click()
                        URL.revokeObjectURL(url)
                    }
                }, 'image/png', 1.0)
            }
            
            img.onerror = (error) => {
                console.error('Error loading SVG for PNG conversion:', error)
                // Fallback: try direct SVG download
                downloadAs('svg')
            }
            
            img.src = svgDataUrl
        } catch (error) {
            console.error('Error converting SVG to PNG:', error)
            // Fallback: try direct SVG download
            downloadAs('svg')
        }
    }
}

const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const downloadMenus = [
    [
        {
            label: 'Mermaid code',
            icon: 'i-simple-icons:mermaid',
            click: () => downloadFile(mermaidCode.value, `${props.itemId || 'diagram'}.mmd`)
        },
        {
            label: 'JSON',
            icon: 'i-codicon:json',
            click: () => downloadFile(JSON.stringify(rawJSON, null, 2), `${props.itemId || 'diagram'}.json`)
        },
        {
            label: 'Image (SVG)',
            icon: 'i-hugeicons:svg-01',
            click: () => downloadAs('svg')
        },
        {
            label: 'Image (PNG)',
            icon: 'i-hugeicons:png-01',
            click: () => downloadAs('png')
        }
    ]
]

</script>

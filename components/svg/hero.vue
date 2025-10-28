<template>
    <svg class="absolute inset-0 w-full h-full" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="none">
        <defs>
            <filter id="blur">
                <feGaussianBlur :stdDeviation="config.blurStdDev" />
            </filter>
        </defs>

        <!-- Straight connections between nodes using paths -->
        <g stroke="#1B6ECA" stroke-opacity="0.3" stroke-width="1">
            <path v-for="(conn, i) in connections" :key="`line-${i}`"
                :d="`M ${conn.x1} ${conn.y1} L ${conn.x2} ${conn.y2}`" />
        </g>

        <!-- Nodes -->
        <g fill="#1B6ECA">
            <circle v-for="(node, i) in nodes" :key="i" :cx="node.x" :cy="node.y" :r="config.nodeRadius"
                :fill-opacity="config.nodeMinOpacity">
                <animate attributeName="fill-opacity"
                    :values="`${config.nodeMinOpacity};${config.nodeMaxOpacity};${config.nodeMinOpacity}`"
                    :dur="`${config.pulseDuration}s`" repeatCount="indefinite" />
            </circle>
        </g>

        <!-- Flow dots -->
        <g fill="white" fill-opacity="0.6">
            <circle v-for="(dot, i) in dots" :key="i" :cx="dot.position.x" :cy="dot.position.y"
                :r="config.flowDotRadius" />
        </g>
    </svg>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(
    defineProps<{
        size?: number
        spokes?: number
        rings?: number
        config?: Partial<Record<
            'nodeRadius' | 'nodeMinOpacity' | 'nodeMaxOpacity' |
            'pulseDuration' | 'blurStdDev' | 'flowDotRadius' |
            'flowDotDuration' | 'flowDotOpacity' | 'enableFlow',
            number | boolean
        >>
    }>(),
    {
        size: 800,
        spokes: 12,
        rings: 4,
        config: () => ({ enableFlow: true }),
    }
)

const defaults = {
    nodeRadius: 3,
    nodeMinOpacity: 0.2,
    nodeMaxOpacity: 0.8,
    pulseDuration: 4,
    blurStdDev: 0.5,
    flowDotRadius: 2,
    flowDotDuration: 4,
    flowDotOpacity: 0.9,
    enableFlow: true,
}
const config = { ...defaults, ...props.config }

const size = ref(props.size!)
const width = size
const height = size
const centerX = size.value / 2
const centerY = size.value / 2
const radius = size.value / 2

const spokeAngles = Array.from({ length: props.spokes! }, (_, i) => (2 * Math.PI / props.spokes!) * i)
const ringRadii = Array.from({ length: props.rings! }, (_, i) => radius * ((i + 1) / props.rings!))

const nodes = spokeAngles.flatMap(angle =>
    ringRadii.map(r => ({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
    }))
)

const connections = []
for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < 0.08) {
            connections.push({
                x1: nodes[i].x,
                y1: nodes[i].y,
                x2: nodes[j].x,
                y2: nodes[j].y
            })
        }
    }
}

const dots = ref<any[]>([])

// Utility function for calculating distance between two points
function distance(a: any, b: any) {
    return Math.hypot(a.x - b.x, a.y - b.y)
}

// Linear interpolation for position
function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
}

// Get the position of a dot along a connection
function getPosition(conn: any, t: number) {
    return {
        x: lerp(conn.x1, conn.x2, t),
        y: lerp(conn.y1, conn.y2, t),
    }
}

// Get connections that share an endpoint with the given one
function getConnectedConnections(conn: any) {
    const nodesAtEnds = [`${conn.x1},${conn.y1}`, `${conn.x2},${conn.y2}`]
    return connections.filter(c =>
        [`${c.x1},${c.y1}`, `${c.x2},${c.y2}`]
            .some(pos => nodesAtEnds.includes(pos)) && c !== conn
    )
}

// Initialize dots on random connections
function initDots() {
    for (let i = 0; i < 10; i++) {
        const conn = connections[Math.floor(Math.random() * connections.length)]
        dots.value.push({
            conn,
            t: Math.random(), // progress along line
            dir: Math.random() < 0.5 ? 1 : -1,
            position: getPosition(conn, Math.random()),
        })
    }
}

// Animate dots smoothly
function animateDots() {
    for (const dot of dots.value) {
        dot.t += dot.dir * 0.005 // Speed of travel across the line
        if (dot.t >= 1 || dot.t <= 0) {
            // Snap to end
            dot.t = dot.t >= 1 ? 1 : 0

            // Find a connected path to continue
            const next = getConnectedConnections(dot.conn)
            if (next.length > 0) {
                const newConn = next[Math.floor(Math.random() * next.length)]
                const goingForward = `${newConn.x1},${newConn.y1}` === `${dot.position.x},${dot.position.y}`
                dot.conn = newConn
                dot.dir = goingForward ? 1 : -1
                dot.t = goingForward ? 0 : 1
            } else {
                dot.dir *= -1
            }
        }
        dot.position = getPosition(dot.conn, dot.t)
    }
    requestAnimationFrame(animateDots)
}

onMounted(() => {
    initDots()
    animateDots()
})
</script>

<style scoped>
/* Nothing extra needed */
</style>

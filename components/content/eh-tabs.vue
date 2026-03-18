<template>
    <div :class="ui.wrapper" v-bind="attrs">
        <UTabs :items="tabItems" :class="ui.tabs"
            :ui="{ list: { background: ui.list.background, marker: { background: ui.list.marker.background } } }">
            <template v-for="(child, index) in slotContent" :key="`tab-${index}`" #[`tab-${index}`]>
                <div :class="ui.content">
                    <component :is="child" />
                </div>
            </template>
        </UTabs>
    </div>
</template>

<script setup lang="ts">
import { tabs as config } from "@/ui.config";

interface TabItem {
    label?: string;
    icon?: string;
    disabled?: boolean;
}

const props = withDefaults(
    defineProps<{
        tabs?: TabItem[];
        ui?: Partial<typeof config>;
        description?: string;
        class?: any;
    }>(),
    {
        ui: () => ({}),
        tabs: () => [],
        class: () => undefined,
        description: "",
    }
);

const slots = useSlots();

const { ui, attrs } = useUI(
    "eh-tabs",
    toRef(props, "ui"),
    config,
    toRef(props, "class")
);

// Get slot content and count children
const slotContent = computed(() => {
    if (!slots.default) return [];
    const content = slots.default();
    return content.filter(vnode => vnode.type !== Comment && (typeof vnode.type !== 'symbol' || vnode.children));
});

// Transform tabs into UTabs format
const tabItems = computed(() => {
    const children = slotContent.value;

    // If tabs prop is provided with labels, use those
    if (props.tabs && props.tabs.length > 0) {
        return props.tabs.map((tab, index) => ({
            key: `tab-${index}`,
            label: tab.label || `Tab ${index + 1}`,
            icon: tab.icon,
            disabled: tab.disabled || false,
            slot: `tab-${index}`,
        }));
    }

    // Otherwise, create a tab for each child component
    return children.map((_, index) => ({
        key: `tab-${index}`,
        label: `Tab ${index + 1}`,
        slot: `tab-${index}`,
    }));
});
</script>
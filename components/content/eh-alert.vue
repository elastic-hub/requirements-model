<template>
    <div id="alert" :class="[ui.wrapper, alert]">
        <div :class="ui.base">
            <UIcon :class="['size-7', iconColor]" :name="icon" dynamic></UIcon>
        </div>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { alert as config } from "@/ui.config" // Import the config file

// Define props
const props = withDefaults(
    defineProps<{
        description?: string;
        typeAlert?: string;
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
        typeAlert: "info",
        description: "",
    }
);

const { ui } = useUI(
    "eh-alert",
    toRef(props, "ui"),
    config
);

const alert = computed(() => {
    switch (props.typeAlert) {
        case "success":
            return config.alert.success;
            break;
        case "warning":
            return config.alert.warning;
            break;
        case "danger":
            return config.alert.danger;
            break;
        default: // info
            return config.alert.info;
            break;
    }
});
const icon = computed(() => {
    switch (props.typeAlert) {
        case "success":
            return config.icon.success;
            break;
        case "warning":
            return config.icon.warning;
            break;
        case "danger":
            return config.icon.danger;
            break;
        default: // info
            return config.icon.info;
            break;
    }
});

const iconColor = computed(() => {
    switch (props.typeAlert) {
        case "success":
            return config.icon.color.success;
            break;
        case "warning":
            return config.icon.color.warning;
            break;
        case "danger":
            return config.icon.color.danger;
            break;
        default: // info
            return config.icon.color.info;
            break;
    }
});
//, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
</script>

<style>
#alert {
    font-family: "DM Sans"
}
</style>

<template>
    <div :class="ui.wrapper">
        <div v-if="isFacebook">
            <iframe
                :class="ui.facebook"
                :src="src"
                :width="width"
                :height="410"
                style="overflow: hidden"
                scrolling="no"
                frameborder="0"
                allowfullscreen="true"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
        </div>
        <div v-else-if="isLinkedin">
            <iframe
                :class="ui.linkedin"
                :src="src"
                :width="width"
                :height="650"
                frameborder="0"
                allowfullscreen="true"
                title="Embedded post"
            ></iframe>
        </div>
        <div v-else-if="isTwitter">
            <NuxtTweet
                :class="ui.twitter"
                :id="src"
                :showMedia="true"
            />
        </div>
        <div v-else>No supported social media found.</div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, toRef, computed } from 'vue'
import { social as config } from '@/ui.config' // Import the config file

// Define props
const props = withDefaults(
    defineProps<{
        description?: string;
        src?: string;
        width?: string;
        height?: string;
        ui?: Partial<typeof config>;
    }>(),
    {
        ui: () => ({}),
        description: "",
        src: "",
        width: "500",
        height: "",
    }
);

const { ui } = useUI(
    "eh-social",
    toRef(props, "ui"),
    config
);

// Computed properties to determine social media type
const isFacebook = computed(() => /facebook/i.test(props.src));
const isLinkedin = computed(() => /linkedin/i.test(props.src));
const isTwitter = computed(() => /^\d+$/.test(props.src));
</script>

<template>
    <div :class="ui.wrapper">
        <video v-if="!isYouTubeVideo" controls>
            <source :src="videoSource" :type="videoType" />
            Your browser does not support the video tag.
        </video>
        <iframe v-else :src="videoSource" frameborder="0" allowfullscreen width="100%" height="700"></iframe>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import { video as config } from '@/ui.config' // Importing the config file

const props = withDefaults(
    defineProps < {
        description?: string;
        src: String;
        ui?: Partial < typeof config >;
    } > (),
    {
        ui: () => ({}),
        src: "",
        description: "",
    });

const { ui } = useUI(
    "eh-video",
    toRef(props, "ui"),
    config
);

const isYouTubeVideo = computed(() => isYouTubeVideoCheck(props.src));
const videoType = ref("");
const videoSource = computed(() => {
    if (isYouTubeVideo.value) {
        videoType.value = "text/html";
        return `https://www.youtube.com/embed/${getYouTubeVideoId(props.src)}`;
    } else {
        videoType.value = "video/mp4"; // Update with appropriate MIME type
        return props.src;
    }
});

const isYouTubeVideoCheck = (url) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
};

const getYouTubeVideoId = (url) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
};
</script>

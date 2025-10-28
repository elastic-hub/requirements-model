<template>
    <div :class="ui.wrapper">
        <div :class="ui.question">
            {{ question || props.question }}
        </div>
        <div :class="ui.base">
            <UIcon :name="upvoteIcon" :class="[ui.icons, ui.upvoteIcon, upvoteClass]" @click="upvotesCount" />
            <div :class="ui.upvotes">{{ upvotes }}</div>
        </div>
        <div :class="ui.base">
            <UIcon :name="downvoteIcon" :class="[ui.icons, ui.downvoteIcon, downvoteClass]" @click="downvotesCount" />
            <div :class="ui.downvotes">{{ downvotes }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const config = {
    wrapper: "flex flex-row items-center justify-end space-x-4",
    question: "text-sm text-gray-300 italic font-thin",
    base: "flex flex-row items-center space-x-2 text-md hover:brightness-150",
    icons: "text-2xl cursor-pointer text-gray-400",
    upvoteIcon: "",
    upvotes: "text-gray-400",
    downvoteIcon: "",
    downvotes: "text-gray-400",
};

const likes = useAppConfig().likes
const question = likes.question
const upvoteIcon = likes.icon.upvote
const downvoteIcon = likes.icon.downvote

const upvotes = ref(0)
const downvotes = ref(0)

const upvoteClass = ref("")
const downvoteClass = ref("")

const upvotesCount = () => {
    if (upvoteClass.value === "text-green-500") {
        upvotes.value -= 1;
        upvoteClass.value = "";
        return;
    }
    if (downvoteClass.value === "text-red-500") {
        downvotes.value -= 1;
        downvoteClass.value = "";
    }
    upvotes.value += 1;
    upvoteClass.value = "text-green-500";
};

const downvotesCount = () => {
    if (downvoteClass.value === "text-red-500") {
        downvotes.value -= 1;
        downvoteClass.value = "";
        return;
    }
    if (upvoteClass.value === "text-green-500") {
        upvotes.value -= 1;
        upvoteClass.value = "";
    }
    downvotes.value += 1;
    downvoteClass.value = "text-red-500";
};

const props = withDefaults(
    defineProps<{
        ui?: Partial<typeof config>;
        upvotes?: number;
        downvotes?: number;
        question?: string;
    }>(),
    {
        ui: () => ({}),
        upvotes: 0,
        downvotes: 0,
        question: "Did you find this prompt to be useful?",
    }
);

const { ui } = useUI(
    "likes",
    toRef(props, "ui"),
    config,
);
</script>
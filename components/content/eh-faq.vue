<template>
  <p :class="ui.header.wrapper">
    <MDC :class="ui.header.title" :value="title" />
  </p>
  <div :class="ui.wrapper">
    <div v-for="(faq, index) in faqs" :key="index" :class="ui.inner">
      <p :class="ui.question" @click="toggleAnswer(index)">
        <MDC :class="['not-prose', ui.q]" :value="'Q: ' + faq.q" />
        <UIcon name="i-icons8-chevron-right-round"
          :class="[ui.icon, visibleAnswers[index] ? 'rotate-90' : 'rotate-0', 'transition-transform duration-300']">
        </UIcon>
      </p>
      <p :class="[ui.answer, 'transition-max-height duration-500 ease-in-out overflow-hidden']"
        :style="{ maxHeight: visibleAnswers[index] ? answerHeights[index] : '0' }" ref="answerRefs">
        <MDC :class="ui.a" :value="faq.a" />
      </p>
      <div v-if="index < faqs.length - 1" :class="ui.divider"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, toRef, onMounted, nextTick } from 'vue';
import { faq as config } from '@/ui.config'; // Importing the config file

interface Faq {
  q: string;
  a: string;
}

// Define the props to accept a dynamic number of Q&A pairs
const props = withDefaults(
  defineProps<{
    description?: string;
    qas: Faq[];
    title?: string;
    ui?: Partial<typeof config>;
  }>(),
  {
    ui: () => ({}),
    description: "",
    title: "FAQs",
  }
);

const { ui } = useUI(
  "eh-faq",
  toRef(props, "ui"),
  config
);

// Convert the incoming Q&A props to a structured format
const faqs = computed(() => {
  return props.qas.map((item) => ({
    q: item.q,
    a: item.a,
  }));
});

const icon = computed(() => {
  return config.icon;
});

// State to track which answers are visible
const visibleAnswers = ref<boolean[]>(faqs.value.map(() => false));
const answerHeights = ref<string[]>(faqs.value.map(() => '0'));
const answerRefs = ref<HTMLParagraphElement[]>([]);

// Function to toggle visibility of answers
const toggleAnswer = (index: number) => {
  visibleAnswers.value[index] = !visibleAnswers.value[index];
  nextTick(() => {
    const element = answerRefs.value[index];
    answerHeights.value[index] = visibleAnswers.value[index] ? `${element.scrollHeight}px` : '0';
  });
};

onMounted(() => {
  faqs.value.forEach((_, index) => {
    const element = answerRefs.value[index];
    answerHeights.value[index] = `${element.scrollHeight}px`;
  });
});
</script>

<style>
/* Transition for max-height */
.transition-max-height {
  transition: max-height 0.5s ease-in-out;
}
</style>

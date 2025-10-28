<template>
    <div class="border rounded-xl p-5 mt-5 mb-5 bg-blue-950/20 dark:bg-blue-950/20">
        <UTabs :items="tabs" v-model="selectedTab" class="w-full min-w-0 space-y-8"
            :ui="{ base: 'space-y-10', list: { tab: { active: 'bg-green-600' } } }">
            <template #item="{ item }">
                <div class="">
                    <div class="space-y-8">
                        <div class="w-full max-w-7xl mx-auto">
                            <div
                                class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <div
                                    class="text-xs font-medium text-center text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                                    Current Context
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-center">
                                    <div class="flex flex-col">
                                        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Meeting
                                            ID</span>
                                        <span class="text-gray-700 dark:text-gray-300 truncate"
                                            :title="meetingID || 'Not selected'">
                                            {{ meetingID || 'Not selected' }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Topic
                                            ID</span>
                                        <span class="text-gray-700 dark:text-gray-300 truncate"
                                            :title="topicID || 'Not selected'">
                                            {{ topicID || 'Not selected' }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col sm:col-span-1">
                                        <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Topic
                                            Title</span>
                                        <span class="text-gray-700 dark:text-gray-300 truncate"
                                            :title="topicTitle || 'Not selected'">
                                            {{ topicTitle || 'Not selected' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-row items-center justify-between">
                            <div class="flex items-center">
                                <UIcon name="i-material-symbols:left-click-rounded"
                                    class="text-2xl dark:text-gray-300 flex-shrink-0" />
                                <div class="text-lg font-medium">Prompt Selection</div>
                            </div>
                            <UTooltip
                                :text="promptTitle ? 'Configuration Options' : 'Select Prompt Title first to access Configuration'">
                                <UButton color="gray" @click="isOpen = true" variant="ghost"
                                    class="font-bold text-2xl flex-shrink-0" :ui="{ rounded: 'rounded-lg' }"
                                    :disabled="!promptTitle">
                                    <template #leading>
                                        <UIcon name="i-solar:tuning-4-outline" />
                                    </template>
                                </UButton>
                            </UTooltip>
                        </div>
                        <URadioGroup v-if="titles.length <= 5" v-model="promptTitle" :options="titles"
                            :ui="{ fieldset: 'space-y-6', }" :uiRadio="{
                                ring: 'ring-2 ring-gray-300 dark:ring-gray-500 checked:ring-green-500 dark:checked:ring-green-400 focus-visible:ring-green-500 dark:focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900',
                                base: 'mt-3 flex-shrink-0 hover:cursor-pointer',
                            }" color="green">
                            <template #label="{ option }">
                                <div :title="`Prompt ID: ${option.value}`" class="hover:cursor-pointer">
                                    <div class="dark:text-gray-400 mb-1 text-lg font-bold"
                                        :class="{ 'dark:!text-white': promptTitle === option.value }">
                                        {{ option.label }}
                                    </div>
                                    <div class="dark:text-gray-500 italic"
                                        :class="{ 'dark:!text-gray-200': promptTitle === option.value }">
                                        {{ option.description }}
                                    </div>
                                </div>
                            </template>
                        </URadioGroup>
                        <USelect v-if="titles.length > 5" v-model="promptTitle" :options="titles" :required="true"
                            placeholder="Select a Prompt Title" />
                        <EhAlert v-if="titles.length === 0" typeAlert="warning" :ui="{ wrapper: 'pr-10' }">
                            <span class="text-sm">No prompts available for this type</span>
                        </EhAlert>
                    </div>

                </div>
                <!-- <div v-if="promptTitle" class="mt-10">
                    <div class="font-bold dark:text-gray-400">Description</div>
                    <div class="dark:text-gray-400 text-lg w-fit pt-1 pb-1 pl-3 pr-3">{{ selectedPromptDescription }}
                    </div>
                </div>
                <div v-if="promptTitle" class="dark:text-gray-400 mt-10">
                    <div class="font-bold -mb-3">Notes</div>
                    <div class="w-fit pb-1 mt-2 mb-2">
                        <ul v-if="selectedPromptNotes" class="dark:text-gray-400 text-lg">
                            <li v-for="note in selectedPromptNotes" :key="note">{{ note }}</li>
                        </ul>
                    </div>
                </div> -->
                <hr class="border-gray-200 dark:border-gray-700" />
                <div class="border flex justify-between rounded-lg p-4 relative">
                    <!-- <MDC :value="aiResponse" /> -->
                    <div v-if="aiResponse" class="mt-6 w-full max-w-full overflow-hidden">
                        <pre class="whitespace-pre-wrap break-words overflow-x-auto bg-inherit">{{ aiResponse }}</pre>
                    </div>
                    <div v-if="!aiResponse && !isAnalysisRunning" class="text-gray-500 italic">Select a Prompt to run...
                    </div>
                    <div v-if="isAnalysisRunning" class="animate-pulse italic text-gray-500">Fetching AI response...
                    </div>
                    <div v-if="aiResponse" class="absolute top-3 left-9 text-sm text-gray-500">{{ persistentPromptTitle
                        ? 'Running Analysis for: ' + persistentPromptTitle : 'No prompt selected' }}
                    </div>
                    <UButton v-if="aiResponse" :icon="isCopied ? 'i-si:check-line' : 'i-si:copy-line'" size="xs"
                        color="primary" variant="ghost" :label="isCopied ? 'Copied!' : 'Copy as Markdown'"
                        :trailing="false" class="absolute top-2 right-1" @click="copyToClipboard" />
                </div>

                <UModal v-model="isOpen" prevent-close>
                    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                        <template #header>
                            <div class="flex flex-row items-center justify-between">
                                <div class="h-8 dark:text-gray-300 font-semibold text-lg">Configuration Options
                                </div>
                                <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                                    @click="isOpen = false" />
                            </div>
                        </template>

                        <div class="p-4 -mt-1 space-y-4">
                            <div v-if="!hasInputs" class="text-gray-500 dark:text-gray-400 text-center py-4">
                                <EhAlert typeAlert="danger" :ui="{ wrapper: 'pr-10' }">
                                    <span class="text-sm">No inputs in config file</span>
                                </EhAlert>
                            </div>
                            <div v-else class="space-y-8">
                                <div v-if="showMeetingID" class="flex-1 mb-4">
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Meeting
                                        ID</label>
                                    <USelect v-model="meetingID" :options="meetingIDs" :title="meetingID"
                                        placeholder="Select meeting_ID" />
                                </div>
                                <div v-if="showTopicID || showTopicTitle"
                                    class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 items-center justify-between gap-4">
                                    <div v-if="showTopicID" class="sm:flex-1 w-full">
                                        <label
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Topic
                                            ID</label>
                                        <USelect v-model="topicID" :options="topicIDs" :title="topicID"
                                            placeholder="Select topic_ID" />
                                    </div>
                                    <div v-if="showTopicTitle" class="sm:flex-1">
                                        <label :title="topicTitle"
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Topic
                                            Title</label>
                                        <USelect v-model="topicTitle" :options="topicTitles" :title="topicTitle"
                                            placeholder="Select topic_title" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <template #footer>
                            <div class="flex flex-row items-center justify-end">
                                <UButton color="green" variant="solid" label="OK" @click="isOpen = false" />
                            </div>
                        </template>
                    </UCard>
                </UModal>

                <!-- <UAccordion v-if="promptTitle" :items="configurationIDs"
                    :ui="{ item: { base: 'border border-gray-200 dark:border-gray-700 rounded-xl' } }">
                    <template #default="{ item, index, open }">
                        <UButton color="gray" variant="ghost" class="font-bold text-2xl"
                            :ui="{ rounded: 'rounded-lg' }">
                            <template #leading>
                                <UIcon name="i-solar:tuning-4-outline" class="w-5 h-5 -ml-3" />
                            </template>
                            {{ item.label }}
                            <template #trailing>
                                <UIcon name="i-heroicons-chevron-right-20-solid"
                                    class="w-5 h-5 ms-auto transform transition-transform duration-200"
                                    :class="[open && 'rotate-90']" />
                            </template>
                        </UButton>
                    </template>
                    <template #item="{ item }">
                        <div class="p-4 -mt-1 space-y-4">
                            <div v-if="!hasInputs" class="text-gray-500 dark:text-gray-400 text-center py-4">
                                <EhAlert typeAlert="danger" :ui="{ wrapper: 'pr-10' }">
                                    <span class="text-sm">No inputs in config file</span>
                                </EhAlert>
                            </div>
                            <div v-else class="space-y-8">
                                <div v-if="showMeetingID" class="flex-1 mb-4">
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Meeting
                                        ID</label>
                                    <USelect v-model="meetingID" :options="meetingIDs"
                                        placeholder="Select meeting_ID" />
                                </div>
                                <div v-if="showTopicID || showTopicTitle"
                                    class="flex flex-col sm:flex-row space-y-6 sm:space-y-0 items-center justify-between gap-4">
                                    <div v-if="showTopicID" class="sm:flex-1 w-full">
                                        <label
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Topic
                                            ID</label>
                                        <USelect v-model="topicID" :options="topicIDs" placeholder="Select topic_ID" />
                                    </div>
                                    <div v-if="showTopicTitle" class="sm:flex-1">
                                        <label
                                            class="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-2">Topic
                                            Title</label>
                                        <USelect v-model="topicTitle" :options="topicTitles"
                                            placeholder="Select topic_title" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </UAccordion> -->

                <div class="flex flex-col space-y-7 sm:space-y-0 sm:flex-row items-center mt-5"
                    :class="[showExportOptions === false ? 'justify-end' : 'justify-between']">
                    <div v-if="showExportOptions === true">
                        <URadioGroup v-model="selectedFormat" :options="export_options" :color="color"
                            :ui="{ fieldset: 'flex flex-row gap-4', legend: 'mx-auto sm:mx-0' }"
                            :uiRadio="{ background: 'dark:bg-gray-700' }">
                            <template #legend v-if="props.legend">
                                <div class="mb-5">{{ props.legend }}</div>
                            </template>
                            <template #label="{ option }">
                                <div class="items-center gap-2 inline-flex -mt-1">
                                    <UTooltip :text="option.iconTooltip">
                                        <UIcon :name="option.icon" class="text-3xl" />
                                        {{ option.label }}
                                    </UTooltip>
                                </div>
                            </template>
                        </URadioGroup>
                    </div>
                    <div>
                        <UTooltip :text="!promptTitle
                            ? 'Select Prompt Title first to run analysis'
                            : (!meetingID || !topicID || !topicTitle)
                                ? 'Missing input context. Check Meeting ID, Topic ID and Topic Title values.'
                                : isAnalysisCompleted
                                    ? 'Analysis already completed. Select another prompt'
                                    : 'AI Power'">
                            <UButton @click="runAnalysis" variant="solid"
                                :color="isAnalysisCompleted ? 'purple' : 'green'" size="sm"
                                :icon="isAnalysisCompleted ? 'lets-icons:done-duotone' : 'prime:microchip-ai'"
                                :ui="{ padding: { sm: 'p-2' }, font: '!text-white' }" class="w-fit h-fit"
                                :loading="isAnalysisRunning"
                                :disabled="!promptTitle || isAnalysisCompleted || !meetingID || !topicID || !topicTitle"
                                :label="isAnalysisCompleted ? 'COMPLETED' : 'RUN ANALYSIS'" />
                        </UTooltip>
                    </div>
                </div>
            </template>
        </UTabs>

        <UModal v-model="isModalOpen">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            No Prompts Defined
                        </h3>
                        <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                            @click="isModalOpen = false" />
                    </div>
                </template>

                <div class="p-4">
                    <p class="text-sm text-gray-500 dark:text-gray-400" v-html="noPromptsMessage">
                    </p>
                </div>

                <template #footer>
                    <div class="flex justify-end">
                        <UButton color="primary" @click="isModalOpen = false">
                            OK
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script lang="ts" setup>
import { useQueryCollection } from '~/composables/nuxt/nav/useQueryCollection'
import { useGitHubGetContent } from '@/composables/github/content'
const { $filterTopic } = useNuxtApp();

interface TypeConfig {
    label: string;
    icon?: string;
    promptIDs?: string[];
}

interface TypesConfig {
    [key: string]: TypeConfig;
}

const props = withDefaults(
    defineProps<{
        //ui?: Partial<typeof config>;
        description?: string;
        showExportOptions?: boolean;
        legend?: string;
        types?: TypesConfig;
        dataUrl?: string;
    }>(),
    {
        //ui: () => ({}),
        description: "",
        showExportOptions: false,
        legend: "Choose an option to export",
        dataUrl: "",
        types: () => ({
            type1: {
                label: "GENERAL",
                icon: "i-material-symbols:settings-outline",
                promptIDs: []
            },
            type2: {
                label: "ADVANCED",
                icon: "i-entypo:tools",
                promptIDs: []
            },
            type3: {
                label: "PRO",
                icon: "i-streamline-plump:diamond-2-remix",
                promptIDs: []
            }
        })
    }
);

const isOpen = ref(false)
defineShortcuts({
    escape: {
        usingInput: true,
        whenever: [isOpen],
        handler: () => { isOpen.value = false }
    }
})

// Create tabs dynamically from types prop
const tabs = computed(() => {
    return Object.entries(props.types).map(([key, config]) => ({
        label: config.label,
        key: key,
        icon: config.icon || 'i-material-symbols:settings-outline',
        tabTooltip: `${config.label} Prompts`
    }));
});

const selectedTab = ref(0)

// Store the selected prompt title persistently across tab switches
const persistentPromptTitle = ref<string>('')
// Store the selected prompt ID persistently across tab switches (for AI response tracking)
const persistentPromptID = ref<string>('')

const { data: prompt_library } = await useAsyncData(() => {
    return useQueryCollection('prompts').where('id', '=', 'prompts/.promptlib/prompt_library.yaml').first()
})

const prompts_config = computed(() => {
    return prompt_library.value?.prompts.map((prompt: any) => ({
        promptID: prompt.id,
        prompt_title: prompt.title,
        description: prompt.description,
        notes: prompt.notes,
        output_format: prompt.output_format,
        inputs: prompt.parameters,
    })) || [];
});

const promptIDs = computed(() => {
    return prompts_config.value.map((prompt: any) => prompt.id);
});

const prompt_title = computed(() => {
    return prompts_config.value.map((prompt: any) => prompt.prompt_title);
});

const descriptions = computed(() => {
    return prompts_config.value.map((prompt: any) => prompt.description);
});

const notes = computed(() => {
    return prompts_config.value.map((prompt: any) => prompt.notes);
});

const output_format = computed(() => {
    return prompts_config.value?.map((prompt: any) => prompt.output_format);
});

// Extract the prompts array from the data
const prompts = computed(() => {
    return prompt_library.value?.meta?.body?.prompts || [];
});

// Filter titles based on current selected tab
const titles = computed(() => {
    const tabKeys = Object.keys(props.types);
    const currentTypeKey = tabKeys[selectedTab.value];
    const currentType = props.types[currentTypeKey];

    if (!currentType || !currentType.promptIDs || currentType.promptIDs.length === 0) {
        // If no specific prompts defined, return empty array to trigger the modal
        return [];
    }

    // Filter prompts to only show those specified in the current type
    const options = prompts_config.value
        .filter((prompt: { promptID: string; prompt_title: string, description: string }) => currentType.promptIDs!.includes(prompt.promptID))
        .map((prompt: { promptID: string; prompt_title: string, description: string }) => ({
            label: prompt.prompt_title,
            value: prompt.promptID,
            description: prompt.description,
        })) || [];

    return options;
})

const promptTitle = ref(undefined)

// Modal for no prompts defined
const route = useRoute()
const isModalOpen = ref(false)

// Check if no prompts are defined and show modal
const noPromptsMessage = computed(() => {
    if (promptIDs.value.length === 0) {
        return 'There are no prompts defined in the prompt configuration file.<br><em>Please define prompts in the configuration file.</em>';
    } else {
        const tabKeys = Object.keys(props.types);
        const currentTypeKey = tabKeys[selectedTab.value];
        return `<em>promptIDs</em> array prop empty.<br>Define prompts in <strong>${route.path}</strong> EhGenAiPrompt component under <br><code>${currentTypeKey}.promptIDs</code>`;
    }
})

// Watch titles to show modal when no prompts are available
watch(titles, (newTitles) => {
    if (newTitles.length === 0) {
        isModalOpen.value = true
    }
}, { immediate: true })

// Reset selected title when tab changes
watch(selectedTab, () => {
    promptTitle.value = undefined;
});

// Clear AI response when a different prompt is selected (not when reset to undefined)
watch(promptTitle, (newPromptTitle, oldPromptTitle) => {
    // Only clear if we're switching from one prompt to another (both defined and different)
    // Compare against the persistent prompt ID (the one used for the current AI response)
    if (newPromptTitle && persistentPromptID.value && newPromptTitle !== persistentPromptID.value) {
        aiResponse.value = '';
    }

    // Update persistent prompt title when a prompt is selected (but don't update persistentPromptID here)
    if (newPromptTitle) {
        const selectedPrompt = prompts_config.value.find((p: any) => p.promptID === newPromptTitle);
        if (selectedPrompt) {
            persistentPromptTitle.value = selectedPrompt.prompt_title;
        }
    }
});

const selectedPromptDescription = computed(() => {
    if (!promptTitle.value) {
        return 'Select Title first';
    }

    const selectedIndex = prompts_config.value.findIndex(
        (prompt: { promptID: string }) => prompt.promptID === promptTitle.value
    );

    return selectedIndex !== -1 ? descriptions.value[selectedIndex] || ['No description available'] : '';
});

const selectedPromptNotes = computed(() => {
    if (!promptTitle.value) {
        return [];
    }

    const selectedIndex = prompts_config.value.findIndex(
        (prompt: { promptID: string }) => prompt.promptID === promptTitle.value
    );

    return selectedIndex !== -1 ? notes.value[selectedIndex] || ['No notes available'] : '';
});

const selectedPromptInputs = computed(() => {
    if (!promptTitle.value) {
        return [];
    }

    const selectedPrompt = prompts_config.value.find(
        (prompt: { promptID: string }) => prompt.promptID === promptTitle.value
    );

    // Extract just the field names (everything before the colon)
    const rawInputs = selectedPrompt?.inputs || [];

    // Check if rawInputs is actually an array
    if (!Array.isArray(rawInputs)) {
        return [];
    }

    const parsedInputs = rawInputs.map((input: any) => {
        // Handle different input types
        if (typeof input === 'string') {
            // Split by colon and take the first part, then trim whitespace
            return input.split(':')[0].trim();
        } else if (typeof input === 'object' && input !== null) {
            // If it's an object, try to get the key or a property
            if (Object.keys(input).length > 0) {
                return Object.keys(input)[0];
            }
        }

        // Fallback: convert to string and try to split
        const inputStr = String(input);
        return inputStr.split(':')[0].trim();
    });

    return parsedInputs;
});

// ALTERNATIVE IMPLEMENTATION 1: Simple string array
// Use this if inputs are just plain strings like: ["meeting_id", "topic_id", "topic_title"]
/*
const selectedPromptInputs = computed(() => {
    if (!promptTitle.value) {
        return [];
    }

    const selectedPrompt = prompts_config.value.find(
        (prompt: { promptID: string }) => prompt.promptID === promptTitle.value
    );
    
    // Simply return the inputs array as-is since they're already clean strings
    const rawInputs = selectedPrompt?.inputs || [];
    
    // Check if rawInputs is actually an array
    if (!Array.isArray(rawInputs)) {
        return [];
    }
    
    // Filter out any non-string values and return clean array
    return rawInputs.filter((input: any) => typeof input === 'string');
});
*/

// ALTERNATIVE IMPLEMENTATION 2: Boolean-based inputs
// Use this if inputs are boolean flags like: { meeting_id: true, topic_id: false, topic_title: true }
/*
const selectedPromptInputs = computed(() => {
    if (!promptTitle.value) {
        return [];
    }

    const selectedPrompt = prompts_config.value.find(
        (prompt: { promptID: string }) => prompt.promptID === promptTitle.value
    );
    
    const rawInputs = selectedPrompt?.inputs || {};
    
    // Check if rawInputs is an object with boolean values
    if (typeof rawInputs !== 'object' || rawInputs === null || Array.isArray(rawInputs)) {
        return [];
    }
    
    // Extract only the keys where the value is true
    return Object.keys(rawInputs).filter(key => rawInputs[key] === true);
});
*/

const showMeetingID = computed(() => {
    return selectedPromptInputs.value.includes('meeting_id');
});
const showTopicID = computed(() => {
    return selectedPromptInputs.value.includes('topic_id');
});
const showTopicTitle = computed(() => {
    // Show topic_title if it's in inputs OR if topic_id is in inputs (per requirement)
    return selectedPromptInputs.value.includes('topic_title') || selectedPromptInputs.value.includes('topic_id');
});

const hasInputs = computed(() => {
    return selectedPromptInputs.value.length > 0;
});



const gen_ai = useAppConfig().gen_ai;
const position = gen_ai.selected;
const radioGroup = gen_ai.radioGroup

const export_options = radioGroup.map((item) => ({
    label: item.label,
    value: item.value,
    iconTooltip: item.iconTooltip,
    icon: item.icon,
}));

// Check if any radioGroup item matches the output format from the library
const matchingFormat = computed(() => {
    if (!output_format.value || output_format.value.length === 0) {
        return null;
    }

    // Get the output format for the selected prompt
    const selectedPrompt = prompts.value.find(
        (prompt: { promptID: string; output_format?: string }) => prompt.promptID === promptTitle.value
    );

    if (!selectedPrompt?.output_format) {
        return null;
    }

    // Check if any radioGroup item matches the output format
    // Handle different formats like "structured_markdown" vs "markdown"
    const normalizeFormat = (format: string) => format.toLowerCase().replace(/[_-]/g, '');
    const normalizedOutputFormat = normalizeFormat(selectedPrompt.output_format);

    return radioGroup.find(item => {
        const normalizedItemValue = normalizeFormat(item.value);
        const normalizedItemLabel = normalizeFormat(item.label);
        return normalizedItemValue === normalizedOutputFormat ||
            normalizedItemLabel === normalizedOutputFormat;
    });
});

const selectedOutputFormat = computed(() => {
    const matching = matchingFormat.value;
    return matching ? matching.value : export_options[position].value;
});

const selectedFormat = ref(export_options[position].value)
const color = ref('primary' as const)

// Watch for changes in selectedOutputFormat and update selectedFormat
watch(selectedOutputFormat, (newValue) => {
    selectedFormat.value = newValue;
}, { immediate: true })

const meetingID = ref<string>('')
const meetingIDs = ref<Array<{ label: string; value: string }>>([])
const topicID = ref<string>('')
const topicIDs = ref<Array<{ label: string; value: string }>>([])
const topicTitle = ref<string>('')
const topicTitles = ref<Array<{ label: string; value: string }>>([])

// Store the topic mapping for syncing selections
const topicMapping = ref<Map<string, string>>(new Map()) // ID -> Title mapping

// Watch for topic ID changes and sync with topic title
watch(topicID, (newTopicID) => {
    if (newTopicID && topicMapping.value.has(newTopicID)) {
        const correspondingTitle = topicMapping.value.get(newTopicID)
        if (correspondingTitle && topicTitle.value !== correspondingTitle) {
            topicTitle.value = correspondingTitle
        }
    }
})

// Watch for topic title changes and sync with topic ID
watch(topicTitle, (newTopicTitle) => {
    if (newTopicTitle) {
        // Find the corresponding ID for this title
        const correspondingID = Array.from(topicMapping.value.entries())
            .find(([id, title]) => title === newTopicTitle)?.[0]
        if (correspondingID && topicID.value !== correspondingID) {
            topicID.value = correspondingID
        }
    }
})

const dataUrl = ref('');
onMounted(() => {
    dataUrl.value = sessionStorage.getItem('meetingRegister') || '';
});

// const dataUrl = ref('https://github.com/elastic-hub/genai-meeting-minutes/blob/main/local_tasks/topic_segmentation/meetingRegister.json')

onMounted(async () => {
    let data
    const keywords = useAppConfig().dynamic_table.fetch.dataUrl.includes;
    if (Array.isArray(keywords) && keywords.some(keyword => String(dataUrl?.value).includes(keyword))) {

        const url = new URL(dataUrl.value.toString());
        const pathParts = url.pathname.split('/');
        const owner = pathParts[1];
        const repo = pathParts[2];
        // Extract branch - it's typically at index 4 in GitHub URLs like /owner/repo/blob/branch/path
        const branch = pathParts[4] === 'blob' ? pathParts[5] : pathParts[4];
        // Path starts after the branch (index 6 for blob URLs)
        const path = pathParts[4] === 'blob' ? pathParts.slice(6).join('/') : pathParts.slice(5).join('/');

        data = await useGitHubGetContent(owner, repo, path, branch);

    } else {
        data = await useAsyncData(`${route.path}/${props.dataUrl}`, () => {
            return $fetch(props.dataUrl)
        })
        //data = JSON.parse(data)
        //data = await $fetch(props.dataUrl);
    }
    if (data) {
        const filtered = $filterTopic(data)

        // Populate options arrays from filtered data
        if (filtered && Array.isArray(filtered)) {
            // Extract unique meeting IDs
            const uniqueMeetingIDs = [...new Set(filtered.map(item => item.meetingID).filter((id): id is string => Boolean(id)))]
            meetingIDs.value = uniqueMeetingIDs.map(id => ({ label: id, value: id }))

            // Create a map of topic ID to topic title for easy lookup
            const topicMap = new Map()
            filtered.forEach(item => {
                if (item.id && item.title) {
                    topicMap.set(item.id, item.title)
                }
            })

            // Store the mapping for reactive syncing
            topicMapping.value = topicMap

            // Extract unique topic IDs (just the IDs, no titles)
            const uniqueTopicIDs = [...new Set(filtered.map(item => item.id).filter((id): id is string => Boolean(id)))]
            topicIDs.value = uniqueTopicIDs.map(id => ({
                label: id,
                value: id
            }))

            // Extract unique topic titles with their corresponding IDs
            const uniqueTopicTitles = [...new Set(filtered.map(item => item.title).filter((title): title is string => Boolean(title)))]
            topicTitles.value = uniqueTopicTitles.map(title => {
                // Find the corresponding ID for this title
                const correspondingItem = filtered.find(item => item.title === title)
                const topicId = correspondingItem?.id || 'Unknown ID'
                return {
                    label: `${title} (${topicId})`,
                    value: title
                }
            })
        }

        // Prepopulate from query params if present
        if (route.query.meeting_id) {
            const meetingIDValue = route.query.meeting_id as string
            meetingID.value = meetingIDValue
        } else if (route.query.topic_id) {
            const topicIDValue = route.query.topic_id as string
            topicID.value = topicIDValue
        } else if (route.query.combined_id) {
            const combinedIDValue = route.query.combined_id as string
            // Decompose the combined ID: "topic.id meeting.id"
            const parts = combinedIDValue.split(' ')
            if (parts.length >= 2) {
                const topicIDPart = parts[0]
                const meetingIDPart = parts.slice(1).join(' ') // In case meeting ID has spaces

                // Set the topic ID
                topicID.value = topicIDPart

                // Set the corresponding topic title using the mapping
                if (topicMapping.value.has(topicIDPart)) {
                    const correspondingTitle = topicMapping.value.get(topicIDPart)
                    if (correspondingTitle) {
                        topicTitle.value = correspondingTitle
                    }
                }

                // Set the meeting ID
                meetingID.value = meetingIDPart
            }
        }
    }
})

const configurationIDs = ref([
    {
        label: 'Configuration Options',
        icon: 'i-heroicons-cog-6-tooth',
        defaultOpen: false
    }
])

const isAnalysisRunning = ref(false)
const isAnalysisCompleted = computed(() => aiResponse.value.length > 0)

const user = useSupabaseUser();

const name = computed(
    () => user.value?.user_metadata.full_name
);
const username = computed(
    () => user.value?.user_metadata.user_name
);
const email = computed(
    () => user.value?.user_metadata.email
);

const aiResponse = ref<string>(``)

const runAnalysis = async () => {
    if (!promptTitle.value) return

    isAnalysisRunning.value = true

    try {
        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            controller.abort()
        }, 60000) // 60 seconds timeout

        // Make the API call to process the request
        const response = await $fetch("/api/process", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: {
                data: {
                    meeting_id: meetingID.value || null,
                    topic_id: topicID.value || null,
                    prompt_id: promptTitle.value || null,
                },
                meta: {
                    requested_by: email.value || undefined,
                    timestamp: new Date().toISOString()
                }
            },
            signal: controller.signal
        }) as any

        // Clear timeout if request succeeds
        clearTimeout(timeoutId)

        aiResponse.value = response?.open_ai_response || 'Something went wrong. Please, try again.'

        // Set the persistent prompt ID after successful API call to track which prompt generated this response
        persistentPromptID.value = promptTitle.value;

        return aiResponse.value

        //exportAsJSON()

        // if (selectedFormat.value === 'JSON') {
        //     // Handle JSON export logic here if needed
        // } else {
        //     setTimeout(() => {
        //         window.open('/temp-display', '_blank')
        //     }, 2000)
        // }

    } catch (error) {
        console.error('Error running analysis:', error)

        // Handle timeout specifically
        if (error instanceof Error && error.name === 'AbortError') {
            aiResponse.value = 'Request timed out after 60 seconds. Please try again.'
        } else {
            aiResponse.value = 'Something went wrong. Please, try again.'
        }
    } finally {
        // Always stop the loading state regardless of success or failure
        isAnalysisRunning.value = false
    }
};
const isCopied = ref(false)
const copyToClipboard = async () => {
    await navigator.clipboard.writeText(aiResponse.value)
    isCopied.value = true
}

// const exportAsJSON = () => {
//     const exportData = {
//         data: {
//             meeting_id: meetingID.value || null,
//             topic_id: topicID.value || null,
//             prompt_id: promptTitle.value || null,
//         },
//         meta: {
//             requested_by: {
//                 user: name.value || undefined,
//                 username: username.value || undefined,
//                 email: email.value || undefined
//             },
//             timestamp: new Date().toISOString()
//         }
//     }

//     // Create and download JSON file
//     const jsonString = JSON.stringify(exportData, null, 2)
//     const blob = new Blob([jsonString], { type: 'application/json' })
//     const url = URL.createObjectURL(blob)

//     const filename = `prompt-inputs-${promptTitle.value}-${new Date().toISOString().split('T')[0]}.json`
//     const link = document.createElement('a')
//     link.href = url
//     link.download = filename
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//     URL.revokeObjectURL(url)
// };
</script>
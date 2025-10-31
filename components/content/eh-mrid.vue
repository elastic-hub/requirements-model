<template>
    <ClientOnly>
        <div :class="ui.wrapper">
            <UDropdown :items="version" :popper="{ placement: 'bottom-start' }">
                <UButton color="green" :label="'Version ' + selectedLabel"
                    trailing-icon="i-heroicons-chevron-down-20-solid" />
            </UDropdown>
            <div :class="ui.table.wrapper">
                <div :class="ui.table.title">Entity Definition</div>
                <div :class="[ui.table.content.base, ui.table.content.padding, ui.table.content.text]">
                    <div v-for="mridEntity in mridEntities" :key="mridEntity.value">
                        <div>{{ mridEntity.columnName + ` (Total: ${getAllMridIds().length})`}}</div>
                        <UDropdown :items="mridEntity.entityType" :popper="{ placement: 'bottom-start' }"
                            :ui="dropdownScrollableConfig">
                            <UButton color="white" :label="mridEntity.label"
                                trailing-icon="i-heroicons-chevron-down-20-solid" />
                        </UDropdown>
                    </div>
                    <div v-for="entity in entities" :key="entity.value">
                        <div class="truncate whitespace-nowrap">{{ entity.columnName }}</div>
                        <UBadge :label="entity.badgeLabel" color="white" size="lg" />
                    </div>
                </div>
            </div>

            <div class="w-full pl-4 pr-4 border rounded-xl p-4 space-y-8">
                <div :class="ui.table.title">Validation Criteria</div>
                <div class="w-full flex flex-row items-start p-4 border rounded-xl">
                    <div class="w-fit p-4">
                        <div :class="ui.table.content.title">Must Satisfy</div>
                        <div :class="'text-left dark:text-gray-400'">
                            {{ currentMridData?.mustSatisfy || 'No Data' }}
                        </div>
                    </div>
                    <div class="w-1/4 p-4">
                        <div :class="ui.table.content.title">Keyword</div>
                        <div :class="ui.table.content.text">{{ currentMridData?.keyword || 'No Data' }}</div>
                    </div>
                    <div class="w-fit md:w-1/2 p-4">
                        <div>
                            <div :class="ui.table.content.title">Dependencies</div>
                            <div :class="ui.table.content.text"
                                v-html="(currentMridData?.dependencies || 'No Data').replace(/,\s*/g, ',<br>')"></div>
                        </div>
                    </div>
                </div>

                <div v-for="req_cond in requirement_condition" :key="req_cond.value">
                    <div class="text-xl absolute font-bold font-mono p-4">{{ req_cond.columnName }}</div>
                    <div class="relative flex flex-row items-start pt-20 p-8 space-x-10 border rounded-xl">
                        <div class="w-1/6 flex-shrink-0">
                            <div :class="ui.table.content.title">{{ req_cond.checkFunction }}</div>
                            <div :class="ui.table.content.text">
                                {{ req_cond.value === 'requirement' ? (req_cond.requirements[0] as any).checkFunction :
                                (req_cond.requirements[0] as any)?.checkFunction }}
                            </div>
                        </div>
                        <div class="w-1/3 flex-shrink-0">
                            <div :class="ui.table.content.title">{{ req_cond.description }}</div>
                            <div
                                :class="[req_cond.requirements[1]?.description !== 'No description available' ? 'text-left dark:text-gray-400' : ui.table.content.text ]">
                                {{ req_cond.value === 'requirement' ? (req_cond.requirements[1] as any).description :
                                (req_cond.requirements[1] as any)?.description }}
                            </div>
                        </div>
                        <div class="flex-1">
                            <div :class="ui.table.content.title">{{ req_cond.arguments }}</div>
                            <div class="text-center dark:text-gray-400 whitespace-pre-line list-outside">
                                {{ req_cond.value === 'requirement' ? (req_cond.requirements[2] as any).reqArguments :
                                (req_cond.requirements[2] as any)?.conditionArguments }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import { mrid as config } from '@/ui.config' // Import the config file
import { useGitHubGetContent } from "@/composables/github/content"

const props = defineProps<{
    ui?: Partial<typeof config>;
}>()

// Use shared MRID data composable
const { getMridById, getAllMridData, setMridData } = useMridData()

const sharedDataUrl = ref('');
onMounted(() => {
  sharedDataUrl.value = sessionStorage.getItem('mridDataUrl') || '';
});

const { ui } = useUI(
    "eh-card",
    toRef(props, "ui"),
    config
);

// Configuration for scrollable dropdown with max 10 visible items
const dropdownScrollableConfig = {
    container: 'max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800'
}

const route = useRoute()
const router = useRouter()
const mridID = computed(() => {
    // First try to get from props, then from route query, then fallback
    return (route.query.mrid_id as string) || 'Missing MRID'
})

// Fetch data if store is empty
const { $model_rules_v1_2, $readCheckFunctionDescriptions } = useNuxtApp()
const isDataLoaded = ref(false)
const checkFunctionDescriptions = ref<Record<string, string>>({})

const loadMridDataIfNeeded = async () => {
    const allData = getAllMridData()

    if (allData.length === 0 && !isDataLoaded.value) {
        isDataLoaded.value = true

        try {
            let rawData;
            const dataUrl = sharedDataUrl.value;
            if (!dataUrl || typeof dataUrl !== 'string' || !/^https?:\/\//.test(dataUrl)) {
                console.error('Invalid or missing MRID data URL:', dataUrl);
                // Optionally show a user-facing message or set fallback data here
                return;
            }
            const url = new URL(dataUrl.toString());
            const pathParts = url.pathname.split('/');
            const owner = pathParts[1];
            const repo = pathParts[2];
            // Extract branch - it's typically at index 4 in GitHub URLs like /owner/repo/blob/branch/path
            const branch = pathParts[4] === 'blob' ? pathParts[5] : pathParts[4];
            // Path starts after the branch (index 6 for blob URLs)
            const path = pathParts[4] === 'blob' ? pathParts.slice(6).join('/') : pathParts.slice(5).join('/');

            rawData = await useGitHubGetContent(owner, repo, path, branch);
            if (typeof rawData === 'string') {
                rawData = JSON.parse(rawData)
            }

            // Extract CheckFunction descriptions
            checkFunctionDescriptions.value = $readCheckFunctionDescriptions(rawData)

            const transformedData = $model_rules_v1_2(rawData)
            setMridData(transformedData)

        } catch (error) {
            console.error('Failed to fetch GitHub content:', error);
            // Handle the error appropriately - maybe set default data or re-throw
            throw error;
        }
    }
}

// Load data when component mounts
onMounted(() => {
    loadMridDataIfNeeded()
})

// Find the specific MRID data from shared store
const currentMridData = computed(() => {
    // Trigger reactivity by accessing getAllMridData
    const allData = getAllMridData()

    // Try to get from the shared data store
    const foundData = getMridById(mridID.value)

    return foundData
})

// Helper function to get all MRID IDs for dropdown
const getAllMridIds = () => {
    const allData = getAllMridData()
    if (!allData || allData.length === 0) return []
    
    return allData.map(item => ({ 
        label: item.id, 
        value: item.id,
        click: () => handleMridSelect(item.id)
    }))
}

// Handle MRID selection - navigate to the selected MRID
const handleMridSelect = (mridId: string) => {
    router.push({ query: { ...route.query, mrid_id: mridId } })
}

const mridEntities = computed(()=>[
    {
        columnName: 'MRID',
        label: mridID.value || 'No Data',
        value: '',
        icon: '',
        entityType: [
            getAllMridIds().length > 0
                ? getAllMridIds()
                : [{ label: mridID.value || 'No Data', value: mridID.value || 'No Data', click: () => { } }]
        ]
    },
])

const entities = computed(() => [
    {
        columnName: 'Entity Type',
        badgeLabel: currentMridData.value?.entityType || 'No Data',
        value: 'entity1',
        icon: '',
        entityType: [
            [{ label: currentMridData.value?.entityType || 'No Data', value: currentMridData.value?.entityType || 'No Data' }]
        ]
    }, {
        columnName: 'Function',
        badgeLabel: currentMridData.value?.function || 'No Data',
        value: 'function',
        icon: '',
        entityType: [
            [{ label: currentMridData.value?.function || 'No Data', value: currentMridData.value?.function || 'No Data' }]
        ]
    }, {
        columnName: 'Reference',
        badgeLabel: currentMridData.value?.reference || 'No Data',
        value: 'reference',
        icon: '',
        entityType: [
            [{ label: currentMridData.value?.reference || 'No Data', value: currentMridData.value?.reference || 'No Data' }]
        ]
    }, {
        columnName: 'MR Version Introduced',
        badgeLabel: currentMridData.value?.mrVersionIntroduced || 'No Data',
        value: 'mr_version_introduced',
        icon: '',
        entityType: [
            [{ label: currentMridData.value?.mrVersionIntroduced || 'No Data', value: currentMridData.value?.mrVersionIntroduced || 'No Data' }]
        ]
    }, {
        columnName: 'Type',
        badgeLabel: currentMridData.value?.type || 'No Data',
        value: 'type',
        icon: '',
        entityType: [
            [{ label: currentMridData.value?.type || 'No Data', value: currentMridData.value?.type || 'No Data' }]
        ]
    }
])

const requirement_condition = computed(() => {
    // Get descriptions for the check functions
    const requirementCheckFunction = currentMridData.value?.requirement_checkFunction || 'No Data'
    const conditionCheckFunction = currentMridData.value?.condition_checkFunction || 'No Data'
    
    const requirementDescription = checkFunctionDescriptions.value[requirementCheckFunction] || 'No description available'
    const conditionDescription = checkFunctionDescriptions.value[conditionCheckFunction] || 'No description available'

    return [
        {
            columnName: 'Requirement',
            checkFunction: 'Check Function',
            description: 'Description',
            arguments: 'Arguments',
            value: 'requirement',
            requirements: [
                { checkFunction: requirementCheckFunction },
                { description: requirementDescription },
                { reqArguments: (currentMridData.value?.reqArguments || 'No Data').replace(/<\/?(?:pre|code)>/g, '') }
            ]
        }, {
            columnName: 'Condition',
            checkFunction: 'Check Function',
            description: 'Description',
            arguments: 'Arguments',
            value: 'condition',
            requirements: [
                { checkFunction: conditionCheckFunction },
                { description: conditionDescription },
                { conditionArguments: (currentMridData.value?.conditionArguments || 'No Data').replace(/<\/?(?:pre|code)>/g, '') }
            ]
        }
    ]
})

const selected = ref<string>(currentMridData.value?.modelVersionIntroduced || 'Error Loading Version. Please Refresh or Check Data Source')

const selectedLabel = computed(() => {
    if (!selected.value) return currentMridData.value?.modelVersionIntroduced
    const found = version[0].find(i => i.value === selected.value)
    return found ? found.label : (currentMridData.value?.modelVersionIntroduced)
})

const handleVersionSelect = (item: any) => {
    if (item.value) {
        selected.value = item.value
    }
}

const version = [[{
    label: currentMridData.value?.modelVersionIntroduced,
    value: currentMridData.value?.modelVersionIntroduced,
    icon: 'i-heroicons-check-badge-20-solid',
    click: () => handleVersionSelect({ value: currentMridData.value?.modelVersionIntroduced })
}]]
</script>
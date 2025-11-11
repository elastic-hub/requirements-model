<template>
    <div :class="ui.wrapper">
        <UDropdown :items="version" :popper="{ placement: 'bottom-start' }">
            <UButton color="green" :label="'Version ' + selectedLabel"
                trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdown>
        <div :class="ui.table.wrapper">
            <div :class="ui.table.title">Entity Definition</div>
            <div :class="[ui.table.content.base, ui.table.content.padding, ui.table.content.text]">
                <div v-for="mridEntity in mridEntities" :key="mridEntity.value">
                    <div>{{ mridEntity.columnName + ` (Total: ${getAllMridIds().length})` }}</div>
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
                            :class="[req_cond.requirements[1]?.description !== 'No description available' ? 'text-left dark:text-gray-400' : ui.table.content.text]">
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
</template>

<script setup lang="ts">
import { mrid as config } from '@/ui.config' // Import the config file

const props = defineProps<{
    ui?: Partial<typeof config>;
}>()

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

// Get MRID ID from URL query parameter
const mridID = computed(() => {
    return (route.query.mrid_id as string) || 'Missing MRID'
})

// Get transformation functions
const { $model_rules_v1_2, $readCheckFunctionDescriptions } = useNuxtApp()

// Load data using queryCollection
const transformedData = ref<any[]>([])
const checkFunctionDescriptions = ref<Record<string, string>>({})

// Load and transform data
const { data: collectionData } = await useAsyncData('mrid-data', () => {
    return queryCollection('modelData').all()
})

// Transform the data when collection data is available
watchEffect(() => {
    if (collectionData.value && Array.isArray(collectionData.value) && collectionData.value.length > 0) {
        const dataItem = collectionData.value[0]
        if (dataItem && (dataItem as any).meta) {
            const rawData = (dataItem as any).meta
            // Extract CheckFunction descriptions
            checkFunctionDescriptions.value = $readCheckFunctionDescriptions(rawData)
            // Transform the data
            transformedData.value = $model_rules_v1_2(rawData)
        }
    }
})

// Find the specific MRID data by comparing with mrid_id from URL
const currentMridData = computed(() => {
    if (!transformedData.value || transformedData.value.length === 0) {
        return null
    }

    return transformedData.value.find((item: any) => item.id === mridID.value)
})

// Helper function to get all MRID IDs for dropdown
const getAllMridIds = () => {
    if (!transformedData.value || transformedData.value.length === 0) return []

    return transformedData.value.map((item: any) => ({
        label: item.id,
        value: item.id,
        click: () => handleMridSelect(item.id)
    }))
}

// Handle MRID selection - navigate to the selected MRID
const handleMridSelect = (mridId: string) => {
    router.push({ query: { ...route.query, mrid_id: mridId } })
}

const mridEntities = computed(() => [
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
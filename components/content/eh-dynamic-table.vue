<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <div v-if="props.header" :class="ui.header">
      <MDC v-if="props.header" :value="props.header" />
    </div>
    <div :class="ui.base">
      <div :class="ui.search">
        <div class="flex flex-row items-center gap-2">
          <div class="text-base flex flex-row items-center">
            <span class="pr-2 dark:text-white">Show: </span>
            <select class="dark:text-white rounded-lg p-1" @change="onPerPageChange">
              <option v-for="item in PER_PAGE_LIST" :key="item" :value="item" :class="{ selected: perPage === item }">
                {{ item }}
              </option>
              <option value="-1" key="-1" :class="{ selected: perPage === -1 }">All</option>
            </select>
          </div>
          <div class="pl-4 dark:text-white">
            <button @click="downloadCSV" class="hover:scale-125" title="Download CSV file">
              <UIcon name="i-carbon-download" />
            </button>
          </div>
          <div class="pl-8 grow">
            <UInput v-model="q" type="text" @keyup="onSearch" placeholder="Type to search for..." />
          </div>
        </div>
      </div>
      <div :class="ui.filter">
        <UAccordion :items="accordionItems" color="primary" variant="solid" size="sm" class="not-prose">
          <template #quick-filters>
            <div :class="getQuickFilterClass()">
              <template v-for="column in sortedFilters">
                <div class="rounded-lg border" v-if="column.filter">
                  <UDivider :label="column.title" class="py-4 overflow-x-auto" />
                  <ul class="max-h-40 overflow-auto">
                    <li v-for="label in Object.keys(stats[column.name]).sort(sortBySelection(column.name))"
                      :data-filter-key="column.name" :data-filter-value="label" @click="onFilterChange"
                      class="list-none flex items-center p-2 hover:cursor-pointer gap-2"
                      :class="[isSelectedFilter(column.name, label) ? ui.tr.selected : '', ui.tr.active]">
                      <span :title="label" class="flex-1 break-words pr-1 min-w-0">{{ label }}</span>
                      <UBadge class="flex-shrink-0">
                        {{ stats[column.name][label] }}
                      </UBadge>
                    </li>
                  </ul>
                </div>
              </template>
            </div>
          </template>
        </UAccordion>
      </div>
      <div class="w-full">
        <div class="w-full overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table :class="ui.table" class="w-full border-collapse border-spacing-0"
            :style="perPage === -1 ? 'table-layout: fixed;' : 'table-layout: auto;'">
            <thead
              :class="[ui.thead, 'sticky top-0 z-40 backdrop-blur-sm bg-white/90', { 'dark:bg-slate-800/90': true }]">
              <tr :ui.tr.base>
                <template v-for="column in props.columns">
                  <th v-if="column.hide !== true"
                    :class="[ui.th.base, ui.th.padding, ui.th.color, ui.th.font, ui.th.size]"
                    class="px-2 py-2 break-words hyphens-auto overflow-hidden">
                    <UButton v-if="column.sortable" v-bind="{ ...(config.default.sortButton) }"
                      :icon="getSortIcon(column)" @click="onSort(column)">
                      <span v-html="getColumTitle(column)" class="not-prose break-words" />
                    </UButton>
                    <span v-else v-html="getColumTitle(column)" class="not-prose break-words" />
                  </th>
                </template>
              </tr>
            </thead>
            <tbody :class="ui.tbody">
              <template v-for="(row, index) in displayItems" :key="`${index}-${Date.now()}`">
                <tr :id="`${index}-${Date.now()}`" :class="ui.tr.base">
                  <template v-for="(column, cIndex) in props.columns" :key="`${column.name}-${index}-${Date.now()}`">
                    <td v-if="!column.hide" v-html="getItemColumValue(row, column)"
                      :id="`${column.name}-${index}-${Date.now()}`"
                      :class="[ui.td.base, ui.td.padding, ui.td.color, ui.td.font, ui.td.size]"
                      class="not-prose px-2 py-2 break-words hyphens-auto">
                    </td>
                  </template>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div :class="ui.pagination">
        <div class="flex flex-row justify-between">
          <div class="text-xs">
            {{ infoMessage }}
          </div>
          <UPagination v-model="page" :page-count="perPage" :total="numberOfItems" :max="10" @click="onPageChange"
            show-last show-first />
        </div>
      </div>
    </div>
    <div v-if="props.footer" :class="ui.footer">
      <MDC :value="props.footer" />
    </div>
  </div>

  <UModal v-model="buddy_mentor_open" prevent-close :ui="{ width: 'w-full sm:max-w-4xl', container: 'items-center' }">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex flex-col space-y-3">
          <div class="flex flex-row items-center justify-between">
            <div class="text-md font-medium text-gray-600 dark:text-gray-300">
              {{ 'Buddy&Mentor Quick Take for' }}
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class=""
              @click="(buddy_mentor_open = false) && (isCopied = false)" />
          </div>
          <div class="flex justify-between">
            <div class="flex flex-col w-full space-y-3">
              <div class="">
                <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm sm:text-center">
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Meeting
                        ID</span>
                      <span class="text-gray-700 dark:text-gray-300 truncate"
                        :title="selectedMeetingID || 'Not selected'">
                        <a v-if="selectedMeetingUrl" :href="selectedMeetingUrl" target="_blank">{{ selectedMeetingID
                        }}</a>
                        <div v-else>{{ selectedMeetingID || 'Not selected' }}</div>
                      </span>
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Topic
                        ID</span>
                      <span class="text-gray-700 dark:text-gray-300 truncate"
                        :title="selectedTopicId || 'Not selected'">
                        <a v-if="selectedTopicUrl" :href="selectedTopicUrl" target="_blank">{{ selectedTopicId }}</a>
                        <div v-else>{{ selectedTopicId || 'Not selected' }}</div>
                      </span>
                    </div>
                    <div class="flex flex-col sm:col-span-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">Topic
                        Title</span>
                      <span class="text-gray-700 dark:text-gray-300 truncate"
                        :title="selectedTopicTitle || 'Not selected'">
                        <a v-if="selectedTopicUrl" :href="selectedTopicUrl" target="_blank">{{ selectedTopicTitle }}</a>
                        <div v-else>{{ selectedTopicTitle || 'Not selected' }}</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="text-xs text-gray-400">
                {{ 'Get a quick summary of this topic in easy to understand non-technical terms.' }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <div class="flex flex-col">
        <div v-if="!isTyping && displayedText" class="flex flex-row items-center justify-between mb-5">
          <div class="text-sm text-gray-400">AI Gist:</div>
          <UButton :icon="isCopied ? 'i-si:check-line' : 'i-si:copy-line'" size="xs" color="primary" variant="ghost"
            :label="isCopied ? 'Copied!' : 'Copy as Markdown'" :trailing="false" @click="copyToClipboard" />
        </div>
        <div class="font-mono ">
          <div v-if="!displayedText && isAnalysisRunning" class="animate-pulse italic text-gray-500">
            Fetching the response from AI...
          </div>
          <!-- <MDC v-if="aiResponse" :value="aiResponse" /> -->
          <pre v-if="displayedText" class="whitespace-pre-wrap break-words overflow-x-auto bg-inherit">{{ displayedText }}
        </pre>
          <pre v-else-if="aiResponse && !isTyping" class="whitespace-pre-wrap break-words overflow-x-auto bg-inherit">{{
            aiResponse }}</pre>
        </div>
      </div>

      <template #footer>
        <div class="text-xs text-center text-gray-500 italic">
          {{ 'AI can make mistakes. Please verify the information provided.' }}
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { dynamicTable as config, dynamicTable } from "@/ui.config"
import { useGitHubGetContent } from "@/composables/github/content"
import dynamicTableYamlModal from '@/components/modals/dynamic-table/yaml-modal.vue'
import dynamicTableMermaidModal from '@/components/modals/dynamic-table/mermaid-modal.vue'

const { $filterTopic, $filterCR12, $model_rules_v1_2 } = useNuxtApp();

// Use shared MRID data composable
const { setMridData, setLoading } = useMridData()

const route = useRoute();

const PER_PAGE_LIST = config.perPage
//const recordingIcon = config.icons.recording

type itemsElement = {
  name: String;
  title?: String;
  filter?: Boolean;
  filterOrder?: Number;
  order?: Boolean;
  hide?: Boolean;
  formatColumValue?: String;
  type?: String;
  typeData?: Array;
}

// type: url
// name: link text 
// typeData: ['url']  => [text](url)
// typeData: ['name'] => [text](text)


const props = withDefaults(
  defineProps<{
    dataUrl: string;
    dataField?: String;
    columns: itemsElement[];
    ui?: Partial<typeof config>;
    header?: String;
    footer?: String;
    perPage?: Number;
    transformRawData?: any;
    // icon?: any;
    // secondIcon?: any;
    // thirdIcon?: any;
    // fourthIcon?: any;
    // fifthIcon?: any;
    class?: Any;
  }>(),
  {
    dataUrl: '',
    dataField: () => undefined,
    columns: () => ([]),
    ui: () => ({}),
    header: '',
    footer: '',
    perPage: config.default.perPage,
    transformRawData: () => null,
    // icon: config.icons.recording,
    // secondIcon: config.icons.ai,
    // thirdIcon: config.icons.github,
    // fourthIcon: config.icons.google,
    // fifthIcon: config.icons.topic,
    class: () => undefined
  });

const { ui, attrs } = useUI(
  "eh-dynamic-table",
  toRef(props, "ui"),
  config,
  toRef(props, "class")
)


const fetchData = async () => {
  try {
    displayItems.value = []
    items.value = []
    rawData.value = [] // Clear raw data
    nextTick()

    let data;
    const keywords = useAppConfig().dynamic_table.fetch.dataUrl.includes

    if (keywords.some(keyword => props.dataUrl.includes(keyword))) {

        const url = new URL(props.dataUrl.toString());
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
      //data = await $fetch(props.dataUrl);
      data = JSON.parse(data)
    }

    // Store raw data before any transformations
    let rawDataToStore = data;
    if (props.dataField) {
      rawDataToStore = data[props.dataField];
    }
    rawData.value = rawDataToStore; // Store the raw data as is

    if (props.transformRawData) {
      if (props.transformRawData === "filterTopic") {
        data = $filterTopic(data)
      } else if (props.transformRawData === "cr12") {
        data = $filterCR12(data)
      } else if (props.transformRawData === 'model_rules_v1_2') {
        data = $model_rules_v1_2(data)
      }
    }
    nextTick()

    if (props.dataField) {
      return reformatColumnValues(data[props.dataField])
    } else {
      return reformatColumnValues(data)
    }
  } catch (error) {
    console.log(error)
    return []
  }
}

const modal = useModal()

function openModal(itemId?: string) {
  if (itemId) {
    // Parse raw data if it's a string
    let parsedData = rawData.value;
    if (typeof rawData.value === 'string') {
      try {
        parsedData = JSON.parse(rawData.value);
      } catch (e) {
        console.error('Error parsing rawData:', e);
        parsedData = rawData.value;
      }
    }

    const objectKey = 'ModelRules'; // Adjust based on your actual data structure

    // Pass the whole parsed JSON data
    modal.open(dynamicTableYamlModal, {
      itemId: itemId,
      itemToConvert: parsedData[objectKey]?.hasOwnProperty(itemId)
        ? parsedData[objectKey][itemId]
        : null,
    })
  } else {
    modal.open(dynamicTableYamlModal, {
      itemId: itemId
    })
  }
}

function openMermaidModal(itemId?: string) {
  if (itemId) {
    // Parse raw data if it's a string
    let parsedData = rawData.value;
    if (typeof rawData.value === 'string') {
      try {
        parsedData = JSON.parse(rawData.value);
      } catch (e) {
        console.error('Error parsing rawData:', e);
        parsedData = rawData.value;
      }
    }

    const objectKey = 'ModelRules'; // Adjust based on your actual data structure

    // Pass the whole parsed JSON data
    modal.open(dynamicTableMermaidModal, {
      itemId: itemId,
      itemToConvert: parsedData[objectKey]?.hasOwnProperty(itemId)
        ? parsedData[objectKey][itemId]
        : null,
    })
  } else {
    modal.open(dynamicTableMermaidModal, {
      itemId: itemId
    })
  }
}

const reformatColumnValues = (data) => {
  for (let i = 0; i < data.length; i++) {
    props.columns?.forEach(column => {
      if (column.name && column.formatColumValue) {
        if (column.formatColumValue === 'DY' && data[i][column.name]) {
          try {
            let dateStr = new Date(data[i][column.name])
            dateStr = dateStr.getFullYear().toString()
            data[i][column.name] = dateStr

          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  }
  return data
}

const updateData = async () => {
  setLoading(true)
  items.value = await fetchData()
  
  // Store data in the shared composable for MRID components
  // Only store if this table is using the mr12 transformer (MRID data)
  if (props.transformRawData === 'model_rules_v1_2') {
    setMridData(items.value)
  }
  
  setLoading(false)
  nextTick()
  sortFilters()
  updateDisplayData()
}

const infoMessage = toRef("")

const updateDisplayData = () => {

  let filteredData = filterDataByQuery(items.value)
  filteredData = filterDataByQuickFilter(filteredData)
  filteredData = sortDisplayData(filteredData)

  stats.value = getStats(filteredData)

  numberOfItems.value = filteredData?.length > 0 ? filteredData.length : 0

  if (perPage.value === -1) {
    for (let index = 0; index < numberOfItems.value; index++) {
      displayItems.value.push(filteredData[index])
    }

    infoMessage.value = `Showing ${numberOfItems.value} items`

  } else {
    let startIndex = page.value * perPage.value - perPage.value
    let endIndex = startIndex + perPage.value > numberOfItems.value ? numberOfItems.value : startIndex + perPage.value

    infoMessage.value = ""
    displayItems.value = []
    nextTick()

    for (let index = startIndex; index < endIndex; index++) {
      displayItems.value.push(filteredData[index])
    }

    infoMessage.value = `Showing ${endIndex > 0 ? startIndex + 1 : 0} to ${endIndex} out of ${numberOfItems.value} items`
  }
  nextTick()
}

const items = toRef([])
const rawData = toRef([]) // Store raw JSON data before transformations
const displayItems = toRef([])
const page = defineModel('page', { type: Number, default: 1 })
const q = defineModel('q', { type: String, default: '' })
const perPage = toRef(props.perPage)
const numberOfItems = toRef(0)
const selectedFilters = toRef([])
const stats = toRef([])
const accordionItems = toRef([
  {
    label: "Quick Filters",
    icon: "i-heroicons-eye-dropper",
    slot: "quick-filters",
    defaultOpen: true
  }
])
const sortColumn = toRef({})
// Default sorting: show newest meetings first by meetingID date when possible
// meetingID values often contain an 8-digit YYYYMMDD substring (e.g. "focus_20250501").
// Initialize default sort to meetingID desc so table loads latest meetings first.
try {
  // Some environments expect a plain object on sortColumn.value
  sortColumn.value = { name: 'meetingID', direction: 'desc' }
} catch (e) {
  // Fallback: ignore if immutable
}
const sortedFilters = toRef([])
const buddy_mentor_open = ref(false)
const selectedTopicId = ref('')
const selectedTopicTitle = ref('')
const selectedTopicUrl = ref('')
const selectedMeetingID = ref('')
const selectedMeetingUrl = ref('')

const sortFilters = () => {
  sortedFilters.value = []

  if (props.columns) {
    let columnsUsedForFilter = props.columns.reduce((acc, c) => {
      if (c && c.filter) {
        acc.push(c)
      }
      return acc
    }, [])
    columnsUsedForFilter = columnsUsedForFilter.sort((l, r) => {
      if (!l.filterOrder && !r.filterOrder) {
        return 0
      } else if (!r.filterOrder) {
        return -1
      }
      return l.filterOrder - r.filterOrder
    })
    sortedFilters.value = columnsUsedForFilter
  }
}

const filterDataByQuery = (data) => {
  const fields2Search = props.columns.filter(item => item.query).map(item => item.name)

  if (q.value.length > 0) {
    return data.filter(item => {
      let finded = false
      for (const name of fields2Search) {
        if (name === "Undefined") {
          if (q.value === "") {
            finded = true
            break
          }
        } else if (item[name]?.toString().toLowerCase().includes(q.value.toLowerCase())) {
          finded = true
          break
        }
      }
      return finded
    })
  } else {
    return data
  }
}

const filterDataByQuickFilter = (data) => {
  if (selectedFilters.value.length > 0) {
    return selectedFilters.value.reduce((res, el) => {
      let currColumn = props.columns.filter(column => column.name === el.name)
      const items = res.length > 0 ? res : data
      res = items.filter(item => {
        if (item[el.name] && el.value) {
          return (currColumn[0].type === 'list') ? item[el.name].toString().includes(el.value.toString())
            : item[el.name].toString() === el.value.toString()
        } else
          return false
      })
      return res
    }, [])
  } else {
    return data
  }
}

const sortDisplayData = (data) => {
  if (Object.keys(sortColumn).length > 0) {
    return (data && typeof data.sort === 'function') ? data.sort((a, b) => defaultSort(a[sortColumn.value.name], b[sortColumn.value.name], sortColumn.value.direction)) : data
  } else {
    return data
  }
}

const isSelectedFilter = (key, value) => {
  const res = selectedFilters.value.filter(item => item.name === key && item.value === value)
  return res.length > 0
}

const getColumTitle = (column) => {
  return column?.title ? column.title : ""
}

const aiResponse = ref('')
const isAnalysisRunning = ref(false)
const promptTitle = ref('focus_newcontributors_summary-001')
const user = useSupabaseUser();

const email = computed(
  () => user.value?.user_metadata.email
);
// Expose runAnalysis globally for use in buddyMentorAndAnalysis
const runAnalysis = async () => {

  isAnalysisRunning.value = true

  try {
    // Prepare the payload
    const payload = {
      data: {
        meeting_id: selectedMeetingID.value || null,
        topic_id: selectedTopicId.value || null,
        prompt_id: promptTitle.value || null,
      },
      meta: {
        requested_by: email.value || undefined,
        timestamp: new Date().toISOString()
      }
    };
    // Make the API call to process the request
    const response = await $fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }) as any

    aiResponse.value = response?.open_ai_response || 'Something went wrong. Please, try again.'

    return aiResponse.value

  } catch (error) {
    console.error('Error running analysis:', error)
  } finally {
    isAnalysisRunning.value = false
  }
};


const getItemColumValue = (item: (any), column: (any)) => {
  let result = ""

  const icons = Object.values(config.icons).map(icon => icon.svg)
  const titles = Object.values(config.icons).map(icon => icon.tooltip)
  const keys = Object.values(config.icons).map(icon => icon.key)

  if (column.type === 'url' && column.name === 'icon') {

    const accessRoles = useState<string[]>('access-roles')?.value || []
    const allowedRoles = useAppConfig().middleware.auth.allowed_roles || []

    const hasAccess = accessRoles.some(role => allowedRoles.includes(role))

    const links = (column?.typeData || [])
      .map((keyOrValue: string) => {

        // Check for icon key with optional suffix (e.g., "ai-meetingID", "ai-combinedID")
        const [baseKey, suffix] = keyOrValue.split('-')

        // Check if the base key exists in our icons configuration
        if (!Object.keys(config.icons).includes(baseKey)) {
          return ''
        }

        const iconConfig = config.icons[baseKey as keyof typeof config.icons]

        // Handle different link types based on the key and suffix
        if (baseKey === 'ai') {
          // Temporarily removed hasAccess check
          // if (!hasAccess) return ''

          if (suffix === 'meetingID') {
            return `<a href="/analysis?meeting_id=${item.meetingID}" target="_blank" title="Analyse ${item.meetingID}" onclick="sessionStorage.setItem('analysisDataUrl', '${props.dataUrl.toString()}');">${iconConfig.svg}</a>`
          } else if (suffix === 'topicID') {
            return `<a href="/analysis?topic_id=${item.id}" target="_blank" title="Analyse ${item.id}" onclick="sessionStorage.setItem('analysisDataUrl', '${props.dataUrl.toString()}');">${iconConfig.svg}</a>`
          } else if (suffix === 'combinedID') {
            return `<button onclick="sessionStorage.setItem('meetingRegister', '${props.dataUrl}'); window.open('/analysis?combined_id=${item.combinedID}', '_blank');" title="Analyse ${item.combinedID}" class="cursor-pointer mr-2 hover:text-blue-100">${iconConfig.svg}</button>`

          } else {
            // Default ai behavior if no suffix
            return iconConfig.svg
          }
        } else if (baseKey === 'buddy_mentor') {
          const topicId = item.id || item.combinedID || item.meetingID || 'Unknown ID'
          const topicTitle = item.title || item.name || item.topic || 'Unknown Topic'
          const topicUrl = item.link || item.idURL || ''
          const meetingID = item.meetingID || item.combinedID || '';
          const minutesUrl = item.minutesUrl || '';
          return `<button onclick="window.buddyMentorAndAnalysis('${topicId}', '${topicTitle}', '${topicUrl}', '${meetingID}', '${minutesUrl}');"
                  title="${iconConfig.tooltip + ' ' + topicId}" class="cursor-pointer">${iconConfig.svg}</button>`
        } else if (baseKey === 'recording') {
          return `<a href="${item.recording}" target="_blank" title="${iconConfig.tooltip}">${iconConfig.svg}</a>`
        } else {
          // For other icons, just return the SVG (no linking for now)
          return iconConfig.svg
        }
      })
      .filter(Boolean)

    // const links = (column?.typeData || []).map((keyOrValue: (any), index: (any)) => {
    //   const link = item[keyOrValue] || keyOrValue
    //   if (!link) return ''
    //   if (index === 1 && !hasAccess) return ''

    //   const icon = icons[index]
    //   const title = titles[index] || `Link ${index + 1}`

    //   if (index === 1 && column.typeData.length===2) {
    //     return `<a href="/analysis?meeting_id=${item.meetingID}" target="_blank" title="Analyse ${item.meetingID}">${icon}</a>`
    //   } else if (index === 1 && column.typeData.length>4) {
    //     return `<a href="/analysis?combined_id=${item.combinedID}" target="_blank" title="Analyse ${item.combinedID}">${icon}</a>`
    //   } else if (index === 5 && column.typeData.length>4) {
    //     const topicId = item.id || item.combinedID || item.meetingID || 'Unknown ID'
    //     const topicTitle = item.title || item.name || item.topic || 'Unknown Topic'
    //     return `<button onclick="window.openBuddyMentor('${topicId}', '${topicTitle}')" title="${title}" class="cursor-pointer">${icon}</button>`
    //   }
    //   else{
    //     return `<a href="${link}" target="_blank" title="${title}">${icon}</a>`
    //   }

    // }).filter(Boolean)

    result = links.join('\n')
  } else if (column.type === 'url' && column.name === 'SCR_Icon') {
    // Multiple buttons for different actions
  const yamlButton = `<button onclick="window.openYamlModal('${item.id}')" title="See ${item.id} in YAML format" class="cursor-pointer mr-2">${icons[6]}</button>`;
  const mermaidDiagram = `<button onclick="window.openMermaidModal('${item.id}')" title="Show ${item.id} Mermaid diagram" class="cursor-pointer mr-2">${icons[8]}</button>`;
  const safeDataUrl = (typeof props.dataUrl === 'string') ? props.dataUrl.replace(/'/g, "\\'") : '';
  const MRIDReader = `<button onclick="sessionStorage.setItem('mridDataUrl', '${safeDataUrl}'); window.open('/mrid?mrid_id=${item.id}', '_blank');" title="View ${item.id}" class="cursor-pointer mr-2 hover:text-blue-100">${icons[7]}</button>`;

  return yamlButton + mermaidDiagram + MRIDReader;
  } else if (Array.isArray(column.typeData) && column.typeData.includes('idURL') && column.name === 'idURL') {
    const platform = item.platform
    const link = item.link
    const title = item.id

    const ai = `<a href="/analysis?topic_id=${item.id}" target="_blank" title="Analyse ${item.id}">${icons[1]}</a>`

    const googleDrive = link
      ? [`<a href="${link}" target="_blank" class="mr-6" title="${title}">${icons[3]}</a>`, ai]
      :
      [
        `<div title="${title}" class="group relative inline-flex items-center">
            <span class="group-hover:hidden">${title}</span>
            <span class="opacity-0 group-hover:opacity-100">${icons[3]}</span>
          </div>`
      ]

    const gitHub = link
      ? [
        `<a href="${link}" target="_blank" title="${title}" class="group relative inline-flex items-center">
            <span class="group-hover:hidden">${title}</span>
            <span class="opacity-0 group-hover:opacity-100">${icons[2]}</span>
        </a>`
      ]
      :
      [
        `<div title="${title}" class="group relative inline-flex items-center">
            <span class="group-hover:hidden">${title}</span>
            <span class="opacity-0 group-hover:opacity-100">${icons[2]}</span>
          </div>`
      ]

    const links = link
      ? [
        `<a href="${link}" target="_blank" title="${title}" class="group relative inline-flex items-center">
              <span class="group-hover:hidden">${title}</span>
              <span class="opacity-0 group-hover:opacity-100">${icons[4]}</span>
            </a>`
      ]
      :
      [
        `<div title="${title}" class="group relative inline-flex items-center">
            <span class="group-hover:hidden">${title}</span>
            <span class="opacity-0 group-hover:opacity-100">${icons[4]}</span>
          </div>`
      ]

    const linkSources: Record<string, string> = {
      googleDrive: googleDrive.join(''),
      gitHub: gitHub.join(''),
      links: links.join('')
    }

    const icon = useAppConfig().dynamic_table
    const platformKey = icon.topic.platform[platform] ?? icon.topic.platform.default

    return result = linkSources[platformKey]

  } else if (column.type === 'url') {
    const linkTitle = item[column?.name] ? item[column.name] : ""
    const linkHref = item[column?.typeData] ? item[column.typeData[0]] : ""
    result = `<a href="${linkHref}" target="_blank">${linkTitle}</a>`
  } else if (column.type === 'subs') {
    result = item[column?.typeData] ? item[column.typeData] : ""
  } else if (column.name === 'applicabilityCriteria') {
    const itemValue = item[column.name]
    if (itemValue?.length > 0) {
      result = itemValue.toString().replaceAll('_', '_\n')
    } else {
      result = ""
    }
  } else {
    const itemValue = item[column.name]
    result = itemValue?.length > 0 ? itemValue.toString() : ""
  }
  return result
}

const getSortIcon = (column) => {
  if (sortColumn.value?.name === column.name) {
    return sortColumn.value.direction === 'asc' ? config.default.sortAscIcon : config.default.sortDescIcon
  } else {
    return config.default.sortButton.icon
  }
}

const getQuickFilterClass = () => {
  const numFilterColumns = props.columns.reduce((res, column) => {
    return column.filter ? res + 1 : res
  }, 0)

  if (numFilterColumns < 2) {
    return 'grid grid-cols-1 gap-4 min-h-48'
  } else if (numFilterColumns < 3) {
    return 'grid grid-cols-2 gap-2 min-h-48'
  } else if (numFilterColumns < 4) {
    return 'grid grid-cols-3 gap-1 min-h-48'
  } else if (numFilterColumns < 5) {
    return 'grid grid-cols-4 gap-1 min-h-48'
  } else if (numFilterColumns < 6) {
    return 'grid grid-cols-5 gap-1 min-h-48'
  } else if (numFilterColumns < 7) {
    return 'grid grid-cols-6 gap-1 min-h-48'
  } else if (numFilterColumns < 8) {
    return 'grid grid-cols-7 gap-1 min-h-48'
  } else if (numFilterColumns < 9) {
    return 'grid grid-cols-8 gap-1 min-h-48'
  } else if (numFilterColumns < 10) {
    return 'grid grid-cols-9 gap-1 min-h-48'
  } else {
    return 'grid grid-cols-10 gap-1 min-h-48'
  }
}

const getStats = (data) => {
  const stats = {}
  props.columns.forEach(el => {
    if (el.filter) {
      stats[el.name] = {}
    }
  })

  if (data && typeof data.forEach === 'function') {
    data.forEach(el => {
      props.columns.forEach(column => {
        if (Object.keys(el).includes(column.name) && Object.keys(stats).includes(column.name)) {
          if (column.type === 'list') {
            const items = el[column.name]?.split(',')
            if (items?.length > 0) {
              items.forEach(item => {
                const label = item ? item.trim() : "Undefined"
                stats[column.name][label] = stats[column.name][label] ? stats[column.name][label] + 1 : 1
              })
            }
          } else {
            const label = el[column.name] ? el[column.name] : "Undefined"
            stats[column.name][label] = stats[column.name][label] ? stats[column.name][label] + 1 : 1
          }
        }
      })
    })
  }

  return stats
}

// Sort filter keys based on selection for a specific column
// Special-case: for meetingID values attempt date-aware sort (newest -> oldest)
const sortBySelection = (colName: string) => {
  // find selected elements for the column in question
  const selected = (selectedFilters.value as any[]).filter((el: any) => el.name === colName)
  // find the selected values for in the given column
  const selectedValues = selected.map((el: any) => el.value)

  // Helper: parse human readable dates like 11-Aug-25 or 11-Aug-2025 -> YYYYMMDD number
  const parseHumanDate = (val: any): number | null => {
    if (typeof val !== 'string') return null
    const m = val.match(/(\d{1,2})[- ]([A-Za-z]{3,9})[- ](\d{2,4})/i)
    if (!m) return null
    const day = Number(m[1])
    const monthStr = m[2].toLowerCase()
    const yearRaw = Number(m[3])
    const months: Record<string, number> = {
      jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
      may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9,
      oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12
    }
    const month = months[monthStr]
    if (!month) return null
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw
    return year * 10000 + month * 100 + day
  }

  // Helper: extract 8-digit YYYYMMDD substring
  const extractYYYYMMDD = (val: any): number | null => {
    if (typeof val !== 'string') return null
    const m = val.match(/(\d{8})/)
    return m && m[1] ? Number(m[1]) : null
  }

  return (a: any, b: any): number => {
    // prioritize selected values first (preserve previous UX)
    if (selectedValues.length > 0) {
      const aSelected = selectedValues.includes(a)
      const bSelected = selectedValues.includes(b)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      // otherwise fall through to normal comparison
    }

    // If this is the meetingID column, attempt date-aware sorting (newest first)
    if (colName === 'meetingID') {
      const aHuman = parseHumanDate(a)
      const bHuman = parseHumanDate(b)
      if (aHuman !== null && bHuman !== null) {
        return aHuman === bHuman ? 0 : (aHuman > bHuman ? -1 : 1)
      }

      const aNum = extractYYYYMMDD(a)
      const bNum = extractYYYYMMDD(b)
      if (aNum !== null && bNum !== null) {
        return aNum === bNum ? 0 : (aNum > bNum ? -1 : 1)
      }

      // If only one parsed as date, treat it as newer
      if (aHuman !== null || aNum !== null) return -1
      if (bHuman !== null || bNum !== null) return 1

      // fallback: lexicographic descending for meeting IDs to show recent-like order
      if (a === b) return 0
      return a > b ? -1 : 1
    }

    // Default behavior for other columns: lexicographic ascending
    if (a === b) return 0
    return a < b ? -1 : 1
  }
}

// Escape fields containing special characters by wrapping them in quotes
const escapeCSVField = (field) => {
  let result = ""
  if (typeof field === 'string' && (field.includes(',') ||
    field.includes('"') || field.includes('#') || field.includes('\n'))) {
    result = field.replace(/"/g, '\"')
    result = result.replace(/,/g, ' ')
    result = result.replace(/\n/g, ' ')
  } else if (!field) {
    result = "NULL"
  } else {
    result = field.length > 0 ? field.toString() : " "
  }
  return `${result}`
}

const downloadCSV = () => {
  let csvContent = "" // "data:text/csv;charset=utf-8," // CSV file headers
  const headers = props.columns.map(column => `${escapeCSVField(column.title)
    }`)
  csvContent += headers.join(",") + "\n"

  displayItems.value.forEach((row, index) => {

    const rowContent = props.columns.map(column => `${escapeCSVField(row[column.name])} `)
    csvContent += rowContent.join(",") + "\n"
  })

  // Create a temporary anchor element to trigger the download
  const encodedUri = "data:text/csv;charset=utf-8i," + encodeURIComponent(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "table_data.csv")
  document.body.appendChild(link)

  // Trigger the download
  link.click()

  // Clean up: remove the link after download
  document.body.removeChild(link)
}

// Event handlers

const onPageChange = (e) => {
  updateDisplayData()
}

const onSearch = (e) => {
  page.value = 1
  q.value = q.value.trim()
  updateDisplayData()
}

const onFilterChange = (e) => {
  const key = e.currentTarget.getAttribute('data-filter-key')
  const value = e.currentTarget.getAttribute('data-filter-value')

  const selected = selectedFilters.value.filter(el => el.name === key && el.value === value)

  if (selected.length > 0) {
    selectedFilters.value = selectedFilters.value.filter(el => el != selected[0])
  } else {
    selectedFilters.value.push({ name: key, value: value });
  }

  page.value = 1
  q.value = ""
  updateDisplayData()
}

const defaultSort = (a: any, b: any, direction: 'asc' | 'desc') => {
  // Normalize null/undefined
  if (a == null) a = ""
  if (b == null) b = ""

  const normalize = (v: any) => (typeof v === 'string' ? v.trim() : v)
  a = normalize(a)
  b = normalize(b)

  // Helper: extract an 8-digit YYYYMMDD number from strings like "focus_20250501"
  const extractYYYYMMDD = (val: any): number | null => {
    if (typeof val !== 'string') return null
    const m = val.match(/(\d{8})/)
    if (m && m[1]) return Number(m[1])
    return null
  }

  // Helper: extract DD-MMM-YY(YY) like 11-Aug-25 or 11-Aug-2025 (case-insensitive)
  const extractDDMMYYYYFromHuman = (val: any): number | null => {
    if (typeof val !== 'string') return null
    // Match day, month name (3+ letters), year (2 or 4)
    const m = val.match(/(\d{1,2})[- ]([A-Za-z]{3,9})[- ](\d{2,4})/i)
    if (!m) return null
    const day = Number(m[1])
    const monthStr = m[2].toLowerCase()
    const yearRaw = Number(m[3])

    const months: Record<string, number> = {
      jan: 1, january: 1,
      feb: 2, february: 2,
      mar: 3, march: 3,
      apr: 4, april: 4,
      may: 5,
      jun: 6, june: 6,
      jul: 7, july: 7,
      aug: 8, august: 8,
      sep: 9, sept: 9, september: 9,
      oct: 10, october: 10,
      nov: 11, november: 11,
      dec: 12, december: 12
    }

    const month = months[monthStr as keyof typeof months]
    if (!month) return null

    // Normalize 2-digit year to 2000+ (assumption: meetings are 2000-2099)
    const year = yearRaw < 100 ? 2000 + yearRaw : yearRaw

    // Build comparable YYYYMMDD number
    const y = year
    const mnum = month
    const d = day
    const num = y * 10000 + mnum * 100 + d
    return num
  }

  // Try human-readable date first
  const aHuman = extractDDMMYYYYFromHuman(a)
  const bHuman = extractDDMMYYYYFromHuman(b)
  if (aHuman !== null && bHuman !== null) {
    if (aHuman === bHuman) return 0
    if (direction === 'asc') return aHuman < bHuman ? -1 : 1
    return aHuman > bHuman ? -1 : 1
  }

  // Then try YYYYMMDD numeric substring
  const aDateNum = extractYYYYMMDD(a)
  const bDateNum = extractYYYYMMDD(b)
  if (aDateNum !== null && bDateNum !== null) {
    if (aDateNum === bDateNum) return 0
    if (direction === 'asc') return aDateNum < bDateNum ? -1 : 1
    return aDateNum > bDateNum ? -1 : 1
  }

  // Fallback to default string/number comparison
  if (a === b) return 0
  if (direction === 'asc') return a < b ? -1 : 1
  return a > b ? -1 : 1
}

const onSort = (column) => {
  if (sortColumn.value.name === column.name) {
    sortColumn.value.direction = sortColumn.value.direction === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = { name: column.name, direction: 'asc' }
  }
  updateDisplayData()
}

const onPerPageChange = (e) => {
  try {
    perPage.value = Number(e.target.value)
    updateDisplayData()
  } catch (error) {
    console.error(error)
  }
}

const displayedText = ref(``)
const isTyping = ref(false)
const isCopied = ref(false)
const typeWriterSpeed = ref(1) // milliseconds per character
let typewriterInterval: NodeJS.Timeout | null = null

function typeWriter(text: string, speed = typeWriterSpeed.value, delay = 0) {
  // Clear any existing interval
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
  }

  // Reset the displayed text and set typing state to false during delay
  displayedText.value = ""
  isTyping.value = false

  // Use setTimeout to delay the start of the typewriter effect
  setTimeout(() => {
    isTyping.value = true
    let i = 0
    typewriterInterval = setInterval(async () => {
      if (i < text.length) {
        displayedText.value += text[i]
        i++
      } else {
        clearInterval(typewriterInterval!)
        typewriterInterval = null
        isTyping.value = false
      }
    }, speed)
  }, delay)
}

const copyToClipboard = async () => {
  await navigator.clipboard.writeText(displayedText.value)
  isCopied.value = true
}


onMounted(() => {
  // Set up global functions for buddy mentor modal and combined action
  (window as any).openBuddyMentor = (topicId: string, topicTitle: string, topicUrl?: string, meetingID?: string, minutesUrl?: string) => {
    selectedTopicId.value = topicId
    selectedTopicTitle.value = topicTitle
    selectedTopicUrl.value = topicUrl || ''
    selectedMeetingID.value = meetingID || ''
    selectedMeetingUrl.value = minutesUrl || ''
    buddy_mentor_open.value = true
  }

  // Function to open YAML modal
  (window as any).openYamlModal = (itemId: string) => {
    openModal(itemId)
  }

  // Function to open Mermaid modal
  (window as any).openMermaidModal = (itemId: string) => {
    openMermaidModal(itemId)
  }

  // Combined function to run both buddy mentor and analysis
  (window as any).buddyMentorAndAnalysis = async (topicId: string, topicTitle: string, topicUrl?: string, meetingID?: string, minutesUrl?: string) => {
    (window as any).openBuddyMentor(topicId, topicTitle, topicUrl, meetingID, minutesUrl);
    if (typeof runAnalysis === 'function') {
      await runAnalysis();
    }
  }
  updateData()
})

onUnmounted(() => {
  // Clean up global functions and typewriter interval
  delete (window as any).openBuddyMentor
  delete (window as any).openYamlModal
  delete (window as any).openMermaidModal
  delete (window as any).buddyMentorAndAnalysis
  if (typewriterInterval) {
    clearInterval(typewriterInterval)
  }
})

// Watch for buddy mentor modal opening to start typewriter effect
watch(buddy_mentor_open, (newValue) => {
  if (!newValue) {
    // Clear typewriter when modal closes
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      typewriterInterval = null
    }
    displayedText.value = ""
    isTyping.value = false
    aiResponse.value = ""
  } else {
    isCopied.value = false
  }
})

// Watch aiResponse to trigger typewriter effect immediately when it gets a value
watch(aiResponse, (newValue) => {
  if (buddy_mentor_open.value && newValue) {
    isTyping.value = true;
    displayedText.value = "";
    typeWriter(newValue, typeWriterSpeed.value, 0)
  }
})

watch(items,
  (newValue, oldValue) => {
    updateDisplayData()
    nextTick()
  },
  { immediate: true }
)

await updateData()
</script>

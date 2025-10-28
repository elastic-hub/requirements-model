export default {
  wrapper: "w-full bg-gray-50 dark:bg-inherit border-2 border-neutral-200 dark:border-neutral-500 rounded-2xl p-5",
  header: "rounded-lg font-semibold text-center bg-slate-200 dark:bg-bloo/[0.6] dark:text-white",
  base: "w-full",
  footer: "font-semibold text-center bg-slate-200 dark:bg-slate-700 dark:text-golden",
  search: "w-full pb-4",
  filter: "",
  table: "w-full table-fixed divide-y divide-gray-300 dark:divide-gray-700",
  tbody: 'divide-y divide-gray-300 dark:divide-gray-700',
  thead: "shadow-md border-b-2 border-gray-200 dark:border-gray-700",
  tr: {
    base: '',
    selected: 'bg-blue-400 hover:bg-blue-300 text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:text-golden',
    active: 'hover:bg-neutral-200 dark:hover:bg-neutral-600 cursor-pointer'
  },
  th: {
    base: 'text-left rtl:text-right truncate border-b border-gray-200 dark:border-gray-600',
    padding: 'px-4 py-3.5',
    color: 'text-gray-900 dark:text-white',
    font: 'font-semibold',
    size: 'text-sm'
  },
  td: {
    base: 'whitespace-nowrap text-pretty truncate',
    padding: 'px-4 py-4',
    color: 'text-gray-500 dark:text-golden dark:brightness-[85%]',
    font: '',
    size: 'text-sm'
  },
  icons: {
    recording: {
      key: 'recording',
      label: 'Recording',
      tooltip: 'Watch Recording',
      svg: "<svg class='inline-block space-x-1' width=\'24\' height=\'24\' viewBox=\'0 0 20 20\'><rect width=\'20\' height=\'20\' fill=\'none\'/><path fill=\'currentColor\' d=\'M4.5 4A2.5 2.5 0 0 0 2 6.5v2.837c.31-.148.647-.251 1-.302V6.5A1.5 1.5 0 0 1 4.5 5h7A1.5 1.5 0 0 1 13 6.5v7a1.5 1.5 0 0 1-1.5 1.5H11v1h.5a2.5 2.5 0 0 0 2.5-2.5v-1l2.4 1.8a1 1 0 0 0 1.6-.8v-7a1 1 0 0 0-1.6-.8L14 7.5v-1A2.5 2.5 0 0 0 11.5 4zM14 8.75l3-2.25v7l-3-2.25zM1 12.5A2.5 2.5 0 0 1 3.5 10h4a2.5 2.5 0 0 1 2.5 2.5v4A2.5 2.5 0 0 1 7.5 19h-4A2.5 2.5 0 0 1 1 16.5zm4.02.034a.45.45 0 0 0-.447-.037a.5.5 0 0 0-.156.108a.5.5 0 0 0-.145.357v3.075a.5.5 0 0 0 .145.358a.6.6 0 0 0 .158.11a.45.45 0 0 0 .323.02a.5.5 0 0 0 .13-.064l2.296-1.567a.47.47 0 0 0 .163-.185a.54.54 0 0 0-.003-.487a.5.5 0 0 0-.168-.182z\'/></svg>",
    },
    ai: {
      key: 'ai',
      label: 'AI Summary',
      tooltip: 'AI Analysis',
      svg: "<svg class='inline-block space-x-1' width='24' height='24' viewBox='0 0 24 24'><rect width='24' height='24' fill='none'/><path fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m10 7l-.516 1.394c-.676 1.828-1.014 2.742-1.681 3.409s-1.581 1.005-3.409 1.681L3 14l1.394.516c1.828.676 2.742 1.015 3.409 1.681s1.005 1.581 1.681 3.409L10 21l.516-1.394c.676-1.828 1.015-2.742 1.681-3.409s1.581-1.005 3.409-1.681L17 14l-1.394-.516c-1.828-.676-2.742-1.014-3.409-1.681s-1.005-1.581-1.681-3.409zm8-4l-.221.597c-.29.784-.435 1.176-.72 1.461c-.286.286-.678.431-1.462.72L15 6l.598.221c.783.29 1.175.435 1.46.72c.286.286.431.678.72 1.462L18 9l.221-.597c.29-.784.435-1.176.72-1.461c.286-.286.678-.431 1.462-.72L21 6l-.598-.221c-.783-.29-1.175-.435-1.46-.72c-.286-.286-.431-.678-.72-1.462z' color='currentColor'/></svg>",
    },
    github: {
      key: 'github',
      label: 'GitHub',
      tooltip: 'View on GitHub',
      svg: "<svg class='inline-block space-x-1' width='24' height='24' viewBox='0 0 24 24'><rect width='24' height='24' fill='none'/><path fill='currentColor' d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2'/></svg>",
    },
    google: {
      key: 'google',
      label: 'Google',
      tooltip: 'View on Google',
      svg: "<svg class='inline-block space-x-1' width='24' height='24' viewBox='0 0 48 48'><rect width='48' height='48' fill='none'/><path fill='#ffc107' d='M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917'/><path fill='#ff3d00' d='m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691'/><path fill='#4caf50' d='M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44'/><path fill='#1976d2' d='M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917'/></svg>",
    },
    topic: {
      key: 'topic',
      label: 'Topic',
      tooltip: 'Topic',
      svg: "<svg class='inline-block' width='24' height='24' viewBox='0 0 512 512' fill='currentColor'><path d='M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6.6-1 1.1-1.3 1.4l-.3.3c-4.6 4.6-5.9 11.4-3.4 17.4s8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64a32 32 0 1 1 0-64m128 0a32 32 0 1 1 0 64a32 32 0 1 1 0-64m96 32a32 32 0 1 1 64 0a32 32 0 1 1-64 0'/></svg>",
    },
    buddy_mentor: {
      key: 'buddy_mentor',
      label: 'Buddy Mentor',
      tooltip: 'Gist of Topic',
      svg: `<svg class='inline-block text-inherit' width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="m16 7.78l-.313.095l-12.5 4.188L.345 13L2 13.53v8.75c-.597.347-1 .98-1 1.72a2 2 0 1 0 4 0c0-.74-.403-1.373-1-1.72v-8.06l2 .655V20c0 .82.5 1.5 1.094 1.97c.594.467 1.332.797 2.218 1.093c1.774.59 4.112.937 6.688.937s4.914-.346 6.688-.938c.886-.295 1.624-.625 2.218-1.093C25.5 21.5 26 20.82 26 20v-5.125l2.813-.938L31.655 13l-2.843-.938l-12.5-4.187zm0 2.095L25.375 13L16 16.125L6.625 13zm-8 5.688l7.688 2.562l.312.094l.313-.095L24 15.562V20c0 .01.004.126-.313.375c-.316.25-.883.565-1.625.813C20.58 21.681 18.395 22 16 22s-4.58-.318-6.063-.813c-.74-.247-1.308-.563-1.624-.812C7.995 20.125 8 20.01 8 20z" /></svg>`,
    },
    yaml: {
      key: 'yaml',
      label: 'YAML',
      tooltip: 'View YAML',
      svg: `<svg width="32" height="32" viewBox="0 0 32 32"><path fill="#cb171e" d="M20.06 12.73H14.5l-1.13 2.73H10.9l5.22-12.3h2.52l5 12.3H21zm-.92-2.46l-1.71-4.51l-1.9 4.51z" /><path fill="#d2d2d2" d="M30 28.82v-2.57h-6.36v-9.44H21v12zm-15.87-2.68l2.8-5.78v8.5h2.48V16.82H16l-3 5.46l-2.86-5.46H6.8v12.06h2.58v-8.32l2.71 5.6zM2 3.14h3.46L8.5 7.97l3.07-4.85h3.31l-5.02 7.53v4.77H6.8v-4.77z" /></svg>`
    },
    mrid: {
      key: 'mrid',
      label: 'MRID',
      tooltip: 'View MRID',
      svg: `<svg width="32" height="32" viewBox="0 0 256 256"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"><path d="m 16,64 224.93778,0.09256" /><path d="M 48,16 H 207.91114 C 225.62929,16 240,30.281849 240,48 v 160 c 0,17.71816 -14.28185,32 -32,32 H 48 C 30.281848,240 16.069099,225.73073 16.06221,208.01257 L 16,48 C 15.993112,30.281851 30.281848,16 48,16 Z" /><path d="M 191.96444,64.092555 192,16" /><path d="M 48.044437,112.06589 H 80.02666" /><path d="M 48.044437,144.04812 H 175.97333" /><path d="M 48.044437,176.03034 H 127.99999" /><path d="M 48.044437,208.01256 H 80.02666" /></g></svg>`
    },
    mermaid: {
      key: 'mermaid',
      label: 'Mermaid',
      tooltip: 'View Diagram',
      svg: `<svg width="32" height="32" viewBox="0 0 32 32"><path fill="#fd366e" d="M29.973 4.478A14.24 14.24 0 0 0 16 13.842c-2.107-5.82-7.787-9.628-13.973-9.364a14.25 14.25 0 0 0 6.2 12.36a7.65 7.65 0 0 1 3.316 6.32v4.376h8.916V23.16a7.65 7.65 0 0 1 3.315-6.32a14.25 14.25 0 0 0 6.2-12.36z" /></svg>`
    },
  },
  pagination: 'pt-5',
  perPage: [10, 25, 50, 100],
  default: {
    perPage: 10,
    sortAscIcon: 'i-heroicons-bars-arrow-up-20-solid',
    sortDescIcon: 'i-heroicons-bars-arrow-down-20-solid',
    sortButton: {
      icon: 'i-heroicons-arrows-up-down-20-solid',
      trailing: true,
      square: true,
      color: 'gray' as const,
      variant: 'ghost' as const,
      class: '-m-1.5 font-semibold text-sm'
    },
  }
}

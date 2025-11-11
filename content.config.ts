import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/FinOps-Open-Cost-and-Usage-Spec/meetings/tree/dev', // to checkout the content from another branch add /tree/<branch-name> to the end of the url
        include: '**/*.{md,json}', // include both markdown and JSON files
        exclude: ['templates/*.md', 'buddymentor', 'meeting_selection', 'meetings/!(upcoming_agenda|latest_minutes)/**', 'reports', 'topics'], //'README.md'
        authToken: process.env.GITHUB_TOKEN,
      },
    }),
    localContent: defineCollection({
      source: '**/*.md',
      type: 'page'
    }),
    prompts: defineCollection({
      type: 'data',
      source: {
        repository: 'https://github.com/elastic-hub/genai-meeting-minutes/tree/main/.promptlib/', // to checkout the content from another branch add /tree/<branch-name> to the end of the url
        include: '**/*.yaml',
        exclude: [''],
        authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({
        prompts: z.array(z.object({
          promptID: z.string(),
          title: z.string(),
          role: z.string(),
          description: z.string(),
          inputs: z.array(z.string()).optional()
        }))
      })
    }),
  },
})

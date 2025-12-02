import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/FinOps-Open-Cost-and-Usage-Spec/meetings/tree/dev', // to checkout the content from another branch add /tree/<branch-name> to the end of the url
        include: '**/*.md', // include only markdown files 
        exclude: ['templates/*.md', 'buddymentor', 'meeting_selection', 'meetings/**', 'reports', 'topics', 'README.md'], 
        authToken: process.env.GITHUB_TOKEN,
      },
    }),
    modelData: defineCollection({
      type: 'data',
      source: {
        repository: 'https://github.com/FinOps-Open-Cost-and-Usage-Spec/meetings/tree/dev',
        include: '**/model-1.2.json', // target specifically the model-1.2.json file
        authToken: process.env.GITHUB_TOKEN,
      },
      schema: z.object({}), // Allow any JSON object structure
    }),
    localContent: defineCollection({
      source: '**/*',
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

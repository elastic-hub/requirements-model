// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  ssr: true,
  
  app: {
    // Allow overriding the base URL (useful for GitHub Pages under a repo path)
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    // Ensure assets use the correct base URL
    cdnURL: process.env.NUXT_APP_BASE_URL || '/',
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/google-fonts',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@nuxtjs/mdc',
  ],

  colorMode: {
    preference: 'dark'
  },

  supabase: { redirect: false },

  runtimeConfig: {
    public: {
      githubToken: process.env.GITHUB_TOKEN,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
    }
  },

  icon: {
    provider: 'iconify',
    serverBundle: false,
  },

  googleFonts: {
    families: {
      "Roboto": [300, 400, 600, 700],
      "DM Sans": [400, 500, 600, 700],
      "DM Mono": [400, 500],
    },
  },
  
  nitro: {
    devProxy: {
      "/api/process": {
        target: "http://127.0.0.1:5000/process",
        changeOrigin: true,
      },
    },
    prerender: {
      routes: ['/footer-content', '/mrid', '/'],
      crawlLinks: true,
      failOnError: false,
      ignore: ['/api'],
    },
  },
  
  router: {
    options: {
      strict: true, // Prevent automatic trailing slash addition
    }
  },
  
  experimental: {
    payloadExtraction: false,
  },
})
// /plugins/mermaid.client.ts
import mermaid from 'mermaid'

export default defineNuxtPlugin(() => {
    mermaid.initialize({
        startOnLoad: false, // we’ll manually trigger rendering
        theme: 'default',
        securityLevel: 'loose', // allows inline SVGs safely
    })

    return {
        provide: {
            mermaid,
        },
    }
})

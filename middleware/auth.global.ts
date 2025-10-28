import { showError } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
    // if (to.path.startsWith('/_nuxt') || /\.\w+$/.test(to.path)) return
    // if (!(to.path.startsWith('/table') || to.path.startsWith('/meeting_selection') || to.path.startsWith('/reports') || to.path.startsWith('/analysis'))) return

    // const user = useSupabaseUser().value
    // const username = user?.user_metadata?.user_name
    // if (!username) {
    //     return showError({
    //         statusCode: 403,
    //         statusMessage: `Sorry, you do NOT have permission to access ${to.path.slice(1).toUpperCase()}. Login to continue.`,
    //     })
    // }
    return
})

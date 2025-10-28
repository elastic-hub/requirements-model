import { watchEffect } from 'vue'
import type { Ref } from 'vue'
import { useAppConfig } from '#imports'
import { createError } from 'h3'

export function useThrow404(page: Ref<any>) {
    const error404 = useAppConfig().site?.error?.[404]
    watchEffect(() => {
        if (!page.value) {
            throw createError({
                statusCode: 404,
                statusMessage: typeof error404 === 'string' && error404.trim() ? error404 : 'Page not found',
            })
        }
    })
}
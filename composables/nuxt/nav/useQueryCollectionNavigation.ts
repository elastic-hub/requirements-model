export const useQueryCollectionNavigation = () => {
    const route = useRoute()
    return useAsyncData(`navigation-${route.path}`, () =>
        queryCollectionNavigation('content')
    )
}
// Composable for sharing MRID data between components
export const useMridData = () => {
  // Shared reactive state
  const mridDataStore = useState<any[]>('mrid-data', () => [])
  const isLoading = useState<boolean>('mrid-data-loading', () => false)
  
  const setMridData = (data: any[]) => {
    mridDataStore.value = data
  }
  
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }
  
  const getMridById = (id: string) => {
    return mridDataStore.value.find(item => item.id === id) || null
  }
  
  const getAllMridData = () => {
    return mridDataStore.value
  }
  
  return {
    mridDataStore: readonly(mridDataStore),
    isLoading: readonly(isLoading),
    setMridData,
    setLoading,
    getMridById,
    getAllMridData,
  }
}
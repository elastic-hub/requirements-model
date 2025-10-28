import { computed } from 'vue';

/**
 * Composable to determine the default open state for an accordion based on a list of items and an isActive function.
 * @param items - The array of items (e.g., keywords or objects).
 * @param getItemPath - Function to get the path from an item.
 * @param isActive - Function to determine if a path is active.
 * @returns { isDefaultOpen: ComputedRef<boolean> }
 */
export function useAccordionDefaultOpen<T = any>(
  items: T[],
  getItemPath: (item: T) => string | undefined,
  isActive: (path: string | undefined) => boolean
) {
  const isDefaultOpen = computed(() => {
    return items.some(item => {
      const path = getItemPath(item);
      return path && isActive(path);
    });
  });

  return { isDefaultOpen };
}

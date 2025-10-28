import { reactive, nextTick } from 'vue';
import type { ComponentPublicInstance } from 'vue';

/**
 * Composable for managing refs and scrolling the active item into view.
 * @param getActiveKey - Function that returns the active key (string) for the list.
 * @param getItemKey - Function that returns the key for each item (string).
 * @returns { keywordRefs, setKeywordRef, scrollActiveIntoView }
 */
export function useScrollIntoView(
  getActiveKey: () => string | undefined,
  getItemKey: (item: any) => string
) {
  const keywordRefs = reactive<Record<string, HTMLElement | null>>({});

  function setKeywordRef(keyword: string, el: Element | ComponentPublicInstance | null) {
    keywordRefs[keyword] = (el instanceof HTMLElement) ? el : null;
  }

  async function scrollActiveIntoView(items: any[]) {
    await nextTick();
    const activeKey = getActiveKey();
    if (!activeKey) return;
    for (const item of items) {
      const key = getItemKey(item);
      if (key === activeKey) {
        const el = keywordRefs[key];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }
    }
  }

  return {
    keywordRefs,
    setKeywordRef,
    scrollActiveIntoView
  };
}

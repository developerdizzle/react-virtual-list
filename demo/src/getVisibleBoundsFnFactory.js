export function getVisibleBoundsFnFactory() {
    let minIndex = Number.MAX_SAFE_INTEGER;
    let maxIndex = -1;

    return function getVisibleItemBounds(list, container, items, itemHeight, itemBuffer, defaultImpl) {
        const result = defaultImpl(list, container, items, itemHeight, itemBuffer);
        if (!result) {
            return result;
        }
        const { firstItemIndex, lastItemIndex } = result;
        minIndex =
            lastItemIndex > -1 && minIndex > firstItemIndex
                ? firstItemIndex
                : minIndex;
        maxIndex = maxIndex < lastItemIndex ? lastItemIndex : maxIndex;
        return { firstItemIndex: minIndex, lastItemIndex: maxIndex };
    }
}

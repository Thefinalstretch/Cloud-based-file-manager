export function simulateItems<T>(items: T[], count: number, createDummy: (index: number) => T): T[] {
  const result = [...items];

  for (let i = items.length; i < count; i++) {
    result.push(createDummy(i));
  }

  return result;
}

// Generates rows of items for a honeycomb layout, alternating between rows of 3 and 2 items, and filling in dummy items as needed to maintain the structure.
export function createHoneycombRows<T extends { appID: string; isDummy?: boolean }>(
  items: T[]
): T[][] {
  const rows: T[][] = [];

  let currentIndex = 0;
  let isThreeRow = true;

  while (currentIndex < items.length) {
    const chunkSize = isThreeRow ? 3 : 2;
    const chunk = items.slice(currentIndex, currentIndex + chunkSize);

    while (chunk.length < chunkSize) {
      chunk.push({
        appID: `dummy-${currentIndex}-${chunk.length}`,
        isDummy: true,
      } as T);
    }

    rows.push(chunk);
    currentIndex += chunkSize;
    isThreeRow = !isThreeRow;
  }

  return rows;
}
import { useState } from "react";

type HasRelativePath = {
  relativePath: string;
};

export function useSelectableList<T extends HasRelativePath>(initialAvailable: T[] = []) {
  const [availableItems, setAvailableItems] = useState<T[]>(initialAvailable);
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const selectItem = (itemToSelect: T) => {
    setAvailableItems((prev) =>
      prev.filter((item) => item.relativePath !== itemToSelect.relativePath)
    );
    setSelectedItems((prev) => [...prev, itemToSelect]);
  };

  const deselectItem = (itemToDeselect: T) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.relativePath !== itemToDeselect.relativePath)
    );
    setAvailableItems((prev) => [...prev, itemToDeselect]);
  };

  return {
    availableItems,
    selectedItems,
    setAvailableItems,
    setSelectedItems,
    selectItem,
    deselectItem,
  };
}
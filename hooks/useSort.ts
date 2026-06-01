// import { sortData, SortDirection } from "@/lib/sort";
import { useState, useMemo } from "react";
import { sortData, SortDirection } from "@/lib/sort";

export function useSort<T>(data: T[], initialField: keyof T) {
  const [sortField, setSortField] = useState<keyof T>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    return sortData(data, sortField, sortDirection);
  }, [data, sortField, sortDirection]);

  return {
    sortedData,
    sortField,
    sortDirection,
    handleSort,
  };
}
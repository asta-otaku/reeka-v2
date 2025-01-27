import { useState } from "react";

interface PaginationResult<T> {
  currentPageData: T[];
  pageCount: number;
  handlePageChange: (selected: { selected: number }) => void;
  currentPage: number;
}

export function usePagination<T>(
  data: T[],
  itemsPerPage: number
): PaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(0);

  const pageCount = Math.ceil(data.length / itemsPerPage);

  const currentPageData = data.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  return {
    currentPageData,
    pageCount,
    handlePageChange,
    currentPage,
  };
}

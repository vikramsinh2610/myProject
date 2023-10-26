import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const LEFT = "left";
const RIGHT = "right";

export default function Pagination({
  total,
  onPageChange,
  page,
  pageSize,
}: any) {
  const [totalPage, setTotalPage] = useState(0);
  useEffect(() => {
    if (total > 0 && pageSize > 0) setTotalPage(Math.ceil(total / pageSize));
  }, [total, pageSize]);

  const [visiblePages, setVisiblePage] = useState([]);
  const filterPages = (visiblePages: any, totalPages: any) => {
    return visiblePages.filter((page: any) => page <= totalPages);
  };

  const getVisiblePages = (page: any, totalPage: any) => {
    if (totalPage < 6) {
      return filterPages([1, 2, 3, 4, 5], totalPage);
    } else {
      if (page % 4 >= 0 && page > 3 && page + 2 < totalPage) {
        return [1, LEFT, page - 1, page, page + 1, RIGHT, totalPage];
      } else if (page % 4 >= 0 && page > 3 && page + 2 >= totalPage) {
        return [
          1,
          LEFT,
          totalPage - 3,
          totalPage - 2,
          totalPage - 1,
          totalPage,
        ];
      } else {
        return [1, 2, 3, 4, RIGHT, totalPage];
      }
    }
  };
  useEffect(() => {
    let pages = getVisiblePages(page, totalPage);
    setVisiblePage(pages);
  }, [page, totalPage]);

  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="mr-2 flex h-8 items-center gap-2 p-1 text-themeColor disabled:opacity-30"
      >
        <IoIosArrowBack /> Prev
      </button>
      {visiblePages.map((i, id) => {
        if (i === LEFT) {
          return (
            <li
              key={id}
              className="min-h-8 flex h-8 w-8 items-center justify-center rounded-md border border-solid border-red-200 bg-transparent p-1 font-bold text-textColor hover:border-themeColor hover:text-themeColor"
            >
              &hellip;
            </li>
          );
        }
        if (i === RIGHT) {
          return (
            <li
              key={id}
              className="min-h-8 flex h-8 w-8 items-center justify-center rounded-md border border-solid border-red-200 bg-transparent p-1 font-bold text-textColor hover:border-themeColor hover:text-themeColor"
            >
              &hellip;
            </li>
          );
        }

        return (
          <button
            className={`min-h-8 flex h-8 w-8 items-center justify-center rounded-md border border-solid border-red-200 p-1 font-bold hover:border-themeColor  ${
              page === i
                ? "bg-themeColor text-white hover:text-white"
                : " bg-transparent text-textColor hover:text-themeColor"
            }`}
            key={id}
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        );
      })}
      <button
        className="ml-2 flex h-8 items-center gap-2 p-1 text-themeColor disabled:opacity-30"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPage}
      >
        Next <IoIosArrowForward />
      </button>
    </div>
  );
}

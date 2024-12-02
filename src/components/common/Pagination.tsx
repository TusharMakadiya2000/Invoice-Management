import React, { useEffect, useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalRecords: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalRecords,
    perPage,
    onPageChange,
}: PaginationProps) => {
    const [pageNumbers, setPageNumbers] = useState([1]);

    const generatePagination = (tRecords: number, cPage: number) => {
        const totalPages = Math.ceil(totalRecords / perPage);
        console.log("totalPages", totalPages);
        const pagesToShow = Math.min(totalPages);
        console.log("pagesToShow", pagesToShow);
        let startPage = Math.max(1, cPage - Math.floor(pagesToShow / 2));
        console.log("startPage", startPage);
        let endPage = Math.min(tRecords, startPage + pagesToShow - 1);
        console.log("endPage", endPage);

        if (tRecords <= pagesToShow) {
            startPage = 1;
            endPage = tRecords || 1;
        } else {
            if (endPage - startPage + 1 < pagesToShow) {
                startPage = endPage - pagesToShow + 1;
            }
        }
        if (totalPages < endPage) {
            // Less than 5 pages so show all
            startPage = 1;
            endPage = pagesToShow || 1;
        }

        const pagination = [];
        for (let i = startPage; i <= endPage; i++) {
            pagination.push(i);
        }

        return pagination;
    };
    useEffect(() => {
        const pagination = generatePagination(totalRecords, currentPage);
        setPageNumbers(pagination);
        // eslint-disable-next-line
    }, [currentPage, totalRecords, perPage]);

    return (
        <div className="w-fit">
            {/* <div className="flex gap-x-2 rounded border border-border dark:border-border-dark dark:bg-fgc-dark  "> */}
            <div className="flex gap-x-2 ">
                <div
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`cursor-pointer border border-border/70 dark:border-border-dark/70 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-white hover:dark:bg-bgc-dark  rounded-full ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                        }`}
                >
                    {"<"}
                </div>

                {pageNumbers.map((page, index) => (
                    <div
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={` min-w-[36px] min-h-[36px] flex items-center justify-center dark:text-white  rounded-full cursor-pointer border border-border/70 dark:border-border-dark/70 hover:bg-white hover:dark:bg-bgc-dark   ${currentPage === page
                            ? "pointer-events-none !bg-bgc2 dark:!bg-bgc2 hover:!bg-bgc2 text-white"
                            : ""
                            }`}
                    >
                        {page}
                    </div>
                ))}

                <div
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`cursor-pointer border border-border/70 dark:border-border-dark/70 min-w-[36px] min-h-[36px] flex items-center justify-center hover:bg-white hover:dark:bg-bgc-dark  rounded-full  ${currentPage === JSON.parse(JSON.stringify(pageNumbers)).pop()
                        ? "pointer-events-none opacity-50"
                        : ""
                        }`}
                >
                    {">"}
                </div>
            </div>
        </div>
    );
};

export default Pagination;

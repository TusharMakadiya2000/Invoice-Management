type RequestType = {
    rowCount?: number;
    columnCount?: number;
};
const GridSkeleton: React.FC<RequestType> = ({
    rowCount = 3,
    columnCount = 4,
}) => {
    const skeletonCards = Array.from(Array(columnCount * rowCount).keys());

    return (
        <>
            {skeletonCards.map((index: number) => (
                <div
                    key={"skeleton_" + index}
                    className="flex md:flex-col rounded-md overflow-hidden shadow-md w-full bg-bgc dark:bg-bgc-dark"
                >
                    <div className="flex justify-center items-center bg-primary h-full w-[195px] md:w-auto md:h-32 animate-pulse"></div>
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex flex-col gap-1 p-2 pb-0">
                            <h3 className="">
                                <div className="p-[10px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                            </h3>
                            <div>
                                <div className="">
                                    <div className="p-[5px] my-[5px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                                </div>
                                <div className="">
                                    <div className="p-[5px] my-[5px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                                </div>
                                <div className=" opacity-80">
                                    <div className="p-[5px] my-[5px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                                </div>
                                <div className=" font-bold">
                                    <div className="p-[5px] my-[5px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-border dark:border-border-dark p-2">
                            <div className="p-[5px] my-[5px] bg-fgc/50 dark:bg-fgc-dark/50 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}

            {/* <tr>
                <td colSpan={columnCount}>
                    <div className="flex w-full flex-1 flex-col">
                        <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl">
                            <div className="flex flex-col divide-y divide-border dark:divide-border-dark">
                                {skeletonCards.map((index: number) => (
                                    <div
                                        key={"skeleton_" + index}
                                        className="p-[20px] w-full bg-bgc/50 dark:bg-bgc-dark/50"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </td>
            </tr> */}
        </>
    );
};

export default GridSkeleton;

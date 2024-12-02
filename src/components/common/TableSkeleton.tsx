type RequestType = {
  rowCount?: number;
  columnCount?: number;
};
const TableSkeleton: React.FC<RequestType> = ({
  rowCount = 10,
  columnCount = 5,
}) => {
  const skeletonCards = Array.from(Array(rowCount).keys());

  return (
    <tr>
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
    </tr>
  );
};

export default TableSkeleton;

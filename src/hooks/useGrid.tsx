import { useCallback, useEffect, useState } from "react";

type AboutBoxType<T> = { size: string; states: Record<number, T> };

type UseGridType<T = "WALL" | "VISITED" | "NOT_VISITED" | "CHOOSEN"> = {
  rows: number;
  columns: number;
  aboutBox: AboutBoxType<T>;
};

const UseGrid = <T,>(
  { rows, columns, aboutBox }: UseGridType<T>,
  animationTime: number
) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedRowCol, setSelectedRowCol] = useState<Map<string, T>>(
    new Map()
  );

  const { size } = aboutBox;

  useEffect(() => {
    const initialGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 0)
    );
    setGrid(initialGrid);
  }, []);

  const updateBoxHandler = (
    state: T,
    selectedRow: number,
    selectedColumn: number
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const selectedBox = `${selectedRow}-${selectedColumn}`;
        setSelectedRowCol((prevMap) => prevMap.set(selectedBox, state));
        resolve(null);
      }, animationTime);
    });
  };

  const renderGrid = useCallback(() => {
    return grid.map((row, i) => (
      <div key={i} className="flex">
        {row.map((_, j) => (
          <div
            key={j}
            className={`w-[${size}px] h-[${size}px] border border-gray-300`}
          ></div>
        ))}
      </div>
    ));
  }, [selectedRowCol]);

  return {
    renderGrid,
    updateBoxHandler,
  };
};

export default UseGrid;

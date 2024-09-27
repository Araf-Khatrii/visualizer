// @refresh reset
import { useCallback, useEffect, useMemo, useState } from "react";

export type BoxState =
  | ""
  | "START"
  | "END"
  | "WALL"
  | "VISITED"
  | "CACHE_VISITED"
  | "NOT_VISITED"
  | "CHOOSEN";

type AboutBoxType<T = BoxState> = {
  colors: Record<BoxState, string>;
};

type UseGridType<T = BoxState> = {
  rows: number;
  aboutBox: AboutBoxType<T>;
};

function UseGrid<T extends BoxState>(
  { rows, aboutBox }: UseGridType<T>,
  memoCb: (map: Map<string, T>) => Map<string, T>,
  animationTime: number
) {
  const columns = Math.floor(800 / 24);
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedRowCol, setSelectedRowCol] = useState<Map<string, T>>(
    new Map()
  );
  const selectedMemo = useMemo(() => {
    const newMap = new Map();
    return memoCb(newMap);
  }, []);
  const [selectedAction, setSelectedAction] = useState<"WALL" | null>(null);
  const [fromBox, setFromBox] = useState<{ active: boolean; place: string }>({
    active: false,
    place: "0-0",
  });
  const [toBox, setToBox] = useState<string>(`${rows - 1}-${columns - 1}`);

  const { colors } = aboutBox;

  useEffect(() => {
    const initialGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => 0)
    );
    setGrid(initialGrid);
    // setSelectedRowCol(() => {
    //   const newMap = new Map();
    //   return newMap;
    // });
  }, []);

  useEffect(() => {
    // const fromBox = document.querySelector(".grid-box.from-box");
    // const toBox = document.querySelector(".grid-box.to-box");
    // window.addEventListener("mousemove", (e) => {
    //   if (!e.target) return;
    //   const gridEl = e.target as HTMLElement;
    //   if (gridEl.closest(".grid-box")) {
    //     console.log(gridEl.dataset);
    //   }
    // });
  }, [grid]);

  const updateBoxHandler = (newMap: Map<string, T>) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSelectedRowCol(newMap);
        resolve(null);
      }, animationTime);
    });
  };

  const renderGrid = useCallback(() => {
    return grid.map((row, i) => (
      <div key={i} className="flex cursor-pointer">
        {row.map((_, j) => {
          const currentBox = `${i}-${j}`;
          const selectedBoxState: BoxState =
            selectedRowCol.get(currentBox) ?? "";
          const selectedColor = colors[selectedBoxState];
          const isFromAndToBox =
            currentBox == fromBox.place
              ? "from-box bg-green-500"
              : currentBox == toBox
              ? "to-box bg-yellow-500"
              : "";

          return (
            <div
              onClick={() =>
                currentBox == fromBox.place &&
                setFromBox({ active: true, place: currentBox })
              }
              data-row-idx={i}
              data-col-idx={j}
              key={`${i}-${j}`}
              className={`${isFromAndToBox} grid-box w-6 h-6 border ${
                selectedBoxState
                  ? selectedColor
                  : "shadow-inner-border shadow-black"
              } ${[fromBox, toBox].includes(currentBox) ? "cursor-move" : ""}`}
            ></div>
          );
        })}
      </div>
    ));
  }, [selectedRowCol, grid]);

  return {
    grid,
    selectedMemo,
    renderGrid,
    updateBoxHandler,
  };
}

export default UseGrid;

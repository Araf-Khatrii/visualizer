import useGrid from "@/hooks/useGrid";
import { FC, useEffect, useMemo, useRef } from "react";

const FindPathTo: FC = () => {
  const { grid, selectedMemo, renderGrid, updateBoxHandler } = useGrid(
    {
      rows: 20,
      aboutBox: {
        colors: {
          START: "bg-green-500",
          END: "bg-sky-500",
          WALL: "bg-black",
          VISITED: "bg-yellow-500",
          NOT_VISITED: "bg-white",
          CHOOSEN: "bg-red-500",
          "": "",
          CACHE_VISITED: "bg-blue-300",
        },
      },
    },
    (map) => {
      const rows = grid.length;
      const columns = grid?.[0]?.length;
      map.set("0-0", "START");
      map.set(`${rows - 1}-${columns - 1}`, "END");
      for (let row = 0; row < rows - 6; row++) {
        map.set(`${row - 3}-16`, "WALL");
        map.set(`${rows - row - 5}-10`, "WALL");
        map.set(`${row}-6`, "WALL");
      }

      for (let col = 10; col < columns; col++) {
        map.set(`10-${col}`, "WALL");
        map.set(`15-${col}`, "WALL");
      }
      updateBoxHandler(map);
      return map;
    },
    0
  );

  const findPath = async (
    row: number,
    col: number,
    count: number
  ): Promise<boolean> => {
    const placeExists = selectedMemo.get(`${row}-${col}`);
    if (placeExists === "END") return true;

    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid[0].length ||
      placeExists === "VISITED" ||
      placeExists === "WALL"
    )
      return false;
    if (placeExists !== "START") selectedMemo.set(`${row}-${col}`, "VISITED");
    await updateBoxHandler(new Map(selectedMemo));
    return (
      (await findPath(row - 1, col, count + 1)) ||
      (await findPath(row, col + 1, count + 1)) ||
      (await findPath(row + 1, col, count + 1)) ||
      (await findPath(row, col - 1, count + 1)) ||
      false
    );
  };

  return (
    <div className="flex gap-4">
      <div>{renderGrid()}</div>
      <button onClick={() => findPath(0, 0, 0)}>Run Algorithm</button>
    </div>
  );
};

export default FindPathTo;

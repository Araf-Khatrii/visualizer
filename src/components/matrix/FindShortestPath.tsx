import useGrid, { BoxState, MapValue } from "@/hooks/useGrid";

const FindShortestPath = () => {
  const { grid, selectedMemo, renderGrid, updateBoxHandler } = useGrid(
    {
      rows: 20,
      aboutBox: {
        colors: {
          START: "bg-green-500",
          END: "bg-yellow-500",
          WALL: "bg-black",
          VISITED: "bg-sky-500",
          NOT_VISITED: "bg-white",
          CHOOSEN: "bg-red-500",
          "": "",
          CACHE_VISITED: "bg-orange-400",
        },
      },
    },
    (map, grid) => {
      const rows = grid.length;
      const columns = grid?.[0]?.length;
      map.set(`${rows - 6}-${columns - 1}`, { state: "END" });
      for (let row = 0; row < rows - 6; row++) {
        map.set(`${row - 3}-16`, { state: "WALL" });
        map.set(`${rows - row - 5}-10`, { state: "WALL" });
        map.set(`${row}-6`, { state: "WALL" });
        map.set(`${row + 8}-2`, { state: "WALL" });
        if (row != 9) map.set(`${row + 8}-8`, { state: "WALL" });
      }
      for (let col = 10; col < columns; col++) {
        map.set(`10-${col + 5}`, { state: "WALL" });
        map.set(`15-${col}`, { state: "WALL" });
      }
      for (let col = 0; col < 4; col++) {
        map.set(`5-${col}`, { state: "WALL" });
      }
      map.set(`0-0`, { state: "START", value: 0 });
      return map;
    },
    0
  );

  const bfs = async (row: number, col: number) => {
    const queue: ({ row: number; col: number } | null)[] = [{ row, col }];
    const visitedPath = new Map(selectedMemo);
    let optimalPath: { path: string; state: "END"; count: number } | null =
      null;
    while (queue.length) {
      const node = queue.shift();
      if (!node) continue;
      const { row, col } = node;
      const rowCol = `${row}-${col}`;
      if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length)
        continue;
      const placeExists: MapValue<BoxState> = visitedPath.get(rowCol) || {
        state: "VISITED",
        value: 0,
      };
      if (placeExists?.state === "END") {
        queue.splice(0, queue.length); // break out of the loop
        optimalPath = {
          path: rowCol,
          state: "END",
          count: placeExists.value ?? 0,
        };
      }
      if (placeExists?.state === "WALL") continue;
      if (placeExists?.state !== "START" && placeExists?.state !== "END") {
        const currentNodeValue = visitedPath.get(rowCol)?.value ?? 0;

        visitedPath.set(rowCol, {
          ...placeExists,
          state: "VISITED",
          value: currentNodeValue,
        });
      }

      const top = `${row - 1}-${col}`;
      const right = `${row}-${col + 1}`;
      const bottom = `${row + 1}-${col}`;
      const left = `${row}-${col - 1}`;
      const visitedStates: BoxState[] = [
        "VISITED",
        "CACHE_VISITED",
        "START",
        "WALL",
      ];
      if (
        !visitedStates.includes(visitedPath.get(top)?.state ?? "") &&
        row - 1 >= 0
      ) {
        const prevState = visitedPath.get(top)?.state ?? "CACHE_VISITED";
        visitedPath.set(top, {
          state: prevState,
          value: (visitedPath.get(rowCol)?.value ?? 0) + 1,
        });
        queue.push({ row: row - 1, col });
      }
      if (
        !visitedStates.includes(visitedPath.get(right)?.state ?? "") &&
        col + 1 < grid[0].length
      ) {
        const prevState = visitedPath.get(right)?.state ?? "CACHE_VISITED";
        visitedPath.set(right, {
          state: prevState,
          value: (visitedPath.get(rowCol)?.value ?? 0) + 1,
        });
        queue.push({ row, col: col + 1 });
      }
      if (
        !visitedStates.includes(visitedPath.get(bottom)?.state ?? "") &&
        row + 1 < grid.length
      ) {
        const prevState = visitedPath.get(bottom)?.state ?? "CACHE_VISITED";
        visitedPath.set(bottom, {
          state: prevState,
          value: (visitedPath.get(rowCol)?.value ?? 0) + 1,
        });
        queue.push({ row: row + 1, col });
      }
      if (
        !visitedStates.includes(visitedPath.get(left)?.state ?? "") &&
        col - 1 >= 0
      ) {
        const prevState = visitedPath.get(left)?.state ?? "CACHE_VISITED";
        visitedPath.set(left, {
          state: prevState,
          value: (visitedPath.get(rowCol)?.value ?? 0) + 1,
        });
        queue.push({ row, col: col - 1 });
      }
      await updateBoxHandler(new Map(visitedPath));
      queue.push(null);
    }

    // backtrack to optimal path and highlight the path
    let currentPath = optimalPath?.path;
    let count = optimalPath?.count ?? 0;
    while (count > 0) {
      const [row, col] = currentPath!.split("-").map(Number);
      const top = `${row - 1}-${col}`;
      const right = `${row}-${col + 1}`;
      const bottom = `${row + 1}-${col}`;
      const left = `${row}-${col - 1}`;
      const topPath = visitedPath.get(top) || { state: "NOT_VISITED" };
      const rightPath = visitedPath.get(right) || { state: "NOT_VISITED" };
      const bottomPath = visitedPath.get(bottom) || { state: "NOT_VISITED" };
      const leftPath = visitedPath.get(left) || { state: "NOT_VISITED" };
      const paths = [topPath, rightPath, bottomPath, leftPath];
      const pathChoosen = paths.findIndex(
        ({ state, value }) =>
          state === "VISITED" && value && value === count - 1
      );
      const options = [top, right, bottom, left];
      if (visitedPath.get(currentPath!)?.state !== "END")
        visitedPath.set(currentPath!, { state: "CHOOSEN" });
      await updateBoxHandler(new Map(visitedPath));
      currentPath = options[pathChoosen];
      count--;
    }
    return false;
  };

  return (
    <div>
      {renderGrid()}
      <button onClick={() => bfs(0, 0)}>Find Shortest Path</button>
    </div>
  );
};

export default FindShortestPath;

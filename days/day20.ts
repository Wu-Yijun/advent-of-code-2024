interface Data {
  map: string[][];
  size: [number, number];
  pos: [number, number];
  target: [number, number];
}

const PARAMS = {
  less: 100,
};

function read(input: string) {
  const data: Data = {
    map: input.trim().split("\n").map((x) => x.trim().split("")),
    size: [0, 0],
    pos: [0, 0],
    target: [0, 0],
  };
  data.size = [data.map.length, data.map[0].length];
  // find S as pos, E as target
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "S") {
        data.pos[0] = x;
        data.pos[1] = y;
      }
      if (data.map[x][y] === "E") {
        data.target = [x, y];
      }
    }
  }
  return data;
}

function dfs(
  data: Data,
  max_time = 10000,
): [number, [[number, number], [number, number]]] {
  const scores = Array.from(
    { length: data.size[0] },
    () => Array.from({ length: data.size[1] }, () => Infinity),
  );
  // [x, y, score]
  const queue = [[data.pos[0], data.pos[1], 0]];
  while (queue.length) {
    const [x, y, score] = queue.shift()!;
    if (data.map[x][y] === "#") {
      // hit walls
      continue;
    }
    if (scores[x][y] <= score || score > max_time) {
      continue;
    }
    scores[x][y] = score;
    // move forward by increasing score by 1
    queue.push([x + 1, y, score + 1]);
    queue.push([x - 1, y, score + 1]);
    queue.push([x, y + 1, score + 1]);
    queue.push([x, y - 1, score + 1]);
  }
  // console.log(scores);
  if (scores[data.target[0]][data.target[1]] === Infinity) {
    return [Infinity, [[0, 0], [0, 0]]];
  }
  const pass = best_path(data, scores);
  return [scores[data.target[0]][data.target[1]], pass];
}

// after dfs, search the decreasing 1 path from end to start
function best_path(
  data: Data,
  score: number[][],
): [[number, number], [number, number]] {
  let [x, y] = data.target;
  let [last_x, last_y] = [x, y];
  const pass: [[number, number], [number, number]] = [[-1, -1], [-1, -1]];
  let skip = false;
  while (score[x][y] > 0) {
    if (data.map[x][y] === "1" || data.map[x][y] === "2") {
      if (!skip) {
        skip = true;
        pass[0] = [last_x, last_y];
      }
    } else if (skip) {
      pass[1] = [x, y];
      skip = false;
    }
    last_x = x;
    last_y = y;
    if (score[x + 1][y] === score[x][y] - 1) {
      x++;
    } else if (score[x - 1][y] === score[x][y] - 1) {
      x--;
    } else if (score[x][y + 1] === score[x][y] - 1) {
      y++;
    } else if (score[x][y - 1] === score[x][y] - 1) {
      y--;
    }
  }
  return pass;
}

function valid(p: [number, number]) {
  return p[0] > 0 && p[1] > 0;
}

export function partOne(input: string) {
  const data = read(input);
  console.log("size", data.size);
  console.log("s", data.pos, "e", data.target);
  console.log(data.map.map((x) => x.join("")).join("\n"));
  const time0 = dfs(data)[0];
  console.log("time0", time0);
  let num = 0;
  for (let x = 1; x < data.size[0] - 1; x++) {
    for (let y = 1; y < data.size[1] - 1; y++) {
      if (data.map[x][y] !== "#") continue;
      data.map[x][y] = "1";
      // if (y + 1 < data.size[1] - 1 && data.map[x][y + 1] === "#") {
      //   data.map[x][y + 1] = "2";
      //   const [time, [p1, p2]] = dfs(data, time0);
      //   data.map[x][y + 1] = "#";
      //   if (time < time0 && valid(p1) && valid(p2)) {
      //     console.log("timY", time0 - time, x, y, p1, p2);
      //     // console.log(data.map.map((x) => x.join("")).join("\n"));
      //     num++;
      //   }
      // }
      // if (x + 1 < data.size[0] - 1 && data.map[x + 1][y] === "#") {
      //   data.map[x + 1][y] = "2";
      //   const [time, [p1, p2]] = dfs(data, time0);
      //   data.map[x + 1][y] = "#";
      //   if (time < time0 && valid(p1) && valid(p2)) {
      //     console.log("timX", time0 - time, x, y, p1, p2);
      //     console.log(data.map.map((x) => x.join("")).join("\n"));
      //     num++;
      //   }
      // }
      const [time, [p1, p2]] = dfs(data, time0);
      // console.log(data.map.map((x) => x.join("")).join("\n"));
      data.map[x][y] = "#";
      if (time < time0 && valid(p1) && valid(p2)) {
        console.log("time", time0 - time, x, y, p1, p2);
        num++;
      }
    }
  }
  console.log(data.map.map((x) => x.join("")).join("\n"));
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  console.log("size", data.size);
  // console.log(data.map.map((x) => x.join("")).join("\n"));
  dfs(data);
  best_path(data);
  let num = 0;
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "O") {
        num++;
      }
    }
  }
  console.log(data.map.map((x) => x.join("")).join("\n"));
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day20.txt`);
  assertEquals(partOne(result1), 0); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day16.txt`);
  assertEquals(partTwo(result1), 45); // Replace null with expected result for Part One
  const result2 = Deno.readTextFileSync(`data/examples/day16.2.txt`);
  assertEquals(partTwo(result2), 64); // Replace null with expected result for Part One
});

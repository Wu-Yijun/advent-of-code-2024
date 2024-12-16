interface Data {
  map: string[][];
  scores: number[][][]; // [x][y][direction]
  size: [number, number];
  pos: [number, number];
  target: [number, number];
}

const LEFT = [0, -1]; // 0
const DOWN = [1, 0]; // 1
const RIGHT = [0, 1]; // 2
const UP = [-1, 0]; // 3
const Directions = [LEFT, DOWN, RIGHT, UP];

function read(input: string) {
  const data: Data = {
    map: input.trim().split("\n").map((x) => x.trim().split("")),
    scores: [],
    size: [0, 0],
    pos: [0, 0],
    target: [0, 0],
  };
  data.size = [data.map.length, data.map[0].length];
  data.scores = Array.from(
    { length: data.size[0] },
    () =>
      Array.from(
        { length: data.size[1] },
        () => Array.from({ length: 4 }, () => Infinity),
      ),
  );
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

function dfs(data: Data) {
  // [x, y, direction, score]
  const queue = [[data.pos[0], data.pos[1], 0, 0]];
  while (queue.length) {
    const [x, y, direction, score] = queue.shift()!;
    if (data.map[x][y] === "#") {
      // hit walls
      continue;
    }
    if (data.scores[x][y][direction] <= score) {
      continue;
    }
    data.scores[x][y][direction] = score;
    // move forward by increasing score by 1
    queue.push([
      x + Directions[direction][0],
      y + Directions[direction][1],
      direction,
      score + 1,
    ]);
    // turn 90 degree by increasing score by 1000
    queue.push([x, y, (direction + 1) % 4, score + 1000]);
    queue.push([x, y, (direction + 3) % 4, score + 1000]);
  }
}

// after dfs, search the single tune decreasing path from end to start
function best_path(data: Data) {
  const queue = [[
    data.target[0],
    data.target[1],
    0,
    data.scores[data.target[0]][data.target[1]][0],
  ]];
  while (queue.length > 0) {
    const [x, y, d, score] = queue.shift()!;
    data.map[x][y] = "O";
    // search for the best direction
    if (data.scores[x][y][(d + 1) % 4] == score - 1000) {
      queue.push([x, y, (d + 1) % 4, score - 1000]);
    }
    if (data.scores[x][y][(d + 3) % 4] == score - 1000) {
      queue.push([x, y, (d + 3) % 4, score - 1000]);
    }
    if (
      data.scores[x - Directions[d][0]][y - Directions[d][1]][d] == score - 1
    ) {
      queue.push([
        x - Directions[d][0],
        y - Directions[d][1],
        d,
        score - 1,
      ]);
    }
  }
}

export function partOne(input: string) {
  const data = read(input);
  console.log("size", data.size);
  console.log(data.map.map((x) => x.join("")).join("\n"));
  dfs(data);
  const best_scores = data.scores[data.target[0]][data.target[1]];
  return best_scores.reduce((a, b) => Math.min(a, b));
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
  const result1 = Deno.readTextFileSync(`data/examples/day16.txt`);
  assertEquals(partOne(result1), 7036); // Replace null with expected result for Part One
  const result2 = Deno.readTextFileSync(`data/examples/day16.2.txt`);
  assertEquals(partOne(result2), 11048); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day16.txt`);
  assertEquals(partTwo(result1), 45); // Replace null with expected result for Part One
  const result2 = Deno.readTextFileSync(`data/examples/day16.2.txt`);
  assertEquals(partTwo(result2), 64); // Replace null with expected result for Part One
});

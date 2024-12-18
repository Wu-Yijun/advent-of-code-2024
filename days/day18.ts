interface Data {
  map: string[][];
  scores: number[][]; // [x][y]
  size: [number, number];
  pos: [number, number];
  target: [number, number];
}

const SIZE = [71, 71, 1024];

function read(input: string) {
  const data: Data = {
    map: Array.from(
      { length: SIZE[0] },
      () => Array.from({ length: SIZE[1] }, (_) => "."),
    ),
    scores: Array.from(
      { length: SIZE[0] },
      () => Array.from({ length: SIZE[1] }, (_) => Infinity),
    ),
    size: [SIZE[0], SIZE[1]],
    pos: [0, 0],
    target: [SIZE[0] - 1, SIZE[1] - 1],
  };
  let i = SIZE[2];
  for (const line of input.trim().split("\n")) {
    if (line.trim().length > 0) {
      if (i-- <= 0) {
        break;
      }
      // console.log("1", line);
      const [y, x] = line.split(",").map(Number);
      data.map[x][y] = "#";
    }
  }
  return data;
}

function dfs(data: Data) {
  // [x, y, score]
  const queue = [[data.pos[0], data.pos[1], 0]];
  while (queue.length) {
    const [x, y, score] = queue.shift()!;
    if (x < 0 || x >= SIZE[0] || y < 0 || y >= SIZE[1]) {
      continue;
    }
    if (data.map[x][y] === "#") {
      // hit walls
      continue;
    }
    if (data.scores[x][y] <= score) {
      continue;
    }
    data.scores[x][y] = score;
    // move forward by increasing score by 1
    queue.push([x + 1, y, score + 1]);
    queue.push([x - 1, y, score + 1]);
    queue.push([x, y + 1, score + 1]);
    queue.push([x, y - 1, score + 1]);
  }
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  console.log(data.map.map((x) => x.join("")).join("\n"));
  dfs(data);
  const score = data.scores[data.target[0]][data.target[1]];
  return score;
}

export function partTwo(input: string) {
  let l = 0, r = 3450;
  while (l + 1 < r) {
    const m = (l + r) >> 1;
    SIZE[2] = m;
    const data = read(input);
    dfs(data);
    const score = data.scores[data.target[0]][data.target[1]];
    if (score === Infinity) {
      r = m;
    } else {
      l = m;
    }
  }
  SIZE[2] = l;
  const data = read(input);
  const [y, x] = input.split("\n")[l].split(",").map(Number);
  data.map[x][y] = "X";
  console.log(data.map.map((x) => x.join("")).join("\n"));
  return input.split("\n")[l].toString();
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  SIZE[0] = 7;
  SIZE[1] = 7;
  SIZE[2] = 12;
  const result = Deno.readTextFileSync(`data/examples/day18.txt`);
  assertEquals(partOne(result), 22); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  SIZE[0] = 7;
  SIZE[1] = 7;
  SIZE[2] = 12;
  const result = Deno.readTextFileSync(`data/examples/day18.txt`);
  assertEquals(partTwo(result), "6,1"); // Replace null with expected result for Part Two
});

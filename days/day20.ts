interface Data {
  map: string[][];
  size: [number, number];
  pos: [number, number];
  target: [number, number];
}

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

function dfs(map: string[][], x: number, y: number) {
  const scores = Array.from(
    { length: map.length },
    () => Array.from({ length: map[0].length }, () => Infinity),
  );
  // [x, y, score]
  const queue = [[x, y, 0]];
  while (queue.length) {
    const [x, y, score] = queue.shift()!;
    if (map[x][y] === "#") {
      // hit walls
      continue;
    }
    if (scores[x][y] <= score) {
      continue;
    }
    scores[x][y] = score;
    // move forward by increasing score by 1
    queue.push([x + 1, y, score + 1]);
    queue.push([x - 1, y, score + 1]);
    queue.push([x, y + 1, score + 1]);
    queue.push([x, y - 1, score + 1]);
  }
  return scores;
}

// return number of possible cheats
function dfs_cheat(
  map: string[][],
  score: number,
  targets: number[][],
  x: number,
  y: number,
  max_step = 20,
) {
  if (map[x][y] === "#") {
    return 0;
  }
  // [x, y, score, step]
  // const queue = [[x, y, score, 0]];
  const queue: [number, number, number, number][] = [];
  if (map[x + 1][y] === "#") queue.push([x + 1, y, score, 0]);
  if (map[x - 1][y] === "#") queue.push([x - 1, y, score, 0]);
  if (map[x][y + 1] === "#") queue.push([x, y + 1, score, 0]);
  if (map[x][y - 1] === "#") queue.push([x, y - 1, score, 0]);

  const size = [map.length, map[0].length];
  const scores = Array.from(
    { length: size[0] },
    () => Array.from({ length: size[1] }, () => Infinity),
  );
  // x << 16 | y
  const valid_pos = new Set<number>();
  while (queue.length > 0) {
    const [x, y, score, step] = queue.shift()!;
    if (x < 0 || x >= size[0] || y < 0 || y >= size[1]) {
      // hit walls
      continue;
    }
    if (step > max_step) {
      continue;
    }
    if (map[x][y] !== "#") {
      // move out
      if (score < targets[x][y]) {
        valid_pos.add(x << 16 | y);
      }
      continue;
    }
    if (scores[x][y] <= score) {
      continue;
    }
    scores[x][y] = score;
    // move forward by increasing score by 1
    queue.push([x + 1, y, score + 1, step + 1]);
    queue.push([x - 1, y, score + 1, step + 1]);
    queue.push([x, y + 1, score + 1, step + 1]);
    queue.push([x, y - 1, score + 1, step + 1]);
  }
  // if (valid_pos.size > 0) {
  //   console.log(
  //     "valid",
  //     x,
  //     y,
  //     score,
  //   );
  //   valid_pos.values().forEach((x) => console.log([x >> 16, x & 0xffff]));
  // }
  return valid_pos.size;
}

export function partOne(input: string, threshold = 100) {
  const data = read(input);
  // console.log("size", data.size);
  // console.log("s", data.pos, "e", data.target);
  // console.log(data.map.map((x) => x.join("")).join("\n"));
  const scores = dfs(data.map, data.pos[0], data.pos[1]);
  const time = scores[data.target[0]][data.target[1]] - threshold;
  const inv_score = dfs(data.map, data.target[0], data.target[1]);
  // const counts = Array.from({ length: 90 }, (_) => 0);
  let num = 0;
  for (let x = 1; x < data.size[0] - 1; x++) {
    for (let y = 1; y < data.size[1] - 1; y++) {
      if (data.map[x][y] !== "#") continue;
      const score = Math.min(
        scores[x][y - 1],
        scores[x][y + 1],
        scores[x - 1][y],
        scores[x + 1][y],
      );
      if (score + inv_score[x + 1][y] + 2 <= time) {
        num += 1;
        // counts[score + inv_score[x + 1][y] + 2] += 1;
        // console.log(score + inv_score[x + 1][y], "x+1", x, y);
      }
      if (score + inv_score[x - 1][y] + 2 <= time) {
        num += 1;
        // counts[score + inv_score[x - 1][y] + 2] += 1;
        // console.log(score + inv_score[x - 1][y], "x-1", x, y);
      }
      if (score + inv_score[x][y + 1] + 2 <= time) {
        num += 1;
        // counts[score + inv_score[x][y + 1] + 2] += 1;
        // console.log(score + inv_score[x][y + 1], "y+1", x, y);
      }
      if (score + inv_score[x][y - 1] + 2 <= time) {
        num += 1;
        // counts[score + inv_score[x][y - 1] + 2] += 1;
        // console.log(score + inv_score[x][y - 1], "y-1", x, y);
      }
    }
  }
  console.log(num);
  // console.log(counts);
  return num;
}

export function partTwo(input: string, threshold = 100, max_step = 19) {
  const data = read(input);
  const scores = dfs(data.map, data.pos[0], data.pos[1]);
  const time = scores[data.target[0]][data.target[1]];
  const target_score = dfs(data.map, data.target[0], data.target[1]);
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (target_score[x][y] !== Infinity) {
        target_score[x][y] = time - target_score[x][y];
      }
    }
  }
  // console.log(
  //   scores.map((x) => x.map((x) => x === Infinity ? -1 : x).join("\t")).join(
  //     "\n",
  //   ),
  // );
  // console.log("target");
  // console.log(
  //   target_score.map((x) => x.map((x) => x === Infinity ? -1 : x).join("\t"))
  //     .join("\n"),
  // );
  let num = 0;
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "#") {
        continue;
      }
      const score = scores[x][y] + threshold - 1;
      const max_step_x = max_step + 1;
      for (let dx = -max_step_x; dx <= max_step_x; dx++) {
        const max_step_y = max_step_x - Math.abs(dx);
        for (let dy = -max_step_y; dy <= max_step_y; dy++) {
          if (
            (x + dx < 0 || x + dx >= data.size[0]) ||
            (y + dy < 0 || y + dy >= data.size[1]) ||
            (dx === 0 && dy === 0) ||
            (data.map[x + dx][y + dy] === "#")
          ) {
            continue;
          }
          const step = Math.abs(dx) + Math.abs(dy);
          if (score + step < target_score[x + dx][y + dy]) {
            num += 1;
          }
        }
      }
    }
  }
  console.log(num);
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day20.txt`);
  assertEquals(partOne(result1, 1), 44); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day20.txt`);
  assertEquals(partTwo(result1, 1, 1), 44); // Replace null with expected result for Part One
  assertEquals(partTwo(result1, 53, 20), 285-32-31); // Replace null with expected result for Part One
  assertEquals(partTwo(result1, 52, 20), 285-32); // Replace null with expected result for Part One
  assertEquals(partTwo(result1, 51, 20), 285-32); // Replace null with expected result for Part One
  assertEquals(partTwo(result1, 50, 20), 285); // Replace null with expected result for Part One
  // 32+31+29+39+25+23+20+19+12+14+12+22+4+3=285
});

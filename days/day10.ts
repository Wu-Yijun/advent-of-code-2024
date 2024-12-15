interface Data {
  map: number[][];
  val: number[][][];
  size: [number, number];
}

function log(data: Data) {
  console.log(data.map.map((line) => line.join("")).join("\n"));
  console.log(data.val.map((line) => line.join(" | ")).join("\n"));
  console.log(data.size);
}

function read(input: string) {
  const map = input.split("\n").filter((line) => line.length > 0).map((line) =>
    line.trim().split("").map((s) => parseInt(s))
  );
  let id = 0;
  const data: Data = {
    map: map,
    // val: map.map((line) => line.map((s) => (0))),
    val: map.map((line) => line.map((s) => (s === 0 ? [id++] : []))),
    size: [map.length, map[0].length],
  };
  return data;
}

function dfs(data: Data) {
  for (let i = 0; i < 9; i++) {
    for (let x = 0; x < data.size[0]; x++) {
      for (let y = 0; y < data.size[1]; y++) {
        if (data.map[x][y] === i + 1) {
          if (x + 1 < data.size[0] && data.map[x + 1][y] === i) {
            data.val[x][y].push(...data.val[x + 1][y]);
          }
          if (x - 1 >= 0 && data.map[x - 1][y] === i) {
            data.val[x][y].push(...data.val[x - 1][y]);
          }
          if (y + 1 < data.size[1] && data.map[x][y + 1] === i) {
            data.val[x][y].push(...data.val[x][y + 1]);
          }
          if (y - 1 >= 0 && data.map[x][y - 1] === i) {
            data.val[x][y].push(...data.val[x][y - 1]);
          }
        }
      }
    }
    // log(data);
  }
}

export function partOne(input: string) {
  const data = read(input);
  // data.val[0][2] = 1;
  // log(data);
  dfs(data);
  let sum = 0;
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === 9) {
        const s: Set<number> = new Set(data.val[x][y]);
        sum += s.size;
      } else {
        data.val[x][y] = [];
      }
    }
  }
  // log(data);
  // console.log(sum);
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  dfs(data);
  let sum = 0;
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === 9) {
        sum += data.val[x][y].length;
      } else {
        data.val[x][y] = [];
      }
    }
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day10.txt`);
  assertEquals(partOne(result), 36); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day10.txt`);
  assertEquals(partTwo(result), 81); // Replace null with expected result for Part Two
});

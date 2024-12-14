interface Data {
  chars: string[][];
}

function read(input: string) {
  const data: Data = {
    chars: input.split("\n").map((line) => line.trim().split("")),
  };
  return data;
}

function search_XMAS(chars: string[][], direction: [number, number]) {
  const size = [chars.length, chars[0].length];
  let num = 0;
  const x_range = [
    Math.max(0, -direction[0] * 3),
    Math.min(size[0], size[0] - direction[0] * 3),
  ];
  const y_range = [
    Math.max(0, -direction[1] * 3),
    Math.min(size[1], size[1] - direction[1] * 3),
  ];
  for (let x = x_range[0]; x < x_range[1]; x++) {
    for (let y = y_range[0]; y < y_range[1]; y++) {
      let i = x;
      let j = y;
      if (chars[i][j] !== "X") continue;
      i += direction[0];
      j += direction[1];
      if (chars[i][j] !== "M") continue;
      i += direction[0];
      j += direction[1];
      if (chars[i][j] !== "A") continue;
      i += direction[0];
      j += direction[1];
      if (chars[i][j] !== "S") continue;
      // find a XMAS
      num += 1;
    }
  }
  return num;
}

// A at center, M at top left as direction,
function search_X_MAS(chars: string[][], direction: [number, number]) {
  const size = [chars.length, chars[0].length];
  let num = 0;
  for (let i = 1; i < size[0] - 1; i++) {
    for (let j = 0; j < size[1] - 1; j++) {
      if (chars[i][j] !== "A") continue;
      if (chars[i + direction[0]][j + direction[1]] !== "S") continue;
      if (chars[i + direction[1]][j - direction[0]] !== "S") continue;
      if (chars[i - direction[0]][j - direction[1]] !== "M") continue;
      if (chars[i - direction[1]][j + direction[0]] !== "M") continue;
      // find a XMAS
      num += 1;
    }
  }
  return num;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  let num = 0;
  num += search_XMAS(data.chars, [0, 1]);
  num += search_XMAS(data.chars, [1, 0]);
  num += search_XMAS(data.chars, [0, -1]);
  num += search_XMAS(data.chars, [-1, 0]);
  num += search_XMAS(data.chars, [1, 1]);
  num += search_XMAS(data.chars, [1, -1]);
  num += search_XMAS(data.chars, [-1, -1]);
  num += search_XMAS(data.chars, [-1, 1]);
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data);
  let num = 0;
  num += search_X_MAS(data.chars, [1, 1]);
  num += search_X_MAS(data.chars, [1, -1]);
  num += search_X_MAS(data.chars, [-1, -1]);
  num += search_X_MAS(data.chars, [-1, 1]);
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day04.txt`);
  assertEquals(partOne(result), 18); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day04.txt`);
  assertEquals(partTwo(result), 9); // Replace null with expected result for Part Two
});

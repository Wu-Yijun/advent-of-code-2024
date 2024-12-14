interface Data {
  levels: number[];
}

function read(input: string) {
  const data: Data[] = [];
  const lines = input.split("\n");
  for (const line of lines) {
    if (line.trim() === "") {
      continue;
    }
    const parts = line.split(" ");
    const levels = parts.map((part) => parseInt(part));
    if (levels.length > 0) {
      data.push({ levels });
    }
  }
  return data;
}

function is_safe(levels: number[]): boolean {
  let min = 1;
  let max = 3;
  if (levels.length <= 1) {
    return true;
  } else if (levels[0] > levels[1]) {
    min = -3;
    max = -1;
  }
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];
    if (diff < min || diff > max) {
      // not safe
      return false;
    }
  }
  return true;
}

export function partOne(input: string) {
  const reports = read(input);
  // console.log(data);
  // count safe levels num
  let num = 0;
  for (const report of reports) {
    if (is_safe(report.levels)) {
      num++;
    }
  }
  return num;
}

export function partTwo(input: string) {
  const reports = read(input);
  // console.log(data);
  // count safe levels num
  let num = 0;
  for (const report of reports) {
    for (let i = 0; i < report.levels.length; i++) {
      const spliced = Array.from(report.levels);
      spliced.splice(i, 1);
      if (is_safe(spliced)) {
        num++;
        // console.log(spliced, i);
        break;
      }
    }
  }
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day02.txt`);
  assertEquals(partOne(result), 2); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day02.txt`);
  assertEquals(partTwo(result), 4); // Replace null with expected result for Part Two
});

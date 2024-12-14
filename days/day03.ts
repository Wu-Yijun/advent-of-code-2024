interface Data {
  mul: [number, number][];
}

function read(input: string) {
  const data: Data = {
    mul: [],
  };
  const regex = /mul\((\-?\d+),(\-?\d+)\)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    const values = match.slice(1, 3).map(Number);
    data.mul.push(values as [number, number]);
  }
  return data;
}
function read2(input: string) {
  const data: Data = {
    mul: [],
  };
  let enabled = true;
  const regex = /do\(\)|don't\(\)|mul\((\-?\d+),(\-?\d+)\)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    if (match[0] === "do()") {
      enabled = true;
    } else if (match[0] === "don't()") {
      enabled = false;
    } else if (enabled) {
      const values = match.slice(1, 3).map(Number);
      data.mul.push(values as [number, number]);
    }
  }
  return data;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  // count sum of mul
  let sum = 0;
  for (const [a, b] of data.mul) {
    sum += a * b;
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read2(input);
  // console.log(data);
  let sum = 0;
  for (const [a, b] of data.mul) {
    sum += a * b;
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day03.txt`);
  assertEquals(partOne(result), 161); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day03.txt`);
  assertEquals(partTwo(result), 48); // Replace null with expected result for Part Two
});

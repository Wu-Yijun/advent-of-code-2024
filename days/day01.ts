interface Data {
  left: number[];
  right: number[];
}

function read(input: string) {
  const data: Data = {
    left: [],
    right: [],
  };
  const regex = /(\-?\d+)\s+(\-?\d+)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    const values = match.slice(1, 3).map(Number);
    data.left.push(values[0]);
    data.right.push(values[1]);
  }
  return data;
}

export function partOne(input: string) {
  const data = read(input);
  data.left.sort((a, b) => a - b);
  data.right.sort((a, b) => a - b);
  // console.log(data);
  // calculate the sum of abs diff between left and right
  let sum = 0;
  for (let i = 0; i < data.left.length; i++) {
    sum += Math.abs(data.left[i] - data.right[i]);
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  // id -> number of appear
  const left: Map<number, number> = new Map();
  const right: Map<number, number> = new Map();
  for (const num of data.left) {
    left.set(num, (left.get(num) || 0) + 1);
  }
  for (const num of data.right) {
    right.set(num, (right.get(num) || 0) + 1);
  }
  console.log(left, right);
  // calculate the sum of the product of the number of appear of each number
  let sum = 0;
  for (const [num, appear] of left) {
    sum += num * appear * (right.get(num) || 0);
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day01.txt`);
  // assertEquals(partOne(result), null); // Replace null with expected result for Part One
  assertEquals(partOne(result), 11); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day01.txt`);
  assertEquals(partTwo(result), 31); // Replace null with expected result for Part Two
});

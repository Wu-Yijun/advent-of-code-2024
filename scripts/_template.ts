// deno-lint-ignore no-empty-interface
interface Data {
  // fill here
}

function read(input: string) {
  const data: Data = {};
  const regex = /(\-?\d+)\s(\-?\d+)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    const values = match.slice(1, 3).map(Number);
  }
  return data;
}

export function partOne(input: string) {
  const _data = read(input);
  // TODO: Implement part one logic here
  return null;
}

export function partTwo(input: string) {
  const _data = read(input);
  // TODO: Implement part two logic here
  return null;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day%DAY_NUMBER%.txt`);
  assertEquals(partOne(result), null); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day%DAY_NUMBER%.txt`);
  assertEquals(partTwo(result), null); // Replace null with expected result for Part Two
});

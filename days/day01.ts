export function partOne(_input: string) {
  // TODO: Implement part one logic here
  return null;
}

export function partTwo(_input: string) {
  // TODO: Implement part two logic here
  return null;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day01.txt`);
  assertEquals(partOne(result), null); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day01.txt`);
  assertEquals(partTwo(result), null); // Replace null with expected result for Part Two
});

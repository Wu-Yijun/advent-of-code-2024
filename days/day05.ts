interface Data {
  map_rev: Map<number, number[]>;
  sets: Set<number>;
  updates: number[][];
}

function read(input: string) {
  const [rules, updates] = input.split("\n\n");
  const data: Data = {
    map_rev: new Map(),
    sets: new Set(),
    updates: updates.split("\n").filter((line) => line.trim().length > 0).map(
      (line) => line.split(",").map(Number),
    ),
  };
  const regex = /(\-?\d+)\|(\-?\d+)/g;
  let match;
  while ((match = regex.exec(rules)) !== null) {
    // console.log(match);
    const values = match.slice(1, 3).map(Number);
    data.sets.add(values[0] * 10000 + values[1]);
    if (!data.map_rev.has(values[1])) {
      data.map_rev.set(values[1], [values[0]]);
    } else {
      data.map_rev.get(values[1])!.push(values[0]);
    }
  }
  return data;
}

function can_update(maps: Map<number, number[]>, update: number[]) {
  const forbidden = new Set<number>();
  for (const value of update) {
    if (forbidden.has(value)) {
      return false;
    }
    if (maps.has(value)) {
      for (const rule of maps.get(value)!) {
        forbidden.add(rule);
      }
    }
  }
  return true;
}

function sort_update_sets(sets: Set<number>, update: number[]) {
  console.log(sets);
  update.sort((a, b) => {
    if (sets.has(a * 10000 + b)) {
      return -1;
    } else if (sets.has(b * 10000 + a)) {
      return 1;
    } else {
      console.error(a, b, "Is not find");
      return 0;
      // throw new Error("Could not find!!!");
    }
  });
  // return update;
}

export function partOne(input: string) {
  const data = read(input);
  console.log(data);
  // let num = 0;
  let sum = 0;
  for (const update of data.updates) {
    if (can_update(data.map_rev, update)) {
      // num++;
      // console.log(update);
      sum += update[(update.length - 1) / 2];
    }
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data);

  let sum = 0;
  for (const update of data.updates) {
    if (!can_update(data.map_rev, update)) {
      sort_update_sets(data.sets, update);
      // console.log(update);
      sum += update[(update.length - 1) / 2];
    }
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  // notice you may need to change the example txt to LF if you are on Windows
  const result = Deno.readTextFileSync(`data/examples/day05.txt`);
  assertEquals(partOne(result), 143); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day05.txt`);
  assertEquals(partTwo(result), 123); // Replace null with expected result for Part Two
});

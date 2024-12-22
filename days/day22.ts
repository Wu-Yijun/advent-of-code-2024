interface Data {
  numbers: number[];
}

function read(input: string) {
  return { numbers: input.trim().split("\n").map(Number) };
}

function mix(v1: number, v2: number) {
  const hi = 0x80000000;
  const low = 0x7fffffff;
  const hi1 = ~~(v1 / hi);
  const hi2 = ~~(v2 / hi);
  const low1 = v1 & low;
  const low2 = v2 & low;
  const h = hi1 ^ hi2;
  const l = low1 ^ low2;
  return h * hi + l;
}

function prune(a: number) {
  return a % 16777216;
}

function next(a: number): number {
  const b = prune(mix(a, a * 64));
  const c = prune(mix(b, Math.floor(b / 32)));
  const d = prune(mix(c, c * 2048));
  return d;
}

export function partOne(input: string) {
  const data = read(input);
  console.log(data);
  let sum = 0;
  for (let a of data.numbers) {
    for (let b = 0; b < 2000; b++) {
      a = next(a);
    }
    sum += a;
  }
  return sum;
}

function get_seq(input: number): number[][] {
  const seq = [];
  const val = [];
  let last = input;
  for (let i = 0; i < 2000; i++) {
    const now = next(last);
    seq.push((now % 10) - (last % 10));
    val.push(now % 10);
    last = now;
  }
  return [seq, val];
}

function to_num(list: number[], pos: number) {
  return (list[pos] + 10) + 20 * (list[pos + 1] + 10) +
    400 * (list[pos + 2] + 10) + 8000 * (list[pos + 3] + 10);
}
function to_list(num: number) {
  const list = [];
  for (let i = 0; i < 4; i++) {
    list.push(num % 20 - 10);
    num = Math.floor(num / 20);
  }
  return list;
}

function construct_map(seq: number[][]): Map<number, number> {
  const map = new Map<number, number>();
  for (let i = 0; i < seq[0].length - 4; i++) {
    const key = to_num(seq[0], i);
    const value = seq[1][i + 3];
    if (!map.has(key)) {
      map.set(key, value);
    }
  }
  return map;
}

function get_sum(maps: Map<number, number>[], test_key: number): number {
  let sum = 0;
  for (const map of maps) {
    if (map.has(test_key)) {
      sum += map.get(test_key)!;
    }
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  const maps = data.numbers.map((x) => construct_map(get_seq(x)));
  let max = 0;
  let max_key = 0;
  for (let i = 0; i < 160000; i++) {
    const sum = get_sum(maps, i);
    if (sum > max) {
      max = sum;
      max_key = i;
      console.log(max, to_list(max_key));
    }
  }
  return max;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day22.txt`);
  assertEquals(partOne(result), 37327623); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day22.2.txt`);
  assertEquals(partTwo(result), 23); // Replace null with expected result for Part Two
});

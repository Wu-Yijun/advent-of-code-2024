interface Data {
  stones: bigint[];
}

class DFS {
  private visited: Map<string, bigint> = new Map();
  constructor() {}
  public get_num(stone: bigint, blink_num: number): bigint {
    if (blink_num == 0) {
      return BigInt(1);
    }
    const s = stone.toString();
    const key = `${s}_${blink_num}`;
    if (this.visited.has(key)) {
      return this.visited.get(key)!;
    } else {
      let res = BigInt(0);
      if (s === "0") {
        res += this.get_num(BigInt(1), blink_num - 1);
      } else if (s.length % 2 == 0) {
        res += this.get_num(BigInt(s.slice(0, s.length / 2)), blink_num - 1);
        res += this.get_num(BigInt(s.slice(s.length / 2)), blink_num - 1);
      } else {
        res += this.get_num(stone * BigInt(2024), blink_num - 1);
      }
      this.visited.set(key, res);
      return res;
    }
  }
}

function read(input: string) {
  const data: Data = {
    stones: input.trim().split(" ").map((x) => BigInt(x)),
  };
  return data;
}

function blink(stones: bigint[]): bigint[] {
  const res: bigint[] = [];
  for (const stone of stones) {
    const s = stone.toString();
    if (stone === BigInt(0)) {
      res.push(BigInt(1));
    } else if (s.length % 2 == 0) {
      res.push(BigInt(s.slice(0, s.length / 2)));
      res.push(BigInt(s.slice(s.length / 2)));
    } else {
      res.push(stone * BigInt(2024));
    }
  }
  return res;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  let stones = data.stones;
  for (let i = 0; i < 25; i++) {
    stones = blink(stones);
    // console.log(stones);
  }
  return stones.length;
}

export function partTwo(input: string, blink_num = 75) {
  const data = read(input);
  let sum = BigInt(0);
  const dfs = new DFS();
  for(const stone of data.stones) {
    sum += dfs.get_num(stone, blink_num);
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day11.txt`);
  assertEquals(partOne(result), 55312); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day11.txt`);
  assertEquals(partTwo("125 17", 6), BigInt(22)); // Replace null with expected result for Part Two
  assertEquals(partTwo("125 17", 25), BigInt(55312)); // Replace null with expected result for Part Two
});

Deno.test("Test dfs", () => {
  console.log(new DFS().get_num(BigInt(1), 75));
});

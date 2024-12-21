interface Data {
  map: number[][];
}

function read(input: string) {
  const data: Data = {
    map: input.trim().split("\n").map((x) =>
      x.trim().split("").map((d) => parseInt(d, 16))
    ),
  };
  return data;
}

const DigitPos = [
  [3, 1], // 0
  [2, 0], // 1
  [2, 1], // 2
  [2, 2], // 3
  [1, 0], // 4
  [1, 1], // 5
  [1, 2], // 6
  [0, 0], // 7
  [0, 1], // 8
  [0, 2], // 9
  [3, 2], // A
];
const DigitChars = "0123456789A";
const DigitX = [3, 0];

const DirectionPos = [
  [0, 2], // A
  [0, 1], // up
  [1, 1], // down
  [1, 0], // left
  [1, 2], // right
];
const DirectionX = [0, 0];
const DirectionChars = ["A", "^", "v", "<", ">"];
const D = {
  A: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4,
};

function repeat(num: number, times: number): number[] {
  return Array.from({ length: times }, () => num);
}

const DFS = new Map<string, number>();
function to_string(order: number, arr: number[]): string {
  return `${order}${arr.map((x) => DirectionChars[x]).join("")}`;
}
function dfs(order: number, arr: number[]): number {
  if (order === 0) return arr.length;
  const key = to_string(order, arr);
  if (DFS.has(key)) {
    return DFS.get(key)!;
  }
  const score = get_min_scores(
    (a) => dfs(order - 1, a),
    DirectionPos,
    DirectionX,
    DirectionPos[D.A],
    arr,
  );
  DFS.set(key, score);
  return score;
}

/**
 * @description Recursion function to calculate min score
 *
 * @param RecursionCall used to calculate min sub scores
 * @param PosMap arr number to position mapping
 * @param XPos the position of X
 * @param Pos0 the initial position
 * @param arr the directions to move
 * @returns the min score of full path
 */
function get_min_scores(
  RecursionCall: (arr: number[]) => number,
  PosMap: number[][],
  XPos: number[],
  Pos0: number[],
  arr: number[],
): number {
  let score = 0;
  let pos = [Pos0[0], Pos0[1]];
  for (let i = 0; i < arr.length; i++) {
    const dir = arr[i];
    const [x, y] = PosMap[dir];
    const move_x = repeat(
      x - pos[0] > 0 ? D.DOWN : D.UP,
      Math.abs(x - pos[0]),
    );
    const move_y = repeat(
      y - pos[1] > 0 ? D.RIGHT : D.LEFT,
      Math.abs(y - pos[1]),
    );
    let score1 = Infinity;
    let score2 = Infinity;
    if (pos[1] !== XPos[1] || x !== XPos[0]) {
      // move x, move y
      score1 = RecursionCall([...move_x, ...move_y, D.A]);
    }
    if (pos[0] !== XPos[0] || y !== XPos[1]) {
      // move y, move x
      score2 = RecursionCall([...move_y, ...move_x, D.A]);
    }
    score += Math.min(score1, score2);
    pos = [x, y];
  }
  return score;
}

function solve_with_order(order: number, data: Data): number {
  let sum = 0;
  for (const item of data.map) {
    const score = get_min_scores(
      (arr) => dfs(order, arr),
      DigitPos,
      DigitX,
      DigitPos[10],
      item,
    );
    const str = item.map((d) => DigitChars[d]).join("");
    const val = parseInt(str.slice(0, str.length - 1), 10);
    console.log(str, val, score);
    sum += val * score;
  }
  return sum;
}

export function partOne(input: string) {
  const data = read(input);
  const res = solve_with_order(2, data);
  console.log(res);
  return res;
}

export function partTwo(input: string) {
  const data = read(input);
  const res = solve_with_order(25, data);
  console.log(res);
  return res;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day21.txt`);
  // Data.list = Data.list_example;
  assertEquals(partOne(result), 126384); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day21.txt`);
  assertEquals(partTwo(result), 154115708116294); // Replace null with expected result for Part Two
});

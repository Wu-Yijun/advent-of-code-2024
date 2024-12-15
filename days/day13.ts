interface Data {
  ax: number;
  ay: number;
  bx: number;
  by: number;
  rx: number;
  ry: number;
}

function read(input: string) {
  const data: Data[] = [];
  const regex =
    /Button A: X\+(\d+), Y\+(\d+)\nButton B: X\+(\d+), Y\+(\d+)\nPrize: X=(\d+), Y=(\d+)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    const [ax, ay, bx, by, rx, ry] = match.slice(1, 1 + 6).map(Number);
    data.push({ ax, ay, bx, by, rx, ry });
  }
  return data;
}

function _findMinimalSolution_old(a: number, b: number, c: number) {
  let minSum = Infinity;
  let bestX = -1;
  let bestY = -1;
  for (let x = 1; x <= Math.min(c / a, 100); x++) {
    const remainder = c - a * x;
    if (remainder > 0 && remainder % b === 0) {
      const y = remainder / b;
      if (y > 0 && 3 * x + y < minSum) {
        minSum = 3 * x + y;
        bestX = x;
        bestY = y;
      }
    }
  }
  return bestX !== -1 ? [bestX, bestY] : "Indeterminate without solution";
}

function extendedGCD(a: number, b: number): [number, number, number] {
  let old_r = a, r = b;
  let old_s = 1, s = 0;
  let old_t = 0, t = 1;

  while (r !== 0) {
    const quotient = Math.floor(old_r / r);
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
    [old_t, t] = [t, old_t - quotient * t];
  }

  return [old_r, old_s, old_t]; // 返回 gcd 和系数 s, t
}

// 求解 ax + by = c 的正整数解，最小化 3x + y
function findMinimalSolution(a: number, b: number, c: number) {
  const [gcd, x0, y0] = extendedGCD(a, b);
  // c is not divided by gcd(a, b)
  if (c % gcd !== 0) return "Indeterminate without solution";
  // scale x,y
  const scale = c / gcd;
  const x = x0 * scale;
  const y = y0 * scale;
  // get steps, solution is x = x + stepX * t, y = y - stepY * t
  const stepX = b / gcd;
  const stepY = a / gcd;
  // get t range
  const tMin = Math.ceil(-x / stepX); // when x > 0
  const tMax = Math.floor(y / stepY); // when y > 0
  // letting 3x + y minimal
  const bestT = 3 * b > a ? tMin : tMax;
  return [x + stepX * bestT, y - stepY * bestT];
}

// solve (a, b) from a * ax + b * bx = rx && a * ay + b * by = ry
function solve(data: Data) {
  // classify to indeterminate equation, inequality, determined equation
  // and solve them separately
  // indeterminate equation when ax : bx = ay : by, also could be inequality
  // determined equation when ax : bx != ay : by
  if (data.ax * data.by == data.ay * data.bx) {
    if (data.ax * data.ry == data.ay * data.rx) {
      return findMinimalSolution(data.ax, data.bx, data.rx);
    } else {
      return "Inequality";
    }
  } else {
    // solve determined equation
    const a = (data.rx * data.by - data.ry * data.bx) /
      (data.ax * data.by - data.ay * data.bx);
    const b = (data.rx * data.ay - data.ry * data.ax) /
      (data.bx * data.ay - data.by * data.ax);
    return [a, b];
  }
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  let sum = 0;
  for (const equ of data) {
    const res = solve(equ);
    console.log(res);
    if (Array.isArray(res)) {
      if (Number.isInteger(res[0]) && Number.isInteger(res[1])) {
        if (res[0] > 0 && res[1] > 0) {
          sum += res[0] * 3 + res[1];
        }
      }
    }
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  let sum = 0;
  for (const equ of data) {
    equ.rx += 10000000000000;
    equ.ry += 10000000000000;
    const res = solve(equ);
    console.log(res);
    if (Array.isArray(res)) {
      if (Number.isInteger(res[0]) && Number.isInteger(res[1])) {
        if (res[0] > 0 && res[1] > 0) {
          sum += res[0] * 3 + res[1];
        }
      }
    }
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day13.txt`);
  assertEquals(partOne(result), 480); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day13.txt`);
  assertEquals(partTwo(result), 875318608908); // Replace null with expected result for Part Two
});

interface Data {
  result: number;
  params: number[];
}

function read(input: string) {
  const data: Data[] = [];
  const lines = input.split("\n").filter((line) => line.length > 0);
  for (let i = 0; i < lines.length; i++) {
    const [[result], params] = lines[i].split(": ").map((values) =>
      values.split(" ").map((p) => parseInt(p))
    );
    data.push({ result, params });
  }
  return data;
}

const OPERATORS = {
  add: true,
  multiply: true,
  join: false,
};

function test_operator(
  result: number,
  params: number[],
  length: number,
): string | null {
  if (length === 1) {
    if (params[0] === result) {
      return "";
    } else {
      return null;
    }
  }
  length -= 1;
  if (OPERATORS.join) {
    // try join (concat numbers)
    const val = result.toString();
    const p = params[length].toString();
    if (val.length > p.length && val.endsWith(p)) {
      const res = test_operator(
        parseInt(val.substring(0, val.length - p.length)),
        params,
        length,
      );
      if (res !== null) {
        return "|" + res;
      }
    }
  }
  if (OPERATORS.add && result % params[length] === 0) {
    // try multiply
    const res = test_operator(result / params[length], params, length);
    if (res !== null) {
      return "*" + res;
    }
  }
  if (OPERATORS.add && result - params[length] >= 0) {
    // try add
    const res = test_operator(result - params[length], params, length);
    if (res !== null) {
      return "+" + res;
    }
  }
  return null;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  let sum = 0;
  for (const d of data) {
    const res = test_operator(d.result, d.params, d.params.length);
    if (res !== null) {
      sum += d.result;
      // console.log(d, res);
    }
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data);
  OPERATORS.join = true;
  let sum = 0;
  for (const d of data) {
    const res = test_operator(d.result, d.params, d.params.length);
    if (res !== null) {
      sum += d.result;
      // console.log(d, res);
    }
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day07.txt`);
  assertEquals(partOne(result), 3749); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day07.txt`);
  assertEquals(partTwo(result), 11387); // Replace null with expected result for Part Two
});

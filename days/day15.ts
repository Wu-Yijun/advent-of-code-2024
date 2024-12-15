interface Data {
  map: string[][];
  size: [number, number];
  pos: [number, number];
  directions: [number, number][];
}

function read2(input: string) {
  const [map, moves] = input.trim().split("\n\n");
  const data: Data = {
    map: map.split("\n").map((x) =>
      x.trim().split("").map((c) => {
        switch (c) {
          case "#":
            return ["#", "#"];
          case ".":
            return [".", "."];
          case "@":
            return ["@", "."];
          case "O":
            return ["[", "]"];
          default:
            return [".", "."];
        }
      }).flat()
    ),
    size: [0, 0],
    pos: [0, 0],
    directions: moves.replaceAll("\n", "").trim().split("").map((x) => {
      switch (x) {
        case ">":
          return [0, 1];
        case "<":
          return [0, -1];
        case "^":
          return [-1, 0];
        case "v":
          return [1, 0];
      }
      return [0, 0];
    }),
  };
  data.size = [data.map.length, data.map[0].length];
  // find @ as pos
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "@") {
        data.pos = [x, y];
        break;
      }
    }
  }
  return data;
}

function read(input: string) {
  const [map, moves] = input.trim().split("\n\n");
  const data: Data = {
    map: map.split("\n").map((x) => x.trim().split("")),
    size: [0, 0],
    pos: [0, 0],
    directions: moves.replaceAll("\n", "").trim().split("").map((x) => {
      switch (x) {
        case ">":
          return [0, 1];
        case "<":
          return [0, -1];
        case "^":
          return [-1, 0];
        case "v":
          return [1, 0];
      }
      return [0, 0];
    }),
  };
  data.size = [data.map.length, data.map[0].length];
  // find @ as pos
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "@") {
        data.pos = [x, y];
        break;
      }
    }
  }
  return data;
}

// return false if can not move
function simulate(
  map: string[][],
  directions: [number, number],
  pos: [number, number],
): boolean {
  let [x, y] = pos;
  while (true) {
    x += directions[0];
    y += directions[1];
    if (map[x][y] === ".") {
      // able to push
      map[x][y] = "O";
      return true;
    }
    if (map[x][y] === "#") {
      // not able to push
      return false;
    }
  }
}

function simulate_y(
  map: string[][],
  dy: number,
  pos: [number, number],
): boolean {
  // alone y, simple
  let y = pos[1];
  let last = ".";
  while (map[pos[0]][y] !== "#" && map[pos[0]][y] !== ".") {
    const a = map[pos[0]][y];
    map[pos[0]][y] = last;
    last = a;
    y += dy;
  }
  if (map[pos[0]][y] === "#") {
    return false;
  } else {
    map[pos[0]][y] = last;
    return true;
  }
}

// can all the boxes be pushed, will break the map
function simulate_x(
  map: string[][],
  dx: number,
  pos: [number, number],
): boolean {
  const [x, y] = pos;
  if (map[x][y] === ".") {
    // able to push
    return true;
  }
  if (map[x][y] === "#") {
    // not able to push
    return false;
  }
  if (map[x][y] === "@") {
    // able to push
    if (simulate_x(map, dx, [x + dx, y])) {
      // able to push
      map[x + dx][y] = "@";
      map[x][y] = ".";
      return true;
    }
  } else if (map[x][y] === "[") {
    // push left box and right box
    if (
      simulate_x(map, dx, [x + dx, y]) && simulate_x(map, dx, [x + dx, y + 1])
    ) {
      // able to push
      map[x + dx][y] = map[x][y];
      map[x + dx][y + 1] = map[x][y + 1];
      map[x][y] = ".";
      map[x][y + 1] = ".";
      return true;
    }
  } else if (map[x][y] === "]") {
    // push left box and right box
    if (
      simulate_x(map, dx, [x + dx, y]) && simulate_x(map, dx, [x + dx, y - 1])
    ) {
      // able to push
      map[x + dx][y] = map[x][y];
      map[x + dx][y - 1] = map[x][y - 1];
      map[x][y] = ".";
      map[x][y - 1] = ".";
      return true;
    }
  }
  return false;
}

function calculate_gps(map: string[][]) {
  let sum = 0;
  for (let x = 0; x < map.length; x++) {
    for (let y = 0; y < map[0].length; y++) {
      if (map[x][y] === "O") {
        sum += x * 100 + y;
      } else if (map[x][y] === "[") {
        sum += x * 100 + y;
      }
    }
  }
  return sum;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  // console.log(data.directions);
  for (const direction of data.directions) {
    if (simulate(data.map, direction, data.pos)) {
      data.map[data.pos[0]][data.pos[1]] = ".";
      data.pos[0] += direction[0];
      data.pos[1] += direction[1];
      data.map[data.pos[0]][data.pos[1]] = "@";
    }
  }
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  return calculate_gps(data.map);
}

export function partTwo(input: string) {
  const data = read2(input);
  for (const direction of data.directions) {
    const map = data.map.map((c) => c.map((s) => s));
    if (direction[0] === 0) {
      if (simulate_y(map, direction[1], data.pos)) {
        data.map = map;
        data.pos[1] += direction[1];
      }
    } else {
      if (simulate_x(map, direction[0], data.pos)) {
        data.map = map;
        data.pos[0] += direction[0];
      }
    }
  }
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  return calculate_gps(data.map);
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day15.txt`);
  assertEquals(partOne(result), 10092); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day15.txt`);
  assertEquals(partTwo(result), 9021); // Replace null with expected result for Part Two
});

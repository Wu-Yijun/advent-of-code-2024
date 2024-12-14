interface Data {
  pos: [number, number];
  size: [number, number];
  map: string[][];
}

function read(input: string) {
  const data: Data = {
    pos: [0, 0],
    size: [0, 0],
    map: input.split("\n").filter((line) => line.length > 0).map((line) =>
      line.trim().split("")
    ),
  };
  data.size = [data.map.length, data.map[0].length];
  // find pos of '^'
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      if (data.map[x][y] === "^") {
        data.pos = [x, y];
        break;
      }
    }
  }
  return data;
}

function patrol(data: Data) {
  let direction = [-1, 0]; // up [-1, 0], right [0, 1], down [1, 0], left [0, -1]
  const pos = [data.pos[0], data.pos[1]];
  while (
    (pos[0] >= 0 && pos[0] < data.size[0]) &&
    (pos[1] >= 0 && pos[1] < data.size[1])
  ) {
    // check if we hit a wall
    if (data.map[pos[0]][pos[1]] === "#") {
      // move back
      pos[0] -= direction[0];
      pos[1] -= direction[1];
      // turn right
      direction = [direction[1], -direction[0]];
    } else {
      // mark current pos
      data.map[pos[0]][pos[1]] = "X";
    }
    // move forward
    pos[0] += direction[0];
    pos[1] += direction[1];
  }
}

// test if we can patrol out of the map
function patrol_test(data: Data, max_steps = 100) {
  let direction = [-1, 0]; // up [-1, 0], right [0, 1], down [1, 0], left [0, -1]
  const pos = [data.pos[0], data.pos[1]];
  while (
    (pos[0] >= 0 && pos[0] < data.size[0]) &&
    (pos[1] >= 0 && pos[1] < data.size[1]) &&
    max_steps > 0
  ) {
    // check if we hit a wall
    if (data.map[pos[0]][pos[1]] === "#") {
      // move back
      pos[0] -= direction[0];
      pos[1] -= direction[1];
      // turn right
      direction = [direction[1], -direction[0]];
    }
    // move forward
    pos[0] += direction[0];
    pos[1] += direction[1];
    max_steps -= 1;
  }
  return max_steps > 0;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  patrol(data);
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  let num = 0;
  for (const line of data.map) {
    for (const c of line) {
      if (c === "X") {
        num += 1;
      }
    }
  }
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  const x_map: Data = {
    pos: [data.pos[0], data.pos[1]],
    size: [data.size[0], data.size[1]],
    map: data.map.map((c) => c.slice()),
  };
  patrol(x_map);
  for (let line = 0; line < x_map.size[0]; line++) {
    for (let column = 0; column < x_map.size[1]; column++) {
      // should not put at the start
      if (x_map.pos[0] === line && x_map.pos[1] === column) continue;
      // on the way
      if (x_map.map[line][column] === "X") {
        data.map[line][column] = "#";
        if (!patrol_test(data, 10000)) {
          data.map[line][column] = "O";
        } else {
          data.map[line][column] = ".";
        }
      }
    }
  }
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  // count the number of O
  let num = 0;
  for (const line of data.map) {
    for (const c of line) {
      if (c === "O") {
        num += 1;
      }
    }
  }
  // console.log(data);
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day06.txt`);
  assertEquals(partOne(result), 41); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day06.txt`);
  assertEquals(partTwo(result), 6); // Replace null with expected result for Part Two
});

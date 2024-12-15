interface Data {
  pos: [number, number];
  velocity: [number, number];
}

// const SIZE = [11, 7];
const SIZE = [101, 103];
const TIME = 100;

function printGrid(robots: Data[]) {
  const grid = Array.from(
    { length: SIZE[1] },
    () => Array.from({ length: SIZE[0] }, () => "."),
  );
  for (const robot of robots) {
    grid[robot.pos[1]][robot.pos[0]] = "#";
  }
  for (const row of grid) {
    console.log(row.join(""));
  }
  console.log();
}

function read(input: string) {
  // read from input and parse the data
  const robots: Data[] = [];
  const regex = /p=(\-?\d+),(\-?\d+) v=(\-?\d+),(\-?\d+)/g;
  let match;
  while ((match = regex.exec(input)) !== null) {
    // console.log(match);
    const values = match.slice(1, 5).map(Number);
    const data: Data = {
      pos: [values[0], values[1]],
      velocity: [
        (values[2] + SIZE[0]) % SIZE[0],
        (values[3] + SIZE[1]) % SIZE[1],
      ],
    };
    robots.push(data);
  }
  return robots;
}

export function partOne(input: string) {
  // read from input and parse the data
  const robots = read(input);
  // console.log(robots);
  // simulate movement after TIME
  for (const robot of robots) {
    robot.pos[0] = (robot.pos[0] + TIME * robot.velocity[0]) % SIZE[0];
    robot.pos[1] = (robot.pos[1] + TIME * robot.velocity[1]) % SIZE[1];
  }
  // printGrid(robots);
  // calculate the num of robots in each quadrant
  // dismiss the robot if it stands on x or y axis
  const quad = [[0, 0], [0, 0]];
  const axis = [(SIZE[0] - 1) / 2, (SIZE[1] - 1) / 2];
  for (const robot of robots) {
    if (robot.pos[0] === axis[0] || robot.pos[1] === axis[1]) {
      continue;
    }
    let i = 0;
    let j = 0;
    if (robot.pos[0] > axis[0]) {
      i = 1;
    }
    if (robot.pos[1] > axis[1]) {
      j = 1;
    }
    quad[i][j]++;
  }
  // console.log(quad);
  // calculate the product of the num of robots in each quadrant
  const result = quad[0][0] * quad[1][0] * quad[0][1] * quad[1][1];
  // console.log(result);
  return result;
}

export function partTwo(input: string) {
  // read from input and parse the data
  const robots = read(input);
  let t = 0;
  let done = false;
  while (!done) {
    t += 1;
    done = true;
    const grid = Array.from(
      { length: SIZE[1] },
      () => Array.from({ length: SIZE[0] }, () => "."),
    );
    for (const robot of robots) {
      robot.pos[0] = (robot.pos[0] + robot.velocity[0]) % SIZE[0];
      robot.pos[1] = (robot.pos[1] + robot.velocity[1]) % SIZE[1];
      if (grid[robot.pos[1]][robot.pos[0]] === "#") {
        // should not overlapped
        done = false;
      } else {
        grid[robot.pos[1]][robot.pos[0]] = "#";
      }
    }
    if (t % 1000 === 0) {
      console.log(`iters: ${t}`);
    }
  }
  printGrid(robots);
  return t;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day14.txt`);
  SIZE[0] = 11;
  SIZE[1] = 7;
  assertEquals(partOne(result), 12); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  // const result = Deno.readTextFileSync(`data/examples/day14.txt`);
  // assertEquals(partTwo(result), null); // Replace null with expected result for Part Two
});

interface Data {
  antennas: Map<string, [number, number][]>;
  map: string[][];
  size: [number, number];
}

function read(input: string) {
  const data: Data = {
    antennas: new Map(),
    map: input.split("\n").filter((line) => line.length > 0).map((line) =>
      line.trim().split("")
    ),
    size: [0, 0],
  };
  data.size = [data.map.length, data.map[0].length];
  // find antennas
  for (let x = 0; x < data.size[0]; x++) {
    for (let y = 0; y < data.size[1]; y++) {
      const antenna = data.map[x][y];
      if (antenna !== "." && antenna !== "#") {
        if (!data.antennas.has(antenna)) {
          data.antennas.set(antenna, [[x, y]]);
        } else {
          data.antennas.get(antenna)!.push([x, y]);
        }
      }
    }
  }
  return data;
}

function add_antinode(
  map: string[][],
  size: [number, number],
  antennas: [number, number][],
) {
  for (let i = 1; i < antennas.length; i++) {
    for (let j = 0; j < i; j++) {
      // let pos1 = 2 * antennas[i] - antennas[j];
      let pos1 = [
        2 * antennas[i][0] - antennas[j][0],
        2 * antennas[i][1] - antennas[j][1],
      ];
      if (
        pos1[0] >= 0 && pos1[0] < size[0] && pos1[1] >= 0 && pos1[1] < size[1]
      ) {
        map[pos1[0]][pos1[1]] = "#";
      }
      // let pos2 = 2 * antennas[j] - antennas[i];
      let pos2 = [
        2 * antennas[j][0] - antennas[i][0],
        2 * antennas[j][1] - antennas[i][1],
      ];
      if (
        pos2[0] >= 0 && pos2[0] < size[0] && pos2[1] >= 0 && pos2[1] < size[1]
      ) {
        map[pos2[0]][pos2[1]] = "#";
      }
    }
  }
}

function add_antinode_all(
  map: string[][],
  size: [number, number],
  antennas: [number, number][],
) {
  for (let i = 1; i < antennas.length; i++) {
    for (let j = 0; j < i; j++) {
      let dx = antennas[i][0] - antennas[j][0];
      let dy = antennas[i][1] - antennas[j][1];
      if (dx < 0) {
        dx = -dx;
        dy = -dy;
      }
      const start = Math.floor(antennas[i][0] / dx);
      const end = Math.floor((size[0] - antennas[i][0] - 1) / dx);
      for (let k = -start; k <= end; k++) {
        const x = antennas[i][0] + k * dx;
        const y = antennas[i][1] + k * dy;
        if (y >= 0 && y < size[1]) {
          map[x][y] = "#";
        }
      }
    }
  }
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data.antennas);
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  for (const [_antenna, positions] of data.antennas) {
    add_antinode(data.map, data.size, positions);
  }
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  let num = 0;
  for (const line of data.map) {
    for (const c of line) {
      if (c === "#") {
        num += 1;
      }
    }
  }
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data.antennas);
  // console.log(data.map.map((c) => c.join("")).join("\n"));
  for (const [_antenna, positions] of data.antennas) {
    add_antinode_all(data.map, data.size, positions);
  }
  console.log(data.map.map((c) => c.join("")).join("\n"));
  let num = 0;
  for (const line of data.map) {
    for (const c of line) {
      if (c === "#") {
        num += 1;
      }
    }
  }
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day08.txt`);
  assertEquals(partOne(result), 14); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day08.txt`);
  assertEquals(partTwo(result), 34); // Replace null with expected result for Part Two
});

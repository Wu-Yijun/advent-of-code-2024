function read(input: string) {
  return input.trim().split("\n").map((line) => line.trim().split(""));
}

function count_area_perimeter(data: string[][], pos: [number, number]) {
  let area = 0, perimeter = 0;
  const char = data[pos[0]][pos[1]];
  const queue = [pos];
  const replaced = [];
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    if (x < 0 || x >= data.length || y < 0 || y >= data[0].length) {
      // Out of bounds
      // console.log('ob: ', x, y);
      perimeter++;
    } else if (data[x][y] !== char && data[x][y] !== "-") {
      // Not the same color
      // console.log('cl: ', data[x][y], x, y);
      perimeter++;
    } else if (data[x][y] === char) {
      // Same color
      area++;
      data[x][y] = "-";
      replaced.push([x, y]);
      queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
  }
  for (const [x, y] of replaced) {
    data[x][y] = ".";
  }
  return [area, perimeter];
}

function count_area_edges(data: string[][], pos: [number, number]) {
  let area = 0;
  const char = data[pos[0]][pos[1]];
  const queue = [[pos[0], pos[1], 0]];
  const replaced = [];
  // four directions
  const edges: [number, number][][] = [[], [], [], []];
  while (queue.length > 0) {
    const [x, y, d] = queue.shift()!;
    if (x < 0 || x >= data.length || y < 0 || y >= data[0].length) {
      // Out of bounds
      // add to edges
      edges[d].push([x, y]);
    } else if (data[x][y] !== char && data[x][y] !== "-") {
      // Not the same color
      edges[d].push([x, y]);
    } else if (data[x][y] === char) {
      // Same color
      area++;
      data[x][y] = "-";
      replaced.push([x, y]);
      queue.push([x + 1, y, 0], [x - 1, y, 1], [x, y + 1, 2], [x, y - 1, 3]);
    }
  }
  for (const [x, y] of replaced) {
    data[x][y] = ".";
  }
  let edge_num = 0;
  edge_num += count_group(edges[0], false);
  edge_num += count_group(edges[1], false);
  edge_num += count_group(edges[2], true);
  edge_num += count_group(edges[3], true);
  return [area, edge_num];
}

function count_group(dots: [number, number][], transpose: boolean): number {
  if (transpose) {
    dots = dots.map((d) => [d[1], d[0]]);
  }
  // sort by [0] then [1]
  dots.sort((a, b) => {
    if (a[0] === b[0]) {
      return a[1] - b[1];
    }
    return a[0] - b[0];
  });
  // console.log(dots);

  let num = 0;
  let last = [-2, -2];
  for (let i = 0; i < dots.length; i++) {
    if (last[0] === dots[i][0] && last[1] + 1 === dots[i][1]) {
      // continuous in the same row
    }else{
      num += 1;
    }
    last = dots[i];
  }
  return num;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data.map((c) => c.join("")).join("\n"));
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] !== ".") {
        const [area, perimeter] = count_area_perimeter(data, [i, j]);
        sum += area * perimeter;
        // console.log(area, perimeter);
        // console.log(data.map((c) => c.join("")).join("\n"));
      }
    }
  }
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data.map((c) => c.join("")).join("\n"));
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (data[i][j] !== ".") {
        const [area, edges] = count_area_edges(data, [i, j]);
        sum += area * edges;
        // console.log(area, edges);
        // console.log(data.map((c) => c.join("")).join("\n"));
      }
    }
  }
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day12.txt`);
  assertEquals(partOne(result1), 140); // Replace null with expected result for Part One
  const result2 = Deno.readTextFileSync(`data/examples/day12.2.txt`);
  assertEquals(partOne(result2), 772); // Replace null with expected result for Part One
  const result3 = Deno.readTextFileSync(`data/examples/day12.3.txt`);
  assertEquals(partOne(result3), 1930); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result1 = Deno.readTextFileSync(`data/examples/day12.txt`);
  assertEquals(partTwo(result1), 80); // Replace null with expected result for Part One
  const result2 = Deno.readTextFileSync(`data/examples/day12.2.txt`);
  assertEquals(partTwo(result2), 436); // Replace null with expected result for Part One
  const result21 = Deno.readTextFileSync(`data/examples/day12.2.b1.txt`);
  assertEquals(partTwo(result21), 236); // Replace null with expected result for Part One
  const result22 = Deno.readTextFileSync(`data/examples/day12.2.b2.txt`);
  assertEquals(partTwo(result22), 368); // Replace null with expected result for Part One
  const result3 = Deno.readTextFileSync(`data/examples/day12.3.txt`);
  assertEquals(partTwo(result3), 1206); // Replace null with expected result for Part One
});

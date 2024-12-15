interface Data {
  files: number[];
  spaces: number[];
  disk_len: number;
}

function read(input: string) {
  const values = input.trim().split("").map((line) => parseInt(line));
  const data: Data = {
    files: Array.from(
      { length: (values.length + 1) / 2 },
      (_, i) => values[i * 2],
    ),
    spaces: Array.from(
      { length: (values.length - 1) / 2 },
      (_, i) => values[i * 2 + 1],
    ),
    disk_len: values.reduce((a, b) => a + b, 0),
  };
  return data;
}

function get_disk(data: Data): number[] {
  const disk = Array.from({ length: data.disk_len }, (_, i) => -1);
  let offset = 0;
  for (let i = 0; i < data.files.length; i++) {
    for (let j = 0; j < data.files[i]; j++) {
      disk[offset + j] = i;
    }
    offset += data.files[i] + data.spaces[i];
  }
  return disk;
}

function move_blocks(disk: number[]) {
  let start = 0;
  let end = disk.length - 1;
  while (start < end) {
    if (disk[start] !== -1) {
      start++;
      continue;
    }
    if (disk[end] === -1) {
      end--;
      continue;
    }
    disk[start] = disk[end];
    disk[end] = -1;
    start++;
    end--;
  }
}

function move_whole_blocks(data: Data) {
  // (id, len) arr
  const disk: [number, number][] = [];
  for (let i = 0; i < data.spaces.length; i++) {
    disk.push([i, data.files[i]]);
    disk.push([-1, data.spaces[i]]);
  }
  disk.push([data.files.length - 1, data.files[data.files.length - 1]]);
  // console.log(disk);
  // move end to the first empty block that is larger
  let index = disk.length - 1;
  let take = disk[index][0];
  while (index > 0) {
    if (disk[index][0] !== take) {
      index--;
      continue;
    }
    const len = disk[index][1];
    for (let j = 0; j < index; j++) {
      if (disk[j][0] == -1 && disk[j][1] >= len) {
        if (disk[j][1] == len) {
          disk[j][0] = disk[index][0];
          disk[index][0] = -1;
        } else {
          disk[j][1] -= len;
          // insert to the room
          disk.splice(j, 0, [disk[index][0], len]);
          index++;
          disk[index][0] = -1;
        }
        // console.log(index, take, j, disk);
        break;
      }
    }
    take--;
    index--;
  }
  return disk;
}

function check_sum(disk: number[]) {
  let sum = 0;
  let i = 0;
  while (disk[i] !== -1) {
    sum += disk[i] * i;
    i++;
  }
  return sum;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  const disk = get_disk(data);
  // console.log(data.disk.map((d) => {
  //   if (d == -1) return ".";
  //   else return d.toString();
  // }).join(""));
  move_blocks(disk);
  // console.log(data.disk.map((d) => {
  //   if (d == -1) return ".";
  //   else return d.toString();
  // }).join(""));
  const sum = check_sum(disk);
  return sum;
}

export function partTwo(input: string) {
  const data = read(input);
  const disk = move_whole_blocks(data);
  // console.log(disk);
  let offset = 0, sum = 0;
  let str = "";
  for (let index = 0; index < disk.length; index++) {
    if (disk[index][0] === -1) {
      offset += disk[index][1];
      str += ".".repeat(disk[index][1]);
      continue;
    }
    for (let i = 0; i < disk[index][1]; i++, offset++) {
      sum += offset * disk[index][0];
      str += disk[index][0].toString();
    }
  }
  // console.log(str);
  return sum;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day09.txt`);
  assertEquals(partOne(result), 1928); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day09.txt`);
  assertEquals(partTwo(result), 2858); // Replace null with expected result for Part Two
});

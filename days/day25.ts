interface Data {
  locks: number[][];
  keys: number[][];
}

function read(input: string) {
  const reps = input.trim().split("\n\n");
  const locks: number[][] = [];
  const keys: number[][] = [];
  reps.forEach((rep) => {
    const is_lock = rep.startsWith("#");
    const lines = rep.trim().split("\n").map((line) => line.split(""));
    const arr = [-1, -1, -1, -1, -1];
    lines.forEach((line) => {
      for (let i = 0; i < 5; i++) {
        if (line[i] === "#") arr[i]++;
      }
    });
    if (is_lock) {
      locks.push(arr);
    } else {
      keys.push(arr);
    }
  });
  return { locks, keys };
}

function sorts(data: Data) {
  data.keys.sort((a, b) => {
    for (let i = 0; i < 5; i++) {
      if (a[i] !== b[i]) {
        return a[i] - b[i];
      }
    }
    return 0;
  });
  data.locks.sort((a, b) => {
    for (let i = 0; i < 5; i++) {
      if (a[i] !== b[i]) {
        return b[i] - a[i];
      }
    }
    return 0;
  });
}

function key_to_str(keys: number[]) {
  return keys.map((key) => key.toString()).join("");
}
function lock_to_str(locks: number[]) {
  return locks.map((lock) => (5 - lock).toString()).join("");
}

function match_keys(data: Data): string[] {
  const keys = data.keys.map((key) => key_to_str(key));
  const locks = new Set(data.locks.map((lock) => lock_to_str(lock)));
  console.log(keys, locks);
  const matched: string[] = [];
  keys.forEach((key) => {
    if (locks.has(key)) {
      matched.push(key);
    }
  });
  return matched;
}

function find_unoverlapped(data: Data) {
  let num = 0;
  for(const lock of data.locks){
    for(const key of data.keys){
      let overlapped = false;
      for(let i=0; i<5; i++){
        if(lock[i] + key[i] > 5){
          overlapped = true;
          // console.log(lock, key, i);
          break;
        }
      }
      if(!overlapped){
        num++;
        // console.log(lock, key,"NOT OVERLAPPED");
      }
    }
  }
  return num;
}

export function partOne(input: string) {
  const data = read(input);
  sorts(data);
  // console.log(data);
  // const matched = match_keys(data);
  // console.log(matched);
  const num = find_unoverlapped(data);
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data);
  return null;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day25.txt`);
  assertEquals(partOne(result), 3); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day25.txt`);
  assertEquals(partTwo(result), null); // Replace null with expected result for Part Two
});

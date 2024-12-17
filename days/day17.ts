interface Data {
  register: number[];
  programs: number[];
  pointer: number;
  outputs: number[];
}

function read(input: string) {
  const data: Data = { register: [], programs: [], pointer: 0, outputs: [] };
  const regex = /: (\d+)/g;
  const [r, p] = input.trim().split("\n\n");
  let match;
  while ((match = regex.exec(r)) !== null) {
    // console.log(match);
    const value = match.slice(1, 3).map(Number);
    data.register.push(value[0]);
  }
  data.programs = p.slice(9).split(",").map(Number);
  return data;
}

function get_combo(data: Data, index: number) {
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      return index;
    default:
      return data.register[index - 4];
  }
}

// return false to halt
function operate(data: Data): boolean {
  if (data.pointer < 0 || data.pointer >= data.programs.length) {
    return false;
  }
  const [op, rd] = data.programs.slice(data.pointer, data.pointer + 2);
  if (op == 0) {
    // adv
    // reg[0] /= 2^comb(rd)
    data.register[0] = Math.floor(
      data.register[0] / (2 ** get_combo(data, rd)),
    );
  } else if (op == 1) {
    // bxl
    // reg[1] ^= rd
    data.register[1] ^= rd;
  } else if (op == 2) {
    // bst
    // reg[1] = comb(rd) % 8
    data.register[1] = get_combo(data, rd) % 8;
  } else if (op == 3) {
    // jnz
    // if reg[0] != 0 then jump rd
    if (data.register[0] != 0) {
      data.pointer = rd;
      return true;
    }
  } else if (op == 4) {
    // bxc
    // reg[1] ^= reg[2]
    data.register[1] ^= data.register[2];
  } else if (op == 5) {
    // out
    // output comb(rd) % 8
    data.outputs.push(get_combo(data, rd) % 8);
  } else if (op == 6) {
    // bdv
    // reg[1] = reg[0] / 2^comb(rd)
    data.register[1] = Math.floor(
      data.register[0] / (2 ** get_combo(data, rd)),
    );
  } else if (op == 7) {
    // cdv
    // reg[2] = reg[0] / 2^comb(rd)
    data.register[2] = Math.floor(
      data.register[0] / (2 ** get_combo(data, rd)),
    );
  }
  data.pointer += 2;
  return true;
}

export function partOne(input: string) {
  const data = read(input);
  while (operate(data)) {
    // console.log(data);
  }
  // console.log(data);
  return data.outputs.join(",");
}

export function partTwo(input: string) {
  const data = read(input);
  let a = 0;
  let b = 1;
  while (b <= data.programs.length) {
    const cmp = data.programs[data.programs.length - b];
    data.register = [a, 0, 0];
    data.pointer = 0;
    data.outputs = [];
    while (operate(data)) {
      if (data.outputs.length > 0) {
        if(data.outputs[0] == cmp){
          a *= 8;
          b += 1;
        }else{
          a += 1;
        }
        break;
      }
    }
    // console.log(a, b);
  }
  return a / 8;
}


import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day17.txt`);
  assertEquals(partOne(result), "4,6,3,5,6,3,5,2,1,0"); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day17.2.txt`);
  assertEquals(partTwo(result), 117440); // Replace null with expected result for Part Two
});

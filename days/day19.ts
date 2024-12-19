interface Data {
  words: string[];
  sentences: string[];
}

function read(input: string) {
  const [words, sentences] = input.trim().split("\n\n");
  const data: Data = {
    words: words.trim().split(",").map((s) => s.trim()),
    sentences: sentences.trim().split("\n").map((s) => s.trim()),
  };
  return data;
}

function can_construct(words: string[], sentence: string): number {
  const valid = Array.from({ length: sentence.length + 1 }, () => 0);
  valid[0] = 1;
  for (let i = 0; i < sentence.length; i++) {
    if (valid[i]) {
      // check if the word is in the list
      for (const word of words) {
        if (sentence.substring(i, i + word.length) === word) {
          valid[i + word.length] += valid[i];
        }
      }
    }
  }
  return valid[sentence.length];
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  let num = 0;
  for(const sentence of data.sentences) {
    if(can_construct(data.words, sentence) > 0) {
      num++;
      // console.log(sentence);
    }
  }
  return num;
}

export function partTwo(input: string) {
  const data = read(input);
  // console.log(data);
  let num = 0;
  for(const sentence of data.sentences) {
    num += can_construct(data.words, sentence);
  }
  return num;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day19.txt`);
  assertEquals(partOne(result), 6); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day19.txt`);
  assertEquals(partTwo(result), 16); // Replace null with expected result for Part Two
});

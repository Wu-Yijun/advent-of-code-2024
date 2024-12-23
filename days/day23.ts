interface Data {
  maps: Map<number, Set<number>>;
}

function to_number(id: string): number {
  return (id.charCodeAt(0) - "a".charCodeAt(0)) * 26 +
    (id.charCodeAt(1) - "a".charCodeAt(0));
}
function to_str(id: number): string {
  return String.fromCharCode(
    Math.floor(id / 26) + "a".charCodeAt(0),
    id % 26 + "a".charCodeAt(0),
  );
}

function read(input: string) {
  const links = input.trim().split("\n").map((line) =>
    line.split("-").map((s) => to_number(s))
  );
  const maps = new Map<number, Set<number>>();
  for (const [a, b] of links) {
    if (!maps.has(a)) {
      maps.set(a, new Set());
    }
    if (!maps.has(b)) {
      maps.set(b, new Set());
    }
    maps.get(a)!.add(b);
    maps.get(b)!.add(a);
  }
  return { maps };
}

function find_connected_tuple3(maps: Map<number, Set<number>>) {
  const result = [];
  for (const [a1, b] of maps) {
    for (const a2 of b) { // a1-a2
      if (a2 < a1) continue;
      const c = maps.get(a2)!; // c: a2->...
      for (const a3 of c) { // a2-a3
        if (a3 > a2 && b.has(a3)) { // a1<a2<a3
          result.push([a1, a2, a3]);
        }
      }
    }
  }
  return result;
}

function both(a: Set<number>, b: Set<number>) {
  const c = new Set<number>();
  for (const x of a) {
    if (b.has(x)) {
      c.add(x);
    }
  }
  return c;
}

function find_connected_tuple_all_bad(
  range: Set<number>,
  maps: Map<number, Set<number>>,
  at_least: number = 1,
  first = 0,
): number[] {
  if (range.size < 2) return [...range];
  let result: number[] = [];
  for (const a1 of range) { // a1
    if (first > 0) console.log(`${first++} / ${range.size}`);
    const b = both(maps.get(a1)!, range);
    if (b.size < at_least - 1) continue;
    for (const a2 of b) {
      if (a2 < a1) continue; // a1 < a2
      const c = both(b, maps.get(a2)!); // c: a1,a2->... && c in range
      if (c.size < at_least - 2) continue;
      const sub_g = find_connected_tuple_all_bad(c, maps, at_least - 2);
      if (sub_g.length + 2 > result.length) {
        result = [a1, a2, ...sub_g];
        at_least = result.length;
      }
    }
  }
  // console.log(result);
  return result;
}

function _partTwoBad(input: string) {
  const data = read(input);
  const link0 = find_connected_tuple3(data.maps);
  const map = new Map<number, Set<number>>();
  for (const [a, b, c] of link0) {
    if (!map.has(a)) {
      map.set(a, new Set());
    }
    if (!map.has(b)) {
      map.set(b, new Set());
    }
    if (!map.has(c)) {
      map.set(c, new Set());
    }
    map.get(a)!.add(b);
    map.get(a)!.add(c);
    map.get(b)!.add(a);
    map.get(b)!.add(c);
    map.get(c)!.add(a);
    map.get(c)!.add(b);
  }
  const keys = new Set(map.keys());
  const links = find_connected_tuple_all_bad(keys, map, 2, 1);
  const res = links.sort((a, b) => a - b).map((x) => to_str(x)).join(",");
  return res;
}

function born_kerbosch(
  graph: Map<number, Set<number>>,
  R: Set<number> = new Set(),
  P: Set<number> = new Set(graph.keys()),
  X: Set<number> = new Set(),
): Set<number>[] {
  const results: Set<number>[] = [];
  if (P.size === 0 && X.size === 0) {
    // Found a maximal clique, add it to results
    results.push(new Set(R));
    return results;
  }
  // Choose a pivot node to improve performance (this can be optimized)
  const pivot = Array.from(P).concat(Array.from(X)).reduce((maxNode, node) =>
    (graph.get(node)?.size ?? 0) > (graph.get(maxNode)?.size ?? 0)
      ? node
      : maxNode
  );
  // Explore the possible nodes in P that are not adjacent to the pivot
  for (const node of Array.from(P)) {
    if (!graph.get(pivot)?.has(node)) {
      // Recursive call with updated sets
      const newR = new Set(R);
      newR.add(node);
      const newP = new Set(
        [...P].filter((neighbor) => graph.get(node)?.has(neighbor)),
      );
      const newX = new Set(
        [...X].filter((neighbor) => graph.get(node)?.has(neighbor)),
      );
      results.push(...born_kerbosch(graph, newR, newP, newX));
      P.delete(node);
      X.add(node);
    }
  }

  return results;
}

export function partOne(input: string) {
  const data = read(input);
  // console.log(data);
  const links = find_connected_tuple3(data.maps);
  // console.log(links);
  const min = to_number("ta");
  const max = to_number("tz");
  let num = 0;
  for (const [a, b, c] of links) {
    if (
      (min <= a && a <= max) || (min <= b && b <= max) ||
      (min <= c && c <= max)
    ) {
      num++;
    }
  }
  return num;
}

export function partTwo(input: string) {
  // return _partTwoBad(input);
  const data = read(input);
  const clique = born_kerbosch(data.maps);
  // console.log(clique);
  const maxClique = clique.reduce((max, c) => (c.size > max.size ? c : max));
  const res = Array.from(maxClique).sort((a, b) => a - b).map((x) => to_str(x)).join(",");
  // console.log(res);
  return res;
}

import { assertEquals } from "@std/assert";

Deno.test("Part One", () => {
  const result = Deno.readTextFileSync(`data/examples/day23.txt`);
  assertEquals(partOne(result), 7); // Replace null with expected result for Part One
});

Deno.test("Part Two", () => {
  const result = Deno.readTextFileSync(`data/examples/day23.txt`);
  assertEquals(partTwo(result), "co,de,ka,ta"); // Replace null with expected result for Part Two
});

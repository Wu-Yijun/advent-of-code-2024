const day = Deno.args.map((s) => {
  try {
    return Number(s);
  } catch (_) {
    return 0;
  }
}).find((n) => n);
if (!day) {
  console.error("Please specify a day: deno task solve <day>");
  Deno.exit(1);
}

const bench = Deno.args.includes("--bench");

const formattedDay = day.toString().padStart(2, "0");
const inputPath = `data/inputs/day${formattedDay}.txt`;

try {
  const { partOne, partTwo } = await import(`../days/day${formattedDay}.ts`);
  const input = await Deno.readTextFile(inputPath);
  console.log(`Solving day ${day}...`);
  if (bench) {
    Deno.bench(`Day ${day} - Part One`, (b) => {
      b.start();
      partOne(input);
      b.end();
    });
    Deno.bench(`Day ${day} - Part Two`, (b) => {
      b.start();
      partTwo(input);
      b.end();
    });
  }
  const resultOne = partOne(input);
  const resultTwo = partTwo(input);

  console.log("Part One:\n", resultOne);
  console.log("Part Two:\n", resultTwo);
} catch (e) {
  if (e instanceof Error) {
    console.error(`Error solving day ${day}:`, e.message);
  } else {
    console.error(`Error solving day ${day}:`, e);
  }
}

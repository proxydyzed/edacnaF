import { join } from "node:path";
import { open } from "node:fs/promises";
import { decode } from "./src/decode.js";

const pathname = join(import.meta.dirname, "games", "example-game");
const file = await open(pathname, "r");

try {
  const decompressionStream = new Blob([await file.readFile()]).stream().pipeThrough(new DecompressionStream("deflate"));
  const buffer = await (new Response(decompressionStream)).arrayBuffer();
  console.log(JSON.stringify(decode(buffer), null, 2));
} finally {
  await file.close();
}

console.log(decode);

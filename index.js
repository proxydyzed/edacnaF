import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { decode } from "./src/decode.js";

try {
  const fileBuffer = await readFile(join(import.meta.dirname, "games", "example-1"));
  const arrayBuffer = await (new Response(new Blob([fileBuffer.buffer]).stream().pipeThrough(new DecompressionStream("deflate")))).arrayBuffer();
  console.log(arrayBuffer);

  const game = decode(arrayBuffer);
  console.log({
    title: game.title,
    author: game.author,
    description: game.description,
    "block limit": `${Math.floor(game.prefabs.length * 100 / 256)}%`,
  });
} catch (error) {
  console.error(error);
}

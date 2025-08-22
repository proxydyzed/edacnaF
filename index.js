import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { decode } from "./src/decode.js";

const pathname = join(import.meta.dirname, "games", "example-game");

try {
  const decompressionStream = new Blob([await readFile(pathname)]).stream().pipeThrough(new DecompressionStream("deflate"));
  const buffer = await (new Response(decompressionStream)).arrayBuffer();

  console.time();
  const game = decode(buffer);
  console.timeEnd();

  // console.log(game);

  console.log({
    title: game.title,
    author: game.author,
    description: game.description,
    "block limit": `${Math.floor(game.prefabs.length * 100 / 256)}%`,
  });
} catch (error) {
  console.error(error);
}

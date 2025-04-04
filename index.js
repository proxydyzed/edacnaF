import { join } from "node:path";
import { open } from "node:fs/promises";
import { decode } from "./src/decode.js";

const pathname = join(import.meta.dirname, "games", "example-game");
const file = await open(pathname, "r");

try {
  const decompressionStream = new Blob([await file.readFile()]).stream().pipeThrough(new DecompressionStream("deflate"));
  const buffer = await (new Response(decompressionStream)).arrayBuffer();
  const game = decode(buffer);

  console.log("Name:", game.title);
  console.log("Author:", game.author);
  console.log("Description:", game.description);
  console.log("Block limit:", game.prefabs.length / 256);

  // console.log(JSON.stringify(decode(buffer), null, 2));
} finally {
  await file.close();
}

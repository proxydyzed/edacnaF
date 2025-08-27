import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  Block,
  Vector3Uint16,
  encode,
  decode,
  Game,
  Prefab,
} from "../exports.js";

const game = new Game();
game.title = "Neon Rider";
game.author = "Author Name";
game.description = "A fancade game made from a buffer";

const level = new Prefab();
level.type = Prefab.Types.Level;
level.name = "Level One";
level.backgroundColor = Prefab.Color.Green;
level.tiles = new Prefab.Tiles();
level.tiles.blocks = [
  Block.Script.Vector.index,     Block.Script.Vector.index + 1,
  Block.Script.Vector.index + 2, Block.Script.Vector.index + 3,
];

level.tiles.size = new Vector3Uint16(2, 1, 2);

game.prefabs.push(level);

const buffer = encode(game);
const decodedGame = decode(buffer);
console.log(game);
console.log(decodedGame.prefabs[0]);
console.log(JSON.stringify(decodedGame) === JSON.stringify(game));

// const compressedBuffer = await (new Response(new Blob([buffer]).stream().pipeThrough(new CompressionStream("deflate")))).arrayBuffer();
// await writeFile(join(import.meta.dirname, "test-level"), new Uint8Array(compressedBuffer));
// console.log(buffer);
// console.log(compressedBuffer);
// console.log(new TextDecoder().decode(buffer));
console.log("Done");

/*

# Vanilla sky
> https://share.google/lZrJTgaEC885cS2dS
# open your eyes
> https://share.google/1ZQaLr4OMCSJP7LA6
# Minority Report, Lost in adaptation ~ Dominic Noble
> https://share.google/1ZQaLr4OMCSJP7LA6


*/
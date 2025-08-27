import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  encode,
  Block,
  Game,
  Prefab,
  Setting,
  Vector3Uint16,
  Vector3Float,
} from "../src/exports.js";

const game       = new Game();
game.title       = "Hallo World";
game.author      = "Hallo World";
game.description = "Hallo World";

const level           = new Prefab();
level.type            = Prefab.Types.Level;
level.name            = "Hallo World";
level.backgroundColor = Prefab.Color.Green;

const tiles  = new Prefab.Tiles();
tiles.size   = new Vector3Uint16(1, 1, 1);
tiles.blocks = [
  Block.Script.Comment.index,
];

const comment    = new Setting();
comment.index    = 0;
comment.type     = Setting.Types.Str;
comment.position = new Vector3Float(0, 0, 0);
comment.value    = "Hallo World";

level.tiles    = tiles;
level.settings = [comment];
game.prefabs.push(level);

const gameBuffer       = encode(game);
const compressedBuffer = await (new Response(new Blob([gameBuffer]).stream().pipeThrough(new CompressionStream("deflate")))).arrayBuffer();
await writeFile(join(import.meta.dirname, "../games", "hallo-world"), new Uint8Array(compressedBuffer));

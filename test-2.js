import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  GameData,
  Prefab,
  Setting,
  Connection,
  decode,
  decompressBuffer,
  encode,
  compressBuffer,
} from "./lib/export.js";

try {
  const path = join(import.meta.dirname, "src", "custom", "test-2.buf");
  const game = GameData.from({
    title: "A",
    author: "B",
    description: "C",
    prefabs: [],
  });

  game.prefabs.push(Prefab.from({
    type: Prefab.Type.Level,
    name: "First level",
    editable: true,
  }));

  console.log(game);
  const gameBuffer = encode(game);
  const buffer = await compressBuffer(gameBuffer);
  await writeFile(path, new DataView(buffer));

  console.log("Done");
} catch (error) {
  console.error(error);
}


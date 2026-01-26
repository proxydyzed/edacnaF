import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  Prefab,
  Setting,
  Connection,
  decode,
  decompressBuffer,
} from "./lib/export.js";

try {
  const path = join(import.meta.dirname, "src", "devil-mail@leo", "652FF35AE208BF6D");
  const fileBuffer = await readFile(path);
  const buffer = await decompressBuffer(fileBuffer.buffer);

  console.time();
  const game = decode(buffer);
  console.timeEnd();
  await writeFile(path + ".json", JSON.stringify(game, null, 2));

  // console.log(game);

  // await writeFile(path + ".fcxx", new DataView(buffer));

  console.log("Done");
} catch (error) {
  console.error(error);
}


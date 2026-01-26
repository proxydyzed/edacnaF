import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  Prefab,
  GameData,
  SparseTiles,
  compressBuffer,
  encode,
  Blocks,
  iterAsWorld,
} from "./lib/export.js";

function sortAscending(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

main: try {
  const game = GameData.from({
    title: "All prefabs",
    author: "Someone",
    description: "Every prefab in fancade.",
    prefabs: [],
  });

  const lvl = Prefab.from({
    type: Prefab.Type.Level,
    name: "Prefabs",
    editable: true,
    backgroundColor: Prefab.Color.DarkGray,
  });
  const lvlEnv = SparseTiles.empty();

  game.prefabs.push(lvl);

  let xOffset = 0;
  let zOffset = 0;
  let maxHeightZ = 0;
  for (const block of Blocks) {
    const { index, size } = block;

    if ("data" in block && Array.isArray(block.data) && block.data.length === size.area()) {
      let i = 0;
      for (const pos of iterAsWorld(size)) {
        pos.x += xOffset;
        pos.z += zOffset;

        lvlEnv.setTile(pos, block.data.at(i));
        i++;
      }
    } else {
      let blockIndex = index;
      for (const pos of iterAsWorld(size)) {
        pos.x += xOffset;
        pos.z += zOffset;

        lvlEnv.setTile(pos, blockIndex);
        blockIndex++;
      }
    }

    maxHeightZ = Math.max(size.z, maxHeightZ);
    xOffset += size.x;

    if (xOffset > 32) {
      xOffset = 0;
      zOffset += maxHeightZ;
      maxHeightZ = 0;
    }
  }

  lvl.tiles = lvlEnv.toTiles();

  const path = join(import.meta.dirname, "src", "custom", "all-prefabs.buf");
  await writeFile(path, new DataView(await compressBuffer(encode(game))))
} catch (error) {
  console.error(error);
}

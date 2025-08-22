import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import {
  Colors,
  Blocks,
  SettingTypes,
} from "../src/exports.js";

import {
  Game,
  Setting,
  Connection,
} from "../src/encode.js";

class TileManager {
  blocks = [];

  add(block, position) {
    this.blocks.push({
      data: block,
      position,
    });
  }

  toData() {
    let maxX = 0;
    let maxY = 0;
    let maxZ = 0;
    for (const block of this.blocks) {
      maxX = Math.max(maxX, block.position[0] + block.data.size[0]);
      maxY = Math.max(maxY, block.position[1] + block.data.size[1]);
      maxZ = Math.max(maxZ, block.position[2] + block.data.size[2]);
    }

    const data = Array(maxX * maxY * maxZ).fill(0);
    for (const block of this.blocks) {
      const [px, py, pz] = block.position;
      const [sx, sy, sz] = block.data.size;
      const start = py * maxX * maxZ + pz * maxX + px;
      let index = block.data.index;

      for (let y = 0; sy > y; y++ ) {
        for (let z = 0; sz > z; z++ ) {
          for (let x = 0; sx > x; x++ ) {
            const i = start + x + z * maxX + y * maxX * maxZ;
            data[i] = index;
            index++;
          }
        }
      }
    }

    return {
      size: [maxX, maxY, maxZ],
      blocks: data,
    };
  }
}

const game = new Game();
game.title = "Testing";
game.author = "Someone";
game.description = "Some description";

const level1 = game.addLevel("Some name");

const tiles = new TileManager();

level1.backgroundColor = Colors.DarkGray;

const con1 = new Connection([0, 0, 1], [5, 0, 0], [14, 1, 3], [0, 1, 11]);

tiles.add(Blocks.Scripts.True,             [0, 0, 1]);
tiles.add(Blocks.Scripts["Inspect Number"],  [5, 0, 0]);

level1.tiles = tiles.toData();
level1.connections = [con1];

console.time("toBlob()");
const blob = game.toBlob();
console.timeEnd("toBlob()");

const compressionStream = blob.stream().pipeThrough(new CompressionStream("deflate"));
const buffer = await (new Response(compressionStream)).arrayBuffer();

// drag and drop this in the fancade editor (in web)
await writeFile(join(import.meta.dirname, "made-game.zlib"), new Uint8Array(buffer), "utf-8");

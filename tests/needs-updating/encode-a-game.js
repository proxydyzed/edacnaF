import { writeFile } from "node:fs/promises";
import { join } from "node:path";

import { encode } from "../src/encode.js";
import {
  emaGedacnaF,
  Prefab,
  PrefabTypes,
  Colors,
  PrefabTilesData,
  Blocks,
  ColliderTypes,
  PREFAB_VOXELS_LENGTH,
} from "../src/exports.js";

const VOXEL_LAYER_OFFSET = 8 * 8 * 8;
const VOXEL_GLUE_BIT = 1 << 27;

const game = new emaGedacnaF();
game.title = "Test title";
game.author = "SSSSS";
game.description = "Some sort of description here";
game.prefabs = [];

const level1 = new Prefab();
game.prefabs.push(level1);

const block1 = new Prefab();
game.prefabs.push(block1);

block1.type = PrefabTypes.Script;
block1.name = "Custom Block 1";
block1.collider = ColliderTypes.None;
block1.faces = Array.from({ length: PREFAB_VOXELS_LENGTH }, function() { return 0; });

let iy = 2;
for (let ix = 0; ix < 7; ix++) {
  for (let iz = 0; iz < 7; iz++) {
    drawVoxel(block1.faces, { x: ix, y: iy, z: iz }, {
      x: [Colors.Blue, 0, Colors.Blue],
      y: [Colors.Blue, 0, VOXEL_GLUE_BIT, VOXEL_GLUE_BIT],
      z: [0, 0, VOXEL_GLUE_BIT, VOXEL_GLUE_BIT],
    });
    // const index = ix + iy * 8 + iz * 8 * 8;
    // const faceIndex = index + VOXEL_LAYER_OFFSET * 2;
    // block1.faces[faceIndex] = Colors.Blue;
  }
}

// for (let i = 0; i < 12; i++) {
//   block1.faces[i + 1 * 8 * 8] = (Colors.Blue);
// }

// drawVoxel(block1.faces, { x: 0, y: 0, z: 0}, {
//   x: [Colors.Blue, Colors.Green],
//   y: [Colors.Red, Colors.Yellow],
//   z: [Colors.Gray, Colors.Purple],
// });

function drawVoxel(faces, position, color) {
  const { x: px, y: py, z: pz } = position;
  const index = px + py * 8 + pz * 8 * 8;
  const { x: [cx1, cx2], y: [cy1, cy2], z: [cz1, cz2]} = color;

  faces[index]                          = cx1 ?? 0;
  faces[index +     VOXEL_LAYER_OFFSET] = cx2 ?? 0;
  faces[index + 2 * VOXEL_LAYER_OFFSET] = cy1 ?? 0;
  faces[index + 3 * VOXEL_LAYER_OFFSET] = cy2 ?? 0;
  faces[index + 4 * VOXEL_LAYER_OFFSET] = cz1 ?? 0;
  faces[index + 5 * VOXEL_LAYER_OFFSET] = cz2 ?? 0;
}

// for (let i = 0; i < 8 * 8 * 8; i++) {
//   block1.faces[i] = (Colors.Blue | 1 << 7);
// }

level1.type = PrefabTypes.Level;
level1.name = "Level one";
level1.backgroundColor = Colors.Green;
level1.tiles = new PrefabTilesData();
level1.tiles.size = [2, 1, 2];
level1.tiles.blocks = [
  Blocks.Scripts.Win.index + 0, Blocks.Scripts.Win.index + 1,
  Blocks.Scripts.Win.index + 2, Blocks.Scripts.Win.index + 3,
];

async function compressGame(game) {
  const arrayBuffer1 = encode(game);
  const stream = new Blob([arrayBuffer1]).stream().pipeThrough(new CompressionStream("deflate"));
  const arrayBuffer2 = await (new Response(stream)).arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer2);
  return uint8Array;
}

console.log(game);
await writeFile(join(import.meta.dirname, "test.zlib"), await compressGame(game));
// console.log(encode(game));

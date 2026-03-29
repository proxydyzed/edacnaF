import {
  Prefab,
  Vector3Uint16,
} from "./import.js";

import {
  iterAsWorld,
} from "./iter-as-world.js";

export class SparseTiles {
  data = new Map();

  constructor(tiles) {
    const { size, data } = Prefab.Tiles.from(tiles);

    for (const pos of iterAsWorld(size)) {
      const index = pos.x + pos.y * size.x + pos.z * size.x * size.y;
      this.setTile(pos, data.at(index));
    }
  }

  static empty() {
    return new this({ size: {}, data: [] });
  }

  setTiles(posVec, sizeVec, tiles) {
    const pos  = Vector3Uint16.from(posVec);
    const size = Vector3Uint16.from(sizeVec);

    if (typeof tiles === "number") {
      let i = tiles;
      for (const { x, y, z } of iterAsWorld(size)) {
        this.setTile({
          x: pos.x + x,
          y: pos.y + y,
          z: pos.z + z,
        }, i);

        i++;
      }
    } else if (Array.isArray(tiles)) {
      if (tiles.length !== size.x * size.y * size.z) {
        throw new Error(`Expected tiles.length {${tiles.length}} === size.x * size.y * size.z {${size.x * size.y * size.z}}`);
      }

      let i = 0;
      for (const { x, y, z } of iterAsWorld(size)) {
        this.setTile({
          x: pos.x + x,
          y: pos.x + y,
          z: pos.x + z,
        }, tiles.at(i));

        i++;
      }
    } else {
      throw new TypeError(`Expected parameter "tiles" to be number | number[], but got ${typeof tiles}`);
    }
  }

  putBlock(pos, block) {
    const { x: px, y: py, z: pz } = Vector3Uint16.from(pos);
    const { index, size } = WorldBlockData.from(block);

    let i = index;
    for (const { x, y, z } of iterAsWorld(size)) {
      this.setTile({
        x: px + x,
        y: py + y,
        z: pz + z,
      }, i);

      i++;
    }
  }

  hasTile(pos) {
    return this.data.has(String(Vector3Uint16.from(pos)));
  }

  getTile(pos) {
    return this.data.get(String(Vector3Uint16.from(pos)));
  }

  setTile(pos, tile) {
    if (typeof tile !== "number") {
      throw new TypeError(`Expected parameter "tile" to be number, but got ${typeof tile}`);
    }

    const key = String(Vector3Uint16.from(pos));

    if (tile === 0 && !this.data.has(key)) {
      return;
    }

    this.data.set(key, tile);
  }

  getSize() {
    const size = Vector3Uint16.from({});

    for (const key of this.data.keys()) {
      const pos = Vector3Uint16.parse(key);

      size.x = Math.max(pos.x + 1, size.x);
      size.y = Math.max(pos.y + 1, size.y);
      size.z = Math.max(pos.z + 1, size.z);
    }

    return size;
  }

  toJSON() {
    return {
      size: this.getSize(),
      data: Array.from(this.data.entries()),
    };
  }

  toTiles() {
    const size = this.getSize();
    const tiles = {
      size: size,
      data: new Uint16Array(new ArrayBuffer(size.x * size.y * size.z * 2)),
    };

    for (const [key, value] of this.data) {
      const { x, y, z } = Vector3Uint16.parse(key);
      const index = x + y * size.x + z * size.x * size.y;
      tiles.data[index] = value;
    }

    return Prefab.Tiles.from(tiles);
  }

  *[Symbol.iterator]() {
    for (const [key, tile] of this.data) {
      const position = Vector3Uint16.parse(key);
      yield { position, tile };
    }
  }
};

class WorldBlockData {
  index;
  size;
  constructor(index, size) {
    this.index = index;
    this.size = size;
  }
  static from(__inst__) {
    if ("index" in __inst__) {
      if (typeof __inst__.index !== "number") {
        throw new Error(`Expected field "index" to be "number", but got ${typeof __inst__.index}`);
      }
    } else {
      throw new Error(`Expected "index" field`);
    }
    if ("size" in __inst__) {
      if (typeof __inst__.size !== "object") {
        throw new Error(`Expected field "size" to be "object", but got ${typeof __inst__.size}`);
      }
    } else {
      throw new Error(`Expected "size" field`);
    }
    return new this(__inst__.index, Vector3Uint16.from(__inst__.size));
  }
}

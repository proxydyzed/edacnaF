import {
  GameData,
  Prefab,
  Setting,
  Connection,

  Vector3,
  Vector3Uint8,
  Vector3Uint16,
  Vector3Float,

  decode,
  encode,
  unlock,

  compressBuffer,
  decompressBuffer,

  iterAsWorld,
  SparseTiles,
} from "../lib/export.js";

import {
  assert,
} from "../utils/export.js";

class PrefabSlot {
  prefab;
  position;

  constructor(prefab, position) {
    this.prefab = prefab;
    this.position = position;
  }
}

class IndexedPrefabSlot {
  index;
  prefab;
  position;

  constructor(index, prefab, position) {
    this.index = index;
    this.prefab = prefab;
    this.position = position;
  }
}

function sortAscending(a, b) {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}

function isLevelPrefab(prefab) {
  return prefab.type === Prefab.Type.Level;
}

function isNotLevelPrefab(prefab) {
  return prefab.type !== Prefab.Type.Level;
}

function mapBlockHashmap2IndexedSlot(entry) {
  const [index, { prefab, position }] = entry;
  return new IndexedPrefabSlot(index, prefab, position);
}

function sortPrefabSlotAscending(a, b) {
  return sortAscending(a.position, b.position);
}

export class FancadeGame {
  fileVersion;
  title;
  author;
  description;
  indexOffset;

  levels;
  blocks;

  constructor(gameData) {
    this.fileVersion = gameData.fileVersion;
    this.title = gameData.title;
    this.author = gameData.author;
    this.description = gameData.description;
    this.indexOffset = gameData.indexOffset;

    this.blocks = new Map();
    slightlyUglyInitCode: {
      if (gameData.prefabs.length === 0) {
        this.levels = [];
        break slightlyUglyInitCode;
      }

      const index = gameData.prefabs.findIndex(isLevelPrefab);
      if (index === -1) {
        this.levels = [];

        for (let i = 0; i < gameData.prefabs.length; i++) {
          this.blocks.set(i + this.indexOffset, new PrefabSlot(gameData.prefabs.at(i), i));
        }

        break slightlyUglyInitCode;
      }

      if (index !== 0) {
        throw new Error(`Error, level prefabs must be at the start`);
      }

      const index2 = gameData.prefabs.findIndex(isNotLevelPrefab);

      if (index2 === -1) {
        this.levels = gameData.prefabs;
        break slightlyUglyInitCode;
      }

      this.levels = gameData.prefabs.slice(0, index2);
      for (let i = index2; i < gameData.prefabs.length; i++) {
        this.blocks.set(i + this.indexOffset, new PrefabSlot(gameData.prefabs.at(i), i - index2));
      }
    }
  }

  static currentFileVersion = 31;
  static currentIndexOffset = 597;

  static GameData   = GameData;
  static Prefab     = Prefab;
  static Setting    = Setting;
  static Connection = Connection;

  static Vector3       = Vector3;
  static Vector3Uint8  = Vector3Uint8;
  static Vector3Uint16 = Vector3Uint16;
  static Vector3Float  = Vector3Float;

  static SparseTiles = SparseTiles;

  static PrefabSlot        = PrefabSlot;
  static IndexedPrefabSlot = IndexedPrefabSlot;

  toGameData() {
    const prefabIndexOffset = this.indexOffset;
    const blockIndexOffset = this.indexOffset + this.levels.length;
    const sortedBlocks = Array
      .from(this.blocks, mapBlockHashmap2IndexedSlot)
      .sort(sortPrefabSlotAscending)
    ;

    const sortedBlocksMap = new Map(sortedBlocks.map(({ index }, i) => [index, i + blockIndexOffset]));

    const prefabs = [...this.levels, ...sortedBlocks.map(({ prefab }) => prefab)].map(prefab => {
      let group = null;
      if (prefab.group !== null) {
        assert(sortedBlocksMap.has(prefab.group.index), `Unexpected group index: ${prefab.group.index}`);
        const groupIndex = sortedBlocksMap.get(prefab.group.index);
        // prefab.group.index = groupIndex;

        group = Prefab.Group.from({
          index: groupIndex,
          position: prefab.group.position,
        });
      }

      let tiles = null;
      if (prefab.tiles !== null) {
        const tileData = prefab.tiles.data.map(tile => {
          if (tile < prefabIndexOffset) {
            return tile;
          }

          if (!sortedBlocksMap.has(tile)) {
            // probably referencing a level
            return 0;
          }

          // assert(sortedBlocksMap.has(tile), `Unexpected tile: ${tile}`);
          return sortedBlocksMap.get(tile);
        });

        tiles = Prefab.Tiles.from({
          size: prefab.tiles.size,
          data: tileData,
        });
      }

      let faces = null;
      if (prefab.faces !== null) {
        faces = prefab.faces.clone();
      }

      let settings = null;
      if (prefab.settings !== null) {
        settings = prefab.settings.map(setting => setting.clone());
      }

      let connections = null;
      if (prefab.connections !== null) {
        connections = prefab.connections.map(connection => connection.clone());
      }

      return Prefab.from({
        type            : prefab.type,
        name            : prefab.name,
        editable        : prefab.editable,
        _data1          : prefab._data1,
        _data2          : prefab._data2,
        backgroundColor : prefab.backgroundColor,
        collider        : prefab.collider,
        group           : group,
        faces           : faces,
        tiles           : tiles,
        settings        : settings,
        connections     : connections,
      });
    });

    return GameData.from({
      fileVersion : this.fileVersion,
      title       : this.title,
      author      : this.author,
      description : this.description,
      indexOffset : this.indexOffset,
      prefabs     : prefabs,
    });
  }

  encode() {
    return encode(this.toGameData());
  }

  static encode(gameData) {
    return encode(gameData);
  }

  static decode(buffer) {
    return new this(decode(buffer));
  }

  static unlock(buffer) {
    return unlock(buffer);
  }

  static async decompress(buffer) {
    return await decompressBuffer(buffer);
  }

  static async compress(buffer) {
    return await compressBuffer(buffer);
  }
};

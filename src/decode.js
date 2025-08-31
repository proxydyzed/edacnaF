import { BufferReader } from "./dst/buffer-reader-writer.js";
import { littleEndian } from "./dst/little-endian.js";
import {
  Game,
  Prefab,
  Setting,
  Connection
} from "./dst/types.js";

const voxelArrayLength = Prefab.Faces.voxelArrayLength;

export function decode(buffer) {
  const reader = new BufferReader(buffer);
  const game   = new Game();

  game.fileVersion = reader.readUint16();
  game.title       = reader.readString();
  game.author      = reader.readString();
  game.description = reader.readString();
  game.indexOffset = reader.readUint16();

  const prefabLength = reader.readUint16();

  // The variable `perfabCount` is not used anywhere else
  // other than the following line. In future this might
  // be used by creating an array up-front and stoging to
  // the vacant slots.
  for (let prefabCount = 0 ; prefabCount < prefabLength; prefabCount++) {
    const prefab  = new Prefab();
    prefab.header = reader.readUint16();

    const header  = new Prefab.Header(prefab.header);
    if (header.hasType()) {
      prefab.type = reader.readUint8();
    }
    if (header.hasName()) {
      prefab.name = reader.readString();
    }

    // data1 and data2 are almost never used in the
    // binary format. These probably will be used
    // in the future but I doubt it.
    if (header.hasData1()) {
      prefab.data1 = reader.readUint8();
    }
    if (header.hasData2()) {
      prefab.data2 = reader.readUint32();
    }

    if (header.hasBackground()) {
      prefab.backgroundColor = reader.readUint8();
    }
    if (header.hasCollider()) {
      prefab.collider = reader.readUint8();
    }
    if (header.inGroup()) {
      prefab.group = new Prefab.Group();

      prefab.group.index    = reader.readUint16();
      prefab.group.position = reader.readVec3Uint8();
    }
    if (header.hasVoxels()) {
      prefab.faces = new Prefab.Faces();

      prefab.faces.positiveX = Array.from(reader.readBuffer(voxelArrayLength));
      prefab.faces.negativeX = Array.from(reader.readBuffer(voxelArrayLength));
      prefab.faces.positiveY = Array.from(reader.readBuffer(voxelArrayLength));
      prefab.faces.negativeY = Array.from(reader.readBuffer(voxelArrayLength));
      prefab.faces.positiveZ = Array.from(reader.readBuffer(voxelArrayLength));
      prefab.faces.negativeZ = Array.from(reader.readBuffer(voxelArrayLength));
    }
    if (header.hasBlocks()) {
      prefab.tiles      = new Prefab.Tiles();
      const { x, y, z } = prefab.tiles.size = reader.readVec3Uint16();
      const slice       = reader.readBuffer(x * y * z * 2);
      if (littleEndian) {
        prefab.tiles.blocks = Array.from(new Uint16Array(slice));
      } else {
        // reverses the arrayBuffer in-place
        new Uint8Array(slice).reverse();
        prefab.tiles.blocks = Array.from(new Uint16Array(slice).reverse());
      }

      // alternative method, takes care of endianness internally
      // prefab.tiles.blocks = Array.from({ length: x * y * z }, () => reader.readUint16());
    }
    if (header.hasSettings()) {
      const settingLength = reader.readUint16();
      prefab.settings = [];

      for (let settingCount = 0; settingCount < settingLength; settingCount++) {
        const setting = new Setting();

        setting.index    = reader.readUint8();
        setting.type     = reader.readUint8();
        setting.position = reader.readVec3Uint16();

        switch (setting.type) {
          case Setting.Types.Byte  : setting.value = reader.readUint8();       break;
          case Setting.Types.Short : setting.value = reader.readUint16();      break;
          case Setting.Types.Int   : setting.value = reader.readInt32();       break;
          case Setting.Types.Float : setting.value = reader.readFloat32();     break;
          case Setting.Types.Vec   : setting.value = reader.readVec3Float32(); break;
          default                  : setting.value = reader.readString();      break;
        }

        prefab.settings.push(setting);
      }
    }
    if (header.hasConnections()) {
      const connectionLength = reader.readUint16();
      prefab.connections     = [];

      for (let connectionCount = 0; connectionCount < connectionLength; connectionCount++) {
        const connection = new Connection();

        connection.position.from = reader.readVec3Uint16();
        connection.position.to   = reader.readVec3Uint16();
        connection.offset.from   = reader.readVec3Uint16();
        connection.offset.to     = reader.readVec3Uint16();

        prefab.connections.push(connection);
      }
    }

    game.prefabs.push(prefab);
  }

  // console.assert(reader.offset === reader.view.buffer.byteLength);

  return game;
}

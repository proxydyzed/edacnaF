import {
  BufferReader,
} from "./buffer-reader.js";

import {
  GameData,
  Prefab,
  Setting,
  Connection,

  assert,
  littleEndian,
} from "./import.js";

const voxelArrayLength = 512;

export function decode(buffer) {
  const reader = new BufferReader(buffer);
  const game = GameData.from({
    fileVersion : reader.readUint16(),
    title       : reader.readString(),
    author      : reader.readString(),
    description : reader.readString(),
    indexOffset : reader.readUint16(),
    prefabs     : [],
  });

  const prefabLength = reader.readUint16();
  for (let _i = 0; _i < prefabLength; _i++) {
    const header = new Prefab.Header(reader.readUint16());
    const prefab = Prefab.from({
      editable: !(header.uneditable1() || header.uneditable2()),
    });

    // prefab.header = header;

    if (header.hasType())       prefab.type            = reader.readUint8();
    if (header.hasName())       prefab.name            = reader.readString();
    if (header.hasData1())      prefab._data1          = reader.readUint8();
    if (header.hasData2())      prefab._data2          = reader.readUint32();
    if (header.hasBackground()) prefab.backgroundColor = reader.readUint8();
    if (header.hasCollider())   prefab.collider        = reader.readUint8();

    if (header.inGroup()) {
      prefab.group = Prefab.Group.from({
        index: reader.readUint16(),
        position: {
          x: reader.readUint8(),
          y: reader.readUint8(),
          z: reader.readUint8(),
        },
      });
    }

    if (header.hasVoxels()) {
      prefab.faces = Prefab.Faces.from({
        positiveX: reader.readUint8Array(voxelArrayLength),
        negativeX: reader.readUint8Array(voxelArrayLength),
        positiveY: reader.readUint8Array(voxelArrayLength),
        negativeY: reader.readUint8Array(voxelArrayLength),
        positiveZ: reader.readUint8Array(voxelArrayLength),
        negativeZ: reader.readUint8Array(voxelArrayLength),
      });
    }

    if (header.hasBlocks()) {
      const size = {
        x: reader.readUint16(),
        y: reader.readUint16(),
        z: reader.readUint16(),
      };
      const area = size.x * size.y * size.z * 2;

      let data;
      if (littleEndian) {
        data = new Uint16Array(reader.readBuffer(area));
      } else {
        const slice = reader.readBuffer(area);

        // reverses the arrayBuffer in-place
        void new Uint8Array(slice).reverse();
        data = new Uint16Array(slice).reverse();
      }

      prefab.tiles = Prefab.Tiles.from({
        size,
        data,
      });
    }

    if (header.hasSettings()) {
      const settingLength = reader.readUint16();
      const settings = [];

      for (let _i2 = 0; _i2 < settingLength; _i2++) {
        const index = reader.readUint8();
        const type = reader.readUint8();
        const position = {
          x: reader.readUint16(),
          y: reader.readUint16(),
          z: reader.readUint16(),
        };

        let value;
        switch (type) {
          case Setting.Type.Vec: {
            value = {
              x: reader.readFloat32(),
              y: reader.readFloat32(),
              z: reader.readFloat32(),
            };
            break;
          }

          case Setting.Type.Byte  : value = reader.readUint8();       break;
          case Setting.Type.Short : value = reader.readUint16();      break;
          case Setting.Type.Int   : value = reader.readInt32();       break;
          case Setting.Type.Float : value = reader.readFloat32();     break;
          default                 : value = reader.readString();      break;
        }

        settings.push(Setting.from({
          index,
          type,
          position,
          value,
        }));
      }

      prefab.settings = settings;
    }

    if (header.hasConnections()) {
      const connectionLength = reader.readUint16();
      const connections = [];

      for (let _i2 = 0; _i2 < connectionLength; _i2++) {
        connections.push(Connection.from({
          position: {
            from: {
              x: reader.readUint16(),
              y: reader.readUint16(),
              z: reader.readUint16(),
            },
            to: {
              x: reader.readUint16(),
              y: reader.readUint16(),
              z: reader.readUint16(),
            },
          },
          offset: {
            from: {
              x: reader.readUint16(),
              y: reader.readUint16(),
              z: reader.readUint16(),
            },
            to: {
              x: reader.readUint16(),
              y: reader.readUint16(),
              z: reader.readUint16(),
            },
          },
        }));
      }

      prefab.connections = connections;
    }

    game.prefabs.push(prefab);
  }

  assert(reader.offset === buffer.byteLength, "Error, unexpected trailing data");
  return game;
}

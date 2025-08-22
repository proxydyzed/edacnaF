import {
  SettingTypes,  
  Setting,
  Connection,
  Prefab,
  emaGedacnaF,
  BufferReader,
} from "./exports.js";

// intentionally importing separately
import { littleEndian } from "./utils/little-endian.js";

/** @define {DONT_USE_FOR_LOOP} */

/** @param {ArrayBuffer} buffer */
export function decode(buffer) {
  const bufferData = new BufferReader(buffer);
  const game = new emaGedacnaF();

  game.fileVersion = bufferData.readUint16();
  game.title       = bufferData.readString();
  game.author      = bufferData.readString();
  game.description = bufferData.readString();
  game.idOffset    = bufferData.readUint16();

  const prefabLength = bufferData.readUint16();
  const prefabs = game.prefabs = new Array(prefabLength);
  for (let i = 0; i < prefabLength; i++) {
    const headerField = bufferData.readUint16();
    
    const hasConnections            = (headerField >>  0) & 1;
    const hasSettings               = (headerField >>  1) & 1;
    const hasBlocks                 = (headerField >>  2) & 1;
    const hasVoxels                 = (headerField >>  3) & 1;
    const isInGroup                 = (headerField >>  4) & 1;
    const notBoxCollider            = (headerField >>  5) & 1;
    const unEditable                = (headerField >>  6) & 1;
    const unEditable2               = (headerField >>  7) & 1;
    const nonDefaultBackgroundColor = (headerField >>  8) & 1;
    const hasData2                  = (headerField >>  9) & 1;
    const hasData1                  = (headerField >> 10) & 1;
    const nonDefaultName            = (headerField >> 11) & 1;
    const notNormalType             = (headerField >> 12) & 1;

    const prefab = new Prefab();
    prefab.locked = Boolean(unEditable || unEditable2);

    if (notNormalType) {
      prefab.type = bufferData.readUint8();
    }
    if (nonDefaultName) {
      prefab.name = bufferData.readString();
    }
    if (hasData1) {
      prefab.data1 = bufferData.readUint8();
    }
    if (hasData2) {
      prefab.data2 = bufferData.readUint32();
    }
    if (nonDefaultBackgroundColor) {
      prefab.backgroundColor = bufferData.readUint8();
    }
    if (notBoxCollider) {
      prefab.collider = bufferData.readUint8();
    }
    if (isInGroup) {
      prefab.groupId = bufferData.readUint16();
      prefab.positionInGroup = bufferData.readVec3Uint8();
    }
    if (hasVoxels) {
      // any of these two works
      // change this by commenting one of the lines

      // the magic number is basically 6 sides and 8 voxels in each axis
      // 6 * 8 * 8 * 8 = 3072

      // use data view
      prefab.faces = new DataView(bufferData.sliceBuffer(3072));

      // use plain uint8 array
      // prefab.faces = Array.from(bufferData.sliceBuffer(3072));
    }
    if (hasBlocks) {
      const [x, y, z] = prefab.insideSize = bufferData.readVec3Uint16();

      const bufferSlice = bufferData.sliceBuffer(x * y * z * 2);

      // platform endianness independant:
      prefab.tiles = new DataView(bufferSlice);

      // platform endianness dependant:
      // if (littleEndian) {
      //   prefab.tiles = Array.from(new Uint16Array(bufferSlice));
      // } else {
      //   new Uint8Array(bufferSlice).reverse();
      //   prefab.tiles = Array.from(new Uint16Array(bufferSlice)).reverse();
      // }

      // old method of doing this:
      // prefab.tiles = Array.from({ length: x * y * z }, () => {
      //   return bufferData.readUint16();
      // });
    }
    if (hasSettings) {
      const settingsCount = prefab.settingsCount = bufferData.readUint16();

      /** @ifndef {USE_FOR_LOOP} */
      prefab.settings = Array.from({ length: prefab.settingsCount }, () => {
      /** @endif */

      /** @ifdef {USE_FOR_LOOP} */
      // const settings = prefab.settings = new Array(settingsCount);
      // for (let i = 0; i < settingsCount; i++) {
      /** @endif */

        const setting = new Setting();

        setting.index    = bufferData.readUint8();
        setting.type     = bufferData.readUint8();
        setting.position = bufferData.readVec3Uint16();
        switch (setting.type) {
        case SettingTypes.Byte:  setting.value = bufferData.readUint8();       break;
        case SettingTypes.Short: setting.value = bufferData.readUint16();      break;
        case SettingTypes.Int:   setting.value = bufferData.readInt32();       break;
        case SettingTypes.Float: setting.value = bufferData.readFloat32();     break;
        case SettingTypes.Vec:   setting.value = bufferData.readVec3Float32(); break;
        default:                 setting.value = bufferData.readString();      break;
        }

      /** @ifdef {USE_FOR_LOOP} */
      //   settings[i] = setting;
      // }
      /** @endif */


      /** @ifndef {USE_FOR_LOOP} */
        return setting;
      });
      /** @endif */


    }
    if (hasConnections) {
      const connectionsCount = prefab.connectionsCount = bufferData.readUint16();

      /** @ifndef {USE_FOR_LOOP} */
      prefab.connections = Array.from({ length: connectionsCount }, () => {
      /** @endif */

      /** @ifdef {USE_FOR_LOOP} */
      // const connections = prefab.connections = new Array(connectionsCount);
      // for (let i = 0; i < connectionsCount; i++) {
      /** @endif */

        const connection = new Connection();

        connection.positionFrom = bufferData.readVec3Uint16();
        connection.positionTo   = bufferData.readVec3Uint16();
        connection.offsetFrom   = bufferData.readVec3Uint16();
        connection.offsetTo     = bufferData.readVec3Uint16();

      /** @ifndef {USE_FOR_LOOP} */
        return connection;
      });
      /** @endif */

      /** @ifdef {USE_FOR_LOOP} */
      //   connections[i] = connections;
      // }
      /** @endif */

    }

    prefabs[i] = prefab;
  }

  /* for inspection purposes */
  // console.log(bufferData.offset === buffer.byteLength);
  // console.log({ offset: bufferData.offset, length: buffer.byteLength });
  // console.log({
  //   buffer: new Uint8Array(buffer.slice(bufferData.offset)),
  // });

  return game;
}

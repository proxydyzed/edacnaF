import {
  PrefabType,
  ColliderType,
  SettingType,
  PrefabSetting,
  PrefabConnection,
  Prefab,
  FancadeGame,
} from "./structures.js";

import Colors from "./colors.js";
import Sounds from "./sounds.js";

import { BufferReader } from "./utils/buffer-reader-writer.js";

function objectToReversedMap(object) {
  return new Map(Object.entries(object).map(([key, value]) => ([value, key])));
}

export const PrefabNameMap   = objectToReversedMap(PrefabType);
export const ColliderNameMap = objectToReversedMap(ColliderType);
export const ColorNameMap    = objectToReversedMap(Colors);
export const SoundNameMap    = objectToReversedMap(Sounds);

/** @param {ArrayBuffer} buffer */
export function decodeGameBuffer(buffer, unlock) {
  const bufferData = new BufferReader(buffer);
  const game = new FancadeGame();

  game.fileVersion = bufferData.readUint16();
  game.title       = bufferData.readString();
  game.author      = bufferData.readString();
  game.description = bufferData.readString();
  game.idOffset    = bufferData.readUint16();

  const prefabLength = bufferData.readUint16();

  game.prefabs = Array.from({ length: prefabLength }, () => {
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
      prefab.data2 = bufferData.readUint16();
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
      prefab.faces = Array.from({ length: 6 * 8 * 8 * 8 }, () => {
        return bufferData.readUint8();
      });
    }
    if (hasBlocks) {
      prefab.insideSize = bufferData.readVec3Uint16();
      prefab.tiles = Array.from({ length: prefab.insideSize[0] * prefab.insideSize[1] * prefab.insideSize[2] }, () => {
        return bufferData.readUint16();
      });
    }
    if (hasSettings) {
      prefab.settingsCount = bufferData.readUint16();
      prefab.settings = Array.from({ length: prefab.settingsCount }, () => {
        const setting = new PrefabSetting();

        setting.index = bufferData.readUint8();
        setting.type = bufferData.readUint8();
        setting.position = bufferData.readVec3Uint16();
        switch (setting.type) {
        case SettingType.Byte:  setting.value = bufferData.readUint8(); break;
        case SettingType.Short: setting.value = bufferData.readUint16(); break;
        case SettingType.Int:   setting.value = bufferData.readInt32(); break;
        case SettingType.Float: setting.value = bufferData.readFloat32(); break;
        case SettingType.Vec:   setting.value = bufferData.readVec3Float32(); break;
        default:                setting.value = bufferData.readString(); break;
        }

        return setting;
      });
    }
    if (hasConnections) {
      prefab.connectionsCount = bufferData.readUint16();
      prefab.connections = Array.from({ length: prefab.connectionsCount }, () => {
        const connection = new PrefabConnection();

        connection.positionFrom = bufferData.readVec3Uint16();
        connection.positionTo   = bufferData.readVec3Uint16();
        connection.offsetFrom = bufferData.readVec3Uint16();
        connection.offsetTo   = bufferData.readVec3Uint16();

        return connection;
      })
    }
    return prefab;
  });

  // -- for inspection purposes
  // console.log({ offset: bufferData.offset, length: buffer.byteLength });
  // console.log({
  //   buffer: new Uint8Array(buffer.slice(bufferData.offset)),
  // });

  return game;
}



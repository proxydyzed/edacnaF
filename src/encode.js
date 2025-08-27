import { BufferWriter } from "./dst/buffer-reader-writer.js";
import { Prefab, Setting } from "./dst/types.js";
import {
  assertPrefabFacesLength,
  assertPrefabTilesSize,
  prefabHasGroup,
  prefabHasFaces,
  prefabHasTiles,
  prefabHasSettings,
  prefabHasConnections,
} from "./dst/assertions.js";

export function encode(game) {
  let bufferLength = 
    2 + // fileVersion
    2 + // idOffset
    2 + // prefabs.length
    1 + game.title.length +
    1 + game.author.length +
    1 + game.description.length
  ;

  for (const prefab of game.prefabs) {
    bufferLength += saturatePrefabHeader(prefab);
  }

  const writer = BufferWriter.allocate(bufferLength);

  writer.writeUint16(game.fileVersion);
  writer.writeString(game.title);
  writer.writeString(game.author);
  writer.writeString(game.description);
  writer.writeUint16(game.indexOffset);
  writer.writeUint16(game.prefabs.length);

  for (const prefab of game.prefabs) {
    const header = new Prefab.Header(prefab.header);
    writer.writeUint16(prefab.header);

    if (header.hasType()) {
      writer.writeUint8(prefab.type);
    }
    if (header.hasName()) {
      writer.writeString(prefab.name);
    }
    if (header.hasData1()) {
      writer.writeUint8(prefab._data1);
    }
    if (header.hasData2()) {
      writer.writeUint32(prefab._data2);
    }
    if (header.hasBackground()) {
      writer.writeUint8(prefab.backgroundColor);
    }
    // if (header.uneditable2()) {}
    // if (header.uneditable1()) {}
    if (header.hasCollider()) {
      writer.writeUint8(prefab.collider);
    }
    if (header.inGroup()) {
      writer.writeUint16(prefab.group.index);
      writer.writeVec3Uint8(prefab.group.position);
    }
    if (header.hasVoxels()) {
      assertPrefabFacesLengths(prefab);
      for (const face of prefab.faces.positiveX) {
        writer.writeUint8(face);
      }
      for (const face of prefab.faces.negativeX) {
        writer.writeUint8(face);
      }
      for (const face of prefab.faces.positiveY) {
        writer.writeUint8(face);
      }
      for (const face of prefab.faces.negativeY) {
        writer.writeUint8(face);
      }
      for (const face of prefab.faces.positiveZ) {
        writer.writeUint8(face);
      }
      for (const face of prefab.faces.negativeZ) {
        writer.writeUint8(face);
      }
    }
    if (header.hasBlocks()) {
      assertPrefabTilesSize(prefab);
      writer.writeVec3Uint16(prefab.tiles.size);
      for (const block of prefab.tiles.blocks) {
        writer.writeUint16(block);
      }
    }
    if (header.hasSettings()) {
      writer.writeUint16(prefab.settings.length);
      for (const setting of prefab.settings) {
        writer.writeUint8(setting.index);
        writer.writeUint8(setting.type);
        writer.writeVec3Uint16(setting.position);

        const value = setting.value;
        switch (setting.type) {
          case Setting.Types.Byte  : writer.writeUint8(value);       break;
          case Setting.Types.Short : writer.writeUint16(value);      break;
          case Setting.Types.Int   : writer.writeInt32(value);       break;
          case Setting.Types.Float : writer.writeFloat32(value);     break;
          case Setting.Types.Vec   : writer.writeVec3Float32(value); break;
          default                  : writer.writeString(value);      break;
        }
      }
    }
    if (header.hasConnections()) {
      writer.writeUint16(prefab.connections.length);
      for (const connection of prefab.connections) {
        writer.writeVec3Uint16(connection.position.from);
        writer.writeVec3Uint16(connection.position.to);
        writer.writeVec3Uint16(connection.offset.from);
        writer.writeVec3Uint16(connection.offset.to);
      }
    }
  }

  return writer.view.buffer;
}

const HeaderBitOffset = Prefab.Header.BitOffset;
function saturatePrefabHeader(prefab) {
  let header = 0;
  let length = 2;

  if (typeof prefab.type === "number") {
    length += 1;
    header |= 1 << HeaderBitOffset.hasType;
  }
  if (typeof prefab.name === "string") {
    length += 1 + prefab.name.length;
    header |= 1 << HeaderBitOffset.hasName;
  }
  if (typeof prefab._data1 === "number") {
    length += 1;
    header |= 1 << HeaderBitOffset.hasData1;
  }
  if (typeof prefab._data2 === "number") {
    length += 4;
    header |= 1 << HeaderBitOffset.hasData2;
  }
  if (typeof prefab.backgroundColor === "number") {
    length += 1;
    header |= 1 << HeaderBitOffset.hasBackground;
  }
  if (typeof prefab.collider === "number") {
    length += 1;
    header |= 1 << HeaderBitOffset.hasCollider;
  }
  if (prefabHasGroup(prefab)) {
    length += Prefab.Group.size;
    header |= 1 << HeaderBitOffset.inGroup;
  }
  if (prefabHasFaces(prefab)) {
    length += Prefab.Faces.size;
    header |= 1 << HeaderBitOffset.hasVoxels;
  }
  if (prefabHasTiles(prefab)) {
    const { x, y, z } = prefab.tiles.size;
    length += 6 + (x * y * z * 2);
    header |= 1 << HeaderBitOffset.hasBlocks;
  }
  if (prefabHasSettings(prefab)) {
    length += 2;
    header |= 1 << HeaderBitOffset.hasSettings;

    for (const setting of prefab.settings) {
      length += 8;
      switch (setting.type) {
        case Setting.Types.Byte  : length +=  1; break;
        case Setting.Types.Short : length +=  2; break;
        case Setting.Types.Int   : length +=  4; break;
        case Setting.Types.Float : length +=  4; break;
        case Setting.Types.Vec   : length += 12; break;
        default: {
          length += 1 + setting.value.length;
          break;
        }
      }
    }
  }
  if (prefabHasConnections(prefab)) {
    length += 2 + prefab.connections.length * Connection.size;
    header |= 1 << HeaderBitOffset.hasConnections;
  }

  prefab.header = header;

  return length;
}

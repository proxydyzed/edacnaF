import {
  BufferWriter,
} from "./buffer-writer.js";

import {
  Prefab,
  Setting,
  Connection,
  Vector3Uint16,

  assert,
  littleEndian,
} from "./import.js";

const { voxelArrayLength } = Prefab.Faces;

export function encode(game) {
  let bufferLength = 
    2 + // fileVersion
    2 + // idOffset
    2 + // prefabs.length
    1 + BufferWriter.calculateStringLength(game.title) +
    1 + BufferWriter.calculateStringLength(game.author) +
    1 + BufferWriter.calculateStringLength(game.description)
  ;

  const headerList = [];

  for (const prefab of game.prefabs) {
    const { header, length } = saturatePrefabHeader(prefab);
    bufferLength += length;
    headerList.push(header);
  }

  assert(!Number.isNaN(bufferLength), "Expected a number");

  const writer = BufferWriter.allocate(bufferLength);

  writer.writeUint16(game.fileVersion);
  assert(writer.writeString(game.title)       === 0, "Expected no residue");
  assert(writer.writeString(game.author)      === 0, "Expected no residue");
  assert(writer.writeString(game.description) === 0, "Expected no residue");
  writer.writeUint16(game.indexOffset);
  writer.writeUint16(game.prefabs.length);

  let i = 0;
  for (const prefab of game.prefabs) {
    const headerData = headerList.at(i);
    i++;

    const header = Prefab.Header.from({
      bits: headerData,
    });

    writer.writeUint16(headerData);

    if (header.hasType())       writer.writeUint8(prefab.type);
    if (header.hasName())       assert(writer.writeString(prefab.name) === 0, "Expected no residue");
    if (header.hasData1())      writer.writeUint8(prefab._data1);
    if (header.hasData2())      writer.writeUint32(prefab._data2);
    if (header.hasBackground()) writer.writeUint8(prefab.backgroundColor);
    if (header.hasCollider())   writer.writeUint8(prefab.collider);

    if (header.inGroup()) {
      writer.writeUint16(prefab.group.index);
      writer.writeUint8(prefab.group.position.x);
      writer.writeUint8(prefab.group.position.y);
      writer.writeUint8(prefab.group.position.z);
    }

    if (header.hasVoxels()) {
      assertPrefabFacesLength(prefab);

      writer.writeUint8Array(prefab.faces.positiveX);
      writer.writeUint8Array(prefab.faces.negativeX);
      writer.writeUint8Array(prefab.faces.positiveY);
      writer.writeUint8Array(prefab.faces.negativeY);
      writer.writeUint8Array(prefab.faces.positiveZ);
      writer.writeUint8Array(prefab.faces.negativeZ);
    }

    if (header.hasBlocks()) {
      assertPrefabTilesSize(prefab);
    
      const { x, y, z } = Vector3Uint16.from(prefab.tiles.size);
      writer.writeUint16(x);
      writer.writeUint16(y);
      writer.writeUint16(z);

      for (const tile of prefab.tiles.data) {
        writer.writeUint16(tile);
      }

      // if (littleEndian) {

      // }
    }

    if (header.hasSettings()) {
      writer.writeUint16(prefab.settings.length);

      for (const setting of prefab.settings) {
        writer.writeUint8(setting.index);
        writer.writeUint8(setting.type);

        writer.writeUint16(setting.position.x);
        writer.writeUint16(setting.position.y);
        writer.writeUint16(setting.position.z);

        switch (setting.type) {
          case Setting.Type.Vec: {
            writer.writeFloat32(setting.value.x);
            writer.writeFloat32(setting.value.y);
            writer.writeFloat32(setting.value.z);
            break;
          }

          case Setting.Type.Byte  : writer.writeUint8(setting.value);       break;
          case Setting.Type.Short : writer.writeUint16(setting.value);      break;
          case Setting.Type.Int   : writer.writeInt32(setting.value);       break;
          case Setting.Type.Float : writer.writeFloat32(setting.value);     break;
          default                 : writer.writeString(setting.value);      break;
        }
      }
    }

    if (header.hasConnections()) {
      writer.writeUint16(prefab.connections.length);
      for (const connection of prefab.connections) {
        writer.writeUint16(connection.position.from.x);
        writer.writeUint16(connection.position.from.y);
        writer.writeUint16(connection.position.from.z);

        writer.writeUint16(connection.position.to.x);
        writer.writeUint16(connection.position.to.y);
        writer.writeUint16(connection.position.to.z);

        writer.writeUint16(connection.offset.from.x);
        writer.writeUint16(connection.offset.from.y);
        writer.writeUint16(connection.offset.from.z);

        writer.writeUint16(connection.offset.to.x);
        writer.writeUint16(connection.offset.to.y);
        writer.writeUint16(connection.offset.to.z);
      }
    }
  }

  // console.log({ bufferLength });
  // console.log("offset:", writer.offset, "byteLength:", writer.source.buffer.byteLength);

  const bufferData = writer.toBuffer();
  assert(writer.offset === bufferData.byteLength, "Error, unexptected trailing data");
  return bufferData;
}

const HeaderBitOffset = Prefab.Header.BitOffset;
function saturatePrefabHeader(prefab) {
  let header = 0;
  let length = 2;

  if (!prefab.editable) {
    header |= 1 << HeaderBitOffset.uneditable1;
  }
  if (typeof prefab.type === "number") {
    length += 1;
    header |= 1 << HeaderBitOffset.hasType;
  }
  if (typeof prefab.name === "string") {
    length += 1 + BufferWriter.calculateStringLength(prefab.name);
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
  if (typeof prefab.group === "object" && prefab.group !== null) {
    length += Prefab.Group.size;
    header |= 1 << HeaderBitOffset.inGroup;
  }
  if (typeof prefab.faces === "object" && prefab.faces !== null) {
    length += Prefab.Faces.size;
    header |= 1 << HeaderBitOffset.hasVoxels;
  }
  if (typeof prefab.tiles === "object" && prefab.tiles !== null) {
    const { x, y, z } = prefab.tiles.size;
    length += 6 + (x * y * z * 2);
    header |= 1 << HeaderBitOffset.hasBlocks;
  }
  if (typeof prefab.settings === "object" && prefab.settings !== null) {
    length += 2;
    header |= 1 << HeaderBitOffset.hasSettings;

    for (const setting of prefab.settings) {
      length += 8;
      switch (setting.type) {
        case Setting.Type.Byte  : length +=  1; break;
        case Setting.Type.Short : length +=  2; break;
        case Setting.Type.Int   : length +=  4; break;
        case Setting.Type.Float : length +=  4; break;
        case Setting.Type.Vec   : length += 12; break;
        default: {
          length += 1 + BufferWriter.calculateStringLength(setting.value);
          break;
        }
      }
    }
  }
  if (typeof prefab.connections === "object" && prefab.connections !== null) {
    length += 2 + prefab.connections.length * Connection.size;
    header |= 1 << HeaderBitOffset.hasConnections;
  }

  return { header, length };
}

function assertPrefabFacesLength(prefab) {
  for (const field of [
    "positiveX",
    "negativeX",
    "positiveY",
    "negativeY",
    "positiveZ",
    "negativeZ",
  ]) {
    if (prefab.faces[field].length !== voxelArrayLength) {
      throw new TypeError(`Expected faces.${field}.length to be ${voxelArrayLength}, but got ${prefab.faces[field].length}`);
    }
  }
}

function assertPrefabTilesSize(prefab) {
  // assertVector(prefab.tiles.size);
  const { x, y, z } = Vector3Uint16.from(prefab.tiles.size);
  if (x * y * z !== prefab.tiles.data.length) {
    throw new Error(`Expected tiles.data.length (${prefab.tiles.data.length}) to be equivalent to tiles.size (${x}, ${y}, ${z})`);
  }
}

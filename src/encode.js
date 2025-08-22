import {
  Colors,
  PrefabTypes,
  SettingTypes,
  BufferWriter,
  PrefabHeaderBits,
} from "./exports.js";

const PREFAB_VOXELS_LENGTH = 3072; // 6 * 8 * 8 * 8

export class Connection {
  positionFrom; // vec3u16
  positionTo;   // vec3u16
  offsetFrom;   // vec3u16
  offsetTo;     // vec3u16

  constructor(pFrom, pTo, oFrom, oTo) {
    this.positionFrom = pFrom;
    this.positionTo   = pTo;
    this.offsetFrom   = oFrom;
    this.offsetTo     = oTo;
  }

  toBuffer() {
    return this.intoBuffer(BufferWriter.allocate(this.getSize()));
  }

  intoBuffer(writer) {
    writer.writeVec3Uint16(this.positionFrom);
    writer.writeVec3Uint16(this.positionTo);
    writer.writeVec3Uint16(this.offsetFrom);
    writer.writeVec3Uint16(this.offsetTo);

    return writer.buffer;
  }

  getSize() {
    return 6;
  }
}

export class Setting {
  index;    // u8
  type;     // u8
  position; // vec3u16
  value;    // u8 | u16 | i32 | f32 | vec3f32 | string

  constructor(index, type, position, value) {
    this.index    = index;
    this.type     = type;
    this.position = position;
    this.value    = value;
  }

  toBuffer() {
    return this.intoBuffer(BufferWriter.allocate(this.getSize()));
  }

  intoBuffer(writer) {
    writer.writeUint8(this.index);
    writer.writeUint8(this.type);
    writer.writeVec3Uint16(this.position);

    switch (this.type) {
    case SettingTypes.Byte:  writer.writeUint8(this.value);       break;
    case SettingTypes.Short: writer.writeUint16(this.value);      break;
    case SettingTypes.Int:   writer.writeInt32(this.value);       break;
    case SettingTypes.Float: writer.writeFloat32(this.value);     break;
    case SettingTypes.Vec:   writer.writeVec3Float32(this.value); break;
    default:                 writer.writeString(this.value);      break;
    }

    return writer.buffer;
  }

  getSize() {
    let lens = 8;
    switch (this.type) {
    case SettingTypes.Byte:  lens += 1; break;
    case SettingTypes.Short: lens += 2; break;
    case SettingTypes.Int:   lens += 4; break;
    case SettingTypes.Float: lens += 4; break;
    case SettingTypes.Vec:   lens += 12; break;
    default:                 lens += this.value.length + 1; break;
    }
    return lens;
  }
}

export class Prefab {
  type = 0;         // enum PrefabType
  name;             // string

  locked;           // boolean

  _data1;           // u8
  _data2;           // u32

  backgroundColor;  // u8

  collider;         // u8

  group;            // Class PrefabGroup

  faces;            // u8[6][8][8][8]

  tiles;            // Class PrefabTilesData

  settings;         // struct Setting[]

  connections;      // struct Connection[]

  toBuffer() {
    const { header, lens } = this.getHeaderData();
    const writer = BufferWriter.allocate(lens);
    // console.log(header.toString(2).padStart(16, "0"));

    writer.writeUint16(header);

    if ((header >> PrefabHeaderBits.hasType) & 1) {
      writer.writeUint8(this.type);
    }
    if ((header >> PrefabHeaderBits.hasName) & 1) {
      writer.writeString(this.name);
    }
    if ((header >> PrefabHeaderBits.hasData1) & 1) {
      writer.writeUint8(this._data1);
    }
    if ((header >> PrefabHeaderBits.hasData2) & 1) {
      writer.writeUint32(this._data2);
    }
    if ((header >> PrefabHeaderBits.hasBackground) & 1) {
      writer.writeUint8(this.backgroundColor);
    }
    if ((header >> PrefabHeaderBits.hasCollider) & 1) {
      writer.writeUint8(this.collider);
    }
    if ((header >> PrefabHeaderBits.inGroup) & 1) {
      writer.writeUint16(this.prefab.id);
      writer.writeVec3Uint8(this.prefab.position);
    }
    if ((header >> PrefabHeaderBits.hasVoxels) & 1) {
      if (this.faces.length !== PREFAB_VOXELS_LENGTH) {
        throw new Error("Length of <#Prefab.faces> is invalid, expected " + PREFAB_VOXELS_LENGTH + " but got " + this.faces.length);
      }

      // const uint8arr = new Uint8Array(writer.buffer);
      // uint8arr.set(this.faces, writer.offset);
      // writer.offset += PREFAB_VOXELS_LENGTH;
      for (const face of this.faces) {
        writer.writeUint8(face);
      }
    }
    if ((header >> PrefabHeaderBits.hasBlocks) & 1) {
      // const size = this.tiles.size.reduce((acc, axis) => acc * axis, 0);
      const [x, y, z] = this.tiles.size;
      const size = x * y * z;
      if (this.tiles.blocks.length !== size) {
        throw new Error(`Size of <#Prefab.tiles>.blocks (${this.tiles.blocks.length}) does not match <#Prefab.tiles>.size (${size})`);
      }
      
      writer.writeVec3Uint16(this.tiles.size);
      for (const block of this.tiles.blocks) {
        writer.writeUint16(block);
      }
      // const uint16arr = new Uint16Array(writer.buffer);
      // console.log({ buffer: writer.buffer, arr: new Uint8Array(writer.buffer).join(), offset: writer.offset, size, blocks: this.tiles.blocks });
      // uint16arr.set(this.tiles.blocks, writer.offset - 1);
    }
    if ((header >> PrefabHeaderBits.hasSettings) & 1) {
      writer.writeUint16(this.settings.length);
      for (const setting of this.settings) {
        setting.intoBuffer(writer);
      }
      // throw new Error("Not implemented yet");
    }
    if ((header >> PrefabHeaderBits.hasConnections) & 1) {
      writer.writeUint16(this.connections.length);
      for (const connection of this.connections) {
        connection.intoBuffer(writer);
      }
      // throw new Error("Not implemented yet");
    }

    return writer.buffer;
  }

  getHeaderData() {
    let header = 0;
    let lens   = 2;

    if (typeof this.type === "number") {
      lens += 1;
      header |= 1 << PrefabHeaderBits.hasType;
    }
    if (typeof this.name === "string") {
      lens += 1 + this.name.length;
      header |= 1 << PrefabHeaderBits.hasName;
    }
    if (typeof this._data1 === "number") {
      lens += 1;
      header |= 1 << PrefabHeaderBits.hasData1;
    }
    if (typeof this._data2 === "number") {
      lens += 4;
      header |= 1 << PrefabHeaderBits.hasData2;
    }
    if (typeof this.backgroundColor === "number") {
      lens += 1;
      header |= 1 << PrefabHeaderBits.hasBackground;
    }
    if (typeof this.collider === "number") {
      lens += 1;
      header |= 1 << PrefabHeaderBits.hasCollider;
    }
    if (typeof this.group === "object" && this.group !== null) {
      lens += PrefabGroup.size;
      header |= 1 << PrefabHeaderBits.inGroup;
    }
    if (Array.isArray(this.faces)) {
      lens += PREFAB_VOXELS_LENGTH;
      header |= 1 << PrefabHeaderBits.hasVoxels;
    }
    if (typeof this.tiles === "object" && this.tiles !== null) {
      const [x, y, z] = this.tiles.size;
      lens += 6 + (x * y * z * 2);
      header |= 1 << PrefabHeaderBits.hasBlocks;
    }
    if (Array.isArray(this.settings)) {
      lens += this.settings.reduce(
        (acc, setting) => acc + setting.getSize(),
        // settings.length
        2
      );
      header |= 1 << PrefabHeaderBits.hasSettings;
    }
    if (Array.isArray(this.connections)) {
      lens += 2 + this.connections.length * 24;
      header |= 1 << PrefabHeaderBits.hasConnections;
    }

    return { header, lens };
  }

  // getSize() {}
}

class PrefabGroup {
  id;
  position;

  static get size() { return 5; }
}

class PrefabTilesData {
  size;
  blocks;
}

export class Game {
  fileVersion = 31;
  title;
  author;
  description;
  idOffset = 597;
  prefabs = [];

  toBlob() {
    const lens =
    // fileVersion, idOffset, prefab.length
    6 +
    (
      this.title.length +
      this.author.length +
      this.description.length +
      // title.length + author.length + description.length
      3
    );

    const writer = BufferWriter.allocate(lens);
    writer.writeUint16(this.fileVersion);
    writer.writeString(this.title);
    writer.writeString(this.author);
    writer.writeString(this.description);
    writer.writeUint16(this.idOffset);
    writer.writeUint16(this.prefabs.length);

    const buffers = [writer.buffer];
    for (const prefab of this.prefabs) {
      buffers.push(prefab.toBuffer());
    }

    return new Blob(buffers);
  }

  addLevel(name = "New Level") {
    const level = new Prefab();
    level.type = PrefabTypes.Level;
    level.name = name;
    this.prefabs.push(level);
    return level;
  }

  // getSize() {}
}

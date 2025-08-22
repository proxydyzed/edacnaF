import {
  SettingTypes,
} from "./exports.js";

class SimplifiedReader {
  offset = 0;
  view;
  buffer;

  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
  }

  string() {
    const length = this.view.getUint8(this.offset);
    this.offset += (length + 1);
    return this;
  }

  readUint16() {
    const uint16 = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return uint16;
  }

}

/** @param {ArrayBuffer} buffer */
export function unlock(buffer) {
  const reader = new SimplifiedReader(buffer);

  reader.offset += 2;
  reader
    .string()
    .string()
    .string()
  ;
  reader.offset += 2;
  
  const prefabLength = reader.readUint16();

  for (let prefabIndex = 0; prefabIndex < prefabLength; prefabIndex++) {
    const headerField = reader.view.getUint16(reader.offset, true);

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

    const newHeaderField = headerField & 0b1111_1111_0011_1111;
    reader.view.setUint16(reader.offset, newHeaderField, true);
    reader.offset += 2;

    if (notNormalType) {
      reader.offset++;
    }
    if (nonDefaultName) {
      reader.string();
    }
    if (hasData1) {
      reader.offset++;
    }
    if (hasData2) {
      reader.offset += 4;
    }
    if (nonDefaultBackgroundColor) {
      reader.offset++;
    }
    if (notBoxCollider) {
      reader.offset++;
    }
    if (isInGroup) {
      reader.offset += 5;
    }
    if (hasVoxels) {
      reader.offset += 3072; // 6 * 8 * 8 * 8
    }
    if (hasBlocks) {
      const x = reader.readUint16();
      const y = reader.readUint16();
      const z = reader.readUint16();
      reader.offset += (x * y * z * 2);
    }
    if (hasSettings) {
      const settingsCount = reader.readUint16();
      for (let i = 0; i < settingsCount; i++) {
        reader.offset++; // index
        switch (reader.view.getUint8(reader.offset)) {
        case SettingTypes.Byte:  reader.offset += (1 + 6 +  1); break;
        case SettingTypes.Short: reader.offset += (1 + 6 +  2); break;
        case SettingTypes.Int:   reader.offset += (1 + 6 +  4); break;
        case SettingTypes.Float: reader.offset += (1 + 6 +  4); break;
        case SettingTypes.Vec:   reader.offset += (1 + 6 + 12); break;
        default:                reader.offset += (1 + 6 +  0); reader.string(); break;
        }
      }
    }
    if (hasConnections) {
      const connectionsCount = reader.readUint16();
      reader.offset += (connectionsCount * 24);
    }
  }

  return buffer;
}

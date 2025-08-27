import { assertVector } from "./assertions.js";
import {
  Vector3Uint8,
  Vector3Uint16,
  Vector3Float,
} from "./types.js";

export class BufferReader {
  view;
  offset  = 0;
  decoder = new TextDecoder();
  buffer;

  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
  }

  readUint8() {
    const uint8 = this.view.getUint8(this.offset);
    this.offset++;
    return uint8;
  }
  
  readUint16(littleEndian = true) {
    const uint16 = this.view.getUint16(this.offset, littleEndian);
    this.offset += 2;
    return uint16;
  }

  readUint32(littleEndian = true) {
    const uint32 = this.view.getUint32(this.offset, littleEndian);
    this.offset += 4;
    return uint32;
  }

  readFloat32(littleEndian = true) {
    const float32 = this.view.getFloat32(this.offset, littleEndian);
    this.offset += 4;
    return float32;
  }

  readInt32(littleEndian = true) {
    const int32 = this.view.getInt32(this.offset, littleEndian);
    this.offset += 4;
    return int32;
  }
  
  readString() {
    const length = this.readUint8();
    const str = this.decoder.decode(this.view.buffer.slice(this.offset, this.offset + length));
    this.offset += length;
    return str;
  }

  readVec3Uint8() {
    return new Vector3Uint8(this.readUint8(), this.readUint8(), this.readUint8());
  }

  readVec3Uint16() {
    return new Vector3Uint16(this.readUint16(), this.readUint16(), this.readUint16());
  }

  readVec3Float32() {
    return new Vector3Float(this.readFloat32(), this.readFloat32(), this.readFloat32());
  }
  
  readBuffer(size = 1) {
    const buffer = this.view.buffer.slice(this.offset, this.offset + size);
    this.offset += size;
    return buffer;
  }
};

export class BufferWriter {
  view;
  offset = 0;
  encoder = new TextEncoder();

  buffer;
  
  constructor(buffer) {
    this.buffer = buffer;
    this.view = new DataView(buffer);
  }

  static allocate(size) {
    return new BufferWriter(new ArrayBuffer(size));
  }

  writeUint8(value) {
    this.view.setUint8(this.offset, value);
    this.offset++;
  }

  writeUint16(value, littleEndian = true) {
    this.view.setUint16(this.offset, value, littleEndian);
    this.offset += 2;
  }

  writeUint32(value, littleEndian = true) {
    this.view.setUint32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeFloat32(value, littleEndian = true) {
    this.view.setFloat32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeInt32(value, littleEndian = true) {
    this.view.setInt32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeString(value, littleEndian = true) {
    this.writeUint8(value.length);
    this.encoder.encode(value);

    const { read, written } = this.encoder.encodeInto(value, new Uint8Array(this.buffer, this.offset));
    this.offset += written;
    return value.length - read;
  }

  writeVec3Uint8(value) {
    assertVector(value);
    const { x, y, z } = value;
    this.writeUint8(x);
    this.writeUint8(y);
    this.writeUint8(z);
  }

  writeVec3Uint16(value, littleEndian = true) {
    assertVector(value);
    const { x, y, z } = value;
    this.writeUint16(x, littleEndian);
    this.writeUint16(y, littleEndian);
    this.writeUint16(z, littleEndian);
  }

  writeVec3Float32(value, littleEndian = true) {
    assertVector(value);
    const { x, y, z } = value;
    this.writeFloat32(x, littleEndian);
    this.writeFloat32(y, littleEndian);
    this.writeFloat32(z, littleEndian);
  }
};

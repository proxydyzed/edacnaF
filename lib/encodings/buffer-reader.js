import {
  Vector3Uint8,
  Vector3Uint16,
  Vector3Float,
} from "./import.js";

export class BufferReader {
  #source;
  offset;

  decoder = new TextDecoder();

  // This prevents command line tools from vomiting
  // large buffers when logging the reader.
  get source() { return this.#source; }
  set source(source) { this.#source = source; }

  constructor(arrayBuffer) {
    if (!(arrayBuffer instanceof ArrayBuffer)) {
      throw new TypeError(`Expected ArrayBuffer`);
    }

    this.source = new DataView(arrayBuffer);
    this.offset = 0;
  }

  readUint8() {
    const uint8 = this.source.getUint8(this.offset);
    this.offset++;
    return uint8;
  }
  
  readUint16(littleEndian = true) {
    const uint16 = this.source.getUint16(this.offset, littleEndian);
    this.offset += 2;
    return uint16;
  }

  readUint32(littleEndian = true) {
    const uint32 = this.source.getUint32(this.offset, littleEndian);
    this.offset += 4;
    return uint32;
  }

  readFloat32(littleEndian = true) {
    const float32 = this.source.getFloat32(this.offset, littleEndian);
    this.offset += 4;
    return float32;
  }

  readInt32(littleEndian = true) {
    const int32 = this.source.getInt32(this.offset, littleEndian);
    this.offset += 4;
    return int32;
  }
  
  readString() {
    const length = this.readUint8();
    const str = this.decoder.decode(this.source.buffer.slice(this.offset, this.offset + length));
    this.offset += length;
    return str;
  }

  readVec3Uint8() {
    return new Vector3Uint8(
      this.readUint8(),
      this.readUint8(),
      this.readUint8(),
    );
  }

  readVec3Uint16() {
    return new Vector3Uint16(
      this.readUint16(),
      this.readUint16(),
      this.readUint16(),
    );
  }

  readVec3Float32() {
    return new Vector3Float(
      this.readFloat32(),
      this.readFloat32(),
      this.readFloat32(),
    );
  }
  
  readBuffer(size = 1) {
    this.offset += size;
    return this.source.buffer.slice(this.offset - size, this.offset);
  }

  readUint8Array(size) {
    this.offset += size;
    return new Uint8Array(this.source.buffer, this.offset - size, size).slice(0);
  }
};

export class BufferReader {
  #view;
  #offset = 0;
  #decoder = new TextDecoder();
  
  buffer;
  
  constructor(buffer) {
    this.buffer = buffer;
    this.#view = new DataView(buffer);
  }

  get offset() {
    return this.#offset;
  }

  get view() {
    return this.#view;
  }
  
  readUint8() {
    const uint8 = this.#view.getUint8(this.#offset);
    this.#offset++;
    return uint8;
  }
  
  readUint16(littleEndian = true) {
    const uint16 = this.#view.getUint16(this.#offset, littleEndian);
    this.#offset += 2;
    return uint16;
  }

  readFloat32(littleEndian = true) {
    const float32 = this.#view.getFloat32(this.#offset, littleEndian);
    this.#offset += 4;
    return float32;
  }

  readInt32(littleEndian = true) {
    const int32 = this.#view.getInt32(this.#offset, littleEndian);
    this.#offset += 4;
    return int32;
  }
  
  readString() {
    const length = this.readUint8();
    const str = this.#decoder.decode(this.#view.buffer.slice(this.#offset, this.#offset + length));
    this.#offset += length;
    return str;
  }

  readVec3Uint8() {
    return [this.readUint8(), this.readUint8(), this.readUint8()];
  }

  readVec3Uint16() {
    return [this.readUint16(), this.readUint16(), this.readUint16()];
  }

  readVec3Float32() {
    return [this.readFloat32(), this.readFloat32(), this.readFloat32()];
  }
  
  sliceBuffer(size = 1) {
    const buffer = this.#view.buffer.slice(this.#offset, this.#offset + size);
    this.#offset += size;
    return buffer;
  }
};

export class BufferWritter {
  #view;
  #offset = 0;
  #encoder = new TextEncoder();

  buffer;
  
  constructor(buffer) {
    this.buffer = buffer;
    this.#view = new DataView(buffer);
  }

  get offset() {
    return this.#offset;
  }

  get view() {
    return this.#view;
  }
  
  writeUint8(value) {
    this.#view.setUint8(this.#offset, value);
    this.#offset++;
  }

  writeUint16(value, littleEndian = true) {
    this.#view.setUint16(this.#offset, value, littleEndian);
    this.#offset += 2;
  }

  writeFloat32(value, littleEndian = true) {
    this.#view.setFloat32(this.#offset, value, littleEndian);
    this.#offset += 4;
  }

  writeInt32(value, littleEndian = true) {
    this.#view.setInt32(this.#offset, value, littleEndian);
    this.#offset += 4;
  }

  writeString(value, littleEndian = true) {
    this.writeUint8(value.length);
    this.#encoder.encode(value);

    const { read, written } = this.#encoder.encodeInto(value, new Uint8Array(this.buffer, this.#offset));
    this.#offset += written;
    return value.length - read;
  }

  writeVec3Uint8(value) {
    const [x, y, z] = value;
    this
      .writeUint8(x)
      .writeUint8(y)
      .writeUint8(z)
    ;
  }

  writeVec3Uint16(value, littleEndian = true) {
    const [x, y, z] = value;
    this
      .writeUint16(x, littleEndian)
      .writeUint16(y, littleEndian)
      .writeUint16(z, littleEndian)
    ;
  }

  writeVec3Float32(value, littleEndian = true) {
    const [x, y, z] = value;
    this
      .writeFloat32(x, littleEndian)
      .writeFloat32(y, littleEndian)
      .writeFloat32(z, littleEndian)
    ;
  }
};

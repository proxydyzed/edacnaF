import {
  assert,
} from "./import.js";

export class BufferWriter {
  #source;
  offset;

  encoder = new TextEncoder();

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

  static allocate(size) {
    return new this(new ArrayBuffer(size));
  }

  static calculateStringLength(str) {
    // assert(new TextEncoder().encode(str).length === str.length, "NOTE: multi-code point string length calculation has not been implemented yet.");
    return String(str).length;

    // TODO:

    // let lens = 1;
    // for (const charecter of str) {
    //   const code = charecter.charCodeAt(0);

    //   if (code < 0x0080) {
    //     lens += 1;
    //   } else if (0x0080 < code < 0x07FF) {
    //     lens += 2;
    //   } else if (0x800 < code < 0xFFFF) {
    //     lens += 3;
    //   } else {
    //     lens += 4;
    //   }
    // }

    // return lens;
  }

  allocateMoreBytes(size) {
    const buffer = new ArrayBuffer(this.source.buffer.byteLength + size);
    void new Uint8Array(buffer)
      .set(new Uint8Array(this.source.buffer))
    ;

    this.source = new DataView(buffer);
  }

  ensureCapacity(size) {
    if (this.source.buffer.byteLength < this.offset + size) {
      this.allocateMoreBytes(Math.max(50, size));
    }
  }

  toBuffer() {
    return this.source.buffer.slice(0, this.offset);
  }

  writeUint8(value) {
    this.ensureCapacity(1);
    this.source.setUint8(this.offset, value);
    this.offset++;
  }

  writeUint16(value, littleEndian = true) {
    this.ensureCapacity(2);
    this.source.setUint16(this.offset, value, littleEndian);
    this.offset += 2;
  }

  writeUint32(value, littleEndian = true) {
    this.ensureCapacity(4);
    this.source.setUint32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeFloat32(value, littleEndian = true) {
    this.ensureCapacity(4);
    this.source.setFloat32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeInt32(value, littleEndian = true) {
    this.ensureCapacity(4);
    this.source.setInt32(this.offset, value, littleEndian);
    this.offset += 4;
  }

  writeString(value, littleEndian = true) {
    this.ensureCapacity(1 + BufferWriter.calculateStringLength(value));
    this.writeUint8(value.length);

    const { read, written } = this.encoder.encodeInto(value, new Uint8Array(this.source.buffer, this.offset));
    this.offset += written;
    return value.length - read;
  }

  writeUint8Array(arr) {
    const uint8arr = new Uint8Array(this.source.buffer);
    uint8arr.set(arr, this.offset);
    this.offset += arr.length;
  }
};

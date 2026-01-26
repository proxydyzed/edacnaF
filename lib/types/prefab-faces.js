import {
  combineData,
} from "./combine-data.js";

export class Faces {
  // These are private solely because of keeping the
  // console clean when trying to print out a prefab.
  #positiveX; // u8[512]
  #negativeX; // u8[512]
  #positiveY; // u8[512]
  #negativeY; // u8[512]
  #positiveZ; // u8[512]
  #negativeZ; // u8[512]

  get positiveX() { return this.#positiveX; }
  set positiveX(positiveX) { this.#positiveX = positiveX; }

  get negativeX() { return this.#negativeX; }
  set negativeX(negativeX) { this.#negativeX = negativeX; }

  get positiveY() { return this.#positiveY; }
  set positiveY(positiveY) { this.#positiveY = positiveY; }

  get negativeY() { return this.#negativeY; }
  set negativeY(negativeY) { this.#negativeY = negativeY; }

  get positiveZ() { return this.#positiveZ; }
  set positiveZ(positiveZ) { this.#positiveZ = positiveZ; }

  get negativeZ() { return this.#negativeZ; }
  set negativeZ(negativeZ) { this.#negativeZ = negativeZ; }

  static unglueBitOffset = 7;

  // the magic number is basically 6 sides and 8 voxels in each axis
  // 6 * 8 * 8 * 8 = 3072
  static size = 3072;
  static voxelArrayLength = 512;

  constructor(positiveX, negativeX, positiveY, negativeY, positiveZ, negativeZ) {
    this.positiveX = positiveX;
    this.negativeX = negativeX;
    this.positiveY = positiveY;
    this.negativeY = negativeY;
    this.positiveZ = positiveZ;
    this.negativeZ = negativeZ;
  }

  toJSON() {
    return {
      positiveX: combineData(this.positiveX),
      negativeX: combineData(this.negativeX),
      positiveY: combineData(this.positiveY),
      negativeY: combineData(this.negativeY),
      positiveZ: combineData(this.positiveZ),
      negativeZ: combineData(this.negativeZ),
    };
  }

  clone() {
    return Faces.from({
      positiveX: this.positiveX.slice(0),
      negativeX: this.negativeX.slice(0),
      positiveY: this.positiveY.slice(0),
      negativeY: this.negativeY.slice(0),
      positiveZ: this.positiveZ.slice(0),
      negativeZ: this.negativeZ.slice(0),
    });
  }

  static from(__inst__) {
    if ("positiveX" in __inst__) {
      if (typeof __inst__.positiveX !== "object") {
        throw new Error(`Expected field "positiveX" to be "object", but got ${typeof __inst__.positiveX}`);
      }
      if (__inst__.positiveX === null) {
        throw new Error(`Field "positiveX" can not be null`);
      }
    } else {
      throw new Error(`Expected "positiveX" field`);
    }
    if ("negativeX" in __inst__) {
      if (typeof __inst__.negativeX !== "object") {
        throw new Error(`Expected field "negativeX" to be "object", but got ${typeof __inst__.negativeX}`);
      }
      if (__inst__.negativeX === null) {
        throw new Error(`Field "negativeX" can not be null`);
      }
    } else {
      throw new Error(`Expected "negativeX" field`);
    }
    if ("positiveY" in __inst__) {
      if (typeof __inst__.positiveY !== "object") {
        throw new Error(`Expected field "positiveY" to be "object", but got ${typeof __inst__.positiveY}`);
      }
      if (__inst__.positiveY === null) {
        throw new Error(`Field "positiveY" can not be null`);
      }
    } else {
      throw new Error(`Expected "positiveY" field`);
    }
    if ("negativeY" in __inst__) {
      if (typeof __inst__.negativeY !== "object") {
        throw new Error(`Expected field "negativeY" to be "object", but got ${typeof __inst__.negativeY}`);
      }
      if (__inst__.negativeY === null) {
        throw new Error(`Field "negativeY" can not be null`);
      }
    } else {
      throw new Error(`Expected "negativeY" field`);
    }
    if ("positiveZ" in __inst__) {
      if (typeof __inst__.positiveZ !== "object") {
        throw new Error(`Expected field "positiveZ" to be "object", but got ${typeof __inst__.positiveZ}`);
      }
      if (__inst__.positiveZ === null) {
        throw new Error(`Field "positiveZ" can not be null`);
      }
    } else {
      throw new Error(`Expected "positiveZ" field`);
    }
    if ("negativeZ" in __inst__) {
      if (typeof __inst__.negativeZ !== "object") {
        throw new Error(`Expected field "negativeZ" to be "object", but got ${typeof __inst__.negativeZ}`);
      }
      if (__inst__.negativeZ === null) {
        throw new Error(`Field "negativeZ" can not be null`);
      }
    } else {
      throw new Error(`Expected "negativeZ" field`);
    }
    return new this(__inst__.positiveX, __inst__.negativeX, __inst__.positiveY, __inst__.negativeY, __inst__.positiveZ, __inst__.negativeZ);
  }
}

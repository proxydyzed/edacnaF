import {
  Vector3Uint16,
} from "./vector.js";

import {
  combineData,
} from "./combine-data.js";

export class Tiles {
  size; // vec3u16
  #data; // u16[]

  get data() { return this.#data; }
  set data(data) { this.#data = data; }

  constructor(size, data) {
    this.size = size;
    this.data = data;
  }

  toJSON() {
    return {
      size: this.size,
      data: combineData(this.data),
    };
  }

  clone() {
    return Tiles.from({
      size: this.size,
      data: this.data.slice(0),
    });
  }

  static from(__inst__) {
    if ("size" in __inst__) {
      if (typeof __inst__.size !== "object") {
        throw new Error(`Expected field "size" to be "object", but got ${typeof __inst__.size}`);
      }
    } else {
      throw new Error(`Expected "size" field`);
    }
    if ("data" in __inst__) {
      if (typeof __inst__.data !== "object") {
        throw new Error(`Expected field "data" to be "object", but got ${typeof __inst__.data}`);
      }
      if (__inst__.data === null) {
        throw new Error(`Field "data" can not be null`);
      }
    } else {
      throw new Error(`Expected "data" field`);
    }
    return new this(Vector3Uint16.from(__inst__.size), __inst__.data);
  }
}

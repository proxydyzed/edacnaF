import {
  Vector3Uint8,
} from "./vector.js";

export class Group {
  index;    // u16
  position; // vec3u8

  static size = 5;

  constructor(index, position) {
    this.index = index;
    this.position = position;
  }

  clone() {
    return Group.from({
      index: this.index,
      position: this.position,
    });
  }

  static from(__inst__) {
    const index = "index" in __inst__ ? __inst__.index : 0;
    if (typeof index !== "number") {
      throw new Error(`Expected field "index" to be "number", but got ${typeof index}`);
    }
    if ("position" in __inst__) {
      if (typeof __inst__.position !== "object") {
        throw new Error(`Expected field "position" to be "object", but got ${typeof __inst__.position}`);
      }
      if (__inst__.position === null) {
        throw new Error(`Field "position" can not be null`);
      }
    } else {
      throw new Error(`Expected "position" field`);
    }
    return new this(index, Vector3Uint8.from(__inst__.position));
  }
}

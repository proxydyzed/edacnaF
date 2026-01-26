import {
  Vector3Uint16,
} from "./vector.js";

class VectorRange {
  from; // vec3u16
  to;   // vec3u16

  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  static from(__inst__) {
    if ("from" in __inst__) {
      if (typeof __inst__.from !== "object") {
        throw new Error(`Expected field "from" to be "object", but got ${typeof __inst__.from}`);
      }
      if (__inst__.from === null) {
        throw new Error(`Field "from" can not be null`);
      }
    } else {
      throw new Error(`Expected "from" field`);
    }
    if ("to" in __inst__) {
      if (typeof __inst__.to !== "object") {
        throw new Error(`Expected field "to" to be "object", but got ${typeof __inst__.to}`);
      }
      if (__inst__.to === null) {
        throw new Error(`Field "to" can not be null`);
      }
    } else {
      throw new Error(`Expected "to" field`);
    }
    return new this(Vector3Uint16.from(__inst__.from), Vector3Uint16.from(__inst__.to));
  }
}

export class Connection {
  position; // VectorRange
  offset;   // VectorRange

  static size = 24;
  static VectorRange = VectorRange;

  constructor(position, offset) {
    this.position = position;
    this.offset = offset;
  }

  clone() {
    return Connection.from({
      position: this.position,
      offset: this.offset,
    });
  }

  static from(__inst__) {
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
    if ("offset" in __inst__) {
      if (typeof __inst__.offset !== "object") {
        throw new Error(`Expected field "offset" to be "object", but got ${typeof __inst__.offset}`);
      }
      if (__inst__.offset === null) {
        throw new Error(`Field "offset" can not be null`);
      }
    } else {
      throw new Error(`Expected "offset" field`);
    }
    return new this(Connection.VectorRange.from(__inst__.position), Connection.VectorRange.from(__inst__.offset));
  }
};

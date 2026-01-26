import {
  poisonPill,
} from "./import.js";

import {
  Vector3Uint16,
  Vector3Float,
} from "./vector.js";

export class Setting {
  index;    // u8
  type;     // enum Setting.Types
  position; // class Vector3Uint16
  value;    // u8 | u16 | i32 | f32 | vec3f32 | string

  static Type = Object.freeze({
    __proto__: poisonPill,
    Byte   : 1,
    Short  : 2,
    Int    : 3,
    Float  : 4,
    Vec    : 5,
    Str    : 6,
    ExePin : 7,
    NumPin : 8,
    This   : 9,
    VecPin : 10,
    RotPin : 12,
    TruPin : 14,
    ObjPin : 16,
    ConPin : 18,
  });

  constructor(index, type, position, value) {
    this.index = index;
    this.type = type;
    this.position = position;
    this.value = value;
  }

  clone() {
    return Setting.from({
      index: this.index,
      type: this.type,
      position: this.position,
      value: this.value,
    })
  }

  static from(__inst__) {
    if ("index" in __inst__) {
      if (typeof __inst__.index !== "number") {
        throw new Error(`Expected field "index" to be "number", but got ${typeof __inst__.index}`);
      }
    } else {
      throw new Error(`Expected "index" field`);
    }
    if ("type" in __inst__) {
      if (typeof __inst__.type !== "number") {
        throw new Error(`Expected field "type" to be "number", but got ${typeof __inst__.type}`);
      }
    } else {
      throw new Error(`Expected "type" field`);
    }
    if ("position" in __inst__) {
      if (typeof __inst__.position !== "object") {
        throw new Error(`Expected field "position" to be "object", but got ${typeof __inst__.position}`);
      }
    } else {
      throw new Error(`Expected "position" field`);
    }

    let value;
    if ("value" in __inst__) {
      if        (typeof __inst__.value === "string") {
        value = __inst__.value;
      } else if (typeof __inst__.value === "number") {
        value = __inst__.value;
      } else if (typeof __inst__.value === "object") {
        if (__inst__.value === null) {
          throw new Error(`Field "value" can not be null`);
        }
        value = Vector3Float.from(__inst__.value);
      } else {
        throw new Error(`Expected field "value" to be "number" | "string" | "object", but got ${typeof __inst__.value}`);
      }
    } else {
      throw new Error(`Expected "value" field`);
    }
    return new this(__inst__.index, __inst__.type, Vector3Uint16.from(__inst__.position), value);
  }
};

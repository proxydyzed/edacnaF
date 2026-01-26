export class Vector3 {
  x;
  y;
  z;

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  area() {
    return this.x * this.y * this.z;
  }

  toString() {
    return [this.x, this.y, this.z].map(String).join(",");
  }

  static parse(str) {
    const [x, y, z] = str.split(",").map(Number);
    return this.from({ x, y, z });
  }

  static from(__inst__) {
    const x = "x" in __inst__ ? __inst__.x : 0;
    if (typeof x !== "number") {
      throw new Error(`Expected field "x" to be "number", but got ${typeof x}`);
    }
    const y = "y" in __inst__ ? __inst__.y : 0;
    if (typeof y !== "number") {
      throw new Error(`Expected field "y" to be "number", but got ${typeof y}`);
    }
    const z = "z" in __inst__ ? __inst__.z : 0;
    if (typeof z !== "number") {
      throw new Error(`Expected field "z" to be "number", but got ${typeof z}`);
    }
    return new this(x, y, z);
  }
};

export class Vector3Uint8  extends Vector3 {
  static min = 0;
  static max = 256;

  static from(vec) {
    const { x, y, z } = super.from(vec);
    return new this(
      Math.floor(Math.max(Math.min(x, this.max), this.min)),
      Math.floor(Math.max(Math.min(y, this.max), this.min)),
      Math.floor(Math.max(Math.min(z, this.max), this.min)),
    );
  }
};

export class Vector3Uint16 extends Vector3Uint8 {
  static min = 0;
  static max = 65536;
};

export class Vector3Float  extends Vector3 {};

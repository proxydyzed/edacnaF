import { objectToReverseMap } from "./object-to-reverse-map.js";

// Most of the classes in this file only houses
// fields and data. There are no charecter trait
// implemented in any of them so that the code is
// easier to argue about just by looking at the
// function that calls these classes. The only
// reason for using classes is because JavaScript
// does not have `struct`s yet :/

export class Game {
  fileVersion =  31; // u16
  title       =  ""; // string
  author      =  ""; // string
  description =  ""; // string
  indexOffset = 597; // u16
  prefabs     =  []; // class Prefab[]
}

export class Connection {
  position = new Connection.Vector3Tuple();
  offset   = new Connection.Vector3Tuple();

  static Vector3Tuple = class Vector3Tuple {
    from; // = new Vector3Uint16();
    to;   // = new Vector3Uint16();
  };

  static size = 24;
}

export class Setting {
  index;    // u8
  type;     // enum Setting.Types
  position; // class Vector3Uint16
  value;    // u8 | u16 | i32 | f32 | vec3f32 | string

  static Types = Object.freeze({
    Byte   : 0x01,
    Short  : 0x02,
    Int    : 0x03,
    Float  : 0x04,
    Vec    : 0x05,
    Str    : 0x06,

    ExePin : 0x07,
    NumPin : 0x08,
    This   : 0x09,
    VecPin : 0x0a,
    RotPin : 0x0c,
    TruPin : 0x0e,
    ObjPin : 0x10,
    ConPin : 0x12,
  });

  static TypeNames = objectToReverseMap(Setting.Types);
}

export class Prefab {
  header = 0;      // u16

  type = 0;        // enum Prefab.Types
  name;            // string

  _data1;          // u8
  _data2;          // u32

  backgroundColor; // u8
  collider;        // u8
  group;           // class Prefab.Group
  faces;           // class Prefab.Faces
  tiles;           // class Prefab.Tiles
  settings;        // class Setting[]
  connections;     // class Connection[]

  // I lied a litle when I said there are no
  // implementations. This is the only one
  // and it's purely because functions are
  // more readable than manually bit shifting
  // everywhere.
  static Header = class Header {
    bits;

    constructor(bits) {
      this.bits = bits;
    }

    // Higher level control over bit manipulation.
    // This API is purely for convenience, it gets
    // tiresome to shift bits around everywhere.
    hasConnections() { return (this.bits >> Header.BitOffset.hasConnections) & 1; }
    hasSettings() {    return (this.bits >> Header.BitOffset.hasSettings) & 1; }
    hasBlocks() {      return (this.bits >> Header.BitOffset.hasBlocks) & 1; }
    hasVoxels() {      return (this.bits >> Header.BitOffset.hasVoxels) & 1; }
    inGroup() {        return (this.bits >> Header.BitOffset.inGroup) & 1; }
    hasCollider() {    return (this.bits >> Header.BitOffset.hasCollider) & 1; }
    uneditable1() {    return (this.bits >> Header.BitOffset.uneditable1) & 1; }
    uneditable2() {    return (this.bits >> Header.BitOffset.uneditable2) & 1; }
    hasBackground() {  return (this.bits >> Header.BitOffset.hasBackground) & 1; }
    hasData2() {       return (this.bits >> Header.BitOffset.hasData2) & 1; }
    hasData1() {       return (this.bits >> Header.BitOffset.hasData1) & 1; }
    hasName() {        return (this.bits >> Header.BitOffset.hasName) & 1; }
    hasType() {        return (this.bits >> Header.BitOffset.hasType) & 1; }

    setConnections(value) { this.setBit(value, Header.BitOffset.hasConnections); }
    setSettings(value) {    this.setBit(value, Header.BitOffset.hasSettings); }
    setBlocks(value) {      this.setBit(value, Header.BitOffset.hasBlocks); }
    setVoxels(value) {      this.setBit(value, Header.BitOffset.hasVoxels); }
    setGroup(value) {       this.setBit(value, Header.BitOffset.inGroup); }
    setCollider(value) {    this.setBit(value, Header.BitOffset.hasCollider); }
    setUneditable1(value) { this.setBit(value, Header.BitOffset.uneditable1); }
    setUneditable2(value) { this.setBit(value, Header.BitOffset.uneditable2); }
    setBackground(value) {  this.setBit(value, Header.BitOffset.hasBackground); }
    setData2(value) {       this.setBit(value, Header.BitOffset.hasData2); }
    setData1(value) {       this.setBit(value, Header.BitOffset.hasData1); }
    setName(value) {        this.setBit(value, Header.BitOffset.hasName); }
    setType(value) {        this.setBit(value, Header.BitOffset.hasType); }

    setBit(value, offset) {
      // Checking for `true` because this is JS
      // and in JS anything can be anything else
      if (value === true) {
        this.bits |= 1 << offset;
      } else {
        this.bits &= 0b1111_1111_1111_1111 ^ (1 << offset);
      }

      // return this so methods can be chained
      return this;
    }

    static BitOffset = Object.freeze({
      hasConnections : 0,
      hasSettings    : 1,
      hasBlocks      : 2,
      hasVoxels      : 3,
      inGroup        : 4,
      hasCollider    : 5,
      uneditable1    : 6,
      uneditable2    : 7,
      hasBackground  : 8,
      hasData2       : 9,
      hasData1       : 10,
      hasName        : 11,
      hasType        : 12,
    });
  };

  static Types = Object.freeze({
    Normal  : 0,
    Physics : 1,
    Script  : 2,
    Level   : 3,
  });

  static TypeNames = objectToReverseMap(Prefab.Types);

  static Color = Object.freeze({
    None         : 0x00,
    DarkGray     : 0x01,
    Gray         : 0x02,
    LightGray    : 0x03,
    DarkSilver   : 0x04,
    Silver       : 0x05,
    LightSilver  : 0x06,
    DarkBrown    : 0x07,
    Brown        : 0x08,
    LightBrown   : 0x09,
    DarkBeige    : 0x0A,
    Beige        : 0x0B,
    LightBeige   : 0x0C,
    DarkRed      : 0x0D,
    Red          : 0x0E,
    LightRed     : 0x0F,
    DarkOrange   : 0x10,
    Orange       : 0x11,
    LightOrange  : 0x12,
    DarkYellow   : 0x13,
    Yellow       : 0x14,
    LightYellow  : 0x15,
    DarkGreen    : 0x16,
    Green        : 0x17,
    LightGreen   : 0x18,
    DarkBlue     : 0x19,
    Blue         : 0x1A,
    LightBlue    : 0x1B,
    DarkPurple   : 0x1C,
    Purple       : 0x1D,
    LightPurple  : 0x1E,
    DarkMagenta  : 0x1F,
    Magenta      : 0x20,
    LightMagenta : 0x21,
  });

  static ColorNames = objectToReverseMap(Prefab.Color);

  static Collider = Object.freeze({
    None:    0,
    Box:     1,
    Sphere:  2,
    Surface: 3,
    Exact:   4,
  });

  static ColliderNames = objectToReverseMap(Prefab.Collider);

  static Group = class Group {
    index;    // = 0;                  // u16
    position; // = new Vector3Uint8(); // vec3i8

    static size = 5;
  };

  static Faces = class Faces {
    positiveX; // = Array(512);
    negativeX; // = Array(512);

    positiveY; // = Array(512);
    negativeY; // = Array(512);

    positiveZ; // = Array(512);
    negativeZ; // = Array(512);

    static unglueBitOffset = 7;

    // the magic number is basically 6 sides and 8 voxels in each axis
    // 6 * 8 * 8 * 8 = 3072
    static size = 3072;
    static voxelArrayLength = 512;
  };

  static Tiles = class Tiles {
    size;   // = new Vector3Uint16();
    blocks; // u16[] as Array(size.x * size.y * size.z)
  };

  // Okay I lied a little more when I said that
  // the 2nd time. This one is just to avoid some
  // boilerplate code when creating Prefabs.
  static Default = class DefaultPrefab extends Prefab {
    constructor(type, name) {
      super();
      this.type = type;
      this.name = name;
    }

    static Level(name, color = null) {
      const prefab = new this(Prefab.Types.Level, name);
      if (typeof color === "number") {
        prefab.backgroundColor = color;
      }

      return prefab;
    }

    static Script(name) {
      return new this(Prefab.Types.Script, name);
    }

    static Normal(name) {
      return new this(Prefab.Types.Normal, name);
    }

    static Physics(name) {
      return new this(Prefab.Types.Physics, name);
    }
  };
}

// These types are the same in Javascript.
// Seprated for clarity.
// And no I won't make a base class and
// then extend them 3 times. I don't want
// to overdo the already stinky amount of
// OOP I have in this file :\
export class Vector3Uint8 {
  x; // i8
  y; // i8
  z; // i8

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // So that I can do this if I needed to,
  // const [x, y, z] = new Vector3Uint8(...);
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
};

export class Vector3Uint16 {
  x; // u16
  y; // u16
  z; // u16

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
};

export class Vector3Float {
  x; // float
  y; // float
  z; // float

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
};

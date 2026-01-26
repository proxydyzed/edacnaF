import {
  poisonPill,
} from "./import.js";

import {
  Header,
} from "./prefab-header.js";

import {
  Group,
} from "./prefab-group.js";

import {
  Faces,
} from "./prefab-faces.js";

import {
  Tiles,
} from "./prefab-tiles.js";

import {
  Vector3Uint8,
  Vector3Uint16,
  Vector3Float,
} from "./vector.js";

const Type = Object.freeze({
  __proto__: poisonPill,
  Normal  : 0,
  Physics : 1,
  Script  : 2,
  Level   : 3,
});

const Color = Object.freeze({
  __proto__: poisonPill,
  None         : 0,
  DarkGray     : 1,
  Gray         : 2,
  LightGray    : 3,
  DarkSilver   : 4,
  Silver       : 5,
  LightSilver  : 6,
  DarkBrown    : 7,
  Brown        : 8,
  LightBrown   : 9,
  DarkBeige    : 10,
  Beige        : 11,
  LightBeige   : 12,
  DarkRed      : 13,
  Red          : 14,
  LightRed     : 15,
  DarkOrange   : 16,
  Orange       : 17,
  LightOrange  : 18,
  DarkYellow   : 19,
  Yellow       : 20,
  LightYellow  : 21,
  DarkGreen    : 22,
  Green        : 23,
  LightGreen   : 24,
  DarkBlue     : 25,
  Blue         : 26,
  LightBlue    : 27,
  DarkPurple   : 28,
  Purple       : 29,
  LightPurple  : 30,
  DarkMagenta  : 31,
  Magenta      : 32,
  LightMagenta : 33,
});

const Collider = Object.freeze({
  __proto__: poisonPill,
  None    : 0,
  Box     : 1,
  Sphere  : 2,
  Surface : 3,
  Exact   : 4,
});

export class Prefab {
  type;            // enum Prefab.Types
  name;            // string
  editable;        // boolean
  _data1;          // u8
  _data2;          // u32
  backgroundColor; // u8
  collider;        // u8
  group;           // class Prefab.Group
  faces;           // class Prefab.Faces
  tiles;           // class Prefab.Tiles
  settings;        // class Setting[]
  connections;     // class Connection[]

  static Header = Header;
  static Group  = Group;
  static Faces  = Faces;
  static Tiles  = Tiles;

  static Type     = Type;
  static Color    = Color;
  static Collider = Collider;

  constructor(type, name, editable, _data1, _data2, backgroundColor, collider, group, faces, tiles, settings, connections) {
    this.type = type;
    this.name = name;
    this.editable = editable;
    this._data1 = _data1;
    this._data2 = _data2;
    this.backgroundColor = backgroundColor;
    this.collider = collider;
    this.group = group;
    this.faces = faces;
    this.tiles = tiles;
    this.settings = settings;
    this.connections = connections;
  }

  clone() {
    return Prefab.from({
      type            : this.type,
      name            : this.name,
      editable        : this.editable,
      _data1          : this._data1,
      _data2          : this._data2,
      backgroundColor : this.backgroundColor,
      collider        : this.collider,
      group           : this.group       === null ? null : this.group.clone(),
      faces           : this.faces       === null ? null : this.faces.clone(),
      tiles           : this.tiles       === null ? null : this.tiles.clone(),
      settings        : this.settings    === null ? null : Array.from(this.settings,     setting   =>    setting.clone()),
      connections     : this.connections === null ? null : Array.from(this.connections, connection => connection.clone()),
    });
  }

  static from(__inst__) {
    const type = "type" in __inst__ ? __inst__.type : null;
    if (typeof type !== "number" && type !== null) {
      throw new Error(`Expected field "type" to be "number", but got ${typeof type}`);
    }
    const name = "name" in __inst__ ? __inst__.name : null;
    if (typeof name !== "string" && name !== null) {
      throw new Error(`Expected field "name" to be "string", but got ${typeof name}`);
    }
    const editable = "editable" in __inst__ ? __inst__.editable : false;
    if (typeof editable !== "boolean") {
      throw new Error(`Expected field "editable" to be "boolean", but got ${typeof editable}`);
    }
    const _data1 = "_data1" in __inst__ ? __inst__._data1 : null;
    if (typeof _data1 !== "number" && _data1 !== null) {
      throw new Error(`Expected field "_data1" to be "number", but got ${typeof _data1}`);
    }
    const _data2 = "_data2" in __inst__ ? __inst__._data2 : null;
    if (typeof _data2 !== "number" && _data2 !== null) {
      throw new Error(`Expected field "_data2" to be "number", but got ${typeof _data2}`);
    }
    const backgroundColor = "backgroundColor" in __inst__ ? __inst__.backgroundColor : null;
    if (typeof backgroundColor !== "number" && backgroundColor !== null) {
      throw new Error(`Expected field "backgroundColor" to be "number", but got ${typeof backgroundColor}`);
    }
    const collider = "collider" in __inst__ ? __inst__.collider : null;
    if (typeof collider !== "number" && collider !== null) {
      throw new Error(`Expected field "collider" to be "number", but got ${typeof collider}`);
    }
    const group = "group" in __inst__ ? __inst__.group : null;
    if (typeof group !== "object") {
      throw new Error(`Expected field "group" to be "object", but got ${typeof group}`);
    }
    const faces = "faces" in __inst__ ? __inst__.faces : null;
    if (typeof faces !== "object") {
      throw new Error(`Expected field "faces" to be "object", but got ${typeof faces}`);
    }
    const tiles = "tiles" in __inst__ ? __inst__.tiles : null;
    if (typeof tiles !== "object") {
      throw new Error(`Expected field "tiles" to be "object", but got ${typeof tiles}`);
    }
    const settings = "settings" in __inst__ ? __inst__.settings : null;
    if (typeof settings !== "object") {
      throw new Error(`Expected field "settings" to be "object", but got ${typeof settings}`);
    }
    const connections = "connections" in __inst__ ? __inst__.connections : null;
    if (typeof connections !== "object") {
      throw new Error(`Expected field "connections" to be "object", but got ${typeof connections}`);
    }
    return new this(type, name, editable, _data1, _data2, backgroundColor, collider, group, faces, tiles, settings, connections);
  }
};

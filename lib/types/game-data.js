export class GameData {
  fileVersion; // u16
  title;       // string
  author;      // string
  description; // string
  indexOffset; // u16

  #prefabs;     // class Prefab[]

  get prefabs() { return this.#prefabs; }
  set prefabs(prefabs) { this.#prefabs = prefabs; }

  constructor(fileVersion, title, author, description, indexOffset, prefabs) {
    this.fileVersion = fileVersion;
    this.title = title;
    this.author = author;
    this.description = description;
    this.indexOffset = indexOffset;
    this.prefabs = prefabs;
  }

  static from(__inst__) {
    const fileVersion = "fileVersion" in __inst__ ? __inst__.fileVersion : 31;
    if (typeof fileVersion !== "number") {
      throw new Error(`Expected field "fileVersion" to be "number", but got ${typeof fileVersion}`);
    }
    if ("title" in __inst__) {
      if (typeof __inst__.title !== "string") {
        throw new Error(`Expected field "title" to be "string", but got ${typeof __inst__.title}`);
      }
    } else {
      throw new Error(`Expected "title" field`);
    }
    if ("author" in __inst__) {
      if (typeof __inst__.author !== "string") {
        throw new Error(`Expected field "author" to be "string", but got ${typeof __inst__.author}`);
      }
    } else {
      throw new Error(`Expected "author" field`);
    }
    if ("description" in __inst__) {
      if (typeof __inst__.description !== "string") {
        throw new Error(`Expected field "description" to be "string", but got ${typeof __inst__.description}`);
      }
    } else {
      throw new Error(`Expected "description" field`);
    }
    const indexOffset = "indexOffset" in __inst__ ? __inst__.indexOffset : 597;
    if (typeof indexOffset !== "number") {
      throw new Error(`Expected field "indexOffset" to be "number", but got ${typeof indexOffset}`);
    }
    if ("prefabs" in __inst__) {
      if (typeof __inst__.prefabs !== "object") {
        throw new Error(`Expected field "prefabs" to be "object", but got ${typeof __inst__.prefabs}`);
      }
    } else {
      throw new Error(`Expected "prefabs" field`);
    }
    return new this(fileVersion, __inst__.title, __inst__.author, __inst__.description, indexOffset, __inst__.prefabs);
  }
};

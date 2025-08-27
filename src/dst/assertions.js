import { Prefab, Setting } from "./types.js";

const { voxelArrayLength } = Prefab.Faces;
export function assertPrefabFacesLength(prefab) {
  for (const field of [
    "positiveX",
    "negativeX",
    "positiveY",
    "negativeY",
    "positiveZ",
    "negativeZ",
  ]) {
    if (prefab.faces[field].length !== voxelArrayLength) {
      throw new TypeError(`Expected faces.${field}.length to be ${voxelArrayLength}, but got ${prefab.faces[field].length}`);
    }
  }
}

export function assertPrefabTilesSize(prefab) {
  assertVector(prefab.tiles.size);
  const { x, y, z } = prefab.tiles.size;
  if (x * y * z !== prefab.tiles.blocks.length) {
    throw new Error(`Expected tiles.blocks.length (${prefab.tiles.blocks.length}) to be equivalent to tiles.size (${x}, ${y}, ${z})`);
  }
}

export function prefabHasGroup(prefab) {
  if (!("group" in prefab)) {
    return false;
  }

  const { group } = prefab;
  if (typeof prefab.group !== "object") {
    return false;
  }
  if (prefab.group === null) {
    return false;
  }
  if (!("index" in prefab.group)) {
    return false;
  }
  if (typeof prefab.group.index !== "number") {
    return false;
  }
  if (!("position" in prefab.group)) {
    return false;
  }
  if (typeof prefab.group.position !== "object") {
    return false;
  }
  if (typeof prefab.group.position === null) {
    return false;
  }
  // if (!isVector3(prefab.group.position)) {
  //   return false;
  // }
  return true;
}

export function prefabHasFaces(prefab) {
  if (!("faces" in prefab)) {
    return false;
  }

  const { faces } = prefab;
  if (typeof faces !== "object") {
    return false;
  }
  if (faces === null) {
    return false;
  }

  for (const field of [
    "positiveX",
    "negativeX",
    "positiveY",
    "negativeY",
    "positiveZ",
    "negativeZ",
  ]) {
    if (!(field in faces)) {
      return false;
    }
    if (!Array.isArray(faces[field])) {
      return false;
    }
  }

  return true;
}

export function prefabHasTiles(prefab) {
  if (!("tiles" in prefab)) {
    return false;
  }

  const { tiles } = prefab;
  if (typeof tiles !== "object") {
    return false;
  }
  if (tiles === null) {
    return false;
  }

  if (!("size" in tiles)) {
    return false;
  }
  if (typeof tiles.size !== "object") {
    return false;
  }
  if (tiles.size === null) {
    return false;
  }
  // if (!isVector3(tiles.size)) {
  //   return false;
  // }
  if (!("blocks" in tiles)) {
    return false;
  }
  if (tiles.blocks === null) {
    return false;
  }
  if (!Array.isArray(tiles.blocks)) {
    return false;
  }
  // if (tiles.size.x * tiles.size.y * tiles.size.z !== tiles.blocks.length) {
  //   return false;
  // }

  return true;
}

export function prefabHasSettings(prefab) {
  if (!("settings" in prefab)) {
    return false;
  }

  const { settings } = prefab;
  if (typeof settings !== "object") {
    return false;
  }
  if (settings === null) {
    return false;
  }
  if (!Array.isArray(settings)) {
    return false;
  }

  return true;
}

export function prefabHasConnections(prefab) {
  if (!("connections" in prefab)) {
    return false;
  }

  const { connections } = prefab;
  if (typeof connections !== "object") {
    return false;
  }
  if (connections === null) {
    return false;
  }
  if (!Array.isArray(connections)) {
    return false;
  }

  return true;
}

export function isVector3(vec) {
  if ('x' in vec) {
    if (typeof vec.x !== "number") {
      return false;
    }
  } else {
    return false;
  }

  if ('y' in vec) {
    if (typeof vec.y !== "number") {
      return false;
    }
  } else {
    return false;
  }

  if ('z' in vec) {
    if (typeof vec.z !== "number") {
      return false;
    }
  } else {
    return false;
  }

  return true;
}

export function assertVector(vec) {
  if ('x' in vec) {
    if (typeof vec.x !== "number") {
      throw new TypeError(`Expected vector.x to be a number, but got ${typeof vec.x}`);
    }
  } else {
    throw new TypeError(`Expected field 'x' in vector`);
  }

  if ('y' in vec) {
    if (typeof vec.y !== "number") {
      throw new TypeError(`Expected vector.y to be a number, but got ${typeof vec.y}`);
    }
  } else {
    throw new TypeError(`Expected field 'y' in vector`);
  }

  if ('z' in vec) {
    if (typeof vec.z !== "number") {
      throw new TypeError(`Expected vector.z to be a number, but got ${typeof vec.z}`);
    }
  } else {
    throw new TypeError(`Expected field 'z' in vector`);
  }
};

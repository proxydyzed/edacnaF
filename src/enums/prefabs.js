import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

export const PrefabTypes = Object.freeze({
  Normal  : 0,
  Physics : 1,
  Script  : 2,
  Level   : 3,
});

export const PrefabNames = objectToReverseMap(PrefabTypes);

import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

export const ColliderTypes = Object.freeze({
  None:    0,
  Box:     1,
  Sphere:  2,
  Surface: 3,
  Exact:   4,
});

export const ColliderNames = objectToReverseMap(ColliderTypes);

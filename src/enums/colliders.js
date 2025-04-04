import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

const Members = Object.freeze({
  None:    0,
  Box:     1,
  Sphere:  2,
  Surface: 3,
  Exact:   4,
});

const ReverseMap = objectToReverseMap(Members);

export {
  Members as default,
  ReverseMap,
};

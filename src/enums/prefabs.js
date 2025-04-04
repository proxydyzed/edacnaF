import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

const Members = Object.freeze({
  Normal:  0,
  Physics: 1,
  Script:  2,
  Level:   3,
});

const ReverseMap = objectToReverseMap(Members);

export {
  Members as default,
  ReverseMap,
};

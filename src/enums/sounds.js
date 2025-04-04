import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

const Members = Object.freeze({
  Chirp   : 0,
  Scrape  : 1,
  Squeek  : 2,
  Engine  : 3,
  Button  : 4,
  Ball    : 5,
  Piano   : 6,
  Marimba : 7,
  Pad     : 8,
  Beep    : 9,
  Plop    : 10,
  Flop    : 11,
  Splash  : 12,
  Boom    : 13,
  Hit     : 14,
  Clang   : 15,
  Jump    : 16,
});

const ReverseMap = objectToReverseMap(Members);

export {
  Members as default,
  ReverseMap,
};

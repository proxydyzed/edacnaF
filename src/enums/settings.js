import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

export const SettingTypes = Object.freeze({
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

export const SettingNames = objectToReverseMap(SettingTypes);

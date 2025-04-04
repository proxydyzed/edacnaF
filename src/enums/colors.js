import { objectToReverseMap } from "../utils/object-to-reverse-map.js";

const Members = Object.freeze({
    None:          0x00,
    Dark_Gray:     0x01,
    Gray:          0x02,
    Light_Gray:    0x03,
    Dark_Silver:   0x04,
    Silver:        0x05,
    Light_Silver:  0x06,
    Dark_Brown:    0x07,
    Brown:         0x08,
    Light_Brown:   0x09,
    Dark_Beige:    0x0A,
    Beige:         0x0B,
    Light_Beige:   0x0C,
    Dark_Red:      0x0D,
    Red:           0x0E,
    Light_Red:     0x0F,
    Dark_Orange:   0x10,
    Orange:        0x11,
    Light_Orange:  0x12,
    Dark_Yellow:   0x13,
    Yellow:        0x14,
    Light_Yellow:  0x15,
    Dark_Green:    0x16,
    Green:         0x17,
    Light_Green:   0x18,
    Dark_Blue:     0x19,
    Blue:          0x1A,
    Light_Blue:    0x1B,
    Dark_Purple:   0x1C,
    Purple:        0x1D,
    Light_Purple:  0x1E,
    Dark_Magenta:  0x1F,
    Magenta:       0x20,
    Light_Magenta: 0x21,
});

const ReverseMap = objectToReverseMap(Members);

export {
  Members as default,
  ReverseMap,
};

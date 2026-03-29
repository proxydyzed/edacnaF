import {
  Vector3Uint16,
} from "./import.js";

export function connectionOffset(pos, side) {
  const { x, z } = Vector3Uint16.from(pos);
  switch (side) {
    case "up": {
      return Vector3Uint16.from({
        x: x * 8 + 3,
        y: 1,
        z: z * 8 + 6,
      });
    }

    case "down": {
      return Vector3Uint16.from({
        x: x * 8 + 3,
        y: 1,
        z: z * 8,
      });
    }

    case "left": {
      return Vector3Uint16.from({
        x: x * 8,
        y: 1,
        z: z * 8 + 3,
      });
    }

    case "right": {
      return Vector3Uint16.from({
        x: x * 8 + 6,
        y: 1,
        z: z * 8 + 3,
      });
    }

    default: {
      throw new TypeError(`Expected ConnectionOffsetSide, but got ${JSON.stringify(String(side))}`);
    }
  }
};

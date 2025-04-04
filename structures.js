export const PrefabType = Object.freeze({
  Normal:  0,
  Physics: 1,
  Script:  2,
  Level:   3,
});

export const ColliderType = Object.freeze({
  None:    0,
  Box:     1,
  Sphere:  2,
  Surface: 3,
  Exact:   4,
});

export const SettingType = Object.freeze({
  Byte:   0x01,
  Short:  0x02,
  Int:    0x03,
  Float:  0x04,
  Vec:    0x05,
  Str:    0x06,

  ExePin: 0x07,
  NumPin: 0x08,
  This:   0x09,
  VecPin: 0x0a,
  RotPin: 0x0c,
  TruPin: 0x0e,
  ObjPin: 0x10,
  ConPin: 0x12,
});

export class PrefabSetting {
  index;    // u8
  type;     // u8
  position; // vec3u16
  value;    // u8 | u16 | i32 | f32 | vec3f32 | string
}

export class PrefabConnection {
  positionFrom; // vec3u16
  positionTo;   // vec3u16
  offsetFrom;   // vec3u16
  offsetTo;     // vec3u16
}

export class Prefab {
  type = 0;         // PrefabType
  name;             // string

  locked;           // boolean
  
  data1;            // u8
  data2;            // u32

  backgroundColor;  // u8

  collider;         // u8
  
  groupId;          // u16
  positionInGroup;  // vec3u8

  faces;            // u8[6][8][8][8]

  insideSize;       // vec3u16
  tiles;            // u16[insideSize.x * insideSize.y * insideSize.z]

  settingsCount;    // u16
  settings;         // PrefabSetting[settingsCount]

  connectionsCount; // u16
  connections;      // PrefabConnection[connections]

  toJSON() {
    const {
      type,
      name,
      locked,
      backgroundColor,
      collider,
      groupId,
      positionInGroup,
      faces,
      insideSize,
      tiles,
      settings,
      connections,
    } = this;

    return {
      type,
      name,
      locked,
      backgroundColor,
      collider,
      group: {
        id: groupId,
        position: positionInGroup,
      },
      faces: faces ? "Vec3Uint8[6]" : null,
      tiles: insideSize ? {
        size: insideSize,
        data: tiles, 
        // data: convertTileDataToLayers(tiles, insideSize),
      } : null,
      settings,
      connections,
    };
  }
}

export class FancadeGame {
  fileVersion = 31;
  title;
  author;
  description;
  idOffset = 597;
  prefabs;
}

function convertTileDataToLayers(tiles, size) {
  const [x, y, z] = size;
  const layers = [];
  for (let dy = 0; dy < y; dy++) {
    const lines = [];
    for (let dz = 0; dz < z; dz++) {
      const line = [];
      for (let dx = 0; dx < x; dx++) {
        const index = dx + dy * x + dz * x * y;
        const tile = tiles[index];

        // because most tiles are empty
        // we can save some computation 
        // by just checking if its zero
        if (tile === 0) {
          line.push("   0");
        } else {
          line.push(String(tile).padStart(4, "0"));
        }
      }
      lines.push(line.join(" "));
    }
    layers.push(lines.reverse());
  }
  return layers;
}

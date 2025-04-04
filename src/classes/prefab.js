export default class Prefab {
  type = 0;         // enum PrefabType
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
  settings;         // struct Setting[settingsCount]

  connectionsCount; // u16
  connections;      // struct Connection[connections]

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
      faces,
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

export function convertTileDataToLayers(tiles, size) {
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

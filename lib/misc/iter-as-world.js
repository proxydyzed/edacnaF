export function* iterAsWorld(vec) {
  for (let z = 0; z < vec.z; z++) {
    for (let y = 0; y < vec.y; y++) {
      for (let x = 0; x < vec.x; x++) {
        const pos = { x, y, z };
        yield pos;
      }
    }
  }
}

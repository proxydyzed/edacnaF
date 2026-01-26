export function combineData(data) {
  // simple lossless compression algorithm
  const entries = [];
  let lastTile = -2;

  for (let i = 0; i < data.length; i++) {
    const num = data.at(i);
    if (num === 0) {
      continue;
    }

    if (i - lastTile > 1) {
      entries.push({ k: i, v: [] });
    }

    entries.at(-1).v.push(num);
    lastTile = i;
  }

  return entries;
}

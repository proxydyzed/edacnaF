export function objectToReverseMap(object) {
  return new Map(Object.entries(object).map(([key, value]) => ([value, key])));
}

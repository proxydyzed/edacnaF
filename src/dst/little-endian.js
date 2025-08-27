// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView#endianness
const arrayBuffer = new ArrayBuffer(2);
void new DataView(arrayBuffer).setInt16(0, 256, true /* little endian */);
// Int16Array uses the platform's endianness.
export const littleEndian = new Int16Array(arrayBuffer)[0] === 256;

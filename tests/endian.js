var bufLen = 10;
var buf    = new ArrayBuffer(bufLen);
var u8arr  = new Uint8Array(buf);
var u16arr = new Uint16Array(buf);
var view   = new DataView(buf);
u8arr.set(Array.from({ length: bufLen }, (_, i) => i + 1));

console.log(u16arr);
console.log(Array.from({ length: u16arr.length }, (_, i) => view.getUint16(i * 2, true)));

console.log(Array.from({ length: u16arr.length }, (_, i) => view.getUint16(i * 2, false)));
u8arr.reverse();
console.log(Array.from(u16arr).reverse());

// console.log(u8arr);
// console.log(new Uint8Array(u8arr.buffer.slice(2, 4)).reverse());
// console.log(u8arr);

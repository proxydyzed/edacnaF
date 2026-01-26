import {
  BufferWriter,
} from "./buffer-writer.js";


const str = String.raw`ツ¯\_(ツ)ツツツ_/¯`;

const buf = new TextEncoder().encode(str);
console.log(buf);
// console.log(str.length);
console.log("calculateStringLength():", BufferWriter.calculateStringLength(str));
console.log([...str].map(BufferWriter.calculateStringLength))
console.log([...str].map(s => new TextEncoder().encode(s).length));

// hEKbUt2e8D
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { decode } from "../exports.js";

const buffer = await readFile(join(import.meta.dirname, "./example-games/vector[1,2,3]"));
const arrayBuffer = await (new Response(new Blob([buffer.buffer]).stream().pipeThrough(new DecompressionStream("deflate")))).arrayBuffer();
// console.log(arrayBuffer);
console.log(decode(arrayBuffer).prefabs[0]);

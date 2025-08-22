import { join } from "node:path";
import { open, readFile, writeFile } from "node:fs/promises";

const pathname = join(import.meta.dirname, "games", "5D12154239F9DCE1");

const buf = await readFile(pathname);
const u32len = Math.floor(buf.length / 4);
const u8len  = buf.length - (u32len * 4);
const json = {
  u32: Array.from(new Uint32Array(buf.buffer.slice(0, u32len * 4))),
  u8 : Array.from(new Uint8Array(buf.buffer.slice(u32len * 4))),
};

// console.log(buf.length)
await writeFile(join(import.meta.dirname, "games", "5D12154239F9DCE1.js"), JSON.stringify(json, null, 2));
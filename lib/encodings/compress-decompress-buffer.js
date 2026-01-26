export async function decompressBuffer(buffer) {
  return await (new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream("deflate")))).arrayBuffer();
}

export async function compressBuffer(buffer) {
  return await (new Response(new Blob([buffer]).stream().pipeThrough(new CompressionStream("deflate")))).arrayBuffer();
}

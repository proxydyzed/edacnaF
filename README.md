# edacnaF

This is a thin wrapper for constructing a JSON object given a binary game file from the node based 3d environment.

## Usage examples

### Unwrapping a game

```js
import { decode } from "./src/decode.js";

const arrayBuffer = getTheFileBufferSomehow();
const game = decode(arrayBuffer);

console.log(game.title);
console.log(game.author);
console.log(game.description);
```

### Wrapping a game

```js
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Game, Prefab, encode } from "./src/encode.js";

const game       = new Game();
game.title       = "Game title";
game.author      = "Game author";
game.description = "Game description";

const level           = new Prefab();
level.type            = Prefab.Types.Level;
level.name            = "Game level";
level.backgroundColor = Prefab.Color.DarkGrey;

const stream = new Blob([encode(game)]).stream().pipeThrough(new CompressionStream("deflate"));
const buffer = await (new Response(stream)).arrayBuffer();

// drag and drop this in the fancade editor (in web)
await writeFile(join(import.meta.dirname, "game.zlib"), new Uint8Array(buffer), "utf-8");
```

### Unlocking a game

You can also unlock any uneditable levels or script blocks

```js
import { unlock } from "./src/unlock.js";

const arrayBuffer = getTheFileBufferSomehow();
// this modifies the arrayBuffer in place
unlock(arrayBuffer);
```

## TODO
- [ ] Implement a compiler.
  - Parse and construct a compressed buffer from text representation.
- [x] Implement a game encoder.
- [ ] Implement an editor.
  - Easily slice and edit layers for making sprites.
  - Manipulate prefab position in the "My Blocks" folder to better organize.
  - Create a higher level abstraction to take care of some of the boilerplate.

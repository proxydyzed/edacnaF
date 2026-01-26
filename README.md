# edacnaF

This is a thin wrapper for constructing a JSON object given a binary game file from the node based 3d environment.

## Usage examples

### Unwrapping a game

```js
import { decode } from "./lib/export.js";

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
import { GameData, Prefab, encode, compressBuffer } from "./lib/export.js";

const game = GameData.from({
  title: "Game title",
  author: "Game author",
  description: "Game description",
  prefabs: [],
});

const level = Prefab.from({
  type: Prefab.Type.Level,
  name: "Game level",
  backgroundColor: Prefab.Color.DarkGrey,
});

// Levels need to be before any other prefab types.
game.prefabs.push(level);

const gameBuffer = encode(game);
const buffer = await compressBuffer(gameBuffer);

// drag and drop this in the fancade editor (in web)
await writeFile(join(import.meta.dirname, "game.zlib"), new Uint8Array(buffer), "utf-8");
```

### Unlocking a game

You can also unlock any uneditable levels/blocks.

```js
import { unlock } from "./lib/export.js";

const arrayBuffer = getTheFileBufferSomehow();
// Modifies the arrayBuffer in place
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

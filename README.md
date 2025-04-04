# edacnaF

This is a thin and simple wrapper for constructing a JSON object from the binary game file from the node based 3d environment.

```js
import { decode } from "./src/decode.js";

const game = decode(arrayBuffer);
console.log(game.title);
console.log(game.author);
console.log(game.description);
```


You can also unlock any uneditable levels or script blocks

```js
import { unlock } from "./src/unlock.js";

// this modifies the arrayBuffer in place
unlock(arrayBuffer);
```

## TODO
- Implement a compiler
  - parse and construct a compressed buffer from text representation
- Implement a game encoder
- Implement as editor
  - easily slice and edit layers for making sprites
  - manipulate prefab position in the "My Blocks" folder to better organize
  - create a higher level abstraction to take care of some of the boilerplate

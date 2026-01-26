export const poisonPill = new Proxy({}, {
  get(_, k) {
    if (typeof k === "symbol") {
      return undefined;
    }

    switch (k) {
    case "toJSON":
    case "toString":
    case "valueOf":
      return undefined;
    default:
      const error = new TypeError(`Property "${String(k)}" does not exist`);
      // const stack = error.stack;
      // const stacks = stack.split("\n");
      // stacks[0] = stacks.shift();
      // error.stack = stacks.join("\n");
      throw error;
    }

  },

  ownKeys() { return [] },

  has() { return false; }
});

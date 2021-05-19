import setGlobalContext from '@glimmer/global-context';
import { consumeTag, tagFor, dirtyTagFor } from '@glimmer/validator';

let scheduledDestroyables = [];
let scheduledDestructors = [];
let scheduledFinishDestruction = [];

setGlobalContext.default({
  scheduleRevalidate() {},

  scheduleDestroy(destroyable, destructor) {
    scheduledDestroyables.push(destroyable);
    scheduledDestructors.push(destructor);
  },

  scheduleDestroyed(fn) {
    scheduledFinishDestruction.push(fn);
  },

  toBool(value) {
    return Boolean(value);
  },

  toIterator(value) {
    if (value && value[Symbol.iterator]) {
      return NativeIteratorDelegate.from(value);
    }

    return null;
  },

  getProp(obj, key) {
    if (typeof obj === 'object' && obj !== null) {
      consumeTag(tagFor(obj, key));
    }

    return obj[key];
  },

  setProp(obj, key, value) {
    if (typeof obj === 'object' && obj !== null) {
      dirtyTagFor(obj, key);
    }

    return (obj[key] = value);
  },

  getPath(obj, path) {
    let parts = path.split('.');
    let current = obj;

    for (let part of parts) {
      if (current !== null && current !== undefined) {
        current = current[part];
      }
    }

    return current;
  },

  setPath(obj, path, value) {
    let parts = path.split('.');

    let current = obj;
    let pathToSet = parts.pop();

    for (let part of parts) {
      current = current[part]; // NOTE: current is a Record<>
    }

    current[pathToSet] = value;
  },

  warnIfStyleNotTrusted() {},

  assert(test, msg) {
    if (!test) {
      throw new Error(msg);
    }
  },

  deprecate(msg, test) {
    if (!test) {
      actualDeprecations.push(msg);
    }
  },
});

export class NativeIteratorDelegate { // NOTE: implements IteratorDelegate
  static from(iterable) {
    let iterator = iterable[Symbol.iterator]();
    let result = iterator.next();
    let { done } = result;

    if (done) {
      return null;
    } else {
      return new this(iterator, result);
    }
  }

  position = 0; // private

  constructor(iterable, result) {}

  isEmpty() {
    return false;
  }

  next() {
    let { iterable, result } = this;
    let { value, done } = result;

    if (done === true) {
      return null;
    }

    let memo = this.position++;
    this.result = iterable.next();

    return { value, memo };
  }
}

export const BaseEnv = { // NOTE: EnvironmentDelegate
  isInteractive: true,

  enableDebugTooling: false,

  onTransactionCommit() {
    for (let i = 0; i < scheduledDestroyables.length; i++) {
      scheduledDestructors[i](scheduledDestroyables[i]);
    }

    scheduledFinishDestruction.forEach((fn) => fn());

    scheduledDestroyables = [];
    scheduledDestructors = [];
    scheduledFinishDestruction = [];
  },
};

import { JitRegistry } from './registry.js';

export class JitRuntimeResolver { // NOTE: TestJitRuntimeResolver
  constructor(registry) {
    this.registry = registry;
  }

  lookupHelper(name) {
    return this.registry.lookup('helper', name);
  }

  lookupModifier(name) {
    return this.registry.lookup('modifier', name);
  }

  lookupComponent(name, _owner) {
    return this.registry.lookupComponent(name);
  }

  lookupPartial(name) {
    return this.registry.lookup('partial', name);
  }
}

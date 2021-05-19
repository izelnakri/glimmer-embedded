// TODO: maybe remove and expose resolver directly?
import { JitRuntimeResolver } from './resolver.js';

export default class JitCompileTimeLookup {
  constructor(resolver) {
    this.resolver = resolver;
  }

  lookupHelper(name) {
    return this.resolver.lookupHelper(name);
  }

  lookupModifier(name) {
    return this.resolver.lookupModifier(name);
  }

  lookupComponent(name, owner) {
    return this.resolver.lookupComponent(name, owner);
  }

  lookupPartial(name) {
    return this.resolver.lookupPartial(name);
  }

  lookupBuiltInHelper(_name) {
    return null;
  }

  lookupBuiltInModifier(_name) {
    return null;
  }
}

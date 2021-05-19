// import {
//   CompilableProgram,
//   ResolvedComponentDefinition,
//   Invocation,
//   Option,
//   PartialDefinition,
//   Template,
//   HelperDefinitionState,
//   ModifierDefinitionState,
//   InternalComponentManager,
// } from '@glimmer/interfaces';
import { assert, dict } from '@glimmer/util';
import { getComponentTemplate } from '@glimmer/manager';

// This is used to replicate a requirement of Ember's template referrers, which
// assign the `owner` to the template meta. The requirement is that the template
// metas should not be serialized, and this prevents serialization by adding a
// circular reference to the template meta.
const CIRCULAR_OBJECT = { inner: {} };
CIRCULAR_OBJECT.inner.outer = CIRCULAR_OBJECT;

export class TypedRegistry {
  byName = {}; // private

  has(name) {
    return name in this.byName;
  }

  get(name) {
    return this.byName[name];
  }

  register(name, value) {
    this.byName[name] = value;
  }
}

export default class Registry {
  helper = new TypedRegistry();
  modifier = new TypedRegistry();
  partial = new TypedRegistry();
  component = new TypedRegistry(); // new TypedRegistry<ResolvedComponentDefinition<object, unknown, InternalComponentManager>>
  template = new TypedRegistry();
  compilable = new TypedRegistry();
  'template-source' = new TypedRegistry();
}

export class JitRegistry { // TestJitRegistry
  registry = new Registry(); // private

  register(type, name, value) {
    let registry = this.registry[type];
    registry.register(name, value);
  }

  lookup(type, name) {
    if (this.registry[type].has(name)) {
      return this.registry[type].get(name);
    } else {
      return null;
    }
  }

  lookupComponent(name) {
    let definition = this.lookup('component', name);

    if (definition === null) {
      return null;
    }

    let { manager, state } = definition;

    let capabilities = manager.getCapabilities(state);

    if (definition.template === null) {
      let templateFactory = getComponentTemplate(state);

      assert(
        templateFactory || capabilities.dynamicLayout,
        'expected a template to be associated with this component'
      );

      if (templateFactory) {
        definition.template = templateFactory(CIRCULAR_OBJECT);
      }
    }

    return definition;
  }
}

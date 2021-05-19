// export function setComponentManager(factory, obj): GlimmerComponent {
//   return setInternalComponentManager(new CustomComponentManager(factory), obj);
// }

import { JitRuntimeResolver } from './src/resolver.js';
import { JitRegistry } from './src/registry.js';
import JitCompileTimeLookup from './src/compilation-context.js'; // TODO: maybe remove/replace with Resolver
import { BaseEnv } from './src/env.js';

let registry = new JitRegistry();
let resolver = new JitRuntimeResolver(registry);
console.log(resolver);
console.log(BaseEnv);

// TODO: do all these tomorrow check @global-context source code
// NOTE: check glimmer.js packages are ember addons(shouldnt be)
// import { Component, Context } from '@glimmer/opcode-compiler';
// Now we also have manager to set things... is that it? -> setComponentTemplate(templateFactory, obj)
// NOTE: what is the diff between ComponentManager and InternalComponentManager
// NOTE: there is ComponentManager(with capabilities) and let factory = (owner: object) => new CustomManager(owner);
// USAGE: packages/@glimmer/manager/test/managers-test.ts

// import { artifacts } from '@glimmer/program'; // NOTE: where does @glimmer/global-context go?
// import { precompile } from '@glimmer/compiler';
// import createHTMLDocument from '@simple-dom/document';
// import { AotRuntime, renderAot } from '@glimmer/runtime';


import { templateFactory, programCompilationContext } from '@glimmer/opcode-compiler';
import { precompile } from '@glimmer/compiler'; // Component() expects a serialized/precompiled template
import Component from '@glimmer/component';
import { setComponentManager } from '@glimmer/manager';
import { artifacts } from '@glimmer/program';
import createHTMLDocument from '@simple-dom/document';
import { runtimeContext } from '@glimmer/runtime'; // NOTE: read up on EnvironmentDelegate
import Serializer from '@simple-dom/serializer';
import voidMap from '@simple-dom/void-map';

let source = `
{{#let "hello" "world" as |hello world|}}
  <p>{{hello}} {{world}}</p>
{{/let}}
`;

let output = precompile(source, { strictMode: true });
class CustomComponent extends Component.default {};
let lol = setComponentManager(templateFactory(output), CustomComponent); // TODO: maybe inject templateFactory instead of ComponentInjectedWithTemplate

// TODO: need EnvironmentDelegate
function JitDelegateContext(doc, resolver, env) { // SimpleDocument, TestJitRuntimeResolver, EnvironmentDelegate
  let sharedArtifacts = artifacts(); // NOTE: program
  let context = programCompilationContext(sharedArtifacts, new JitCompileTimeLookup(resolver));
  let runtime = runtimeContext({ document: doc }, env, sharedArtifacts, resolver);
  return { runtime, program: context };
}



let document = createHTMLDocument();
// let runtime = AotRuntime(document, program); // TODO: check this
let element = document.createElement('main');
// let cursor = { element, nextSibling: null };
// let iterator = renderAot(runtime, lol, cursor); // TODO: check this
// let result = iterator.sync();

// self: Reference,
// { runtime, program }: JitTestDelegateContext,
// builder: ElementBuilder,

// let context = programCompilationContext(sharedArtifacts, new JitCompileTimeLookup(resolver));

// let iterator = renderMain(
//   runtime,
//   program,
//   {},
//   self,
//   builder,
//   unwrapTemplate(template).asLayout()
// );
// let res = renderSync(runtime.env, iterator);

// let serialized = new Serializer(voidMap).serialize(element);

function serialize(element) {
  return new Serializer(voidMap).serialize(element);

}
console.log(serialize(element));
// <main><p>hello world</p></main>
// let secondSource = `
// {{#let "hello" "world" as |hello world|}}
//   <p>{{hello}} {{world}}</p>
// {{/let}}
// `;

// let secondOutput = precompile(secondSource, { strictMode: true });
// console.log(Object.keys(templateFactory(secondOutput)));

// function Compilable(source) {
//   return Component(precompile(source));
// }

// if (templateFactory) {
//   setComponentTemplate(templateFactory, ComponentClass);
// }




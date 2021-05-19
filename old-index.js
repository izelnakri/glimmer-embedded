// NOTE: old simple embed API:
import { Component, Context } from '@glimmer/opcode-compiler';
import { artifacts } from '@glimmer/program';
import { precompile } from '@glimmer/compiler';
import createHTMLDocument from '@simple-dom/document';
import { AotRuntime, renderAot } from '@glimmer/runtime';
import Serializer from '@simple-dom/serializer';
import voidMap from '@simple-dom/void-map';

let source = `{{#let "hello" "world" as |hello world|}}<p>{{hello}} {{world}}</p>{{/let}}`;

let context = Context();
let component = Compilable(source);
let handle = component.compile(context);

let program = artifacts(context);

let document = createHTMLDocument();
let runtime = AotRuntime(document, payload);
let element = document.createElement('main');
let cursor = { element, nextSibling: null };
let iterator = renderAot(runtime, handle, cursor);
let result = iterator.sync();

function Compilable(source: string): CompilableProgram {
  return Component(precompile(source));
}

let serialized = new Serializer(voidMap).serialize(element);

function serialize(element: SimpleElement): string {
  return new Serializer(voidMap).serialize(element);

}
console.log(serialize(element));
<main><p>hello world</p></main>

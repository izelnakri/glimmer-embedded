import { setComponentTemplate, getOwner, helperCapabilities, setHelperManager } from '@glimmer/core';
import GlimmerComponent from '@glimmer/component';
import { renderToString } from '@glimmer/ssr';

import { templateFactory } from '@glimmer/opcode-compiler';
import { precompileJSON } from '@glimmer/compiler';

let templateId = 0;

function createTemplate(
  templateSource,
  options,
  scopeValues = {}
) {
  options.locals = options.locals ?? Object.keys(scopeValues ?? {});
  let [block, usedLocals] = precompileJSON(templateSource, options);
  let reifiedScopeValues = usedLocals.map((key) => scopeValues[key]);

  let templateBlock = {
    id: String(templateId++),
    block: JSON.stringify(block),
    moduleName: options.meta?.moduleName ?? '(unknown template module)',
    scope: reifiedScopeValues.length > 0 ? () => reifiedScopeValues : null,
    isStrictMode: options.strictMode ?? false,
  };

  return templateFactory(templateBlock);
}

class HelperWithServicesManager {
  capabilities = helperCapabilities('3.23', {
    hasValue: true,
  });

  constructor(owner) {
    this.owner = owner;
  }

  createHelper(fn, args) {
    return { fn, args, services: this.owner.services };
  }

  getValue(instance) {
    const { args, services } = instance;
    return instance.fn(args.positional, args.named, services);
  }
}

const HelperWithServicesManagerFactory = (owner) => new HelperWithServicesManager(owner);

function helper(fn) {
  setHelperManager(HelperWithServicesManagerFactory, fn);
  return fn;
}

class AnotherComponent extends GlimmerComponent {
  get localeService() {
    return getOwner(this).services.locale;
  }

  get currentLocale() {
    return getOwner(this).services.locale.currentLocale;
  }
}
setComponentTemplate(
  createTemplate(`
    <h5>This is another component</h5>
    <p>Current locale is {{this.currentLocale}}, description: {{this.localeService.description}}</p>
  `, { strictMode: true }),
  AnotherComponent
);

const myHelper = helper(function ([name], { greeting }) {
  return `Helper: ${greeting} ${name}`;
});

const isUSA = helper(function (_args, _hash, services) {
  const localeService = services.locale;

  return localeService.currentLocale === 'en_US';
});

class PageComponent extends GlimmerComponent {}
setComponentTemplate(
  createTemplate(`
    {{#let "hello" "world" as |hello world|}}<p>{{hello}} {{world}}</p>{{/let}}
    {{myHelper "foo" greeting="Hello"}}
    <p>Current locale: {{this.currentLocale}}</p>
    {{#if (isUSA)}}
      <p>Component is in a US locale</p>
    {{else}}
      <p>Component is not in a US locale</p>
    {{/if}}
    <AnotherComponent />
  `, { strictMode: true }, { AnotherComponent, myHelper, isUSA }
  ),
  PageComponent
);

class LocaleService {
  currentLocale = "es";

  constructor(currentLocale) {
    this.currentLocale = currentLocale;
  }

  get locales() {
    if (this.currentLocale === "en") {
      return {
        "button.save": "Save model",
        "button.delete": "Delete model",
        "profile.about.description": "This is description",
      };
    }

    return {
      "button.save": "Guardar modelo",
      "button.delete": "Eliminar modelo",
      "profile.about.description": "Esta es un description",
    };
  }

  get description() {
    return this.locales['profile.about.description'];
  }

  t(key) {
    return this.locales[this.currentLocale][key];
  }
}

renderToString(PageComponent, {
  owner: {
    services: {
      locale: new LocaleService('en_US')
    }
  },
}).then(console.log);

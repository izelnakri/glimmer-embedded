import Component, { hbs, service } from "@emberx/component";
import { helper } from "@emberx/helper";
import { renderToString } from "@emberx/ssr";

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
    return this.locales["profile.about.description"];
  }

  t(key) {
    return this.locales[this.currentLocale][key];
  }
}

class AnotherComponent extends Component {
  @service locale;

  static template = hbs`
    <h5>This is another component</h5>
    <p>Current locale is {{this.locale.currentLocale}}, description: {{this.locale.description}}</p>
  `;
}

const myHelper = helper(function ([name], { greeting }) {
  return `Helper: ${greeting} ${name}`;
});

const isUSA = helper(function (_args, _hash, services) {
  const localeService = services.locale;

  return localeService.currentLocale === "en_US";
});

class PageComponent extends Component {
  static includes = {
    AnotherComponent,
    myHelper,
    isUSA,
  };

  static template = hbs`
    {{#let "hello" "world" as |hello world|}}<p>{{hello}} {{world}}</p>{{/let}}
    {{myHelper "foo" greeting="Hello"}}
    <p>Current locale: {{this.currentLocale}}</p>
    {{#if (isUSA)}}
      <p>Component is in a US locale</p>
    {{else}}
      <p>Component is not in a US locale</p>
    {{/if}}
    <AnotherComponent />
  `;
}

renderToString(PageComponent, {
  owner: {
    services: {
      locale: new LocaleService("en_US"),
    },
  },
}).then(console.log);

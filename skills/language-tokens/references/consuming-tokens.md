# Consuming tokens in code

The generated JSON (`tokens/locales/en.json`, etc.) is nested, e.g.:

```json
{
  "common": { "save": "Save" },
  "home": { "greeting": "Welcome, {name}!" }
}
```

Detect the project's stack and match its conventions. Below are patterns for the
common cases. Migrate incrementally — replacing one hard-coded string at a time
is fine.

## Minimal, zero-dependency helper (plain JS / TS)

Good when there's no i18n library and you don't want one yet.

```js
// t.js
let dict = {};
export async function loadLocale(lang) {
  dict = await fetch(`/tokens/locales/${lang}.json`).then(r => r.json());
}
export function t(key, vars = {}) {
  const value = key.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
  if (value == null) return key; // fall back to the key so missing text is obvious
  return value.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? vars[name] : `{${name}}`
  );
}

// usage
await loadLocale("en");
button.textContent = t("common.save");
heading.textContent = t("home.greeting", { name: user.firstName });
```

## React + i18next (most common JS i18n setup)

The generated JSON already matches i18next's expected shape.

```js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./tokens/locales/en.json";
import es from "./tokens/locales/es.json";

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, es: { translation: es } },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});
```

```jsx
import { useTranslation } from "react-i18next";
function SaveButton() {
  const { t } = useTranslation();
  return <button>{t("common.save")}</button>;
}
// with a placeholder:
// t("home.greeting", { name: user.firstName })
```

Note: i18next uses `{{name}}` (double braces) by default. Either author placeholders
as `{{name}}` in the CSV, or set `interpolation: { prefix: "{", suffix: "}" }` to keep
the single-brace `{name}` style used elsewhere.

## Vue + vue-i18n

```js
import { createI18n } from "vue-i18n";
import en from "./tokens/locales/en.json";
import es from "./tokens/locales/es.json";

export default createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, es },
});
```

```vue
<template>
  <button>{{ t("common.save") }}</button>
  <p>{{ t("home.greeting", { name: user.firstName }) }}</p>
</template>
```

vue-i18n also uses `{name}` single-brace by default — matches the CSV convention directly.

## Python (server-side rendering, CLIs, bots)

```python
import json

_dict = {}

def load_locale(lang, base="tokens/locales"):
    global _dict
    with open(f"{base}/{lang}.json", encoding="utf-8") as f:
        _dict = json.load(f)

def t(key, **vars):
    node = _dict
    for part in key.split("."):
        if not isinstance(node, dict) or part not in node:
            return key  # fall back to the key
        node = node[part]
    return node.format(**vars) if vars else node

# usage
load_locale("en")
print(t("home.greeting", name=user.first_name))
```

## Mobile

- **iOS**: the native format is `Localizable.strings` (flat `"key" = "value";`). Either
  keep the CSV -> JSON flow and read JSON at runtime, or extend `generate.py` to emit
  `.strings`. If the project already uses `.strings`/`.xcstrings`, feed the CSV into that
  instead of introducing JSON.
- **Android**: the native format is `res/values/strings.xml` per language folder
  (`values-es/strings.xml`). Same choice — read JSON at runtime, or generate `strings.xml`.

If a project already has a native localization format, adapt the spreadsheet workflow to
feed it rather than replacing it with JSON.

## Rules that apply everywhere

- **Missing key falls back to the key itself**, not a crash — so untranslated text is
  visible and easy to find.
- **Keys are stable.** Once code references `checkout.pay_button`, don't rename it in the
  CSV without updating the code. Renaming wording is free; renaming keys is a code change.
- **Placeholders stay intact across languages.** The surrounding words can reorder, but
  `{name}` must appear in every translation of that token.

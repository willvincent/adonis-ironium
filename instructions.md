## Registering provider

Make sure to register the provider inside `start/app.js` file.

```js

// Add the mqtt provider
const providers = [
  // ...
  'willvincent/adonis-ironium/providers/IroniumProvider',
]

// ...
// Add the command provider
const aceProviders = [
  // ...
  'willvincent/adonis-ironium/providers/CommandsProvider',
]
```

## Config

Please update configuration before use. The configuration file is `config/ironium.js`.
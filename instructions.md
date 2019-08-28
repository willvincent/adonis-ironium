## Registering provider

Make sure to register the provider and make all of the following necessary changes inside the `start/app.js` file!

```js

// Add the ironium provider
const providers = [
  // ...
  'adonis-ironium/providers/IroniumProvider',
]

// ...
// Add the command provider
const aceProviders = [
  // ...
  'adonis-ironium/providers/CommandsProvider',
]

```

## Config

Please update configuration before use. The configuration file is `config/ironium.js`.

Mongoose Shorthand
===

Allows Mongoose models and schema to be created with less repetitive code.

### Basic Usage

```
const schema = require('mongoose-shorthand');
const shorthand = schema();

shorthand('User', {
  schema: {
    ...
  }
})
```

### Advanced Usage

#### Providing context

In certain situations it may be valuable to pass context to each schema as it is parsed. When setting up the shorthand parser, a parameter may be passed with the global context:

```
const schema = require('mongoose-shorthand');
const shorthand = schema({ hashRounds: 10 });
```

A function can be provided as the schema which will receive this context. In the example below, the `hashRounds` configuration value is used from the provided context to determine the bcrypt behavior:

```
module.exports = context => ({
  middleware: {
    preSave(next) {
      if (!this.isModified('password')) return next();
      bcrypt.hash(this.password, context.hashRounds, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
      });
    },
  },
  schema: {
    username: String,
    password: String,
  },
});
```

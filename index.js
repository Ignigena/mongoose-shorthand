const mongoose = require('mongoose')

const adapters = [
  'methods',
  'middleware',
  'plugins',
  'query',
  'statics',
  'virtuals'
].reduce((result, adapter) => {
  result[adapter] = require(`./adapters/${adapter}`)
  return result
}, {})

module.exports = context => function SchemaParser (name, model) {
  // Allow models to export a function which will be invoked with the `context`
  // object as a single argument. This allows for access to configuration or
  // services from within the schema settings.
  if (typeof model === 'function') {
    model = model(context)
  }

  // When creating the schema in Mongoose, the default collection name matches
  // that of the model (as opposed to the default behavior of pluralizing).
  // This can be overridden in the model settings on the `options` key.
  const schema = new mongoose.Schema(model.schema, model.options)

  // Support for declaring methods, statics, etc. using the same Object-based
  // format that we configure the Schema with.
  Object.keys(adapters).forEach(adapter => {
    if (!model[adapter]) return
    Object.keys(model[adapter]).map(key => {
      adapters[adapter](schema)(model[adapter][key], key)
    })
  })

  // Additional schema configuration can be done with a `setup` function which
  // takes a single argument for the `schema`. Using this method you can
  // configure virtuals, indexes, query helpers, etc. The `context` object is
  // passed as an optional second parameter to facilitate the use of services
  // or configuration in this function.
  if (model.setup) {
    model.setup(schema, context)
  }

  return mongoose.model(name, schema)
}

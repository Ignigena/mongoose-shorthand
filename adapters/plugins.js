module.exports = schema => function(plugin) {
  let use, config;
  if (Array.isArray(plugin)) {
    [use, config] = plugin;
  } else {
    use = plugin
  }

  // Plugins can be declared using a string. In this case, we will first look
  // for an NPM module using the common `mongoose-` prefix. If one is not found,
  // we fall back to the string as the module name.
  if (typeof use === 'string') {
    try {
      use = require(`mongoose-${use}`);
    } catch (err) {
      try {
        use = require(use);
      } catch (err) {
        throw new Error(`Schema plugin "${use}" found, did you forget to install?`);
      }
    }
  }

  schema.plugin(use, config);
};

const Dotenv = require('dotenv-webpack')

module.exports = function override(config, env) {
  config.plugins.push(
    new Dotenv({
      path: '../.env',
      systemvars: true,
      ignoreStub: true
    })
  )

  return config
}

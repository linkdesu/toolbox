// const webpack = require('webpack')
const { merge } = require('webpack-merge')

const baseConfigGenerator = require('./base.config')
const buildUtil = require('./util.js')
const { DIST } = buildUtil

module.exports = async function (env, argv) {
  const baseConfig = baseConfigGenerator(env, argv)
  return [
    merge(baseConfig, {
      target: 'web',
      stats: 'minimal',
      output: {
        path: DIST,
        filename: '[name].js',
        library: {
          type: 'module',
        },
      },
      experiments: {
        outputModule: true,
        topLevelAwait: true,
      }
    })
  ]
}

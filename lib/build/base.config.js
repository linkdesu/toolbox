const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const buildUtil = require('./util.js')
const { ROOT, SRC } = buildUtil

module.exports = function (env, argv) {
  // console.log('env:', env)
  // console.log('argv:', argv)

  let optimization = {
    minimize: false,
  }

  const plugins = [
    new webpack.BannerPlugin({
      banner: buildUtil.generateBanner('ESM')
    }),
    new webpack.DefinePlugin({
      'process.env.PROD': JSON.stringify(true),
      'process.env.NODE_RUNTIME': JSON.stringify(false),
      'process.env.NODE_DEBUG': JSON.stringify(false),
    }),
    new webpack.ProvidePlugin({
      Buffer: path.resolve(ROOT, 'lib', 'build', 'buffer.js')
    }),
  ]

  if (argv.mode === 'production') {
    optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    }
  }

  return {
    context: ROOT,
    resolve: {
      symlinks: true,
      extensions: ['.ts', '.mjs', '.js', '.json'],
      fallback: {
        stream: path.resolve(ROOT, 'node_modules', 'stream-browserify'),
        buffer: path.resolve(ROOT, 'node_modules', 'buffer'),
        assert: path.resolve(ROOT, 'node_modules', 'assert-browserify')
      },
      plugins: [
        // This plugin is required to make webpack resolve modules according to `baseUrl` and `paths` in tsconfig.json .
        new TsconfigPathsPlugin({
          configFile: path.join(ROOT, 'tsconfig.json')
        }),
      ]
    },
    entry: {
      ckb: path.join(SRC, 'ckb.ts'),
      eth: path.join(SRC, 'eth.ts'),
    },
    optimization,
    devtool: false,
    stats: {
      // Suppress warnings come from dependencies
      // warnings: false
      all: true
    },
    watchOptions: {
      // Delay a little more, beause building is base on typescript compiling which may trigger building multiple times.
      aggregateTimeout: 1000,
      ignored: /node_modules/
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.m?js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          include: [
            /bn.js/,
            /tweetnacl/
          ]
        }
      ],
    },
    plugins,
    experiments: {
      asyncWebAssembly: true,
    },
  }
}

const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const nodeExternals = require('webpack-node-externals')
const env = process.env
const isServer = env.RUN_ENV === 'server'

module.exports = {
  publicPath: './',
  outputDir: `dist/${env.RUN_ENV}`,
  assetsDir: 'static',
  configureWebpack: {
    entry: `./src/${env.RUN_ENV}.js`,
    devtool: 'eval',
    target: isServer ? 'node' : 'web',
    output: {
      libraryTarget: isServer ? 'commonjs2' : undefined
    },
    externals: isServer ? nodeExternals({
      allowlist: /\.css$/
    }) : undefined,
    optimization: {
      splitChunks: isServer ? false : undefined
    },
    plugins: [
      isServer ? new VueSSRServerPlugin() : new VueSSRClientPlugin()
    ]
  }
}

require('babel-loader')
require('css-loader')
require('postcss-loader')

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const postcssBrowserReporter = require('postcss-browser-reporter')
const postcssCssnext = require('postcss-cssnext')
const postcssImport = require('postcss-import')
const postcssMixins = require('postcss-mixins')
const postcssReporter = require('postcss-reporter')
const postcssUrl = require('postcss-url')

const CHUNK_VENDOR = 'vendor'
const appRoot = path.resolve(__dirname, '../app')
const serverRoot = path.resolve(__dirname, '../server')
const outputPath = path.resolve(__dirname, '../target')
const profilePath = path.resolve(__dirname, '../profileTarget')
const assetsPath = 'assets'

const commonConfig = {
  context: appRoot,
  entry: {
    main: './main.js',
    [CHUNK_VENDOR]: [
      'babel-polyfill',
      'react',
      'react-dom',
      'react-responsive'
    ]
  },
  resolve: {
    extensions: ['', '.js', '.css', '.png', '.svg', '.jpg', '.jpeg', '.gif', '.woff', '.json'],
    //TODO: what does this do
    alias: {
      server: serverRoot
    },
    root: appRoot
  },
  postcss: postcssConfig
}

const commonLoaders = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader?cacheDirectory=true'
  }
]

const commonPlugins = [
  //TODO: what does this do
  new webpack.optimize.CommonsChunkPlugin({
    name: CHUNK_VENDOR
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'template.html'),
    inject: 'body',
    filename: 'index.html',
    //TODO: create app config to fill head data
    title: 'test'
  }),
  new webpack.ProvidePlugin({
    'React': 'react',
    'fetch': 'exports?self.fetch!whatwg-fetch'
  }),
  // Discussion about up/downsides of using this plugin:
  // https://github.com/gaearon/react-transform-boilerplate/issues/122
  new webpack.NoErrorsPlugin()
]

const devLoaders = [{
  test: /\.css$/,
  loaders: [
    'style-loader',
    'css-loader?modules&localIdentName=[path][name]-[local]__[hash:base64:5]',
    'postcss-loader'
  ]
}]

function postcssConfig(webpack) {
  return [
    postcssBrowserReporter(),
    postcssCssnext({
      browsers: 'last 2 versions',
      sourcemap: true,
      features: {
        autoprefixer: {
          remove: false // faster if not processing legacy css
        }
      }
    }),
    postcssImport({
      path: appRoot,
      addDependencyTo: webpack, // for HMR
      glob: true
    }),
    postcssMixins(),
    postcssReporter(),
    postcssUrl()
  ]
}

module.exports = Object.assign({}, commonConfig, {
  //TODO: what does this do
  output: {
    path: profilePath,
    publicPath: '/',
    filename: assetsPath + '/[name].js',
    pathinfo: true
  },
  debug: true,
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    progress: true,
    https: false,
    stats: {
      colors: true
    }
  },
  module: {
    loaders: devLoaders.concat(commonLoaders)
  },
  plugins: commonPlugins
})

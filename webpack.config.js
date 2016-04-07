'use strict';

var webpack = require('webpack');
var path = require('path');
var debug = process.env.NODE_ENV !== "production";
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CompressionPlugin = require("compression-webpack-plugin");
var BundleTracker = require('webpack-bundle-tracker');

var extractTextPlugin = new ExtractTextPlugin(
  './dist/styles/style.css',
  { allChunks: true }
);

var compressionPlugin = new CompressionPlugin({
  asset: "[path].gz[query]",
  algorithm: "gzip",
  test: /\.js$|\.css$/,
  threshold: 10240,
  minRatio: 0.8
});

var commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin(
  "./dist/scripts/vendor.chunk.js",
  ["entry1", "vendor"]
);

var definePlugin = new webpack.DefinePlugin({
  'process.env': {
      'NODE_ENV': "'" + process.env.NODE_ENV + "'"
  }
});

var bundleTrackerPlugin = new BundleTracker({
  filename: './webpack-stats.json'
})

var hotModuleReplacementPlugin = new webpack.HotModuleReplacementPlugin();

var noErrorsPlugin = new webpack.NoErrorsPlugin();

var config = {
  target: 'web',
  cache: true,
  entry: {
    entry1: './scripts/entry1.js',
    entry2: './scripts/entry2.js',
    entry3: './scripts/entry3.js',
    entry4: [
      'webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
      './scripts/entry4.js'
    ],
    vendor: [
      "react",
      "react-addons-pure-render-mixin",
      "react-dom",
      "select2",
      "striptags",
      'isomorphic-fetch',
      'jquery',
      'marked',
      'react-addons-css-transition-group',
      'react-redux',
      'react-router',
      'redux',
      'redux-thunk'
    ],
  },
  output: {
    path: __dirname,
    filename: "./dist/scripts/[name].bundle.js",
    publicPath: 'http://localhost:3000/assets/bundles/'
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loaders: ['react-hot', 'babel-loader']
      },
      {
        test: /\.json?$/,
        exclude: /(node_modules)/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        exclude: /(node_modules)/,
        loader: ExtractTextPlugin.extract('css!sass')
      },
      {
        test: /\.(png|woff|woff2|eot|otf|ttf|svg)$/,
        exclude: /(node_modules)/,
        loader: 'url-loader?limit=200000'
      }
    ]
    },
  plugins: [
    hotModuleReplacementPlugin,
    noErrorsPlugin,
    commonsChunkPlugin,
    extractTextPlugin,
    definePlugin,
    bundleTrackerPlugin
  ]
};

if (!debug){
  config.devtool = "source-map";
  config.plugins = config.plugins.concat([
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ])
}

module.exports = config;

var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname, '/index.js')
  ],
  output: {
    filename: 'bundle.js',
    publicPath: ''
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  }
}
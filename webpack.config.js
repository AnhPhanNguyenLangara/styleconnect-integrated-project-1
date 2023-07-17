const path = require('path');

module.exports = {
  entry: './map.js',
  mode: 'development',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "source-map"
};
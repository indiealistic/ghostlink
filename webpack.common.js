'use strict';

const path = require('path');

module.exports = () => ({
  entry: [
    './src/ghostlink.js',
    './docs/src/index.js'
  ],
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'assets/app.js'
  },
  resolve: {
    alias: {
      source: path.resolve(__dirname, 'src')
    }
  }
});
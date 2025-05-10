const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.jsx',
    background: './src/background.js',
    content: './src/content.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    iife: false,
    library: {
      type: 'var',
      name: 'ZEMSContentScript'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '.' },
        { from: 'src/popup.html', to: '.' },
        { from: 'src/popup.css', to: '.' },
        { from: 'icons', to: 'icons' }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
const webpack = require('webpack');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  configureWebpack: {
    output: {
      filename: "./js/app.js"
    },
    mode:'production',
    
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: require.resolve('babel-loader'),
          include: ['/src/'],
          options: {
            presets: [
              'dynamic-import-node',
              'remove-webpack', 
            ],
          }
        }
      ],
    },
  },
  chainWebpack:
    config => {config.optimization.delete('splitChunks')}
  ,
  css: {
    extract: false
  },
  productionSourceMap: false,
}
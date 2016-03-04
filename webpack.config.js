var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'index'),
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'app.js',
    publicPath: '/assets/'
  },
  resolve: {
    alias: {
      // Allows `import example from 'modules/example';`
      'actions': path.join(__dirname, 'actions'),
      'config': path.join(__dirname, 'config'),
      'models': path.join(__dirname, 'models'),
      'modules': path.join(__dirname, 'modules'),

      // Allows `import example from 'components/example';`
      'components': path.join(__dirname, 'shared/components'),
      'containers': path.join(__dirname, 'shared/containers'),
      'routes': path.join(__dirname, 'routes'),

      // Allows sass importing: `@import '~styles/mixins/example';`
      'styles': path.join(__dirname, 'assets/styles'),

      // Allows importing images: `import logo from 'images/logo.png';`
      'images': path.join(__dirname, 'assets/images'),

      // Allows referencing of fonts in css `src: url('fonts/comic-sans.woff');`
      'fonts': path.join(__dirname, 'assets/fonts')
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader', // enable ES7 experimental features
        include: __dirname,
        exclude: [
          path.resolve(__dirname, "node_modules"),
        ],
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style',
          'css?modules&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass'
        ],
        include: [
          path.join(__dirname, 'routes'),
          path.join(__dirname, 'shared')
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'file?name=[path][name]___[hash:base64:5].[ext]',
        include: path.join(__dirname, 'assets/img')
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        loader: 'file',
        include: path.join(__dirname, 'assets/fonts')
      }
    ]
  }
};

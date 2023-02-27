// Fichier de configuration à utiliser dans un environnement de production

const webpack = require("webpack");
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

let config = {
  entry: [
    './app/js/app.js',
    './app/scss/main.scss',
  ],
  mode: 'production',
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "js/app.js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      // Js
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },
      // Sass
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCSSExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return autoprefixer({
                  overrideBrowserslist: ['last 4 versions']
                });
              }
            }
          },
          'sass-loader'
        ]
      },
      // Fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/', // Création des fichiers de fonts dans public/fonts
            publicPath: '../fonts' // Définition du chemin vers le dossier des fonts depuis mes fichiers CSS
          }
        },
      },
      // Images
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        use: [
          {
            loader: 'file-loader', // https://www.npmjs.com/package/file-loader
            options: {
              name: '[name].[ext]', // Nom du fichier généré dans le répertoire public (https://github.com/webpack-contrib/file-loader#placeholders)
              outputPath: 'images/', // Chemin de destination des fichiers dans le répertoire public (https://github.com/webpack-contrib/file-loader#outputpath)
              publicPath: '../images' // Chemin relatif par rapport au répertoire public, sera utilisé notamment pendant la génération des chemins dans les fichiers CSS (https://github.com/webpack-contrib/file-loader#publicpath)
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'css/style.css'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new CopyPlugin([
      {
        from: 'app/assets/**',
        to: '.',
        toType: 'dir',
        transformPath: (targetPath) => targetPath.replace(/^app\/assets\//, '')
      }
    ]),
  ]
};

module.exports = config;

const config = require('./webpack/config');

/*Let the magic begin*/
const autoprefixer            = require('autoprefixer');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const CopyWebpackPlugin       = require('copy-webpack-plugin');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin            = require('terser-webpack-plugin');
const path                    = require('path');
const webpack                 = require('webpack');
const safeParser              = require('postcss-safe-parser');

var entry = {};

for (var i = 0; i < config.entries.length; i++) {
  if ( config.entries[i].disable ) {
    continue;
  }
  entry[config.entries[i].name] = path.resolve(__dirname, config.paths.scripts.src + config.entries[i].entry);
}

var webpackConfig = {
  context: __dirname,
  devtool: config.debug ? '#source-map' : false,
  entry: entry,
  output: {
    path: path.resolve(__dirname, config.paths.scripts.dist),
    filename: '[name].min.js',
    publicPath: config.paths.scripts.dist
  },

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      path.resolve(__dirname, config.basePaths.src),
      "node_modules",
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [autoprefixer()];
              }
            }
          },
          {
            loader: 'sass-loader'
          },
        ],
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, config.basePaths.src)],
        query: {
          presets: ['@babel/preset-env'],
          plugins: ["@babel/plugin-proposal-object-rest-spread"],
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.js(\?.*)?$/i,
      }
    ]
  },

  watchOptions: {
    poll: true
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
      chunkFilename: "[id].css"
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [config.basePaths.dist, '!.gitignore', '!.gitkeep']
    }),
    // TODO: [Enhance] Change to file-loader
    new CopyWebpackPlugin([
      { from: config.paths.images.src, to: config.paths.images.dist }
    ]),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCssAssetsPlugin({
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true
          }
        }
      })
    ],
  },
};

module.exports = webpackConfig;
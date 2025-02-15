const { merge } = require('webpack-merge');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { commonConfig, publicPaths } = require('./webpack.common.js');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  output: {
    publicPath: publicPaths.DEV,
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://catalog-service.adobe.io/graphql'),
      TEST_URL: JSON.stringify(
        'https://catalog-service-sandbox.adobe.io/graphql'
      ),
      SANDBOX_KEY: JSON.stringify('storefront-widgets'),
    }),
    new HtmlWebpackPlugin({
      title: 'Sony Biotech Storefront',
      template: './dev-template.html',
      scriptLoading: 'module',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
});

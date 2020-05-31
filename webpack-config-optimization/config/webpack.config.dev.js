const merge = require('webpack-merge');

const baseWebPackConfig = require('./webpack.config.base');

module.exports = merge(baseWebPackConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map'
})
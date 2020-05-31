const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const baseWebPackConfig = require('./webpack.config.base');

module.exports = merge(baseWebPackConfig, {
    mode: "development",
    devtool: 'cheap-module-eval-source-map'
})
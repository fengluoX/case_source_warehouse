const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

const baseWebPackConfig = require('./webpack.config.base');


module.exports = smp.wrap(merge(baseWebPackConfig, {
    mode: "production",
    plugins:[
        new CleanWebpackPlugin()
    ]
}))
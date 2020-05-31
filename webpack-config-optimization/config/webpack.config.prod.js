const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseWebPackConfig = require('./webpack.config.base');


module.exports = merge(baseWebPackConfig, {
    mode: "production",
    plugins:[
        new CleanWebpackPlugin()
    ]
})
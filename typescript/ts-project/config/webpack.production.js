const baseWebpack = require('./webpack.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {merge} = require('webpack-merge');

module.exports = merge(baseWebpack,{
    mode:'production',
    plugins:[
        new CleanWebpackPlugin()
    ]
})
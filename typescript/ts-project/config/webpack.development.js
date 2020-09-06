const {merge} = require('webpack-merge');
const baseWebpack = require('./webpack.base');


module.exports =merge(baseWebpack, {
    mode:'development',
    devServer:{
        port:'8000',
    },
    devtool: 'inline-source-map',
})
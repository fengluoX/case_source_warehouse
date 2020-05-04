const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base');
const apiMocker = require('mocker-api');
const path = require('path');

module.exports = merge(baseConfig,{
    mode: 'development',
    devServer:{
        before(app){
            apiMocker(app, path.resolve('./mock/index.js'))
        }
    }
})
const merge = require('webpack-merge');

const baseWebPackConfig = require('./webpack.config.base');

module.exports = merge(baseWebPackConfig, {
    mode: "development",
    devServer: {
        port: '3000', 
        quiet: false, 
        inline: true, 
        stats: 'errors-only', 
        overlay: false, 
        clientLogLevel: "silent", 
        compress: true 
    },
    devtool: 'cheap-module-eval-source-map'
})
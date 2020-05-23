const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname,'../src/index.js'),
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname,'../public/index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false
            },
            hash: true
        })
    ]
}

const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry:[
        './src/index.tsx'
    ],
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'bundle.[hash:6].js',
    },
    module:{
        rules:[{
            test: /\.(t|j)sx?$/,
            use: ['babel-loader','ts-loader'],
            exclude: /node_modules/ //排除node_modules目录
        }]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.join(__dirname,'../public/index.html'),
            filename:'index.html',
            minify:{
                removeAttributeQuotes:true,
                collapseWhitespace:true
            },
            hash:true
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
}
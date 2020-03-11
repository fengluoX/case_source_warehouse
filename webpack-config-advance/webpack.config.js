const HtmlWebPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
    mode: isDev ? 'development' : 'production',
    entry: './src/main.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:'bundle.[hash:6].js',
        publicPath:'/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        },
        {
            test:/\.s(c|a)ss$/,
            use:[
                'style-loader',
                'css-loader',
                {
                    loader:'postcss-loader',
                    options:{
                        plugin:function(){
                            return [
                                require('autoprefixer')({
                                    overrideBrowserslist:[
                                        ">0.25%",
                                        "not dead"
                                    ]
                                })
                            ]
                        }
                    }
                },
                'sass-loader'
            ],
            exclude: /node_modules/
        },
        {
            test:/\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
            use:[
                {
                    loader:'url-loader',
                    options:{
                        limit:20240,
                        esModule:false,
                        outputPath:'assets'
                    }
                }
            ]
        }
        ]
    },
    plugins: [
        new HtmlWebPlugin({
            template: './public/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false
            },
            hash: true
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from:__dirname+ '/static',
                to:path.resolve(__dirname,'dist/static/'),
                flatten:false //如果设置为true，将会只拷贝文件
            }
        ],{
            ignore:['other.js']
        })
    ],
    devServer: {
        port: 3000,
        stats: 'errors-only',
        clientLogLevel: 'silent',
        compress: true
    },
    devtool:'cheap-module-eval-source-map'
}
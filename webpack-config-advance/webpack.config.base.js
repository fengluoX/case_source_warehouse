const HtmlWebPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
module.exports={
    entry: {
        index: './src/main.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js',
        publicPath: '/'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: ['babel-loader'],
            exclude: /node_modules/
        },
        {
            test: /\.s(c|a)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugin: function () {
                            return [
                                require('autoprefixer')({
                                    overrideBrowserslist: [
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
            test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
            use: [
                {
                    loader: 'url-loader',
                    options: {
                        limit: 20240,
                        esModule: false,
                        outputPath: 'assets'
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
            hash: true,
            chunks: ['index']
        }),
        new HtmlWebPlugin({
            template: './public/login.html',
            filename: 'login.html',
            chunks: ['login']
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: __dirname + '/public/static',
                to: path.resolve(__dirname, 'dist/static/'),
                flatten: false //如果设置为true，将会只拷贝文件
            }
        ], {
            ignore: ['other.js']
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            Component: ['react', 'Component'],
            Vue: ['vue/dist/vue.esm.js', 'default'],
            _map: ['lodash', 'map']
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            DEV:JSON.stringify('DEV'),
            FLAG:'true'
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css'
        }),
        new OptimizeCssPlugin()
    ],
    resolve: {
        modules: ['./src/components', 'node_modules'],
        alias: {
            '@': path.resolve('src')
        },
        extensions:['web.js','.js']
    },
    devServer: {
        port: 3000,
        stats: 'errors-only',
        clientLogLevel: 'silent',
        compress: true,
        hot: true
    },
    devtool: 'cheap-module-eval-source-map'
}
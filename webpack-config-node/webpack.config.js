const HtmlWebpackPlugin = require('html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build'];

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path');

module.exports = {
    mode: isDev ? "development" : "production",
    entry: [
        './src/index.js' //webpack的默认配置
    ],
    output: {
        path: path.resolve(__dirname, 'dist'), //必须为绝对路径 
        filename: 'bundle.[hash:6].js', //打包后的文件名称
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除node_modules目录
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugin: function() {
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
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 20240, //10k
                        esModule: false, //处理es模块require()变成Module Object的问题
                        outputPath: 'assets' //本地资源打包到指定文件夹内
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后文件名
            minify: {
                removeAttributeQuotes: false, //是否删除属性的双引号
                collapseWhitespace: false //是否折叠空白
            },
            hash: true, //是否加上hash，默认是false,html引入是加入hash可以阻止浏览器的缓存策略
            config: config.template
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        port: '3000', //默认端口为8080
        quiet: false, //是否关闭错误打印，默认false
        inline: true, // 刷新模式，默认为开启，如果设置为false，将开启iframe模式
        stats: 'errors-only', //仅终端打印error，如果启用quiet/noInfo，该属性不起作用
        overlay: false, //当编译出错，浏览器窗口全屏输出错误，默认关闭
        clientLogLevel: "silent", //日志等级，如果不需要定，可设置为silent
        compress: true //是否启用 gzip 压缩
    },
    devtool: 'cheap-module-eval-source-map' //开发环境下使用
}
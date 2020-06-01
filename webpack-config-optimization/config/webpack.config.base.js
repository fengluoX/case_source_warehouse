const HtmlWebPackPlugin = require('html-webpack-plugin');
const Happypack = require('happypack');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, '../src'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'bundle.[hash:6].js',
        publicPath: '/'
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.jsx?$/,
                use: ['cache-loader', {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }],
                include: [path.resolve(__dirname, '../src')]
            },
            {
                test: /\.(sa|sc)ss$/,
                use: 'Happypack/loader?id=css',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: 'Happypack/loader?id=url'
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false
            },
            hash: true
        }),
        new Happypack({
            id: 'url',
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
        }),
        new Happypack({
            id: 'css',
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: function () {
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
            ]
        })
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
}

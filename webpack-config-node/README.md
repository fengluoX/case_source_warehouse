# 从0配置webpack用于打包项目

+ 本文章属于半转载文章，更具体文章详见[4W字长文带你深度解锁Webpack系列(上)](https://juejin.im/post/5e5c65fc6fb9a07cd00d8838#heading-11)

## 初始化项目，并安装webpack

```
    npm init -y
    npm install webpack webpack-cli -D
```

## 使用命令进行打包

+ webpack默认入口为src/index文件，默认导出为dist/main.js

```
    npx webpack --mode=development
```

## 将JS转为低版本

1. 安装babel-loader(主要用于将代码编译成向下兼容的代码)

```
    npm install babel-loader -D
```

2. 安装babel配置相关依赖

```
    npm install @babel/core @babel/preset-env @babel/plugin-transform-runtime -D
    npm install @babel/runtime @babel/runtime-corejs3
```

3. 配置webpack.config.js文件

```JS
    module.exports = {
        module: {
            rules: [{
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除node_modules目录
            }]
        }
    }
```

4. 创建.babbelrc文件

```
    {
        "presets": ["@babel/preset-env"],
        "plugins": [
            [
                "@babel/plugin-transform-runtime",
                {
                    "corejs": 3
                }
            ]
        ]
    }
```

## 增加mode配置

+ 主要用于配置是development或production，这样在命令运行时不需要指定环境了,调整后只需要执行`npx webpack`就可以了，不需要后面跟环境变量了

```js
    module.exports = {
        mode: "development",
        module: {
            //...
        }
    }
```

## 将js文件打包到html文件内

1. 安装html插件

    `npm install html-webpack-plugin -D`

2. 配置html-webpack-plugin
    1. 新建public目录，并在其中新建index.html
    2. 修改webpack.config.js
        ```js
            const HtmlWebpackPlugin = require('html-webpack-plugin');
            module.exports = {
                mode: "development",
                module: {/*...*/},
                plugins: [
                    new HtmlWebpackPlugin({
                        template: './public/index.html',
                        filename: 'index.html', //打包后文件名
                        minify: {
                            removeAttributeQuotes: false, //是否删除属性的双引号
                            collapseWhitespace: false //是否折叠空白
                        },
                        hash: true //是否加上hash，默认是false,html引入是加入hash可以阻止浏览器的缓存策略
                    })
                ]
            }
        ```
    3. 配置html-webpack-plugin的config
        1. 新建config.js
            ```js
                module.exports = {
                    dev: {
                        template: {
                            title: '开发环境',
                            header: false,
                            footer: false
                        }
                    },
                    build: {
                        template: {
                            title: '线上环境',
                            header: true,
                            footer: false
                        }
                    }
                }
            ```
        2. 修改webpack.config.js
            ```js
                const HtmlWebpackPlugin = require('html-webpack-plugin');
                const isDev = process.env.NODE_ENV === 'development';
                const config = require('./public/config')[isDev ? 'dev' : 'build'];

                module.exports = {
                    mode: isDev?"development":"production",
                    module: {
                        //...
                    },
                    plugins: [
                        new HtmlWebpackPlugin({
                            //...
                            config: config.template
                        })
                    ]
                }
            ```
        3. 修改index.html
            ```html
                <!DOCTYPE html>
                <html lang="zh-CN">

                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <!-- 
                        这里是根据判断条件进行判断是否加载该html标签
                        <% if(判断条件) {%>} 
                            <html标签>
                        <% } %>
                    -->
                    <% if(htmlWebpackPlugin.options.config.header) { %>}
                        <link rel="stylesheet" type="text/css" href="//common/css/header.css">
                    <% } %>
                    <title>
                        <!--
                            <%= (字符串变量) %>
                        -->
                        <%= (htmlWebpackPlugin.options.config.title) %>
                    </title>
                </head>

                <body>

                </body>
                    <% if(htmlWebpackPlugin.options.config.header) { %>
                        <script src="//common/header.min.js" type="text/javascript"></script>
                    <% } %>
                </html>
            ```
    4. 使用cross-env插件来设置环境变量值（此处使用该插件主要是由于window与mac的兼容）
        1. 安装：`npm install cross-env -D`
        2. 配置：
             ```js
                //package.json
                {
                    //...
                    "scripts": {
                        "dev": "cross-env NODE_ENV=development webpack",
                        "build": "cross-env NODE_ENV=production webpack"
                    },
                }
            ```
    + html-webpack-plugin还有其他配置项，详见[html-webpack-plugin配置项](https://github.com/jantimon/html-webpack-plugin#configuration)

## 安装webpack-dev-server实现热更新
1. 安装：`npm install webpack-dev-server -D`
2. 配置package.json
    ```js
        {
            //...
            "scripts":{
                "dev": "cross-env NODE_ENV=development webpack-dev-server",
                "build": "cross-env NODE_ENV=production webpack"
            }
        }
    ```
3. 配置webpack-dev-server(也可以不配置，使用默认值)
    ```js
        {
            //...
             devServer: {
                port: '3000', //默认端口为8080
                quiet: false, //是否关闭错误打印，默认false
                inline: true, // 刷新模式，默认为开启，如果设置为false，将开启iframe模式
                stats: 'errors-only', //仅终端打印error，如果启用quiet/noInfo，该属性不起作用
                overlay: false, //当编译出错，浏览器窗口全屏输出错误，默认关闭
                clientLogLevel: "silent", //日志等级，如果不需要定，可设置为silent
                compress: true //是否启用 gzip 压缩
            }
        }
    ```
## 设置源码打印映射devtool

+ 设置`devtool`，可以将编译后的代码映射回原始源代码，当然，这会影响构建速度，但可以帮助我们调错
    ```js
    //webpack.config.js
    {
        //...
        devtool: 'cheap-module-eval-source-map' //开发环境下使用
    }
    ```
更多[devtool值](http://webpack.html.cn/configuration/devtool.html)参考

## 利用webpack处理css文件

1. webpack无法直接处理css，需要使用looader进行处理，通常处理过程为：
    `postcss-loader -> css-loader->style-loader`
    如果使用预编译语言的话，一般还要先使用对应预编译语言的loader，
    比如sass使用`sass-loader`,less使用`less-loader`
2. 安装
    `npm install style-loader sass-loader css-loader postcss-loader autoprefixer sass -D`
3. 配置
    ```js
        //webpack.config.js
        //...
        module.exports = {
            //...
            module: {
                rules: [
                    //...
                    {
                        test: /\.(sa|sc|c)ss$/,,
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
                    }
                ]
            }
        }
    ```
4. 引入文件
    新建inde.scss，随便写点css，然后引入
    ```js
        //index.js
        import './index.scss';
    ```
## 使用url-loader处理本地资源文件（也可以使用file-loader）

1. 安装
    `npm install url-loader file-loader -D`
    注意：这里即使使用url-loader，也需要安装file-loader，因为url-loader对于大文件的处理需要依赖file-loader,但url-looader可以指定文件大小小于多少转为base64
2. 配置webpack.config.js
    ```js
        //...
        module.exports = {
            //...
            module: {
                rules: [
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
            }
        }
    ```

## 处理html中的本地图片

+ 平常开发中，我们一般不会将在html里面引入本地文件，但有时确实有这种情况出现，有两种方式可以解决这个问题

1. 使用vm/ejs的模板语法
    `<img src="<%= require('./js.png') %>" />`
2. 使用html-withimg-loader
    1. 安装：`npm install html-withimg-loader -D`
    2. 配置：
        ```js
            //webpack.config.js
            //...
            module.exports = {
                //...
                module: {
                    rules: [
                        //...
                        {
                            test: /.html$/,
                            use: 'html-withimg-loader'
                        }
                    ]
                }
            }
        ```
    + 这里并不太推荐使用第二个方法，因为第二个方法使用后，前面的ejs语法相关的都会失效

## 入口配置
    ```js
        //webpack.config.js
        module.exports = {
            entry: [
                './src/index.js' //webpack的默认配置
            ],
        }
    ```
## 出口配置
    ```js
        //webpack.config.js
        //...
        const path = require('path');
        module.exports = {
            //...
            output: {
                path: path.resolve(__dirname, 'dist'), //必须为绝对路径 
                filename: 'bundle.[hash:6].js', //打包后的文件名称，[hash:6]是处理cdn缓存，6代表长度为6
                publicPath: '/'  //打包地址域名，可以是cdn地址
            },
        }
    ```
## 每次打包情况dist文件夹

+ 使用插件clean-webpack-pplugin
    1. 安装：`npm install clean-webpack-plugin -D`
    2. 配置：
        ```js
            //webpack.config.js
            const { CleanWebpackPlugin } = require('clean-webpack-plugin');
            module.exports = {
                //...
                plugins: [
                    new CleanWebpackPlugin() 
                ]
            }
        ```
    clean-webpack-pplugin参数配置详见[clean-webpack-pplugin](https://github.com/johnagan/clean-webpack-plugin)

## 总结
经过上面的流程，我们算是完成了webpack的基础配置，我们也可以从中看到webpack帮我们做了哪些事，大家也可以尝试自己配置webpack，其实对于vue-cli或者react的脚手架，他们也是对webpack进行了配置，比如加入vue-loader,并没有太复杂的东西，webpack也在变得越来越容易上手，只要自己配一遍，就能理解大多数东西了
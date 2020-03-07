# 从0配置webpack用于打包项目

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
    + html-webpack-plugin还有其他配置项，详见[html-webpack-plugin配置项](https://github.com/jantimon/html-webpack-plugin#configuration)

# webpack优化篇

+ 本文为半转载文章，原文[带你深度解锁Webpack系列(优化篇)](https://juejin.im/post/5e6cfdc85188254913107c1f)

## 量化：speed-measure-webpack-plugin

+ speed-measure-webpack-plugin插件可以测量各个插件和loader所花费的时间，我们可以根据对比优化前后的信息，来确定优化的效果

1. 安装：`npm install speed-measure-webpack-plugin -D`

2. 使用：

    ```ts
        const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
        const smp = new SpeedMeasurePlugin();
        const config = {
            // ...webpack配置
        }
        module.exports = smp.wrap(config);
    ```

## exclude/include

+ 我们可以通过exclude、include配置来确保转译尽可能少的文件
  + exclude:指定要排除的文件
  + include 指定要包含的文件
  + exclude的优先级高于include，在include和exclude中使用绝对路径数组

+ 使用：

```ts
    // webpack.config.js
    const path = require('path');
    module.exports = {
        //...
        module:{
            rules:[
                {
                    test:/\.js[x]?$/,
                    use:['babel-loader'],
                    include:[path.resolve(__dirname,'src')]
                }
            ]
        }
    }
```

## cache-loader

在一些性能开销较大的loader之前添加`cache-loader`，将结果缓存到磁盘中，默认保存在`node_modules/.cache/cache-loader`目录下

1. 安装：`npm install cache-loader -D`

2. 使用

    ```ts
        module.exports = {
            //...webpack.config.js
            rules:[
                {
                    test:/\.jsx?$/,
                    use:['cache-loader','babel-loader']
                }
            ]
        }
    ```

3. 当然，如果你只是想给`babel-loader`配置`cache`的话，也可以不用`cache-loader`，给`babel-loader`增加选项`cacheDirectory`,当存在设置时，将会尝试读取缓存，以避免可能产生的、高性能的`babel`重新编译过程，如果设置空值或`true`，将会使用默认缓存目录`node_modules/.cache/babel-loader`

## happypack 让webpack拥有多进程构建

+ webpack在构建时，是文件读写和计算密集型的操作，特别当文件数量变多时，webpack构建慢的问题就会凸显，但是文件读写和计算是无法避免的，而happypack可以让webpack同一时刻处理多个任务，发挥多核CPU的威力，提升构建速度

1. 安装`npm install happypack -D`

2. 使用：

    ```ts
        const Happypack = require('happypack');
        module.exports = {
            //...
            module:{
                rules:[
                    //...
                    {
                        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                        use: 'Happypack/loader?id=url'
                    }
                ]
            },
            plugins:[
                new Happypack({
                    id:'url', // 和rule中的id=url相对应
                    use:[ // 原use中的loader在这里配置
                        {
                        loader: 'url-loader',
                        options: {
                            limit: 20240,
                            esModule: false,
                            outputPath: 'assets'
                        }
                    }
                    ]
                })
            ]
        }
    ```

3. 注意点：

    + happypack默认开启`CPU核数-1个进程`，我们可以通过传递threads给`Happypack`,这里附上它的[git地址](https://github.com/amireh/happypack#readme)

    + 利用happypack处理css时，如果你使用`postcss-loader`，必须要在项目中创建`postcss.config.js`，否则会抛出错误`Error: No PostCSS Config found`

        ```ts
            //postcss.config.js
            module.exports={
                plugins:{
                    require('autoprefixer')()
                }
            }
        ```

    + 如果项目不是很复杂，不需要配置happypack，因为进程的分配和管理也是需要时间的

## thread-loader

除了使用`Happypack`外，我们还可以是使用`thread-loader`，把`thread-loader`放置在其他`loader`之前，那么放置在这个`loader`之后的`loader`就会在一个单独的`worker`池中运行。

+ 限制：

    1. 这些`loader`不能产生新的文件.

    2. 这些`loader`不能使用定制的`loader`API

    3. 这些`loader`无法获取webpack的选项设置

1. 安装`npm install thread-loader -D`

2. 修改配置

    ```ts
        module.exports = {
            module: {
                //我的项目中,babel-loader耗时比较长，所以我给它配置 thread-loader
                rules: [
                    {
                        test: /\.jsx?$/,
                        use: ['thread-loader', 'cache-loader', 'babel-loader']
                    }
                ]
            }
        }
    ```

## 开启多进程压缩

+ 多进程plugin这里有两个推荐

    1. [`webpack-parallel-uglify-plugin`](https://github.com/gdborton/webpack-parallel-uglify-plugin#readme)

    2. [`uglifyjs-webpack-plugin`](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)

+ 当然，`webpack`默认使用`TerserWebpackPlugin`，默认就已经开启了多进程和缓存，构建时，你可以看到`terser`的缓存文件`node_modules/.cache/terser-webpack-plugin`

## HardSourceWebpackPlugin

+ `HardSourceWebpackPlugin`为模块提供中间缓存，缓存默认的存放路径为:`node_modules/.cache/hard-source`

+ 配置`hard-source-webpack-plugin`，首次构建时间没有太大变化，但第二次构建将会极大节约时间

1. 安装：`npm install hard-source-webpack-plugin -D`

2. 配置：

    ```ts
        // webpack.config.base.js
        const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
        module.exports={
            //...
            plugins:[
                new HardSourcWebpackPlugin()
            ]
        }
    ```

3. 如果你遇到了如热更新失效，或部分配置不生效，可以查阅[官网](https://www.npmjs.com/package/hard-source-webpack-plugin)

## noParse

+ 如果你引入的一些第三方模块没有AMD/CommonJS规范版本，可以使用noParse来标识这个模块，这样webpack会引入这些包，但不会对其转化和解析，从而提升webpack的构建性能，例如`jquery`、`lodash`

+ 使用

    ```ts
        // webpack.config.js
        module.exports={
            //...
            module:{
                noParse:/jquery|lodash/
            }
        }
    ```

## resolve

+ resolve可以配置webpack如何寻找模块对应的文件，如果我们确定模块都从根目录下的node_modules中查找，可以按如下配置

    ```ts
        // webpack.config.js
        const path = require('path');
        module.exports={
            //...
            resolve:{
                modules:[path.resolve(__dirname,'node_modules')]
            }
        }
    ```

+ 注意，如果你进行了该配置，那么webpack将不再会自动查找，如果你依赖中也存在node_modules，就会出现文件存在，但是找不到的问题

+ resolve还有`extensions`配置，默认为`['.js','.json']`，你可以对它进行配置，但记得要将频率最高的放到第一位，并控制列表的长度，以减少尝试次数

## IgnorePlugin

+ `webpack`内置插件，用于忽略第三方包的指定目录

+ 示例：忽略moment的本地化内容

    ```ts
        //webpack.config.js
        module.exports={
            plugins:[
                new webpack.IgnorePlugin(/^\.\/locale$/,'moment$')
            ]
        }
    ```

    这样，我们在使用时，可以手动引入语言包即可，如引入中文语言包：

    ```ts
        import moment from 'moment';
        import 'moment/locale/zh-cn'
    ```

## externals

+ 我们可以将一些JS文件存储在CDN上，以减少Webpack打包出来的js体积,在index.html中通过`<script>`引入,如:

    ```html
        <!DOCTYPE html>
        <html>
            <!-- ... -->
            <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
        </html>
    ```

我们希望在使用时，仍然可以通过`import`的方式去引用，如`import $ from 'jquery'`，并且希望webpack不对其打包，这是可以配置`externals`

```ts
    //webpack.config.js
    module.exports={
        //...
        externals:{
            // jquery通过script引入后，全局中即有了JQuery变量
            'jquery':'JQuery'
        }
    }
```

## DllPlugin

+ 有些时候，如果所有的JS文件都打成一个JS文件，会导致最终生成的JS文件很大，这个时候，我们就要考虑拆分 bundles。
DllPlugin 和 DLLReferencePlugin 可以实现拆分 bundles，并且可以大大提升构建速度，DllPlugin 和 DLLReferencePlugin 都是 webpack 的内置模块。
我们使用 DllPlugin 将不会频繁更新的库进行编译，当这些依赖的版本没有变化时，就不需要重新编译。我们新建一个 webpack 的配置文件，来专门用于编译动态链接库，例如名为: webpack.config.dll.js，这里我们将 react 和 react-dom 单独打包成一个动态链接库

    ```ts
        //webpack.config.dll.js
        const webpack = require('webpack');
        const path = require('path');

        module.exports = {
            entry: {
                react: ['react', 'react-dom']
            },
            mode: 'production',
            output: {
                filename: '[name].dll.[hash:6].js',
                path: path.resolve(__dirname, 'dist', 'dll'),
                library: '[name]_dll' //暴露给外部使用
                //libraryTarget 指定如何暴露内容，缺省时就是 var
            },
            plugins: [
                new webpack.DllPlugin({
                    //name和library一致
                    name: '[name]_dll', 
                    path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') //manifest.json的生成路径
                })
            ]
        }
    ```

在 package.json 的 scripts 中增加:

```ts
{
    "scripts": {
        "dev": "NODE_ENV=development webpack-dev-server",
        "build": "NODE_ENV=production webpack",
        "build:dll": "webpack --config webpack.config.dll.js"
    },
}  
```

## 抽离公共代码

+ 对于多页应用来说，有时候多个引入一些公告模块，我们可以把这些公共模块抽离出来，单独打包,公告代码只需要下载一次就缓存起来，避免重复下载，配置如下：

    ```ts
        // webpack.config.js
        module.exports = {
            optimization:{
                splitChunks:{ // 分割代码块
                    cacheGroups:{
                        vendor:{
                            priority: 1, //设置优先级，首先抽离第三方模块
                            name: 'vendor',
                            test: /node_modules/,
                            chunks: 'initial',
                            minSize: 0,
                            minChunks: 1 //最少引入了1次
                        },
                        //缓存组
                        common: {
                            //公共模块
                            chunks: 'initial',
                            name: 'common',
                            minSize: 100, //大小超过100个字节
                            minChunks: 3 //最少引入了3次
                        }
                    }
                }
            }
        }
    ```

+ 对于单页应用来说，同样可以使用这个配置，比如打包出来的bundle.js体积过大，我们可以将一些依赖包打包成动态链接库，然后将第三方依赖拆出来。当然，我们也可以继续提取业务代码中的公共模块

+ `runtimeChunk` 的作用是将包含 `chunk` 映射关系的列表从 `main.js` 中抽离出来，在配置了 `splitChunk` 时，记得配置 `runtimeChunk`.

    ```ts
        module.exports = {
            //...
            optimization: {
                runtimeChunk: {
                    name: 'manifest'
                }
            }
        }
    ```

这样，最终构建出来的文件中会生成一个manifest.js

### 借助webpack-bundle-analyzer进行进一步优化

+ `webpack-bundle-analyzer`是一个打包分析插件，我们可以使用它分析我们项目代码的组成

1. 安装：`npm install webpack-bundle-analyzer -D`

2. 配置：

    ```ts
        //webpack.config.prod.js
        const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
        const merge = require('webpack-merge');
        const baseWebpackConfig = require('./webpack.config.base');
        module.exports = merge(baseWebpackConfig, {
            //....
            plugins: [
                //...
                new BundleAnalyzerPlugin(),
            ]
        })
    ```

## webpack自身优化

1. tree-shaking

    我们使用ES6的import语法，在生产环境下，没有被使用到的代码会自动别移除

2. scope hosting 作用域提升

    变量提升，可以减少一些变量声明，生成环境默认开启

3. babel配置的优化

    在不配置`@babel/plugin-transform-runtime` 时，babel 会使用很小的辅助函数来实现类似 _createClass 等公共方法。默认情况下，它将被注入(inject)到需要它的每个文件中。但是这样的结果就是导致构建出来的JS体积变大。
    我们也并不需要在每个 js 中注入辅助函数，因此我们可以使用 `@babel/plugin-transform-runtime`，`@babel/plugin-transform-runtime` 是一个可以重复使用 Babel 注入的帮助程序，以节省代码大小的插件。
    因此我们可以在 .babelrc 中增加 `@babel/plugin-transform-runtime`的配置。

    ```ts
        {
            "presets": [],
            "plugins": [
                [
                    "@babel/plugin-transform-runtime"
                ]
            ]
        }
    ```

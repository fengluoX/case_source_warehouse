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

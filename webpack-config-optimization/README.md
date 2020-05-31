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

4. happypack 让webpack拥有多进程构建
    
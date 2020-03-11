# webpack进阶配置

半转载文章，文章出处：[4W字长文带你深度解锁Webpack系列(进阶篇)](https://juejin.im/post/5e6518946fb9a07c820fbaaf)

## 静态资源拷贝

+ 在使用vue或react脚手架生成的项目中，会有静态资源文件夹这种目录，该文件夹下的文件不会经过编译，压缩。我们使用webpack的插件`copy-webpack-plugin`也可以达到相同的效果

1. 安装
    `npm install copy-webpack-plugin -D`
2. 配置
    ```js
        //webpack.config.js
        //...
        const CopyWebpackPlugin = require('copy-webpack-plugin');
        const path = require('path');

        module.exports = {
            //...
            plugins: [
                //...
                new CopyWebpackPlugin([
                    {
                        from:__dirname+ '/static',
                        to:path.resolve(__dirname,'dist/static/'),
                        flatten:false //如果设置为true，将会只拷贝文件
                    }
                ])
            ]
        }
    ```
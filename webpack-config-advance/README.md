# webpack进阶配置

半转载文章，文章出处：[4W字长文带你深度解锁Webpack系列(进阶篇)](https://juejin.im/post/5e6518946fb9a07c820fbaaf)

## copy-webpack-plugin(静态资源拷贝)

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
                ],{
                    ignore:['other.js'] // 排除掉打包的
                })
            ]
        }
    ```

## ProvidePlugin（全局变量）

主要是偷懒用的，嘿嘿，具体配置如下：

```js
    new webpack.ProvidePlugin({
        React:'react',
        Component:['react','Component'],
        Vue:['vue/dist/vue.esm.js','default'],
        $:'jquery',
        _map:['lodash','map']
    })
```

## mini-css-extract-plugin(抽离CSS)

注：extract-text-webpack-plugin插件也有类似功能

1. 安装

    `npm install mini-css-extract-plugin -D`

2. 配置

    ```js
        // webpack.config.js
        //...
        const MiniCssExtractPlugin = require('mini-css-extract-plugin');

        module.exports = {
            //...
            module: {
                rules: [
                //...
                {
                    test:/\.s(c|a)ss$/,
                    use:[
                        MiniCssExtractPlugin.loader,
                        //...
                    ]
                },
                ]
            },
            plugins: [
                //...
                new MiniCssExtractPlugin({
                    filename:'css/[name].css'
                })
            ]
        }
    ```

## （optimize-css-assets-webpack-plugin）将抽离的css进行压缩

1. 安装：`npm install optimize-css-assets-webpack-plugin -D`

2. 使用：

    ```js
        // webpack.config.js
        //...
        const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

        module.exports = {
            //...
            plugins: [
                //...
                new OptimizeCssPlugin()
            ]
        }
    ```

## 按需加载

主要为使用`import()`语法，需要使用`@babel/plugin-syntax-dynamic-import`插件，`@babel/preset-env`会内置该插件，webpack遇到import(****)的语法时，会以此生成一个新的chunk，只有当代码执行到该语句时，采用加载该文件

## 热更新

1. 配置devServer的hot为true

2. 在plugins中增加`new webpack.HotModuleReplacementPlugin()`

3. 在入口文件增加

    ```js
        if(module && module.hot) {
            module.hot.accept()
        }
    ```

## 多页应用打包

有的时候,我们的应该可能会是多页面应用,这需要我们提供多个entry入口文件

1. 配置:

    ```js
        // webpack.config.js
        //...
        module.exports = {
            //...
            entry: {
                index:'./src/main.js',
                login:'./src/login.js'
            },
            output:{
                path: path.resolve(__dirname,'dist'),
                filename:'[name].[hash:6].js',
                publicPath:'/'
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
                new HtmlWebPlugin({
                    template:'./public/login.html',
                    // 这里的filename字段不可缺省,否则默认生成的都是index.html
                    filename:'login.html'
                }),
                //...
            ]
        }
    ```

2. 优化

做了上面的处理后，其实还是有问题的，这就是我们的html文件会引入我们所有的Js文件，这里需要我们指定哪些入口文件不被引入，配置如下：

```js
    // webpack.config.js
    //...
    module.exports = {
        //...
        plugins: [
            new HtmlWebPlugin({
                //...
                chunks:['index']
            }),
            new HtmlWebPlugin({
                //...
                chunks:['login']
            }),
            //...
        ]
    }
```

chunks配置是指定引入那个js文件，可以指定多个，如果不指定，默认全部引入

## resolve配置

resolve配置webpack如何寻找模块对应的文件。webpack内置JavaScript模块化语法解析功能，默认会采用模块化标准里约定的规则去寻找，但支持自定义配置

1. modules
resolve.modules配置webpack去哪些目录下寻找第三方模块，默认情况下，只会寻找node_modules下，如果项目中某个文件夹下的文件经常被导入，不希望写很长的路径，就可以通过该配置来简化：

```js
    //  webpack.config.js
    module.exports = {
        //...
        resolve:{
            modules:['./src/components','node_modules'] //  从左到右依次查找
        }
    }
```

使用时，如果我们`import Dialog from 'dialog'`，就会去寻找`./src/components/dialog`，如果找不到，再寻找`node_modules`
2. alias
resolve.alias配置通过配置别名把原导入路径映射成一个新的导入路径，如：

```js
    // webpack.config.js
    module.exports={
        alias:{
            'react-native':'@my/react-native-web',
            '@':path.resolve('src'),
            '@src':path.join(__dirname,'src')
        }
    }
```

这里可以使用包名,更常用的做法是使用path.join/path.resolve方法拼接路径
注:path.resolve会自右向左解析路径片段,并尝试解析为绝对路径,如果拼接后不是绝对路径,则会加上当前工作目录,而path.join则仅会拼接解析为路径
3. extensions
在适配多端的项目中,有可能会出现.web.js,wx.js,比如在转web的项目中,我们首先希望找.web.js,如果没有,再找.js,我们可以这样配置:

```js
    // webpack.config.js
    //...
    module.exports={
        extensions:['web.js','.js']
    }
```

使用这个配置,我们在使用时可以缺省文件后缀,默认是只找对应的js文件
4. enforceExtension
如果配置`resolve.enforceExtension`为`true`,那么导入语句不能缺省文件后缀
5. mainFields
有一些第三方模块会提供多份代码,例如bootstrap,其package.json文件如下:

```js
    {
        "style":"dist/css/bootstrap.css",
        "sass":"scss/bootstrap.scss",
        "main":"dist/js/bootstrap"
    }
```

`resolve.mainFields`的默认配置为`['browser','main']`,即首先找对应以来package.json中的brower字段,如果没有,找main字段,如果我们希望其默认去找css文件的话,可以配置`resolve.mainFields`为:

```js
    //webpack.config.js
    module.exports={
        //...
        resolve:{
            mainFields:['style','main']
        }
    }
```

注意:bootstrap是依赖jquery和popper的,但是它并不会一起安装进来,需要你自己自行安装!

## (webpack-merge)区分不同的环境

我们的webpack配置,定义在webpack.config.js中,对环境的区分使用的是`process.env.NODE_ENV`,但如果我们的配置文件中有多处需要区分环境的配置,岂不是要针对很多地方进行写判断?这显然不是要给好办法,`webpack-merge`则针对这个问题给出了一个好的解决方案

1. 首先,我们创建多个配置文件

    + `webpack.base.js`定义公共的配置
    + `webpack.dev.js`定义开发环境的配置
    + `webpack.prod.js`定义生成环境的配置

2. 安装并配置`webpack-merge`

    + 安装:`npm install webpack-merge -D`

    + 在`webpack.base.js`中定义公共配置

    + 配置对应环境的配置,以开发环境为例:

        ```js
            //webpack.config.dev.js
            const merge = require('webpack-merge');
            const baseWebpackConfig = require('./webpack.config.base')
            module.exports = merge(baseWebpackConfig,{
                mode:'development'
                //...一些其他配置
            })
        ````

3. 修改package.json,指定对应的config文件

```json
    // package.json
    {
        "scripts":{
            "dev":"cross-env NODE_ENV=development webpack-dev-server --config=webpack.config.dev.js",
            "build":"cross-env NODE_ENV=production webpack --config=webpack.config.prod.js"
        }
    }
```

当然,webpack-merge也有一些其他的配置,详见[https://github.com/survivejs/webpack-merge](https://github.com/survivejs/webpack-merge)

## webpck.DefinePlugin (定义环境变量)

`DefinePlugin`是webpack的内置插件,不需要单独安装,它拥有以下规则:

+ 如果`value`是一个字符串,会被当做`code`片段
+ 如果`value`不是字符串，它会被转化为字符串(包括函数)。
+ 如果`value`是一个对象,正常对象定义即可
+ 如果`value`中有`typeof`,只针对`typeof`调用定义

配置:

```js
    // webpack.config.dev.js
    const webpack = require('webpack');
    module.exports={
        //...
        plugins:[
            new webpack.DefinePlugin({
                DEV:JSON.stringify('dev'), //字符串
                FLAG:'true' // 布尔类型
            })
        ]
    }
```

经典场景为开发环境使用联调域名,测试环境使用sit域名,线上环境使用线上域名

## 利用webpack解决跨域问题

跨域问题可以说是自古以来就有了,虽说可以让后端解决,但是开发时后端可能并不一定会帮你解决,而我们可以使用webpack自己实现跨域代理,做到开发不求人

+ 场景,前端在3000端口,服务端在4000端口

1. 配置:

```js
    // webpack.config.dev.js
    module.exports={
        //...
        devServer:{
            proxy:{
                '/api':{ //匹配含有/api字段的接口
                    target:"http://localhost:4000", // 目标地址
                    pathRewrite:{ // 重写路径
                        '/api':''
                    }
                }
            }
        }
    }
```

详细参数配置见[https://www.webpackjs.com/configuration/dev-server/#devserver-proxy](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy)

## mocker-api(前端模拟数据)

现在都提倡前后端并行开发,这时候需要前端自行mock数据

+ 原理:主要是利用devServer.before对请求发出前进行拦截,然后返回mock数据

1. 安装:`npm install mocker-api -D`

2. 新建mock文件夹,新建index.js

```js
    module.exports = {
        'GET /api/user': {name: '落叶'},
        'POST /login/account': (req, res) => {
            const { password, username } = req.body
            if (password === '888888' && username === 'admin') {
                return res.send({
                    status: 'ok',
                    code: 0,
                    token: 'sdfsdfsdfdsf',
                    data: { id: 1, name: '落叶' }
                })
            } else {
                return res.send({ status: 'error', code: 403 })
            }
        }
    }
```

[mocker-api文档](https://github.com/jaywcjlove/mocker-api#readme)
3. 修改`webpack.config.dev.js`

```js
    const apiMocker = require('mocker-api');
        module.export = {
            //...
            devServer: {
                before(app){
                    apiMocker(app, path.resolve('./mock/mocker.js'))
                }
            }
        }
```

这样,我们再`npm run dev`,就可以发现已经成功mock了数据,当然也可以再自行使用mock.js,效果更优哦

## 最后,[源码地址](https://gitee.com/luoyestr/case_source_warehouse/tree/master/webpack-config-advance)

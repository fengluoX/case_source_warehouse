# 这一章，让我们来学习在项目中使用typescript

## 首先，无中生有

```
    mkdir ts-project
    cd ts-project
    npm init -y
    npm install typescript -D
    npx tsc --init
```

## 接下来，我们需要安装webpack，并且让ts与webpack良好的一起工作

1. 安装webpack

```
    npm install -D webpack webpack-cli webpack-dev-server
```

2. 配置webpack

这里我们来偷个懒，指路[从0配置webpack用于打包项目](http://www.luoyetree.top/articleDetail?id=5e649f308c694a65f85ae94e),我们把这里的配置直接拿过来，不再赘述了。

这里有一点需要注意，`webpack-merge`的引用，要改成这样子了：

```ts
    const { merge } = require('webpack-merge');
```

3. 让webpack与ts一起工作

```
    npm install -D ts-loader
```

接下来改一下`webpack.base.js`

```js
    //...

    module.exports = {
        entry:[
            './src/index.ts'
        ],
        //...
        module:{
            rules:[{
                test: /\.tsx?$/,
                use: ['babel-loader','ts-loader'],
                exclude: /node_modules/ //排除node_modules目录
            }]
        }
    }
```

下面，我们需要配置一下`tsconfig.json`:

```json
    {
        "compilerOptions": {
            "outDir": "./dist/",
            "noImplicitAny": false,
            "module": "es6",
            "target": "es5",
            "jsx": "react",
            "sourceMap": true,
            "allowJs": true
        },
        "include": [
            "./src/**/*"
        ]
    }
```

4. 好了，这样webpack和ts就可以完美的在一起配合使用了，是不是很完美，但是我们一般开发还会使用三大框架，`vue`，`react`，`angular`,下面我们以`react`为例来看一下如何将react嵌入进来

    首先，我们需要先改一下配置：

    ```js
        //...
        module.exports = {
            entry:[
                './src/index.tsx'
            ]
        }
    ```

    安装依赖

    ```
        npm install -S react react-dom
        npm install -D @types/react @types/react-dom
    ```

    好了，接下来我将src/index.tsx的内容改成这样：

    ```tsx
        import * as React from 'react';
        import * as ReactDom from 'react-dom';

        const App:React.FC=()=> {
            return (
                <div className="App">
                    这是项目，【【
                </div>
            );
        }
        ReactDom.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById('app')
        );
    ```

5. 大功告成，剩下的工作，就算为这个项目加入路由，数据流解决方案，以及一些常用的函数库，请求库，这里就不再赘述了，[源码](https://gitee.com/luoyestr/case_source_warehouse/tree/master/typescript/ts-project)指路
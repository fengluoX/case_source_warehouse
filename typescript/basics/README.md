
# typescript基础篇

1. 首先，如果我们想要使用`typescript`，需要安装`typescript`编译器，`typescript`和`webpack`配合使用会放到后面去讲

    + 安装：`npm install -g typescript`;

2. 在编写`typescript`程序之前，我们先简单了解下`typescript`，`typescript`是`javascript`的超集合，我们可以这样认为：

    ```ts
        typescript = T + ESNEXT
    ```

    这里的`T`，就是指类型，`ESNEXT`则是指`ECMAScript`，包括`ES3,5,6,...`,所以，学习`ts`，其实你已经懂了一大半了，任何一门知识，当你懂了一大半后，就不应该只是理论学习了，当然要用起来了，当然，如果你对`ES6`还不太熟悉的话，那就要抓紧了！这里推荐阮老师的[ES6入门教程](https://es6.ruanyifeng.com/)

3. 现在，让我们来编写我们的第一个ts程序

    1. 我们来创建一个`index.ts`文件，你可以使用一下命令`touch index.ts`，或者鼠标操作创建

    2. 让我们来为`index.ts`加点东西，并且编译它吧

        ```ts
            function greeter(person) {
                return "Hello," + person;
            }
            console.log(greeter('TS'));
        ```

        运行下面这条指令：`tsc index.ts`;

        我们可以发现，编译器为我们生成了`index.js`文件，所以我们`ts`写的东西最终跑起来，还是需要编译成js文件，你可以将其理解为less或者sass与css的关系

4. ts基础类型

    + `string`
    + `number`
    + `bloean`

    以上这四种类型以及字面量类型，是我们日常开发中使用最频繁的类型了，至于其他的，譬如`symbol`、`object`、`Function`等，反正我是没怎么使用到过，注意，一般类型来说，首字母都是大写的，但是我们这几个确实小写，我猜大概是因为大写的被ES6占用了吧，当然，真正原因是因为大写的是其包装类型，是一种特殊的对象类型，至于字面量类型，大致是下面这样子：

    ```ts
        type Literal = 'Literal'
    ```

    `type`是类型的声明关键字，接下来会说到，使用上面代码声明的类型来约束的话，那被约束的变量只能被赋值为`'Literal'`

5. 类型的使用方式：

    + 类型的使用主要分为两种，先声明后使用，或者直接使用，下面分别介绍这两种

    1. 直接使用

        如果你是一个前端开发，你一定对css的内联相当熟悉，没错，直接使用其实和内联是很相似的，同样，我们也不推荐这样使用，写法就是下面这样：

        ```ts
            const a:string = 'hello'
        ```

        这样，变量a的类型就被确定了，只能是`string`类型，当然，其实你这样写`const a ='hello'`，也是可以的，而且是等效的，ts会自动推断出a的类型为`string`

    2. 先声明后使用

        + 先声明后使用，在ts中，主要有以下方式声明类型

        1. `type`

            一般来说，我们使用`type`来使用类型，用法为这样：

            ```ts
                export type TestString = '我是字面量类型';
                export type TestFace = {
                    name:string;
                    age:number
                };
            ```

            使用的时候可以这样使用：

            ```ts
                cosnt str:TestString = '我是字面量类型';
                const obj:TestFace = {
                    name:'小明',
                    age:18
                }
            ```

            当然，`type`很好用，但是对于比较复杂的类型来说，更推荐使用`interface`

        2. `interface`

        3. `class`

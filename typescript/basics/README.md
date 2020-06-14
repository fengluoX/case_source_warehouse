
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

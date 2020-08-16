
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

    + 数组

        声明数组类型有以下两种方式：

        ```ts
            let list:number[] = [1,2,3];
            let list:Array<number> = [1,2,3];
        ```

    + 元组

        元组并不是一个明确的类型，而算是一种范式

        ```ts
            let x:[string,number];

            x = ['hello',10] // OK

            x = [10,'hello'] // ERROR
        ```
    
    + 枚举

        枚举类型是ts增加的一种类型，它使用`enum`关键字来进行声明

        ```ts
            enum EColor {
                Red, // 0
                Yellow = 2,
                Green, // 3
                Blue = 'Blue',
            }
            let c:EColor = EColor.Red;
        ```

        默认情况下，`ts`是从`0`为元素编号，如`EColor.Red`代表的值就为0,但是也可以为其手动赋值，如`EColor.Blue`，如果手动赋值的值为数值，则接下来的枚举值会以此递增，比如`EColor.Green`的值就为`3`;如果不是数值，那后续的值都必须手动赋值

        通常情况下，我们一般将枚举作为一些结构化常量来使用，这样我们以后有调整，修改这一处地方就好。当然，你也可以使用对象来替代，我们这里并不推荐这样做

    + Any

        `any`类型属于ts的一个顶层类型，代表任意类型，这个类型在旧项目迁移到ts非常方便，但是我们不推荐使用，如果你大量使用`any`，写成`anyTS`,那就失去了使用`TS`的意义。这里不管任何情况下，如果你想使用`any`，请先问一下是否有其他方式来替代它

    + Void

        `void`类型表示没有任何值，当一个函数没有返回值时，它的返回类型就算`void`;

        ```ts
            function warnUser():void{
                console.log('This is my warning message');
            }
        ```

        如果一个变量是`void`类型，那你只能为它赋`null`或者`undefined`

    + Null 和 Undefined

        这两种类型，见文知意，就是`null`和`undefined`类型

    + Never

        `never`类型表示永远不存在的值的类型，一般来说用在那些会抛出错误的函数里

        ```ts
            function error(message:string):never{
                throw new Error(message); 
            }
        ```

        通常情况下不会将变量定义为`never`类型，因为除了`never`类型，其他值，包括`any`都不可以赋值给它

    + Unknown

        `unknown`表示未知类型，它可以接受任何值，但在不做约束的情况下，`unknown`类型不能赋值给任何类型

        ```ts
            let maybe:unknown;
            const aNumber:number = 123;
            maybe = aNumber; // OK
            let aString:string = maybe; // Error
            if(typeof maybe === 'string'){
                let aString:string = maybe; // OK
            }
        ```

5. 类型的使用方式：

    + 类型的使用主要分为两种，先声明后使用，或者直接使用，下面分别介绍这两种

    1. 直接使用

        如果你是一个前端开发，你一定对css的内联相当熟悉，没错，直接使用其实和内联是很相似的，同样，我们也不推荐这样使用，写法就是下面这样：

        ```ts
            const a:string = 'hello'
        ```

        这样，变量a的类型就被确定了，只能是`string`类型，当然，其实你这样写`const a ='hello'`，也是可以的，而且是等效的，ts会自动推断出a的类型为`string`

    2. 先声明后使用

        + 先声明后使用，在ts中，主要有以下方式声明类型，注意，声明类型是不区分大小写的，但是大多数人都遵循首字母大写的规范。这个并没有强制要求，只不过如果使用小写开头，某些情况下可能会遭人耻笑

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

            `interface`，官方称它为接口，可以理解为结构化类型，你可以把它简单类比为`javascript`的`Object`的类型，使用上可以这样使用：

                ```ts
                    export interface IProps {
                        names:string[];
                        age:number;
                    }
                ```
            
            同时，对于结构化类型，是可以被`implements`和`extends`的，这个放在下一期说

        3. `class`

            对于class，我们暂时之说抽象类这一种，其他内容过于多，将放在单独一章来说

            ```ts
                abstract class Animal {
                    abstract makeSound():void;
                    move():void{
                        console.log('roaming the earch...');
                    }
                }
            ```

            `abstract`关键字用来定义抽象类和在抽象类内部定义抽象方法，抽象类中的抽象方法必须在派生类中实现。



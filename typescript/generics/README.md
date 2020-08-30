# typescript 之 泛型

+ 在实际开发中，你设计的组件可能并不仅仅在一种类型上工作，你可能期望它可以在多种类型间切换并且正常工作，比如`JAVA`语言的`List`这种。而`ts`的泛型就是为了满足这种需求而出现的

1. 认识泛型

    + 首先假设我们要实现一个函数，它会将传入的参数返回

    如果不使用泛型的话，我们需要为它指定一个特定的类型：

    ```ts
        function identity(arg:number):number{
            return arg;
        }
    ```

    或许，我们可以使用`any`

    ```ts
        function identity(arg:any):any{
            return arg;
        }
    ```

    但是这样我们就丢失了函数返回时的类型信息，同时也失去了使用`ts`的意义，下面我们使用泛型来改写这个函数

    ```ts
        function identity<T>(arg:T):T{
            return arg;
        }
    ```

    这样，我们就定义了一个泛型函数，它可以通过以下两种方式来调用：

    1. 将类型参数传递给函数：

    ```ts
        let output = identity<string>('myString');
        // ^ = let output:string;
    ```

    2. 使用类型推断来自动设置value:

    ```ts
        let output = identity('myString');
        // ^ = let output:string;
    ```

    第二种方法是最为常见的，编译器会根据传入的参数自动推断参赛类型。但是类型推断并不是万能的，当编译器无法推断类型时，可能需要像第一种方式显式传递类型实参，这可能在更复杂的示例中发生

2. 使用泛型类型变量

    + 我们可以把泛型比作函数中的参数，它可以与其他泛型来搭配使用：

    ```ts
        type Identity<T>=T[];

        function loggingIdentity<T>(arg:T):Identity<T>{
            return [arg];
        }

        loggingIdentity('string')
    ```
    这里的`Identity`也可以改成`Array`，或者直接写成`T[]`,这里这样写只是为了说明泛型可以和泛型配合使用

3. 使用泛型

    + 很多时候，我们不会把泛型的定义和我们的逻辑代码耦合在一起，我们会把类型单独声明出来，并在需要的地方去使用它们，我们可以这样使用：

    1. 内联写法

    ```ts
        function identity<T>(arg:T):T{
            return arg;
        }
        let myIdentity:<U>(arg:U)=>U = identity;
    ```

    2. 写成对象文字类型的调用签名

    ```ts
        function identity<T>(arg:T):T{
            return arg;
        }
        let myIdentity:{<U>(arg:U):U} = identity;
    ```

    这是一种比较特殊的写法，`interface`描述函数类型的一种方式

    ```ts
        interface SearchFunc {
            (source: string, subString: string): boolean;
        }
        // ^ = type SearchFunc = (source: string, subString: string)=> boolean;
    ```

    3. 接口中的泛型

        有时候，我们需要为整个接口定义一个泛型参数，可以像下面这样来定义：

        ```ts
            interface GenericIdentity<T>{
                identity:(arg:T)=>T;
                list:T[]
            }

            const identityMap:GenericIdentity<number> = {
                identity:(arg)=>arg,
                list:[1,2,3]
            }
        ```

4. 泛型类

    + 通用类和通用接口的写法是非常类似的，如下：

    ```ts
        class GenericNumber<T> {
            zeroValue: T;
            add: (x: T, y: T) => T;
        }

        let myGenericNumber = new GenericNumber<number>();
        myGenericNumber.zeroValue = 0;
        myGenericNumber.add = function(x, y) {
            return x + y;
        };
    ```

5. 对泛型进行约束

    + 有时候，我们并不希望定义的泛型可以接受任意类型，希望对它进行限制，我们可以使用`extends`关键字来实现

    ```ts
        interface Lengthwise {
            length: number;
        }

        function loggingIdentity<T extends Lengthwise>(arg: T): T {
            console.log(arg.length);
            return arg;
        }
    ```

    如上`extends`会限制传入的类型必须是`Lengthwise`的子类型

6. 在泛型中使用类

    1. 我们在`ts`中创建工厂函数时，会用到该类的构造函数来引用该类的类型，例如：

    ```ts
        function create<T>(c:{new ():T}):T{
            return new c();
        }
    ```

    2. 甚至，你可以使用prototype属性来推断和约束构造函数和类的实例类型之间的关系

    ```ts
        class BeeKeeper {
            hasMask: boolean;
        }

        class ZooKeeper {
            nametag: string;
        }

        class Animal {
            numLegs: number;
        }

        class Bee extends Animal {
            keeper: BeeKeeper;
        }

        class Lion extends Animal {
            keeper: ZooKeeper;
        }

        function createInstance<A extends Animal>(c: new () => A): A {
            return new c();
        }

        createInstance(Lion).keeper.nametag;
        createInstance(Bee).keeper.hasMask;
    ```

# 最后，对于泛型，其实是不区分大小写的，但惯例都是使用一个大写字母来表示，一般来说，会取类型的首字母，如React中定义的State和Props，它的定义是这样的:

```ts
    declare function createReactClass<P, S = {}>(spec: ComponentSpec<P, S>): ClassicComponentClass<P>;
```

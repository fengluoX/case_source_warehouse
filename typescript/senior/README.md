# typescript高级篇

+ 在基础篇里，我们已经了解了`ts`的类型，以及`ts`类型的使用，接下来，我们就要介绍对类型的提取，组合，继承，以及一些高级用法

## 类型提取，组合，继承

### 联合类型

联合类型，操作符为`|`，当你期望变量会是多种类型时会用到它：

```ts
    type Props = string|number;
```
    
这样，`Props`类型的变量就既可以是`string`类型，也可以是`number`类型了
    
通常情况下，我们也会在函数参数中使用：

```ts
    function padLeft(value:string,padding:string|number){
        //...
    }
```

### 交叉类型

交叉类型，它的操作符是`&`，它会将多个类型合并成一个新的类型，取其共性，不可合并的变为`never`类型

```ts
    type NetworkLoadingState = {
        success:boolean;
        code:string;
        data:{
            list:string[]
        }
    }

    type NetWorkFailedState = {
        success?:boolean;
        code:number
    }

    type NetworkState = NetWorkFailedState&NetworkLoadingState;
```

经过将两个类型交叉后，我们得到了`NetworkState`类型，它其实和下面这样是等效的：

```ts
    type NetworkState = {
        success:boolean;
        code:never;
        data:{
            list:string[]
        }
    }
```

我们可以看到，经过合并，success丢失了可选属性，而code变成了`never`类型

### in/as

`in`这个关键词在`javascript`中用来检查属性是否存在，而在ts可以用作类型保护，如：

```ts
    interface A {
        x:number;
    }
    interface B {
        y:string;
    }
    function doStuff(q:A|B){
        if('x' in q){
            // q:A
        }else{
            // q:B
        }
    }
```

`as`关键字则是类型断言，使用该关键字可以覆盖ts的推断，主要用来告诉编译器你比它更了解这个类型，并且它不应该再发出错误。

```ts
    interface Foo {
        bar:number;
        bas:string;
    }
    const foo = {} as Foo;
    foo.bar = 123;
    foo.bas = 'hello'
```

### is

`is`用来定义用户自定义的类型防护，但是实际开发中我并没有用过，这个给出官方的示例：

```ts
    // 定义
    interface Fish {
        swim:()=>void;
    }
    interface Bird {
        fly:()=>void;
    }
    const getSmallPet:()=>Fish|Bird;
    function isFish(pet:Fish|Bird):pet is Fish {
        return (pet as Fish).swim !== undefined;
    }
    // 使用
    let pet = getSmallPet();
    if(isFish(pet)){
        pet.swim();
    }else{
        pet.fly();
    }
```

### typeof/instanceof

`typeof`以及`instanceof`这两个关键字是我门的老朋友了，如果你在一个条件块中使用它们，`ts`将会推导出条件块中的变量类型，如下所示：

```ts
    // typeof
    function doSome(x:number|string){
        if(typeof x === 'string'){
            console.log(x.subtr(1)); // Error，string类型上并没有subtr方法
            console.log(x.substr(1)); // OK
        }
        console.log(1) // Error，无法保证x是string类型
    }
    // instanceof
    class Foo {
        foo = 123;
        common ="123";
    }
    class Bar {
        bar = 123;
        common = "123";
    }
    function doStuff(arg:Foo|Bar){
        if(arg instanceof Foo){
            console.log(arg.foo); //OK
            console.log(arg.bar); // Error，Foo上不存在属性bar;
        }
        if(arg instanceof Bar){
            console.log(arg.bar); //OK
            console.log(arg.foo); // Error，Bar上不存在属性foo;
        }
    }
    doStuff(new Foo());
    doStuff(new Bar());
```
`ts`不仅仅可以理解这些，一些其他的判断类型，比如`Arrar.isArray`，甚至`else`。当你使用if来缩小类型时，`ts`知道`else`代码块中的类型并不是`if`中的类型

### 类型的提取，衍生

1. `typeof`

    当`typeof`被用于类型语句时，它会产生和js中不同的表现，会提取当前值的类型

    ```ts
        const foo = {
            foo:'foo',
            common:123
        }
        let bar:typeof foo;

        // 上面这个语句与下面这段语句是等同的
        let bar:{
            foo:string;
            common:number;
        }
    ```

2. `keyof`

    `keyof`是用来获取对象类型的key值的并集，比如这样：

    ```ts
        interface Car {
            manufacturer:string;
            model:string;
            year:number;
        }
        let carProps:keyof Car;
        // 上面这个语句与下面这段语句是等同的
        let carProps:'manufacturer'|'model'|'year';
    ```

3. `extends`

    在es6之后的JS版本，出现了类声明，其中`extends`关键字是用来继承类型的，而`extends`用在类型语句中，则是可以继承类型：

    ```ts
        interface SuperType {
            name:string;
        }

        interface ColorType {
            color:string;
        }

        interface SubType extends SuperType,ColorType {
            age:number;
        }
        // 上面这个语句与下面这段语句是等同的
        interface SubType {
            age:number;
            color:string;
            name:string;
        }
    ```

    当然，如果遇到无法合并的属性，ts就会报错，而不是像`&`运算符一样丢失特性

### 实用类型

+ 这部分类型在开发中非常常用，详细可见(ts文档)[https://www.typescriptlang.org/docs/handbook/utility-types.html],当然，你也可以在`lib.es5.d.ts`找到这些类型的全部定义,当然，如果你对这里面的`?:`等操作非常了解的话，那你的`ts`造诣便不是一般的高了

1. `Partial<Type>`

```ts
    type Partial<T> = {
        [P in keyof T]?: T[P];
    };
```

`Partial<Type>`会将传入的`Type`类型内的所有属性设置为可选，并返回这个新类型

2. `Required<Type>`

```ts
    type Required<T> = {
        [P in keyof T]-?: T[P];
    };
```

`Required<Type>`会将传入的`Type`类型内的所有属性设置为必选，并返回这个新类型

3. `Readonly<Type>`

```ts
    type Readonly<T> = {
        readonly [P in keyof T]: T[P];
    };
```

`Readonly<Type>`会将传入的`Type`类型内的所有属性设置为只读，并返回这个新类型

4. `Pick<Type,Keys>`

```ts
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };
```

`Pick<Type,Keys>`会从`Type`中提取一组属性来返回，

5. `Omit<Type,Keys>`

```ts
    type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

`Omit<Type,Keys>`会从`Type`中移除掉一组属性，然后返回`Type`;

6. `Record<Keys,Type>`

```ts
    type Record<K extends keyof any, T> = {
        [P in K]: T;
    };
```

一般来说，我通常拿它来当作Map的替代品，下面这两个语句是等值的：

```ts
    let Car:Record<string,string>;
    let Car:{
        [props:string]:string;
    }
```

7. `Exclude<Type,ExcludedUnion>`

```ts
    type Exclude<T, U> = T extends U ? never : T;
```

没有看懂这个，官方文档说它会去除重复的属性，官方例子如下：

```ts
    type T0 = Exclude<"a" | "b" | "c", "a">;
    //    ^ = type T0 = "b" | "c"
    type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
    //    ^ = type T1 = "c"
    type T2 = Exclude<string | number | (() => void), Function>;
    //    ^ = type T2 = string | number
```

8. `Extract<Type, Union>`

```ts
    type Extract<T, U> = T extends U ? T : never;
```

这个的作用和`Exclude`是相反的，官方例子如下：

```ts
    type T0 = Extract<"a" | "b" | "c", "a" | "f">;
    //    ^ = type T0 = "a"
    type T1 = Extract<string | number | (() => void), Function>;
    //    ^ = type T1 = () => void
```

9. `NonNullable<Type>`

```ts
    type NonNullable<T> = T extends null | undefined ? never : T;
```

`NonNullable`会移除`null`或`undefined`属性

10. `Parameters<Type>`

```ts
    type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
```

没用过，大致就是获取函数类型的参数类型，官方解释如下：

```ts
    declare function f1(arg: { a: number; b: string }): void;

    type T0 = Parameters<() => string>;
    //    ^ = type T0 = []
    type T1 = Parameters<(s: string) => void>;
    //    ^ = type T1 = [s: string]
    type T2 = Parameters<<T>(arg: T) => T>;
    //    ^ = type T2 = [arg: unknown]
    type T3 = Parameters<typeof f1>;
    /*    ^ = type T3 = [arg: {
        a: number;
        b: string;
    }]*/
    type T4 = Parameters<any>;
    //    ^ = type T4 = unknown[]
    type T5 = Parameters<never>;
    //    ^ = type T5 = never
    type T6 = Parameters<string>;
    // Type 'string' does not satisfy the constraint '(...args: any) => any'.
    //    ^ = type T6 = never
    type T7 = Parameters<Function>;
    // Type 'Function' does not satisfy the constraint '(...args: any) => any'.
    // Type 'Function' provides no match for the signature '(...args: any): any'.
    //    ^ = type T7 = never
```

11. `ConstructorParameters<Type>`

```ts
    type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
```

也没用过，官方解散说是获取类的构造函数的参数类型

```ts
    type T0 = ConstructorParameters<ErrorConstructor>;
    //    ^ = type T0 = [message?: string]
    type T1 = ConstructorParameters<FunctionConstructor>;
    //    ^ = type T1 = string[]
    type T2 = ConstructorParameters<RegExpConstructor>;
    //    ^ = type T2 = [pattern: string | RegExp, flags?: string]
    type T3 = ConstructorParameters<any>;
    //    ^ = type T3 = unknown[]

    type T4 = ConstructorParameters<Function>;
    // Type 'Function' does not satisfy the constraint 'new (...args: any) => any'.
    // Type 'Function' provides no match for the signature 'new (...args: any): any'.
    //    ^ = type T4 = never
```

12. `ReturnType<Type>`

```ts
    type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
```

用于获取函数的返回值的类型，官方用法如下：

```ts
    declare function f1(): { a: number; b: string };

    type T0 = ReturnType<() => string>;
    //    ^ = type T0 = string
    type T1 = ReturnType<(s: string) => void>;
    //    ^ = type T1 = void
    type T2 = ReturnType<<T>() => T>;
    //    ^ = type T2 = unknown
    type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
    //    ^ = type T3 = number[]
    type T4 = ReturnType<typeof f1>;
    /*    ^ = type T4 = {
        a: number;
        b: string;
    }*/
    type T5 = ReturnType<any>;
    //    ^ = type T5 = any
    type T6 = ReturnType<never>;
    //    ^ = type T6 = never
    type T7 = ReturnType<string>;
    // Type 'string' does not satisfy the constraint '(...args: any) => any'.
    //    ^ = type T7 = any
    type T8 = ReturnType<Function>;
    // Type 'Function' does not satisfy the constraint '(...args: any) => any'.
    // Type 'Function' provides no match for the signature '(...args: any): any'.
    //    ^ = type T8 = any
```

13. `InstanceType<Type>`

```ts
    type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
```

用于获取返回类的构造函数的返回值的类型，官方用例如下：

```ts
    class C {
    x = 0;
    y = 0;
    }

    type T0 = InstanceType<typeof C>;
    //    ^ = type T0 = C
    type T1 = InstanceType<any>;
    //    ^ = type T1 = any
    type T2 = InstanceType<never>;
    //    ^ = type T2 = never
    type T3 = InstanceType<string>;
    // Type 'string' does not satisfy the constraint 'new (...args: any) => any'.
    //    ^ = type T3 = any
    type T4 = InstanceType<Function>;
    // Type 'Function' does not satisfy the constraint 'new (...args: any) => any'.
    // Type 'Function' provides no match for the signature 'new (...args: any): any'.
    //    ^ = type T4 = any
```

14. `ThisParameterType<Type>`

```ts
    type ThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
```

看不懂，也没用过，官方用例如下：

```ts
    function toHex(this: Number) {
    return this.toString(16);
    }

    function numberToString(n: ThisParameterType<typeof toHex>) {
    return toHex.apply(n);
    }
```

15. `OmitThisParameter<Type>`

```ts
    type OmitThisParameter<T> = unknown extends ThisParameterType<T> ? T : T extends (...args: infer A) => infer R ? (...args: A) => R : T;
```

也没用过，贴下官方用例：

```ts
    function toHex(this: Number) {
    return this.toString(16);
    }

    const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

    console.log(fiveToHex());
```

16. `ThisType<Type>`

```ts
    interface ThisType<T> { }
```

这个官方讲了一大堆，着实没有看懂，从定义看就是个对象，奇怪，官方用例如下：

```ts
    type ObjectDescriptor<D, M> = {
    data?: D;
    methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
    };

    function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
    let data: object = desc.data || {};
    let methods: object = desc.methods || {};
    return { ...data, ...methods } as D & M;
    }

    let obj = makeObject({
    data: { x: 0, y: 0 },
    methods: {
        moveBy(dx: number, dy: number) {
        this.x += dx; // Strongly typed this
        this.y += dy; // Strongly typed this
        },
    },
    });

    obj.x = 10;
    obj.y = 20;
    obj.moveBy(5, 5);
```

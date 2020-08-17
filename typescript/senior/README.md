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

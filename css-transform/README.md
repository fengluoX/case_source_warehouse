# 详解CSS3-transform属性

transform属性是CSS3的新属性，它翻译为转换，即它可以对html元素进行2D或3D方向的旋转，缩放，倾斜或平移，借助它和transtion,我们可以实现一些比较有趣的交互动画，下面详细介绍它的各个属性只及表示含义，以及配合它使用的transform-origin和perspective属性

## transform-origin
+ transform-origin用于为要变形的元素设置变形的原点，如旋转时的基准点
    + transform-origin在设置值时，可以是px,em,rem,百分比等长度单位，也可以是关键字，它可以设置以下关键字：left,right,top,bottom,center，transform-origin在设置时，可以设置一个，两个或三个值来指定基准点
    + transform-origin 的默认值为center,center
    1. 一个值 如果是长度单位或left,center,right，则为设置X轴的偏移量，如果是top，bottom，则为设置y轴的偏移量
        ```css
            transform-origin:center;
        ```
    2. 两个值 默认第一个值设置X轴的偏移量，第二个值设置y轴的偏移量，下面介绍几种特殊情况
        ```css
            /*
                以下会自动调整
            */
            transform-origin:top right;
            transform-origin:top center;
            transform-origin:top left;
            transform-origin:center center;
            transform-origin:bottom right;
            transform-origin:bottom center;
            transform-origin:bottom left;
            /*
                以下类似的情况样式会无法解析，导致样式不生效
            */
            transform-origin:top bottom;
            transform-origin:top top;
            transform-origin:100px right;
        ```
    3. 三个值 三个值的用法和两个值的用法差不多，区别在于第三个值不能取关键字，只能是长度单位
        ```css
             transform-origin:bottom left 100px; /*正确用例*/
             transform-origin:bottom left bottom; /*错误用例*/
        ```
## perspective

+ perspective属性用于为元素提供3D转换空间，在需要进行3D转换时，转换的元素的父级元素必须拥有该属性

+ 取值：

    1. `none`表示不进行配置3D转换空间

    2. 长度单位，代表基于屏幕的3D转换空间深度，该值只能为正值,z轴的默认坐标以屏幕为0，屏幕之外为正值，屏幕之内为负值

## transform

+ transform拥有若干个函数式属性，分别代表不同的转换

1. matrix(a,b,c,d,tx,ty)
    + `matrix(a,b,c,d,tx,ty)`其实是`matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1) `的简写
    
    + `matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)`

    + 这些参数`a1 b1 c1 d1 a2 b2 c2 d2 a3 b3 c3 d3 d4`以number的格式来描述线性渐变

    + `a4 b4 c4` 以number的格式描述变换的量

    + 这个函数涉及笛卡尔坐标系和矩阵的知识点，日常开发中用到的机会不太大，有兴趣的话倒是可以研究一下

2. perspective()
    
    + 该函数用于设定当前元素的3d容器深度，可以用于覆盖父级元素的`perspective`属性

3. rotate()
    
    + 该函数用于旋转当前元素

    + rotate(a) 
        + 参数a代表旋转的角度，正角表示顺时针旋转，负角表示逆时针旋转，旋转的基准点默认为元素中心点，如果使用`transform-origin`属性定义了新的基准点，则以新的基准点为准
            ```css
                transform:rotate(90deg) /*deg表示度，此处为旋转90度*/
            ```
    
    + rotate3d(x,y,z,a)

        1. `x` number类型，只能是数字，用于描述旋转轴向量的x坐标

        2. `y` number类型，只能是数字，用于描述旋转轴向量的y坐标

        3. `z` number类型，只能是数字，用于描述旋转轴向量的z坐标

        3. `a` 角度单位，代表旋转的角度，正值为顺时针旋转，负值为逆时针旋转

        ```css
            transform: rotate3d(10,10,10,30deg);
        ```

        + rotate3d的参数值必须全部传入，如果不传入，将不产生效果

    + rotate3d还有以下三种简写方式

        1. `rotate3d(1,0,0,a)`的简写形式：rotateX(a)
        
        2. `rotate3d(0,1,0,a)`的简写形式：rotateY(a)

        3. `rotate3d(0,0,1,a)`的简写形式：rotateZ(a)
    
    + rotate3d的旋转轴是由基准点与传入参数的指定的点连成的线，元素将绕这根轴进行旋转

4. scale()

    + 该函数用于缩放元素

    + scale()
        
        + scale(sx)：对元素横纵坐标都以该sx比例缩放

        + scale(sx,sy)：对元素横坐标以sx比例缩放，纵坐标以sy比例缩放
    
    + scale3d(sx,sy,sz)

        + 对元素进行3d缩放

        + `sx`代表缩放横坐标比例

        + `sy`代表缩放纵坐标比例

        + `sz` 代表缩放z轴坐标比例

    + scale3d()同样也有三种简写方式

        1. `scale3d(sx,1,1)`的简写形式：scaleX(sx)

        2. `scale3d(1,sy,1)`的简写形式：scaleY(sy)

        3. `scale3d(1,1,sz)`的简写形式：scaleZ(sz)

5. skew()

    + 该函数用于对元素进行拉伸，参数均为角度值

    + skew(ax)/skew(ax,ay)
        + `ax`表示横坐标扭曲元素的角度
        + `ay`表示纵坐标扭曲元素的角度
    + skew也可以分开设置值,对应函数为：
        ```css
            transform: skewX(30deg) skewY(10deg);
        ```

6. translate()

    + 该函数用于平移元素

    + translate

        + 用法：translate(tx) / translate(tx,ty)

        + `tx` 表示元素向x轴平移tx个坐标

        + `ty` 表示元素向y轴平移ty个坐标

    + translate3d(tx,ty,tz)

        + 该函数是translate的3d版本，主要增加了参数tz来作为元素在z轴的平移距离

    + 简写

        1. translateX(tx)是translate(tx,0)的简写

        2. translateY(ty)是translate(0,ty)的简写

        3. translateZ(tz)是translate3d(0,0,tz)的简写

## 最后，还有几个可以配合的transform使用的属性，但兼容性和实际使用性有待商榷，它们分别是：

1. perspective-origin 指定观察者的位置，用作perspective属性的消失的

2. backface-visibility 指定当元素背面朝观察者时是否可见
    + 取值：visible(可见),hidden(不可见)
3. transform-box 定义了与 transform、transform-origin 这两个属性有关联的布局框。
    + 取值：border-box，fill-box，view-box
    + 注：兼容性不太友好，除了firefox完成了该实现，其他浏览器均未实现
4. transform-style 设置元素的子元素是位于 3D 空间中还是平面中。
    + 取值：flat，preserve-3d
    + 注：除了IE系浏览器不支持，其他均已实现

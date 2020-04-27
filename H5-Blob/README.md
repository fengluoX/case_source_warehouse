# js接收二进制流图片数据并展示

## 背景

公司的图片后端都是做了登录校验，在PC端的时候采用的ctoken的方式进行的校验，是没有任何问题的，毕竟cookie可以自动携带嘛，但是在小程序端的时候，采用的的token的方式，这就尴尬了，因为小程序的image标签请求时是没办法携带token的，所以我们采取了使用请求先获取到图片的二进制流，然后将二进制流进行转换后塞到image标签的src属性上，中间也踩了很多坑，所以才有了本文

## 小程序端

+ 小程序端的主要思路是将图片的二进制流转换成base64编码，然后塞到src里面

  + 支付宝小程序

    ```js
        my.request({
        url: 'http://admin.luoyetree.top/static/js.png',
        method: 'GET',
        dataType:'base64',
        success: (result) => {
            // 注意，小程序不会为你拼接前缀，需要你自行拼接
            result = `data:image/jpg;base64,${result.data}`
        }
        })
    ```

  + 微信小程序

    ```js
        wx.request({
            url: 'http://admin.luoyetree.top/static/js.png',
            method: 'GET',
            dataType:'其他',
            responseType:'arraybuffer', // 划重点
            success: (result) => {
                let arrrybuffer = new Uint8Array(result.data)
                result = `data:image/jpg;base64,${wx.arrayBufferToBase64(arrrybuffer)}`
            }
        })
    ```
  
  + 当然了，除了使用小程序自带的api，我们也可以手动实现将arraybuffer对象转成base64

    + 思路

      1. 首先，我们要将arraybuffer对象的每个byte的Unicode的转为字符,主要使用fromCharCode方法，实现方法如下

            ```js
                function bufferToBase64(buffer){
                    let binary = '';
                    let bytes = new Uint8Array(buffer);
                    let len = bytes.byteLength;
                    for (let i = 0; i < len; i++) {
                        binary += String.fromCharCode(bytes[i]);
                    }
                    return window.btoa(binary);
                }
            ```

      2. window.btoa用于进行base64编码，针对没有window对象或没有该方法的平台，可以使用polyfill实现，或者自行改造下polyfill，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowBase64/btoa)的polyfill实现如下:

            ```js
                // Polyfill from  https://github.com/MaxArt2501/base64-js/blob/master/base64.js
                (function() {
                    // base64 character set, plus padding character (=)
                    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

                        // Regular expression to check formal correctness of base64 encoded strings
                        b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

                    window.btoa = window.btoa || function(string) {
                        string = String(string);
                        var bitmap, a, b, c,
                            result = "",
                            i = 0,
                            rest = string.length % 3; // To determine the final padding

                        for (; i < string.length;) {
                            if ((a = string.charCodeAt(i++)) > 255 ||
                                (b = string.charCodeAt(i++)) > 255 ||
                                (c = string.charCodeAt(i++)) > 255)
                                throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

                            bitmap = (a << 16) | (b << 8) | c;
                            result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63) +
                                b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
                        }

                        // If there's need of padding, replace the last 'A's with equal signs
                        return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
                    };

                    window.atob = window.atob || function(string) {
                        // atob can work with strings with whitespaces, even inside the encoded part,
                        // but only \t, \n, \f, \r and ' ', which can be stripped.
                        string = String(string).replace(/[\t\n\f\r ]+/g, "");
                        if (!b64re.test(string))
                            throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");

                        // Adding the padding if missing, for semplicity
                        string += "==".slice(2 - (string.length & 3));
                        var bitmap, result = "",
                            r1, r2, i = 0;
                        for (; i < string.length;) {
                            bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12 |
                                (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

                            result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255) :
                                r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255) :
                                String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
                        }
                        return result;
                    };
                })()
            ```

## PC端

+ PC端的方式就比较多了，笔者探索出来的有三种，分别是base64编码，使用[URL.createObjectURL](https://developer.mozilla.org/zh-CN/docs/Web/API/URL/createObjectURL),或者使用[FileReader对象](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)，base64编码是通用的前面已经介绍过了，下面主要介绍剩余两种方法

  + 前提：这两种方式所接受的对应都为Blob对象，获取Blob你可以在请求时设置`xhr.responseType==='blob'`，也可以将arrayBuffer对象实例为一个Blob对象，当然，如果你使用fetch,可以使用下面这种方式：
  
  ```js
    fetch(myRequest).then(function(response) {
        return response.blob();
    })
  ```

  1. URL.createObjectURL
  这个的实现思路主要是通过URL.createObjectURL创建一个指向Blob对象的url引用，从而达到展示图片的目的，代码很简单，就是这样`const domString = URL.createObjectURL(blob)`，当然，在用完后记得使用`URL.revokeObjectURL(domString)`解除引用，防止造成内存泄漏

  2. 使用FileReader对象
  FileReader对象可以让我们异步读取用户计算机的文件，这里主要使用它的`readAsDataURL`方法，具体实现如下：
  
  ```ts
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
        resolve(reader.result as string);
    }
  ```

  当然，我们实际看img的src属性时就会发现，`readAsDataURL`其实也是帮我们转成了base64，不过它比较只能，自动帮我们拼接了`data:image/jpg;base64,`这个前缀，当然，也有可能并一定是`image/jpg`，要视文件的格式而定

## 最后，这个也算是踩了不少坑吧，也是相当有收获的，[源码地址](https://gitee.com/luoyestr/case_source_warehouse/tree/master/H5-Blob)

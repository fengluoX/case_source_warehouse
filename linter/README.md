<a name="rAnRt"></a>
# 什么是linter
linter 是一种帮助您改进代码的工具。它通过分析我们的源代码来为我们找出问题。在前端，我们目前使用到的最多的是 [stylelint](https://stylelint.io/) 与 [eslint](https://eslint.org/docs/latest/user-guide/getting-started) ，前者是对我们的css、less、sass代码进行检查，后者则是针对我们的js、ts代码进行检查
<a name="N7Sd3"></a>
# 使用linter
<a name="Pxk8V"></a>
## 创建项目
```bash
mkdir linter
cd linter
pnpm init
mkdir src
touch src/index.ts
```
<a name="Ifyuj"></a>
## [styleLint](https://stylelint.io/user-guide/get-started/)
<a name="zHcbH"></a>
### 安装：
```bash
pnpm install --save-dev stylelint stylelint-config-standard
touch .stylelintrc.json
```
<a name="xegs1"></a>
### 配置配置文件
```json
{
  "extends": "stylelint-config-standard"
}
```
<a name="f3ZHp"></a>
### 其他
styleLint还可以通过自定义rules或者plugins来调整，比如上面我们继承的stylelint-config-standard，其实就是一组已经定义好的rules，详细的rules规则可以在这里查阅到：[https://stylelint.io/user-guide/rules/list](https://stylelint.io/user-guide/rules/list) 。当然，我们更多的时候是直接继承前人已经定义好的规则集，比如你使用sass，可能会用到stylelint-config-standard-scss，你可以在这里找到一些很棒的配置或者插件，根据你们团队的需求来进行选择[https://github.com/stylelint/awesome-stylelint](https://github.com/stylelint/awesome-stylelint)
<a name="YKUTI"></a>
## [eslint](https://eslint.org/docs/latest/user-guide/getting-started)
<a name="nSUbu"></a>
### 安装：
```bash
pnpm install eslint --save-dev
```
<a name="IlaJF"></a>
### 配置：
配置配置文件可以自行配置，eslint也提供了命令行工具来自动为我们创建，这里我们推荐使用命令行工具创建，因为它会根据你的选择，自动为你安装需要的依赖，省去了手动配置安装的过程，命令如下：
```bash
pnpm create @eslint/config
```
命令执行过程中会问你几个问题，根据项目据实回答就好<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657870924119-cef0e2cc-01a4-46b1-b022-466d47c5d828.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=215&id=ueb3e1bd2&margin=%5Bobject%20Object%5D&name=image.png&originHeight=215&originWidth=1065&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27439&status=done&style=none&taskId=ufb6cc2a7-44dc-4b1c-8f49-d09832d16ff&title=&width=1065)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657870956614-7208a797-f3ca-447f-ba70-03d12ef92c1d.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=190&id=u792f1e2a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=190&originWidth=968&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25126&status=done&style=none&taskId=u3117b9c3-97b4-44fa-8361-93351d8f74e&title=&width=968)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657870994270-4384efb9-54f4-4f6e-b3ad-e82e79cf6c77.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=142&id=u2ad45210&margin=%5Bobject%20Object%5D&name=image.png&originHeight=142&originWidth=678&originalType=binary&ratio=1&rotation=0&showTitle=false&size=16776&status=done&style=none&taskId=ufdaec6ba-f8cb-4b82-98e6-01d8ea5f462&title=&width=678)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871045497-6dd0ae7a-b70c-45bd-bb3d-d6f672159cb9.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=207&id=ub206a5bb&margin=%5Bobject%20Object%5D&name=image.png&originHeight=207&originWidth=1007&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26701&status=done&style=none&taskId=u381ab4f6-84a1-4920-9366-37873808ea1&title=&width=1007)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871077694-c25a3fd8-ae1c-4774-a285-20708257530e.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=157&id=uf13a8fed&margin=%5Bobject%20Object%5D&name=image.png&originHeight=157&originWidth=971&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26531&status=done&style=none&taskId=uc739319c-6254-4849-ad7a-47c48bfb0d3&title=&width=971)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871111500-15f26a42-dd37-41b2-93a9-a3363991f83b.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=169&id=u06dd032a&margin=%5Bobject%20Object%5D&name=image.png&originHeight=169&originWidth=912&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27658&status=done&style=none&taskId=ud0ae74e7-ad09-48e1-be80-9815605c6e8&title=&width=912)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871214704-386193d2-504b-4e68-b5cc-1f9e02b43413.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=187&id=ucb944256&margin=%5Bobject%20Object%5D&name=image.png&originHeight=187&originWidth=785&originalType=binary&ratio=1&rotation=0&showTitle=false&size=27969&status=done&style=none&taskId=ua18bbe9c-93f0-411b-9647-55dea6327fb&title=&width=785)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871234636-560bcb94-0f75-4786-8803-0814a73fef59.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=184&id=ua98bb4b9&margin=%5Bobject%20Object%5D&name=image.png&originHeight=184&originWidth=631&originalType=binary&ratio=1&rotation=0&showTitle=false&size=25141&status=done&style=none&taskId=ua50dc46e-9329-4367-945c-0c624e76f3b&title=&width=631)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/12383007/1657871262281-d7cfb74d-c1bf-4663-865c-21f2bb8a4f91.png#clientId=u28494e4b-aff7-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=191&id=uf91feffd&margin=%5Bobject%20Object%5D&name=image.png&originHeight=191&originWidth=1065&originalType=binary&ratio=1&rotation=0&showTitle=false&size=29874&status=done&style=none&taskId=u5066f5fa-86cd-4f84-be0e-20c626aa073&title=&width=1065)

这一系列完成后，我们会生成这样一份配置文件：
```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "airbnb-base"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```
这里需要注意的是，如果你使用typescript，那需要手动安装下typescript，命令如下：
```bash
pnpm install typescript -D
```
<a name="iH7dM"></a>
## 与prettier集成
<a name="ujRNQ"></a>
### 安装prettier
```bash
pnpm install --save-dev --save-exact prettier
```
<a name="widUs"></a>
### 创建配置文件
```bash
echo {}> .prettierrc.json
```
<a name="YFtiT"></a>
### 处理stylelint、eslint与prettier的冲突
```bash
pnpm install --save-dev eslint-config-prettier stylelint-config-prettier
```
```json
{
  "extends": [
    // other configs ...
    "stylelint-config-prettier"
  ]
}
```
```json
{
  "extends": [
    // other configs ...,
    "prettier"
  ]
}
```
<a name="gJy5i"></a>
### git hooks
运行如下命令即可：
```bash
pnpm install --save-dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```
<a name="fXpod"></a>
# 源码地址：
ps：这里由于多个文章源码都放在一起了，就没实现hooks部分<br />[https://github.com/fengluoX/case_source_warehouse/tree/master/linter](https://github.com/fengluoX/case_source_warehouse/tree/master/linter)

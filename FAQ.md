# 快速开发须知
- [项目开发规范](./README.md)
- Git使用须知
  - [Git的常用操作](https://baijiahao.baidu.com/s?id=1621585587557268777&wfr=spider&for=pc)

### 项目技术介绍
前端目前使用vue-cli3.0作为开发的主要框架，在vue.config.js扩展了webpack的配置；
以满足项目项目的多页面开发需要。
项目的公共代码的封装在src/ts的目录下。`注意不能随意更改其中的代码进行提交。`
### 项目业务简介
- 目前项目主要分为雷神加速器和薄荷加速器两个；位于src的page目录下，两者的项目目录也大致一致，均包含如下；
    - 微信公共号、手机web站;-----两者公用一套代码，在src/page的leishen_app和bohe_app
    - pc的web端;         -----在src/page的leishen(官网) ,leishen_user(用户中心)和bohe
    - apple的app内嵌页面、Andriod的app内嵌页面;-----在src/page的leishen_app和bohe_app下
    - 苹果mac客户端内嵌页面、windows的pc端；-----在src/page的leishen_pc和bohe_pc下


## 快速上手
``` javascript
npm install //安装所需的npm包
npm run xxx(根据package.json文件的scripts的命令，目前由开发，测试，验证和生产四个环境)

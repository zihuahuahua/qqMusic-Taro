
## api来源
一部分数据 源自[QQ音乐h5](https://m.y.qq.com/)
一部分来自[鼻子亲了脸 封装接口](https://www.bzqll.com/2019/01/262.html)

## 已做
- [x] [首页]
- [x] [排行榜]
- [x] [搜索]
- [x] [热门歌单]
- [x] [播放]
- [x] [歌词]

## todo
* 播放列表
* 上一首下一首

## UI插件
- Taro-ui
[Taro-ui](https://taro-ui.aotu.io/#/docs/quickstart)是一款基于 Taro 框架开发的多端 UI 组件库,里面的一些组件还是挺好用的，也挺好看的，官网很详细而且还有效果图提供观看和体验。


 ## 引用iconfont
  
先去[iconfont](http://www.iconfont.cn/)官网选择你想要的icon，

![](https://user-gold-cdn.xitu.io/2018/11/2/166d3cc0398e3569?w=130&h=144&f=png&s=7982)
选择添加到你自己的项目
![](https://user-gold-cdn.xitu.io/2018/11/2/166d3ccb49b2334c?w=301&h=272&f=png&s=11194)
![](https://user-gold-cdn.xitu.io/2018/11/2/166d3cdb83b43cdf?w=575&h=299&f=png&s=26167)
复制上面的代码在浏览器里打开(前面记得加https:)，
然后在自己的项目中src目录下新建一个icon.scss名字随意css也行，复制在浏览器打开以后的内容粘贴进去，最后在app.tsc中import './icon.scss'   
使用`<Text class="iconfont icon-play-circle"></Text>`
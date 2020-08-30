# easy-music

## 项目启动

```cmd
#下载依赖
npm install 

#本地启动
npm run serve

#打包运行
npm run build
```



## 项目简介

​		本项目用了开源的网易云接口，地址：`https://github.com/Binaryify/NeteaseCloudMusicApi`。由本人独立开发，ui模仿的pc端的网易云。

​		技术栈：vue + vue-router + vuex + element-ui + axios + vue-scroll

**项目目录结构：**

```cmd
|-- src
    |-- App.vue		根组件
    |-- main.js		入口文件
    |-- util.js		我自己封装的挂载到Vue原型的工具函数
    |-- ajax		网络请求文件		
    |-- assets		静态资源文件
    |-- components
    |   |-- artist		歌手详情页面动态切换的组件
    |   |   |-- album.vue		专辑和热门歌曲
    |   |   |-- artistDesc.vue		歌手描述
    |   |   |-- mv.vue		歌手mv
    |   |-- discover		首页发现音乐的导航条
    |   |   |-- tabBar.vue
    |   |-- navBar		固定在最左边的一级导航条
    |   |   |-- index.vue
    |   |-- navPlayer		底部音乐播放器，播放列表等
    |   |   |-- index.vue
    |   |-- navSearch		顶部搜索条，包含热搜，模糊匹配建议等
    |   |   |-- index.vue
    |   |-- playList		歌单详情下面的动态渲染组件
    |   |   |-- comments.vue		评论
    |   |   |-- songs.vue		歌曲列表
    |   |   |-- subscribers.vue		收藏者
    |   |-- searchInfo		搜索详情的四个动态渲染组件
    |       |-- aritistList.vue		歌手列表
    |       |-- playList.vue		歌单列表
    |       |-- songs.vue		歌曲列表
    |       |-- video.vue		视频列表
    |-- router		路由配置文件
    |   |-- index.js
    |-- store		vuex配置文件
    |   |-- index.js
    |-- views		路由文件
        |-- artist		歌手详情页面
        |   |-- index.vue
        |-- audio		视频或mv详情、播放页面
        |   |-- index.vue
        |-- discoverMusic		发现音乐
        |   |-- index.vue								
        |   |-- anchor
        |   |   |-- index.vue
        |   |-- newMusic		最新音乐页面
        |   |   |-- index.vue
        |   |-- rankingList		排行榜展示页面
        |   |   |-- index.vue
        |   |-- recommend		个性推荐页面
        |   |   |-- index.vue
        |   |-- singer		歌手展示页面
        |   |   |-- index.vue
        |   |-- songList		歌单展示页面
        |       |-- index.vue
        |-- look
        |   |-- index.vue
        |-- playList		歌单详情页面
        |   |-- index.vue
        |-- searchInfo		搜索详情页面
        |   |-- index.vue
        |-- selfFM
        |   |-- index.vue
        |-- video		视频页面
            |-- index.vue
            |-- children	
                |-- mv.vue		所有mv页面
                |-- video.vue
```



to be continue，最后有时间会更加完善它
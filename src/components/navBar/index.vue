<template>
  <div class="nav-bar">
    <div class="nav-bar-box">
      <div class="bar-title">推荐</div>
      <div class="music-list" :class="[path === 'discoverMusic' ? 'checked' : '']"  @click="() => toPath('/discoverMusic')">
        <div class="iconfont">&#xe602;</div>
        <div class="text">发现音乐</div>
      </div>
      <div class="music-list" :class="[path === 'selfFM' ? 'checked' : '']" @click="() => toPath('/selfFM')">
        <div class="iconfont">&#xe725;</div>
        <div class="text">私人FM</div>
      </div>
      <div class="music-list" :class="[path === 'look' ? 'checked' : '']" @click="() => toPath('/look')">
        <div class="iconfont">&#xe69f;</div>
        <div class="text">LOOK直播</div>
      </div>
      <div class="music-list" :class="[path === 'video' ? 'checked' : '']" @click="() => toPath('/video')">
        <div class="iconfont">&#xe634;</div>
        <div class="text">视频</div>
      </div>
      <div class="music-list">
        <div class="iconfont">&#xe6df;</div>
        <div class="text">朋友</div>
      </div>
    </div>
    <div class="nav-bar-box">
      <div class="bar-title">我的音乐</div>
      <div class="music-list">
        <div class="iconfont">&#xe6a0;</div>
        <div class="text">本地音乐</div>
      </div>
      <div class="music-list">
        <div class="iconfont">&#xe63a;</div>
        <div class="text">下载管理</div>
      </div>
    </div>
    <div class="nav-bar-box">
      <div class="bar-title">创建的歌单</div>
      <div class="music-list">
        <div class="iconfont">&#xe60f;</div>
        <div class="text">我喜欢的音乐</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      path: this.$route.path.split('/')[1]
    }
  },
  mounted(){
    // console.log('route',this.$route.path)
  },
  methods: {
    toPath(path){
      if(this.path === path.split('/')[1]){       //防止多次点击同一个bar产生多次请求和渲染
        return 
      }
      this.$router.push({path})
      this.path = this.$route.path.split('/')[1]
      // console.log(this.$route.path)
    }
  }
}
</script>

<style lang="scss">
.nav-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  border-right: #e1e1e2 solid 1px;
  background-color: #f5f5f7;
  color: rgb(37,37,37,0.8);
  font-size: 12px;

  .nav-bar-box {
    display: flex;
    flex-direction: column;

    .bar-title {
      padding: 10px;
    }

    .music-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 30px;
      border-left: 3px solid #f5f5f7; 

      .iconfont {
        font-size: 18px;
        margin: 0 10px 0 15px;
      }

      &:hover {
        cursor: pointer;
        color: #000;
      }
    }
  }
}

//被选中的样式
.checked {
  border-left: 3px solid #be2f2f !important;
  background-color: #e6e7ea;
}
</style>

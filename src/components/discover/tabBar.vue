<template>
  <div class="tabbar">
    <ul>
      <li :class="[path === 'recommend' ? 'checked2' : '']"  @click="() => toPath('recommend')">个性推荐</li>
      <li :class="[path === 'songList' ? 'checked2' : '']" @click="() => toPath('songList')">歌单</li>
      <li :class="[path === 'anchor' ? 'checked2' : '']" @click="() => toPath('anchor')">主播电台</li>
      <li :class="[path === 'rankingList' ? 'checked2' : '']" @click="() => toPath('rankingList')">排行榜</li>
      <li :class="[path === 'singer' ? 'checked2' : '']" @click="() => toPath('singer')">歌手</li>
      <li :class="[path === 'newMusic' ? 'checked2' : '']" @click="() => toPath('newMusic')">最新音乐</li>
    </ul>
  </div>
</template>

<script>

export default {
  data(){
    return {
      path: this.$route.path.split('/')[2]
    }
  },
  methods: {
    toPath(path){
      if(this.path === path){           //防止多次点击同一个bar产生多次请求和渲染
        return
      }
      path = '/discoverMusic/' + path
      this.$router.push({path})
      this.path = this.$route.path.split('/')[2]
    }
  }
}
</script>

<style lang="scss">
.tabbar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom: solid 1px #e1e1e2;
  margin-bottom: 20px;

  ul {
    display: flex;  
    flex-direction: row;
    justify-content: space-between;
    width: 480px;
    height: 45px;
    font-size: 14px;

    li {
      display: flex;  
      flex-direction: row;
      align-items: center;

      &:hover {
        cursor: pointer;
        color: #cf2f2f;
      }
    }
  }
}

.checked2 {
  position: relative;
  color: #cf2f2f;
}
.checked2::after {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: #c62f2f solid 2px;
  content: '';
}
</style>
<template>
  <div class="video parent-dom">
    <myScroll>
      <div class="child-dom">
        <div class="tabbar">
          <ul>
            <li :class="[path === 'mv' ? 'checked2' : '']"  @click="() => toPath('mv')">MV</li>
            <li :class="[path === 'video2' ? 'checked2' : '']" @click="() => toPath('video2')">视频</li>
          </ul>
        </div>
        <router-view></router-view>
      </div>
    </myScroll>
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
      path = '/video/' + path
      this.$router.push({path})
      this.path = this.$route.path.split('/')[2]
    }
  }
}
</script>

<style lang="scss">
.video {
  width: 100%;
  height: 100%;

  .child-dom {
    width: 1000px;
    margin: 0 auto;
  }

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
      width: 100px;
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
}

</style>
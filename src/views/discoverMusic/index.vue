<template>
  <div class="discover parent-dom">
    <myScroll>
      <div class="dis-content child-dom">
        <TabBar></TabBar>
        <router-view></router-view>
      </div>
    </myScroll>
  </div>
</template>

<script>
import TabBar from '@/components/discover/tabBar'

export default {
  components: {
    TabBar
  }
}
</script>

<style lang="scss">
.discover {
  width: 100%;
  height: 100%;

  .dis-content {
    display: flex;
    flex-direction: column;
    width: 1000px;
    margin: 0 auto;
  }
}
</style>
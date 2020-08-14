<template>
  <div class="container">
    <NavSearch></NavSearch>
    <div class="content">
      <NavBar></NavBar>
      <div class="music-box">
        <router-view></router-view>
      </div>
    </div>
    <NavPlayer></NavPlayer>
  </div>
</template>

<script>
import NavBar from '@/components/navBar'
import NavPlayer from '@/components/navPlayer'
import NavSearch from '@/components/navSearch'

export default {
  components: {
    NavBar,
    NavPlayer,
    NavSearch
  }
}
</script>

<style lang="scss">

.container {
  overflow: hidden;
  min-width: 1000px;
  min-height: 500px;
  width: 100%;
  height: 100%;

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    padding-bottom: 100px;
    padding-left: 200px;
    background-color: #fafafa;

    .music-box {
      width: 100%;
      height: 100%;
    }
  }
}

</style>

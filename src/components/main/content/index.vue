<template>
  <div class="content">
    <NavBar></NavBar>
    <div class="music-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import NavBar from './navBar'
export default {
  components: {
    NavBar
  }
}
</script>

<style lang="scss">

.content {
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  background-color: #fafafa;

  .music-box {
    flex: 1;
    height: 100%;
  }
}
</style>
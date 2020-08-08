<template>
  <div class="container">
    <NavSearch></NavSearch>
    <Content></Content>
    <NavPlayer></NavPlayer>
  </div>
</template>

<script>
import Content from './components/main/content'
import NavPlayer from './components/main/navPlayer'
import NavSearch from './components/main/navSearch'

export default {
  components: {
    Content,
    NavPlayer,
    NavSearch
  }
}
</script>

<style lang="scss">

.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

</style>

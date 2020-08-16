<template>
  <div class="artistDesc">
    <div v-if="briefDesc" style="margin-bottom:50px;">
      <div style="color:#000;font-weight:600;">歌手简介</div>
      <div style="text-indent:2em;">{{ briefDesc }}</div>
    </div>
    <div v-for="(intro, index) in introduction" :key="'intro' + index" style="margin-bottom:50px;">
      <div style="color:#000;font-weight:600;">{{ intro.ti }}</div>
      <div v-for="(t, j) in intro.txt" :key="'t' + j" style="text-indent:2em;">{{ t }}</div>
    </div>
  </div>
</template>

<script>
import {
  _getArtistDesc
} from '@/ajax/artist'

export default {
  data(){
    return {
      introduction: null,           //歌手描述信息
      briefDesc: null,              //歌手简介
    }
  },
  props: ['id'],
  created(){
    _getArtistDesc(this.id).then(res => {
      if(res.data.code === 200){
        this.briefDesc = res.data.briefDesc
        res.data.introduction.forEach(val => {
          val.txt = val.txt.split('\n')
        })
        this.introduction = res.data.introduction
      }
    }).catch(res => {
      console.log('获取歌手描述信息失败！', res)
    })
  }
}
</script>

<style lang="scss">
.artistDesc {
  width: 100%;
  font-size: 14px;
  line-height: 30px;
  color: rgb(37,37,37,0.8);
  padding-top: 30px;
}
</style>
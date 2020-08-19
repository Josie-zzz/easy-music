<template>
  <div class="playlist-subscri">
    <div class="subscri" v-if="subscribers.length">
      <div class="users" v-for="(subscriber, index) in subscribers" :key="'subscr' + index">
        <img :src="subscriber.avatarUrl">
        <div style="margin-top:10px;">{{ subscriber.nickname  }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  _getSubscribers
} from '@/ajax/discover'

export default {
  data(){
    return {
      subscribers: [],                      //订阅人的信息
    }
  },
  props: ['id'],
  created(){
    this.getSubscribers()
  },
  methods: {
    getSubscribers(){
      _getSubscribers(this.id, 120).then(res => {
        // console.log(res.data.subscribers)
        this.subscribers = res.data.subscribers
      }).catch(res => {
        console.log('请求订阅者失败！', res)
      })
    }
  }
}
</script>

<style lang="scss">
.playlist-subscri {
  width: 100%;
  border-top: solid 1px #e1e1e2;
}

.subscri {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;

  .users {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    height: 100px;
    margin: 30px 30px;
    font-size: 12px;
    color: rgb(37,37,37);
    // background-color: aquamarine;

    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
}
</style>
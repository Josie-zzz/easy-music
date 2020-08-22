<template>
  <div class="mv2">
    <div class="changeParam">
      <div class="tags" style="margin-bottom:20px;">
        <div>地区:</div>
        <div class="tag" v-for="(tag1, index) in areaTag" :key="'tag1' + index">
          <div class="tagName" :class="[tag1 === area ? 'checked4' : '']" @click="changeTags(tag1, 'area')">{{ tag1 }}</div>
          <div v-if="index < areaTag.length - 1" style="border-left:1px solid rgb(37,37,37,0.6);height:10px;margin:0 5px;"></div>
        </div>
      </div>
      <div class="tags" style="margin-bottom:20px;">
        <div>类型:</div>
        <div class="tag" v-for="(tag2, index) in typeTag" :key="'tag2' + index">
          <div class="tagName" :class="[tag2 === type ? 'checked4' : '']" @click="changeTags(tag2, 'type')">{{ tag2 }}</div>
          <div v-if="index < typeTag.length - 1" style="border-left:1px solid rgb(37,37,37,0.6);height:10px;margin:0 5px;"></div>
        </div>
      </div>
      <div class="tags">
        <div>排序:</div>
        <div class="tag" v-for="(tag3, index) in orderTag" :key="'tag3' + index">
          <div class="tagName" :class="[tag3 === order ? 'checked4' : '']" @click="changeTags(tag3, 'order')">{{ tag3 }}</div>
          <div v-if="index < orderTag.length - 1" style="border-left:1px solid rgb(37,37,37,0.6);height:10px;margin:0 5px;"></div>
        </div>
      </div>
    </div>
    
    <div v-if="audios" class="mv2Info">
      <div class="mv3">
        <div class="mvBox" v-for="(au, index) in audios" :key="'au' + index"  @click="toPath(au.id)">
          <div class="mvImg">
            <img :src="au.cover" />
            <div class="playCount">
              <div class="iconfont">&#xe652;</div>
              <div>{{ au.playCount }}</div>
            </div>
            <div class="duration">{{ au.duration }}</div>
          </div>
          <p>{{ au.name }}</p>
          <p style="font-size:12px;color:rgb(37,37,37,0.8);">{{ au.newArtists }}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction: row;justify-content: center;">
        <el-pagination
          v-if="mvsPage > 1 && audios"
          layout="prev, pager, next"
          :page-count="mvsPage"
          :current-page="currentPage"
          @current-change="currentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { _getMvAll } from '@/ajax/video'

let areaTag = ['全部','内地','港台','欧美','日本','韩国']
let typeTag = ['全部','官方版','原生','现场版','网易出品']
let orderTag = ['上升最快','最热','最新']

export default {
  data() {
    return {
      areaTag,
      typeTag,
      orderTag,
      area: '全部',
      type: '全部',
      order: '上升最快',
      audios: null,               //当前标签当前页的信息
      limit: 30,
      currentPage: 1,
      count: -1,                //记录当前搜索结果数量
    }
  },
  created(){
    this.getMvAll(this.area, this.type, this.order, (this.currentPage - 1) * this.limit)
  },
  computed: {
    mvsPage(){
      if(this.count !== -1){
        return Math.ceil(this.count / this.limit)
      } else {
        return 1
      }
    }
  },
  methods: {
    changeTags(param1, param2){
      if(this[param2] === param1){
        return
      }
      this[param2] = param1
      this.audios = null
      this.currentPage = 1

      this.getMvAll(this.area, this.type, this.order, (this.currentPage - 1) * this.limit)
    },
    currentChange(page){
      this.currentPage = page
      this.audios = null
      //第五个参数false为不需要更新count，因为offset偏移值不为零是不会返回count的值,而且也不需要更新
      this.getMvAll(this.area, this.type, this.order, (this.currentPage - 1) * this.limit, false)  
    },
    getMvAll(area, type, order, offset, changeCount = true, limit = this.limit){
      _getMvAll(area, type, order, offset, limit).then(res => {
        if(changeCount){
          this.count = res.data.count  //只有offset为0的时候才会有count
        }
        res.data.data.forEach(val => {
          val.playCount = this.$transPlayCount(val.playCount)      
          val.duration = this.$transDuration(val.duration)
          val.newArtists = this.$transSinger(val.artists)  //新建的属性储存拼接好的所有歌手
        });
        this.audios = res.data.data
      }).catch(res => {
        console.log('获得全部mv失败！', res)
      })
    },
    toPath(id){
      this.$router.push({
        name: 'audio',
        query: {
          id,
          type: 'mv'
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mv2 {

  .changeParam {
    padding: 10px 0;
    margin-bottom: 20px;

    .tags {
      display: flex;
      flex-direction: row;
      font-size: 12px;
      line-height: 20px;
      color: rgb(37,37,37,0.8);

      .tag {
        display: flex;
        flex-direction: row;
        align-items: center;
        
        .tagName {
          padding: 0 5px;
          margin: 0 10px;
          text-align: center;
          &:hover {
            cursor: pointer;
            color: #000;
          }
        }
      }
    }
  }

  .mv2Info {
    border-top: solid 1px #e1e1e2;

    .mv3 {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding-top: 30px;

      .mvBox {
        width: 300px;
        margin-bottom: 40px;

        &:hover {
          cursor: pointer;
        }

        .mvImg {
          position: relative;

          img {
            width: 300px;
            // height: 100px;
          }

          .playCount {
            position: absolute;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            top: 0;
            right: 0;
            width: 50%;
            padding-right: 5px;
            font-size: 12px;
            color: #ffffff;
            line-height: 20px;
            background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4)); //渐变

            .iconfont {
              font-size: 14px;
              margin-right: 3px;
            }
          }

          .duration {
            position: absolute;
            left: 5px;
            bottom: 3px;
            font-size: 12px;
            color: #ffffff;
          }
        }

        p {
          font-size: 14px;
          line-height: 20px;
          word-break: break-all;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
      }
    }
  }
}
</style>
<template>
  <div class="play-songs">
    <table class="play-songs-table">
      <thead>
        <tr>
          <th style="width: 56px;border-left: none;text-align: right;"></th>
          <th style="width: 56px;">操作</th>
          <th>音乐标题</th>
          <th style="width: 200px;">歌手</th>
          <th style="width: 200px;">专辑</th>
          <th style="width: 100px;border-right: none;">时长</th>
        </tr>
      </thead>
      <tbody v-if="songs">
        <tr v-for="(song, index) in songs" :key="'song' + index">
          <td style="text-align: right;">{{ song.index }}</td>
          <td class="iconfont">
            <span style="margin-right:5px;">&#xe60f;</span>
            <span>&#xe63a;</span>
          </td>
          <td>
            <span style="color:#000;margin-right:5px">{{ song.musicTitle }}</span>
            <span v-if="song.musicAlia">{{ song.musicAlia }}</span>
          </td>
          <td>{{ song.singers }}</td>
          <td>{{ song.album }}</td>
          <td>{{ song.timeLen }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: ['songs']
}
</script>

<style lang="scss">
.play-songs {
  width: 100%;

  .play-songs-table {
    table-layout: fixed; //只有定义了表格的布局算法为fixed，下面布局才能起作用，宽高才能正常根据设置显示，我去，怪不得，弄了嫩久
    width: 100%;
    text-align: left;
    font-size: 12px;
    color: rgb(37 37 37 / 80%);

    tbody tr:nth-child(even){
      background-color: #f5f5f7;
    }

    tbody tr:hover{
      cursor: pointer;
      color: #000000;
      background-color: #ebeced;
    }

    th {
      border: 1px solid #e1e1e2;
    }
    
    th, td {
      padding: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
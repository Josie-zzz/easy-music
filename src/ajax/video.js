import http from '@/ajax/http'

//获取视频分类全部标签
export function _getVideoGroupList(){
  return http({
    url: '/video/group/list'
  })
}

//根据标签获得视频,id:分类id
export function _getVideoGroup(id){
  return http({
    url: '/video/group',
    params: {
      id
    }
  })
}

//获得全部mv
// area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 
// type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
// order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
// limit: 取出数量 , 默认为 30
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
export function _getMvAll(area, type, order, offset, limit){
  return http({
    url: '/mv/all',
    params: {
      area,
      type,
      order,
      offset,
      limit
    }
  })
}

//在搜索界面会出现视频和mv混合一起,可用type区分,type=0是mv，type=1是视频，用此区别去请求
//获取视频详情,视频id=89ADDE33C0AAE8EC14B99F6750DB954D(类似于这样的id)
export function _getVideoDetail(id){
  return http({
    url: '/video/detail',
    params: {
      id
    }
  })
}

//获取视频播放地址 
export function _getVideoUrl(id){
  return http({
    url: '/video/url',
    params: {
      id
    }
  })
}

//获得视频评论 
export function _getCommentVideo(id, offset, limit){
  return http({
    url: '/comment/video',
    params: {
      id,
      offset,
      limit
    }
  })
}

//获取mv详情 
export function _getMvDetail(mvid){
  return http({
    url: '/mv/detail',
    params: {
      mvid
    }
  })
}

//获取mv播放地址
export function _getMvUrl(id){
  return http({
    url: '/mv/url',
    params: {
      id
    }
  })
}

//获得mv评论 
export function _getCommentMv(id, offset, limit){
  return http({
    url: '/comment/mv',
    params: {
      id,
      offset,
      limit
    }
  })
}
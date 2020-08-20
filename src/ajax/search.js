import http from './http'

// 获取热搜信息
export function _getHotSearch(){
  return http({
    url: 'search/hot/detail'
  })
}

//建议搜索匹配
export function _getSuggest(keywords){
  return http({
    url: '/search/suggest',
    params: {
      keywords
    }
  })
}

//搜索详情
// 必选参数 : keywords : 关键词
// 可选参数 : limit : 返回数量 , 默认为 30 
// offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
// type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export function _getSearchInfo(keywords, type, offset, limit){
  return http({
    url: '/search',
    params: {
      keywords,
      type,
      offset,
      limit
    }
  })
}
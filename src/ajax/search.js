import http from './http'

// 获取热搜信息
export function _getHotSearch(){
  return http({
    url: 'search/hot/detail',
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
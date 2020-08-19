import Vue from 'vue'

Vue.prototype.$addZero = function (num) {                              //小于10的时候显示成(09)
  return num < 10 ? '0' + num : num
}

Vue.prototype.$transPlayCount = function (num) {                      //超过十万的数要显示成(8万)
   return num < 100000 ? num : Math.floor( num / 10000 ) + '万'
}

Vue.prototype.$transDate = function(date){                           //处理日期输出格式(2020-8-14)
  let d = new Date(date)
  return `${d.getFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

Vue.prototype.$transSinger = function (ar) {                           //拼接所有歌手(周杰伦/李荣浩)
  let str = ''
  let len = ar.length
  ar.forEach((val, index) => {
    let name = val.name
    if(index < len - 1){
      name = name + '/'
    }
    str = str + name
  })
  return str
}

Vue.prototype.$transDuration = function (time){                        //处理时长输出格式(04:01)
  time = Math.floor(time / 1000)
  let min = Math.floor(time / 60)
  let se = time % 60
  min = min < 10 ? '0' + min : min
  se = se < 10 ? '0' + se : se
  return min + ':' + se
}
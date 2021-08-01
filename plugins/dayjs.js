import Vue from 'vue'
import dayjs from 'dayjs'

// {{ 表达式 | 过滤器 }}
// 起一个全局过滤器的名字 value是你使用这个过滤器前面的那个表达式所计算出来的值
Vue.filter('date', (value, format = 'YYYY-MM-DD HH:mm:ss' ) => {
  // 如果你不传第二个参数，默认就是年月日时分秒，如果你传了就以你传的为准
  return dayjs(value).format(format)
})


/**
 * 基于axios 封装的请求模块
 */
import axios from 'axios'
// 以前的全局配置：axios.defaults.baseURL = ''  
// 通常都会基于axios来创建一个实例，不会污染全局的请求对象

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 通过插件机制获取到上下文对象，（query params req res app store...）
// 插件导出函数必须作为 default 成员
export default ({ store }) => {
  // console.log(context)
  // 请求拦截器（任何请求都要经过请求拦截器）
  // 可以在这做一些公共的业务处理，如统一设置token
  request.interceptors.request.use(config => {
    const { user } = store.state
    if(user && user.token){
      config.headers.Authorization = `Token ${store.state.user.token}`
    }
    
    return config
  }, err => {
    // 请求还没发出去会进入这里（一般不会到这里）
    return Promise.reject(err)
  })

}


// 响应拦截器
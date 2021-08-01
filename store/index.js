const cookieparser = process.server ? require('cookieparser') : undefined

// 为了防止在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态，登录之后 后台返回的数据
    user: ''
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const action = {
  // nuxt又提供了一个特殊的方法，是nuxt特殊的action方法
  // 这个 action 会在服务端渲染期间自动调用
  // 作用：初始化容器数据，传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }){
    // 结构了两个参数，commit是提交mutation的方法，req是服务端渲染期间的请求对象
    let user = null

    // 如果请求头有 Cookie
    if(req.headers.cookie){
      // 使用cookieparser 把 cookie 字符串转为 js对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parse.auth)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交mutation 修改state状态
    commit('setUser', user)

  }
}
/**
 * 验证是否登录的中间件
 */

// 想保护哪个页面，就把这个中间件加给谁。找到那个页面
export default function ({ store, redirect }) {
  // If the user is not authenticated
  if (!store.state.user){
    // 如果容器里面没有user 重定向到登录页面
    return redirect('/login')
  }
}
export default function ({ store, redirect }) {
  // If the user is authenticated
  if (store.state.user){
    // 如果容器里面没有user 重定向到登录页面
    return redirect('/')
  }
}
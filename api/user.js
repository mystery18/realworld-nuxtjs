import { request } from "@/plugins/request";

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    // data 让用户自己传进来
    data
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}
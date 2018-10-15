import request from '@/utils/request'

export function loginByUsername(username, password, platForm) {
  const data = {
    username,
    password,
    platForm
  }
  return request({
    url: '/auth/jwt/token',
    // url: '/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/kafu/uc/user/fetchUserInfo',
    method: 'get',
    params: { token }
  })
}


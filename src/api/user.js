import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/accountService/doLogin',
    method: 'post',
    data
  })
}
// POST /apis/accountService/doLogin
export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout(data) {
  return request({
    url: '/accountService/loginOut',
    method: 'post',
    data
  })
}

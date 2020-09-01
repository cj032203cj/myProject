import request from '@/utils/request'

export function getDataCenter(data) {
  return request({
    url: '/questMgrService/centreData',
    method: 'post',
    data
  })
}
export function questDistList(data) {
  return request({
    url: '/questMgrService/questDistList',
    method: 'post',
    data
  })
}
export function questHsp(data) {
  return request({
    url: '/orgService/query',
    method: 'post',
    data
  })
}
export function doPublish(data) {
  return request({
    url: '/questMgrService/doPublish',
    method: 'post',
    data
  })
}

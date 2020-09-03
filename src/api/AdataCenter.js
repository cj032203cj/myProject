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
export function tempQuery(data) {
  return request({
    url: '/tempService/query',
    method: 'post',
    data
  })
}
export function orgQuery(data) {
  return request({
    url: '/orgService/query',
    method: 'post',
    data
  })
}
export function addOrg(data) {
  return request({
    url: '/orgService/addOrg',
    method: 'post',
    data
  })
}
export function updateOrg(data) {
  return request({
    url: '/orgService/updateOrg',
    method: 'post',
    data
  })
}
export function myQuest(data) {
  return request({
    url: '/questMgrService/myQuest',
    method: 'post',
    data
  })
}
export function questPreview(data) {
  return request({
    url: '/questMgrService/questPreview',
    method: 'post',
    data
  })
}



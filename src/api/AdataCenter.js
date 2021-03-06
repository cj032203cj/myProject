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
    url: '/orgService/updOrg',
    method: 'post',
    data
  })
}
export function deleteOrgById(data) {
  return request({
    url: '/orgService/deleteOrgById',
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
export function savePreview(data) {
  return request({
    url: '/questMgrService/questSubmit',
    method: 'post',
    data
  })
}
export function tempPreview(data) {
  return request({
    url: '/tempService/tempPreview',
    method: 'post',
    data
  })
}
export function updPwd(data) {
  return request({
    url: '/accountService/updPwd',
    method: 'post',
    data
  })
}
export function feedback(data) {
  return request({
    url: '/accountService/feedback',
    method: 'post',
    data
  })
}
export function queryNotDistList(data) {
  return request({
    url: '/questMgrService/queryNotDistList',
    method: 'post',
    data
  })
}
export function doDist(data) {
  return request({
    url: '/questMgrService/doDist',
    method: 'post',
    data
  })
}
export function questShareList(data) {
  return request({
    url: '/questMgrService/questShareList',
    method: 'post',
    data
  })
}
export function cancelDist(data) {
  return request({
    url: '/questMgrService/cancelDist',
    method: 'post',
    data
  })
}
export function updSharePwd(data) {
  return request({
    url: '/questMgrService/updSharePwd',
    method: 'post',
    data
  })
}
export function questPreviewByShare(data) {
  return request({
    url: '/questMgrService/questPreviewByShare',
    method: 'post',
    data
  })
}
export function verificationCode(data) {
  return request({
    url: '/accountService/verificationCode',
    method: 'post',
    data
  })
}
export function forgetPwdStep1(data) {
  return request({
    url: '/accountService/forgetPwdStep1',
    method: 'post',
    data
  })
}
export function forgetPwdStep2(data) {
  return request({
    url: '/accountService/forgetPwdStep2',
    method: 'post',
    data
  })
}
export function questShareinfo(data) {
  return request({
    url: '/questMgrService/questShareinfo',
    method: 'post',
    data
  })
}
export function addTem(data) {
  return request({
    url: '/questMgrService/add',
    method: 'post',
    data
  })
}
export function queryTemp(data) {
  return request({
    url: '/tempService/query',
    method: 'post',
    data
  })
}

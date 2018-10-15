import fetch from '@/utils/request'
const qs = require('qs')

// 分页查询实名认证
export function fetchIdentityPage(query) {
  return fetch({
    url: '/kafu/uc/trackerOwnerIdentity/fetchIdentityPage',
    method: 'get',
    params: query
  })
}

// 根据实名信息的id查询实名认证详情
export function fetchIdentityDetail(query) {
  return fetch({
    url: '/kafu/uc/trackerOwnerIdentity/fetchIdentityDetail',
    method: 'get',
    params: query
  })
}

// 实名认证审核
export function auditIdentity(obj) {
  return fetch({
    url: '/kafu/uc/trackerOwnerIdentity/auditIdentity',
    method: 'put',
    data: qs.stringify(obj)
  })
}

// 分页查询车辆信息
export function fetchTrackPage(query) {
  return fetch({
    url: '/kafu/uc/track/fetchTrackPage',
    method: 'get',
    params: query
  })
}

// 车辆认证审核
export function auditTrack(obj) {
  return fetch({
    url: '/kafu/uc/track/auditTrack',
    method: 'put',
    data: qs.stringify(obj)
  })
}

// 分页查询驾驶员信息
export function fetchDriverPage(query) {
  return fetch({
    url: '/kafu/uc/driver/fetchDriverPage',
    method: 'get',
    params: query
  })
}

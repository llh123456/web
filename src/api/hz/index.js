import fetch from '@/utils/request'
const qs = require('qs')

export function page(query) {
  return fetch({
    url: '/kafu/uc/shipper/fetchShipperPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/shipper/addShipper',
    method: 'post',
    data: obj
  })
}

export function getObj(query) {
  return fetch({
    url: '/kafu/uc/shipper/fetchShipperDetail',
    method: 'get',
    params: query
  })
}

export function delObj(obj) {
  return fetch({
    url: '/kafu/uc/shipper/delete',
    method: 'post',
    data: qs.stringify(obj)
  })
}

export function putObj(data) {
  return fetch({
    url: '/kafu/uc/shipper/updateShipper',
    method: 'post',
    data
  })
}

export function passObj(obj) {
  return fetch({
    url: '/kafu/uc/shipper/resetPassword',
    method: 'post',
    data: qs.stringify(obj)
  })
}


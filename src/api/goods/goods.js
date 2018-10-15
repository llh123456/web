import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/getLogisticsOrderpage',
    method: 'get',
    params: query
  })
}

export function goodsAll(query) {
  return fetch({
    url: '/kafu/goods/goods/all',
    method: 'get',
    params: query
  })
}

export function packageAll(query) {
  return fetch({
    url: '/kafu/goods/package/all',
    method: 'get',
    params: query
  })
}

export function setLogisticsOrderStatus(id, obj) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/setLogisticsOrderStatus/' + id,
    method: 'post',
    data: obj
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/saveLogisticsOrder',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/getLogisticsOrder/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/' + id,
    method: 'put',
    data: obj
  })
}

// 发布
export function publishLogisticsOrder(id, obj) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/publishLogisticsOrder/' + id,
    method: 'post',
    data: obj
  })
}


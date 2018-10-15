import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/orderpagepc',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/getByIdPc/' + id,
    method: 'get'
  })
}

export function toChooseTruck(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/toChooseTruck/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/' + id,
    method: 'put',
    data: obj
  })
}


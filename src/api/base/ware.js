import fetch from '@/utils/request'

export function warepageAll(query) {
  return fetch({
    url: '/kafu/goods/ware/all',
    method: 'get',
    params: query
  })
}

export function wareByCompany(query) {
  return fetch({
    url: '/kafu/goods/ware/wareByCompany',
    method: 'get',
    params: query
  })
}

export function selectWareByShipperIdAndName(query) {
  return fetch({
    url: '/kafu/goods/ware/selectWareByShipperIdAndName',
    method: 'get',
    params: query
  })
}

export function wareByShipperId(query) {
  return fetch({
    url: '/kafu/goods/ware/wareByShipperId',
    method: 'get',
    params: query
  })
}

export function wareByCompanyAndArea(query) {
  return fetch({
    url: '/kafu/goods/ware/wareByCompanyAndArea',
    method: 'get',
    params: query
  })
}

export function warepage(query) {
  return fetch({
    url: '/kafu/goods/ware/pageWithSelect',
    method: 'get',
    params: query
  })
}

export function wareaddObj(obj) {
  return fetch({
    url: '/kafu/goods/ware',
    method: 'post',
    data: obj
  })
}

export function waregetObj(id) {
  return fetch({
    url: '/kafu/goods/ware/ware/' + id,
    method: 'get'
  })
}

export function waredelObj(id) {
  return fetch({
    url: '/kafu/goods/ware/' + id,
    method: 'delete'
  })
}

export function wareputObj(id, obj) {
  return fetch({
    url: '/kafu/goods/ware/' + id,
    method: 'put',
    data: obj
  })
}

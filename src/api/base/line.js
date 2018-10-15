import fetch from '@/utils/request'

export function pageAll(query) {
  return fetch({
    url: '/kafu/goods/lineFreight/all',
    method: 'get',
    params: query
  })
}

export function page(query) {
  return fetch({
    url: '/kafu/goods/lineFreight/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/lineFreight',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/lineFreight/detail/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/lineFreight/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/goods/' + id,
    method: 'put',
    data: obj
  })
}

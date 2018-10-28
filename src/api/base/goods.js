import fetch from '@/utils/request'

export function pageAll(query) {
  return fetch({
    url: '/kafu/goods/goods/all',
    method: 'get',
    params: query
  })
}

export function page(query) {
  return fetch({
    url: '/kafu/goods/goods/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/goods',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/goods/detail/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/goods/' + id,
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

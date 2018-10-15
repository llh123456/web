import fetch from '@/utils/request'

export function pageAll(query) {
  return fetch({
    url: '/kafu/goods/unit/all',
    method: 'get',
    params: query
  })
}

export function page(query) {
  return fetch({
    url: '/kafu/goods/unit/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/unit',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/unit/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/unit/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/unit/' + id,
    method: 'put',
    data: obj
  })
}

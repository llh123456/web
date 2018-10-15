import fetch from '@/utils/request'

export function pageAll(query) {
  return fetch({
    url: '/kafu/goods/goodsCat/all',
    method: 'get',
    params: query
  })
}

export function page(query) {
  return fetch({
    url: '/kafu/goods/goodsCat/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/goodsCat',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/goodsCat/detail/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/goodsCat/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/goodsCat/' + id,
    method: 'put',
    data: obj
  })
}

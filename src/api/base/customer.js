import fetch from '@/utils/request'

export function pageAll(query) {
  return fetch({
    url: '/kafu/goods/customerCompany/all',
    method: 'get',
    params: query
  })
}

export function pageSearch(query) {
  return fetch({
    url: '/kafu/goods/customerCompany/page',
    method: 'get',
    params: query
  })
}

export function page(query) {
  return fetch({
    url: '/kafu/goods/customerCompany/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/goods/customerCompany',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/customerCompany/detail/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/customerCompany/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/customerCompany/' + id,
    method: 'put',
    data: obj
  })
}

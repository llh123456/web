import fetch from '@/utils/request'

export function fetchTree(query) {
  return fetch({
    url: '/kafu/uc/menu/tree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return fetch({
    url: '/api/admin/menu/all',
    method: 'get'
  })
}
export function addObj(data) {
  return fetch({
    url: '/kafu/uc/menu',
    method: 'post',
    data
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/menu/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/menu/' + id,
    method: 'delete'
  })
}

export function putObj(data) {
  return fetch({
    url: '/kafu/uc/menu/' + data.id,
    method: 'put',
    data
  })
}

import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/uc/department/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/department',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/department/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/department/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/uc/department/' + id,
    method: 'put',
    data: obj
  })
}

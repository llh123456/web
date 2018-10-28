import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/uc/roleType/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/roleType',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/roleType/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/roleType/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/uc/roleType/' + id,
    method: 'put',
    data: obj
  })
}

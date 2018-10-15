import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/uc/user/adminUser/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/user/adminUser',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/user/adminUser/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/user/adminUser/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/uc/user/adminUser/' + id,
    method: 'put',
    data: obj
  })
}

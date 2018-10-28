import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/uc/button/page',
    method: 'get',
    params: query
  })
}

export function pageMenuB(id) {
  return fetch({
    url: '/kafu/uc/perimission/all/' + id,
    method: 'get'
  })
}

export function addObj(data) {
  return fetch({
    url: '/kafu/uc/perimission',
    method: 'post',
    data
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/perimission/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/perimission/' + id,
    method: 'delete'
  })
}

export function putObj(id, data) {
  return fetch({
    url: '/kafu/uc/perimission/' + id,
    method: 'put',
    data
  })
}

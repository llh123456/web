import fetch from '@/utils/request'

export function getAreaByParentId(query) {
  return fetch({
    url: '/kafu/goods/area/getAreaByParentId',
    method: 'get',
    params: query
  })
}

export function getAllArea() {
  return fetch({
    url: '/kafu/goods/area/allArea',
    method: 'get'
  })
}

import fetch from '@/utils/request'
// 货主信息表
export function getAllShippers(query) {
  return fetch({
    url: '/kafu/uc/shipper/all',
    method: 'get',
    params: query
  })
}

// 货主搜索
export function getShipperSearch(query) {
  return fetch({
    url: '/kafu/uc/shipper/search',
    method: 'get',
    params: query
  })
}

// 货主详情
export function getDetailObj(query) {
  return fetch({
    url: '/kafu/uc/shipper/fetchShipperDetail',
    method: 'get',
    params: query
  })
}

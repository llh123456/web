import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    // url: '/kafu/goods/consignmentOrder/orderpagepc',
    url: '/kafu/goods/logisticsOrder/getLogisticsOrderpageInConsigment',
    method: 'get',
    params: query
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/goods/logisticsOrder/getLogisticsOrder/' + id,
    method: 'get'
  })
}

// 通过货源id获取汽车的列表
export function getTruckListByLogisticsOrder(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/getTruckListByLogisticsOrder/' + id,
    method: 'get'
  })
}

// 派车保存
export function sendTruck(obj) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/sendTruck',
    method: 'post',
    data: obj
  })
}

// 派车车辆查询
export function toChooseTruck(id, data) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/toChooseTruck/' + id,
    method: 'put',
    data
  })
}

// 添加车辆
export function createConsiginOrderByPc(id, data) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/createConsiginOrderByPc/' + id,
    method: 'put',
    data
  })
}

// 取消车辆
export function cancelTruckBatch(data) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/cancelTruckBatch',
    method: 'put',
    data
  })
}

// 完成运输
export function endTruck(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/endTruck/' + id,
    method: 'put'
  })
}

/* export function toChooseTruck(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/toChooseTruck/' + id,
    method: 'get'
  })
} */

export function delObj(id) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/goods/consignmentOrder/' + id,
    method: 'put',
    data: obj
  })
}


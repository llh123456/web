import fetch from '@/utils/request'
// const qs = require('qs')
export function page(query) {
  return fetch({
    url: '/kafu/uc/role/page',
    method: 'get',
    params: query
  })
}

export function getAllGroupTypes(query) {
  return fetch({
    url: '/kafu/uc/roleType/all',
    method: 'get',
    params: query
  })
}

export function getAllDepartments(query) {
  return fetch({
    url: '/kafu/uc/department/all',
    method: 'get',
    params: query
  })
}

export function fetchTree(query) {
  return fetch({
    url: '/kafu/uc/role/all',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/role',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return fetch({
    url: '/kafu/uc/role/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return fetch({
    url: '/kafu/uc/role/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return fetch({
    url: '/kafu/uc/role/' + id,
    method: 'put',
    data: obj
  })
}

export function getUsers(id) {
  return fetch({
    url: '/kafu/uc/role/' + id + '/user',
    method: 'get'
  })
}

export function modifyUsers(id, data) {
  return fetch({
    url: '/kafu/uc/role/' + id + '/user',
    method: 'put',
    data: data
  })
}

export function removeElementAuthority(id, data) {
  return fetch({
    url: '/kafu/uc/role/' + id + '/authority/element/remove',
    method: 'post',
    params: data
  })
}

export function addElementAuthority(data) {
  return fetch({
    url: '/kafu/uc/rolePermission/save',
    method: 'post',
    data
  })
}

export function getElementAuthority(id, query) {
  return fetch({
    url: '/kafu/uc/perimission/allByRole/' + id,
    method: 'get',
    params: query
  })
}

export function modifyMenuAuthority(id, obj) {
  return fetch({
    url: '/kafu/uc/role/resource/' + id,
    method: 'put',
    data: obj
  })
}

export function getMenuAuthority(id) {
  return fetch({
    url: '/kafu/uc/role/resource/' + id,
    method: 'get'
  })
}

import fetch from '@/utils/request'

export function page(query) {
  return fetch({
    url: '/kafu/uc/user/fetchTrackOwnerPage',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return fetch({
    url: '/kafu/uc/user/addTrackerOwner',
    method: 'post',
    data: obj
  })
}

export function getObj(query) {
  return fetch({
    url: '/kafu/uc/driver/fetchDriverDetail',
    method: 'get',
    params: query
  })
}

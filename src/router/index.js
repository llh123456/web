import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import identityCheckPage from '@/views/check/identityCheck'
import identityDetailsPage from '@/views/check/identityDetails'
import driverCheckPage from '@/views/check/driverCheck'
import driverDetailsPage from '@/views/check/driverDetails'
import vehicleCheckPage from '@/views/check/vehicleCheck'
import vehicleDetailsPage from '@/views/check/vehicleDetails'
import releaseDetailsPage from '@/views/goods/releaseDetails'
import releaseAddPage from '@/views/goods/releaseAdd'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    hidden: true,
    children: [
      { path: '/dashboard', component: () => import('@/views/dashboard/index'), name: 'dashboard', meta: { title: '首页', icon: 'dashboard', noCache: true }},
      { path: '/check/cz-details', component: () => import('@/views/cz/czDetails'), name: 'czDetails', meta: { title: '车主详情' }},
      { path: '/check/identity-check', component: identityCheckPage, name: 'identityCheck', meta: { title: '审核详情' }},
      { path: '/check/identity-details', component: identityDetailsPage, name: 'identityDetails', meta: { title: '身份详情' }},
      { path: '/check/driver-check', component: driverCheckPage, name: 'driverCheck', meta: { title: '审核详情' }},
      { path: '/check/driver-details', component: driverDetailsPage, name: 'driverDetails', meta: { title: '驾驶员详情' }},
      { path: '/check/vehicle-check', component: vehicleCheckPage, name: 'vehicleCheck', meta: { title: '审核详情' }},
      { path: '/check/vehicle-details', component: vehicleDetailsPage, name: 'vehicleDetails', meta: { title: '车辆详情' }},
      { path: '/goods/release-details', component: releaseDetailsPage, name: 'releaseDetails', meta: { title: '发布详情' }},
      { path: '/goods/receipt-details', component: () => import('@/views/goods/receiptDetails'), name: 'receiptDetails', meta: { title: '回单详情' }},
      { path: '/goods/dispatch-details', component: () => import('@/views/goods/dispatchDetails'), name: 'dispatchDetails', meta: { title: '派车详情' }},
      { path: '/goods/release-add', component: releaseAddPage, name: 'releaseAdd', meta: { title: '新增货源' }},
      { path: '/goods/release-edit', component: () => import('@/views/goods/releaseEdit'), name: 'releaseEdit', meta: { title: '编辑货源' }},
      { path: '/goods/release-auditing', component: () => import('@/views/goods/releaseAuditing'), name: 'releaseAuditing', meta: { title: '发布货源' }},
      { path: '/customer/add', component: () => import('@/views/base/customer/add'), name: 'customerAdd', meta: { title: '新增客户单位 ' }},
      { path: '/customer/edit', component: () => import('@/views/base/customer/edit'), name: 'customerEdit', meta: { title: '编辑客户单位 ' }},
      { path: '/customer/details', component: () => import('@/views/base/customer/details'), name: 'customerDetails', meta: { title: '客户单位详情 ' }}
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/cz',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'index',
      component: () => import('@/views/cz/index'),
      name: 'cz',
      meta: { title: '车主用户', icon: 'star' }
    }]
  },
  {
    path: '/hz',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'index',
      component: () => import('@/views/hz/index'),
      name: 'hz',
      meta: { title: '货主用户', icon: 'nested' }
    }]
  },
  {
    path: '/check',
    component: Layout,
    redirect: 'noredirect',
    name: 'check',
    alwaysShow: true,
    meta: {
      title: '审核管理',
      icon: 'people'
    },
    children: [
      { path: 'identity', component: () => import('@/views/check/identity'), name: 'identity', meta: { title: '身份审核' }},
      { path: 'vehicle', component: () => import('@/views/check/vehicle'), name: 'vehicle', meta: { title: '车辆审核' }},
      { path: 'driver', component: () => import('@/views/check/driver'), name: 'driver', meta: { title: '驾驶员审核' }}
    ]
  },
  {
    path: '/authenticate',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'index',
      component: () => import('@/views/authenticate/index'),
      name: 'authenticate',
      meta: { title: '认证查询', icon: 'documentation' }
    }]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: 'noredirect',
    name: 'goods',
    alwaysShow: true,
    meta: {
      title: '货物管理',
      icon: 'international'
    },
    children: [
      { path: 'delivery', component: () => import('@/views/goods/delivery'), name: 'delivery', meta: { title: '发货管理' }},
      { path: 'release', component: () => import('@/views/goods/release'), name: 'release', meta: { title: '发布管理' }},
      { path: 'dispatch', component: () => import('@/views/goods/dispatch'), name: 'dispatch', meta: { title: '派车管理' }},
      { path: 'transit', component: () => import('@/views/goods/transit'), name: 'transit', meta: { title: '在途管理' }},
      { path: 'receipt', component: () => import('@/views/goods/receipt'), name: 'receipt', meta: { title: '回单管理' }},
      { path: 'exception', component: () => import('@/views/goods/exception'), name: 'exception', meta: { title: '异常管理' }}
    ]
  },
  {
    path: '/base',
    component: Layout,
    redirect: 'noredirect',
    name: 'base',
    alwaysShow: true,
    meta: {
      title: '基础数据',
      icon: 'component'
    },
    children: [
      { path: 'customer', component: () => import('@/views/base/customer'), name: 'customer', meta: { title: '客户单位' }},
      { path: 'packaging', component: () => import('@/views/base/packaging'), name: 'packaging', meta: { title: '包装物管理' }},
      { path: 'category', component: () => import('@/views/base/category'), name: 'category', meta: { title: '类目管理' }},
      { path: 'goods', component: () => import('@/views/base/goods'), name: 'product', meta: { title: '货物管理' }},
      { path: 'line', component: () => import('@/views/base/line'), name: 'lines', meta: { title: '线路运价管理' }},
      { path: 'valuation', component: () => import('@/views/base/valuation'), name: 'valuation', meta: { title: '计价单位管理' }}
    ]
  },
  {
    path: '/purview',
    component: Layout,
    redirect: 'noredirect',
    name: 'purview',
    alwaysShow: true,
    meta: {
      title: '权限管理',
      icon: 'component'
    },
    children: [
      { path: 'departManager', component: () => import('@/views/purview/depart/index'), name: 'departManager', meta: { title: '组织机构' }},
      { path: 'userManager', component: () => import('@/views/purview/user/index'), name: 'userManager', meta: { title: '小二管理' }},
      { path: 'menuManager', component: () => import('@/views/purview/menu/index'), name: 'menuManager', meta: { title: '菜单管理' }},
      { path: 'groupTypeManager', component: () => import('@/views/purview/groupType/index'), name: 'groupTypeManager', meta: { title: '角色类型管理' }},
      { path: 'groupManager', component: () => import('@/views/purview/group/index'), name: 'groupManager', meta: { title: '平台角色权限管理' }},
      { path: 'departmentManager', component: () => import('@/views/purview/department/index'), name: 'departmentManager', meta: { title: '平台部门管理' }}
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import tableRouter from './modules/table'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   hidden:false,
  //   children: [
  //     {
  //       path: 'dashboard',
  //       component: () => import('@/views/dashboard/index'),
  //       name: 'Dashboard',
  //       meta: {title: '首页', icon: 'dashboard', affix: false}
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/AdataCenter',
    permission:'admin',
    children: [
      {
        path: 'AdataCenter',
        component: () => import('@/views/AdataCenter/index'),
        name: 'AdataCenter',
        meta: {title: '数据中心', icon: 'table', noCache: true},
      }
    ]
  },
  {
    path: '/AmyFill',
    component: Layout,
    redirect: '/AmyFill',
    permission:'user',
    children: [
      {
        path: '/AmyFill',
        component: () => import('@/views/AmyFill/index'),
        name: 'AmyFill',
        meta: {title: '我的填报', icon: 'edit', noCache: true}
      }
    ]
  },
  {
    path: '/AdataDetail',
    hidden:true,
    component: () => import('@/views/AdataDetail/detail'),
    name: 'AdataDetail',
    meta: {title: '模板详情', icon: 'table', noCache: true},
  },
  {
    path: '/AtempAssign',
    component: Layout,
    redirect: '/AtempAssign/index',
    permission:'admin',
    children: [
      {
        path: 'index',
        component: () => import('@/views/AtempAssign/index'),
        name: 'AtempAssign',
        meta: {title: '模板分配', icon: 'clipboard', noCache: true}
      }
    ]
  },
  {
    path: '/AtempManage',
    component: Layout,
    redirect: '/AtempManage/index',
    permission:'admin',
    children: [
      {
        path: 'index',
        component: () => import('@/views/AtempManage/index'),
        name: 'AtempManage',
        meta: {title: '模板管理', icon: 'component', noCache: true}
      }
    ]
  },
  {
    path: '/AaccountManage',
    component: Layout,
    redirect: '/AaccountManage/index',
    permission:'admin',
    children: [
      {
        path: 'index',
        component: () => import('@/views/AaccountManage/index'),
        name: 'AaccountManage',
        meta: {title: '账号管理', icon: 'user', noCache: true}
      }
    ]
  },
  // {
  //   path: '/AmyFill',
  //   component: Layout,
  //   redirect: '/AmyFill/index',
  //   permission:'user',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/AmyFill/index'),
  //       name: 'AmyFill',
  //       meta: {title: '我的填报', icon: 'edit', noCache: true}
  //     }
  //   ]
  // },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes=[]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

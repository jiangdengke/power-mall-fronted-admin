import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/product'
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/Product/List/index'),
        meta: { title: '商品管理', icon: 'el-icon-goods' }
      },
      {
        path: 'add',
        component: () => import('@/views/Product/Form/index'),
        meta: { title: '添加商品' },
        hidden: true
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/Product/Form/index'),
        meta: { title: '编辑商品' },
        hidden: true
      },
      {
        path: 'sku/edit/:id',
        component: () => import('@/views/Product/Form/SkuForm'),
        name: 'SkuEdit',
        meta: { title: '编辑商品规格', activeMenu: '/product/list' },
        hidden: true
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Product/Category/index'),
      meta: { title: '商品分类', icon: 'el-icon-menu' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 将匹配所有路径
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/content',
    component: Layout,
    redirect: '/content/list',
    name: 'Content',
    meta: { title: '内容管理', icon: 'el-icon-picture' },
    children: [
      {
        path: 'list',
        name: 'ContentList',
        component: () => import('@/views/Content/List'),
        meta: { title: '内容列表' }
      }
    ]
  }
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: routes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

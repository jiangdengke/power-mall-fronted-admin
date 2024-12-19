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
        name: 'ProductList',
        component: () => import('@/views/Product/List/index'),
        meta: { title: '商品管理', icon: 'el-icon-goods' }
      },
      {
        path: 'form/:id?',
        name: 'ProductForm',
        component: () => import('@/views/Product/Form/index'),
        meta: { title: '商品编辑' },
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
    path: '/content',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/views/Content/index'),
      name: 'Content',
      meta: { title: '内容管理', icon: 'el-icon-document' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 将匹配所有路径
  { path: '*', redirect: '/404', hidden: true }
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

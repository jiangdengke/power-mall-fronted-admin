import request from '@/utils/request'

// 获取分类列表
export function getCategoryList() {
  return request({
    url: '/pms/category',
    method: 'get'
  })
}

// 添加分类
export function addCategory(data) {
  return request({
    url: '/pms/category',
    method: 'post',
    data
  })
}

// 更新分类
export function updateCategory(data) {
  return request({
    url: `/pms/category/${data.id}`,
    method: 'put',
    data
  })
}

// 删除分类
export function deleteCategory(id) {
  return request({
    url: `/pms/category/${id}`,
    method: 'delete'
  })
} 
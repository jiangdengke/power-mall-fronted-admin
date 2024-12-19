import request from '@/utils/request'

// 获取内容分页列表
export function getContentList(params) {
  return request({
    url: '/cms/content',
    method: 'get',
    params
  })
}

// 添加内容
export function addContent(data) {
  return request({
    url: '/cms/content',
    method: 'post',
    data
  })
}

// 更新内容
export function updateContent(id, data) {
  return request({
    url: `/cms/content/${id}`,
    method: 'put',
    data
  })
}

// 删除内容
export function deleteContent(id) {
  return request({
    url: `/cms/content/${id}`,
    method: 'delete'
  })
} 
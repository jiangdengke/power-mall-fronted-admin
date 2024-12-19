import request from '@/utils/request'

// 获取商品分页列表
export function getSpuList(params) {
  return request({
    url: '/pms/spu',
    method: 'get',
    params
  })
}

// 获取商品详情
export function getSpuDetail(spuId) {
  return request({
    url: `/pms/spu/${spuId}`,
    method: 'get'
  })
}

// 添加商品
export function addSpu(data) {
  return request({
    url: '/pms/spu',
    method: 'post',
    data
  })
}

// 更新商品
export function updateSpu(data) {
  return request({
    url: `/pms/spu/${data.id}`,
    method: 'put',
    data
  })
}

// 删除商品
export function deleteSpu(spuId) {
  return request({
    url: `/pms/spu/${spuId}`,
    method: 'delete'
  })
}

// 更新商品状态
export function updateSpuStatus(spuId, status) {
  return request({
    url: `/pms/spu/${spuId}/status`,
    method: 'patch',
    params: { status }
  })
} 
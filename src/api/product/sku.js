import request from '@/utils/request'

// 更新SKU状态
export function updateSkuStatus(skuId, status) {
  return request({
    url: '/pms/sku',
    method: 'post',
    data: {
      skuId,
      status
    }
  })
}

// 更新SKU信息
export function updateSku(data) {
  return request({
    url: `/pms/sku/${data.id}`,
    method: 'put',
    data
  })
}

// 添加SKU
export function addSku(data) {
  return request({
    url: '/pms/sku',
    method: 'post',
    data
  })
} 
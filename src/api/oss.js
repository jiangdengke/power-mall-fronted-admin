import request from '@/utils/request'

// 文件上传
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', 'mall')
  return request({
    url: '/oss/minio/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 
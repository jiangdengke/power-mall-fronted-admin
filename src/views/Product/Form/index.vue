<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>{{ isEdit ? '编辑商品' : '添加商品' }}</span>
      </div>

      <el-steps :active="activeStep" finish-status="success" style="margin-bottom: 20px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品详情"></el-step>
      </el-steps>

      <!-- 步骤一：基本信息 -->
      <div v-show="activeStep === 0">
        <el-form ref="baseForm" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入商品名称" />
          </el-form-item>

          <el-form-item label="商品分类" prop="categoryId">
            <el-cascader
              v-model="form.categoryId"
              :options="categoryOptions"
              :props="{ 
                checkStrictly: true,
                value: 'id',
                label: 'name',
                emitPath: false
              }"
              placeholder="请选择商品分类"
              clearable
            />
          </el-form-item>

          <el-form-item label="商品价格" prop="price">
            <el-input-number 
              v-model="form.price"
              :min="0"
              :precision="2"
              :step="0.1"
              placeholder="请输入商品价格"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤二：商品图片 -->
      <div v-show="activeStep === 1">
        <el-form ref="imageForm" :model="form" label-width="120px">
          <el-form-item label="商品主图" prop="img">
            <el-upload
              class="avatar-uploader"
              action="#"
              :http-request="handleMainImageUpload"
              :show-file-list="false"
              :before-upload="beforeImageUpload">
              <img v-if="form.img" :src="form.img" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="商品图集" prop="imgList">
            <el-upload
              action="#"
              list-type="picture-card"
              :http-request="handleGalleryUpload"
              :before-upload="beforeImageUpload"
              :file-list="fileList"
              :on-remove="handleRemove"
              multiple>
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>

      <!-- 步骤三：商品详情 -->
      <div v-show="activeStep === 2">
        <el-form ref="detailForm" :model="form" label-width="120px">
          <el-form-item label="商品详情" prop="detail">
            <el-input
              type="textarea"
              v-model="form.detail"
              :rows="10"
              placeholder="请输入商品详情"
            />
          </el-form-item>
        </el-form>
      </div>

      <div class="form-footer">
        <el-button v-if="activeStep > 0" @click="previousStep">上一步</el-button>
        <el-button v-if="activeStep < 2" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-else type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategoryList } from '@/api/product/category'
import { addSpu, getSpuDetail, updateSpu } from '@/api/product/spu'
import { uploadFile } from '@/api/oss'

export default {
  name: 'ProductForm',
  data() {
    return {
      isEdit: false,
      activeStep: 0,
      categoryOptions: [],
      form: {
        id: undefined,
        name: '',
        categoryId: undefined,
        price: undefined,
        sales: 0,
        img: '',
        imgList: [],
        detail: '',
        status: 1,
        specList: [],
        skuList: []
      },
      fileList: [],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请上传商品主图', trigger: 'change' }
        ],
        detail: [
          { required: true, message: '请输入商品详情', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCategoryOptions()
    const { id } = this.$route.params
    if (id) {
      this.isEdit = true
      this.getDetail(id)
    }
  },
  methods: {
    async getCategoryOptions() {
      try {
        const { data } = await getCategoryList()
        this.categoryOptions = data
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
      }
    },

    async getDetail(id) {
      try {
        const { data } = await getSpuDetail(id)
        this.form = {
          ...data,
          price: data.price / 100 // 将分转换为元
        }
        // 初始化文件列表
        this.fileList = this.form.imgList.map(url => ({
          url,
          name: url.substring(url.lastIndexOf('/') + 1)
        }))
      } catch (error) {
        console.error('获取商品详情失败:', error)
        this.$message.error('获取商品详情失败')
      }
    },

    async handleMainImageUpload({ file }) {
      try {
        const { data } = await uploadFile(file)
        this.form.img = data.url
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败')
      }
    },

    async handleGalleryUpload({ file }) {
      try {
        const { data } = await uploadFile(file)
        // 更新文件列表显示
        this.fileList.push({
          name: file.name,
          url: data.url
        })
        // 更新表单数据
        if (!this.form.imgList) {
          this.form.imgList = []
        }
        this.form.imgList.push(data.url)
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败')
      }
    },

    beforeImageUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
      return true
    },

    previousStep() {
      this.activeStep--
    },

    async nextStep() {
      try {
        if (this.activeStep === 0) {
          await this.$refs.baseForm.validate()
        } else if (this.activeStep === 1) {
          if (!this.form.img) {
            this.$message.warning('请上传商品主图')
            return
          }
        } else if (this.activeStep === 2) {
          await this.$refs.detailForm.validate()
        }
        this.activeStep++
      } catch (error) {
        return
      }
    },

    async submitForm() {
      try {
        const submitData = {
          ...this.form,
          price: Math.round(this.form.price * 100) // 转换为分
        }
        if (this.isEdit) {
          await updateSpu(submitData)
          this.$message.success('更新成功')
        } else {
          await addSpu(submitData)
          this.$message.success('添加成功')
        }
        this.$router.push('/product')
      } catch (error) {
        console.error(this.isEdit ? '更新商品失败:' : '添加商品失败:', error)
        this.$message.error(this.isEdit ? '更新商品失败' : '添加商品失败')
      }
    },

    handleRemove(file) {
      // 从文件列表中移除
      const fileIndex = this.fileList.findIndex(item => item.url === file.url)
      if (fileIndex !== -1) {
        this.fileList.splice(fileIndex, 1)
      }
      // 从表单数据中移除
      const index = this.form.imgList.indexOf(file.url)
      if (index !== -1) {
        this.form.imgList.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
}

.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409EFF;
    }
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 
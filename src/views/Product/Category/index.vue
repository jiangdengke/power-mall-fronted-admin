<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="handleAdd(null)">添加一级分类</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="name" label="分类名称" />
      
      <el-table-column prop="level" label="层级" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.level === 1 ? 'primary' : row.level === 2 ? 'success' : 'warning'">
            {{ row.level === 1 ? '一级' : row.level === 2 ? '二级' : '三级' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="icon" label="图标" width="100" align="center">
        <template slot-scope="{row}">
          <img v-if="row.icon" :src="row.icon" style="width: 40px; height: 40px">
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="排序" width="100" align="center" />

      <el-table-column label="操作" width="300" align="center">
        <template slot-scope="{row}">
          <el-button 
            v-if="row.level < 3"
            type="primary" 
            size="mini" 
            @click="handleAdd(row)"
          >
            添加子分类
          </el-button>
          <el-button 
            type="success" 
            size="mini" 
            @click="handleUpdate(row)"
          >
            编辑
          </el-button>
          <el-button 
            type="danger" 
            size="mini" 
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分类表单对话框 -->
    <el-dialog :title="dialogType === 'add' ? '添加分类' : '编辑分类'" :visible.sync="dialogVisible">
      <el-steps :active="activeStep" finish-status="success" style="margin-bottom: 20px">
        <el-step title="上传图标"></el-step>
        <el-step title="填写信息"></el-step>
      </el-steps>

      <!-- 步骤一：上传图标 -->
      <div v-if="activeStep === 0">
        <el-upload
          class="upload-container"
          action="#"
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <img v-if="form.icon" :src="form.icon" class="preview-image">
          <i v-else class="el-icon-plus upload-icon"></i>
          <div class="upload-tip">点击上传图标</div>
        </el-upload>
      </div>

      <!-- 步骤二：填写信息 -->
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="排序" prop="weight">
          <el-input-number v-model="form.weight" :min="0" :step="1" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="activeStep > 0" @click="activeStep--">上一步</el-button>
        <el-button v-if="activeStep < 1" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-else type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancelDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryList, addCategory, updateCategory, deleteCategory } from '@/api/product/category'
import { uploadFile } from '@/api/oss'

export default {
  name: 'Category',
  data() {
    return {
      loading: true,
      list: [],
      dialogVisible: false,
      dialogType: 'add',
      activeStep: 0,
      form: {
        id: undefined,
        parentId: 0,
        name: '',
        level: 1,
        icon: '',
        weight: 0
      },
      rules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      try {
        this.loading = true
        const { data } = await getCategoryList()
        this.list = data
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
      } finally {
        this.loading = false
      }
    },

    handleAdd(row) {
      this.dialogType = 'add'
      this.activeStep = 0
      this.form = {
        parentId: row ? row.id : 0,
        name: '',
        level: row ? row.level + 1 : 1,
        icon: '',
        weight: 0
      }
      this.dialogVisible = true
    },

    handleUpdate(row) {
      this.dialogType = 'edit'
      this.activeStep = 0
      this.form = {
        id: row.id,
        parentId: row.parentId,
        name: row.name,
        level: row.level,
        icon: row.icon,
        weight: row.weight
      }
      this.dialogVisible = true
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该分类吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteCategory(row.id)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除分类失败:', error)
          this.$message.error('删除分类失败')
        }
      }
    },

    async submitForm() {
      try {
        await this.$refs.form.validate()
        if (this.dialogType === 'add') {
          await addCategory(this.form)
          this.$message.success('添加成功')
        } else {
          await updateCategory(this.form)
          this.$message.success('更新成功')
        }
        this.dialogVisible = false
        this.getList()
      } catch (error) {
        if (error !== false) {
          console.error(this.dialogType === 'add' ? '添加分类失败:' : '更新分类失败:', error)
          this.$message.error(this.dialogType === 'add' ? '添加分类失败' : '更新分类失败')
        }
      }
    },

    async handleUpload({ file }) {
      try {
        const { data } = await uploadFile(file)
        this.form.icon = data.url
        this.$message.success('图标上传成功')
      } catch (error) {
        console.error('上传图标失败:', error)
        this.$message.error('上传图标失败')
      }
    },

    beforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传图标只能是 JPG 或 PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图标大小不能超过 2MB!')
        return false
      }
      return true
    },

    nextStep() {
      if (!this.form.icon) {
        this.$message.warning('请先上传图标')
        return
      }
      this.activeStep++
    },

    cancelDialog() {
      this.dialogVisible = false
      this.activeStep = 0
      this.form = {
        id: undefined,
        parentId: 0,
        name: '',
        level: 1,
        icon: '',
        weight: 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
}

.upload-container {
  width: 200px;
  height: 200px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &:hover {
    border-color: #409EFF;
  }

  .preview-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .upload-icon {
    font-size: 28px;
    color: #8c939d;
  }

  .upload-tip {
    font-size: 14px;
    color: #606266;
    margin-top: 10px;
  }
}
</style> 
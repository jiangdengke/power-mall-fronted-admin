<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <span>内容管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="handleAdd">添加内容</el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        border
        style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="groupName" label="分组名称" />
        <el-table-column label="分组编码" align="center">
          <template slot-scope="{row}">
            <el-tag>{{ getGroupCodeLabel(row.groupCode) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="80" align="center" />
        <el-table-column label="图片" width="120" align="center">
          <template slot-scope="{row}">
            <el-image 
              v-if="row.img"
              style="width: 80px; height: 80px"
              :src="row.img"
              :preview-src-list="[row.img]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="{row}">
            <el-button type="text" @click="handleUpdate(row)">编辑</el-button>
            <el-button type="text" class="delete-btn" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-show="total > 0"
        :current-page="query.current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>

    <!-- 内容表单对话框 -->
    <el-dialog :title="dialogType === 'add' ? '添加内容' : '编辑内容'" :visible.sync="dialogVisible">
      <el-steps v-if="dialogType === 'add'" :active="activeStep" finish-status="success" style="margin-bottom: 20px">
        <el-step title="上传图片"></el-step>
        <el-step title="填写信息"></el-step>
      </el-steps>

      <!-- 步骤一：上传图片 -->
      <div v-if="dialogType === 'add' && activeStep === 0">
        <el-upload
          class="avatar-uploader"
          action="#"
          :http-request="handleUpload"
          :show-file-list="false"
          :before-upload="beforeUpload">
          <img v-if="form.img" :src="form.img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="upload-tip" style="text-align: center; margin-top: 10px;">点击上传图片</div>
      </div>

      <!-- 步骤二：填写信息 或 编辑模式 -->
      <el-form v-else ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分组名称" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入分组名称" />
        </el-form-item>

        <el-form-item label="分组编码" prop="groupCode">
          <el-radio-group v-model="form.groupCode">
            <el-radio
              v-for="option in groupCodeOptions"
              :key="option.value"
              :label="option.value">
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :step="1" />
        </el-form-item>

        <el-form-item v-if="dialogType === 'edit'" label="图片" prop="img">
          <el-upload
            class="avatar-uploader"
            action="#"
            :http-request="handleUpload"
            :show-file-list="false"
            :before-upload="beforeUpload">
            <img v-if="form.img" :src="form.img" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType === 'add' && activeStep > 0" @click="activeStep--">上一步</el-button>
        <el-button v-if="dialogType === 'add' && activeStep < 1" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-else type="primary" @click="submitForm">确定</el-button>
        <el-button @click="cancelDialog">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getContentList, addContent, updateContent, deleteContent } from '@/api/content'
import { uploadFile } from '@/api/oss'

export default {
  name: 'Content',
  data() {
    return {
      loading: true,
      list: [],
      total: 0,
      query: {
        current: 1,
        size: 10
      },
      dialogVisible: false,
      dialogType: 'add',
      activeStep: 0,
      groupCodeOptions: [
        { label: '首页轮播图', value: 'INDEX_SWIPER' },
        { label: '首页广告', value: 'INDEX_ADVERT' },
        { label: '首页导航', value: 'INDEX_NAVIGATION' }
      ],
      form: {
        id: undefined,
        groupName: '',
        groupCode: '',
        title: '',
        sort: 0,
        img: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'blur' }
        ],
        groupCode: [
          { required: true, message: '请选择分组编码', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getGroupCodeLabel(code) {
      const option = this.groupCodeOptions.find(opt => opt.value === code)
      return option ? option.label : code
    },

    async getList() {
      try {
        this.loading = true
        const { data: { records, total } } = await getContentList(this.query)
        this.list = records
        this.total = total
      } catch (error) {
        console.error('获取内容列表失败:', error)
        this.$message.error('获取内容列表失败')
      } finally {
        this.loading = false
      }
    },

    handleAdd() {
      this.dialogType = 'add'
      this.activeStep = 0
      this.form = {
        groupName: '',
        groupCode: '',
        title: '',
        sort: 0,
        img: ''
      }
      this.dialogVisible = true
    },

    handleUpdate(row) {
      this.dialogType = 'edit'
      this.form = { ...row }
      this.dialogVisible = true
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该内容吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteContent(row.id)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除内容失败:', error)
          this.$message.error('删除内容失败')
        }
      }
    },

    async submitForm() {
      try {
        await this.$refs.form.validate()
        if (this.dialogType === 'add') {
          await addContent(this.form)
          this.$message.success('添加成功')
        } else {
          await updateContent(this.form.id, this.form)
          this.$message.success('更新成功')
        }
        this.dialogVisible = false
        this.getList()
      } catch (error) {
        if (error !== false) {
          console.error(this.dialogType === 'add' ? '添加内容失败:' : '更新内容失败:', error)
          this.$message.error(this.dialogType === 'add' ? '添加内容失败' : '更新内容失败')
        }
      }
    },

    async handleUpload({ file }) {
      try {
        const { data } = await uploadFile(file)
        this.form.img = data.url
        this.$message.success('上传成功')
      } catch (error) {
        console.error('上传失败:', error)
        this.$message.error('上传失败')
      }
    },

    beforeUpload(file) {
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

    handleSizeChange(val) {
      this.query.size = val
      this.getList()
    },

    handleCurrentChange(val) {
      this.query.current = val
      this.getList()
    },

    nextStep() {
      if (!this.form.img) {
        this.$message.warning('请先上传图片')
        return
      }
      this.activeStep++
    },

    cancelDialog() {
      this.dialogVisible = false
      this.activeStep = 0
      this.form = {
        id: undefined,
        groupName: '',
        groupCode: '',
        title: '',
        sort: 0,
        img: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  padding: 20px;
}

.delete-btn {
  color: #F56C6C;
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
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style> 
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="商品名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加商品
      </el-button>
    </div>

    <!-- 商品列表 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      default-expand-all
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-table
            :data="row.skuList"
            border
            fit
            style="width: 100%"
          >
            <el-table-column label="规格" align="center">
              <template slot-scope="{row: sku}">
                <el-tag
                  v-for="spec in sku.specValueList"
                  :key="spec.specId"
                  style="margin-right: 5px"
                >
                  {{ spec.specName }}: {{ spec.specValue }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="价格" width="120" align="center">
              <template slot-scope="{row: sku}">
                <span>¥{{ sku.price }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存" width="120" align="center">
              <template slot-scope="{row: sku}">
                <span>{{ sku.stock }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
              <template slot-scope="{row: sku}">
                <el-tag :type="sku.status === 1 ? 'success' : 'info'">
                  {{ sku.status === 1 ? '上架' : '下架' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200">
              <template slot-scope="{row: sku}">
                <el-button type="primary" size="mini" @click="handleSkuUpdate(sku)">
                  编辑
                </el-button>
                <el-button
                  :type="sku.status === 1 ? 'warning' : 'success'"
                  size="mini"
                  @click="handleSkuStatusChange(sku)"
                >
                  {{ sku.status === 1 ? '下架' : '上架' }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column label="商品图片" width="120" align="center">
        <template slot-scope="{row}">
          <img :src="row.img" style="width: 60px; height: 60px">
        </template>
      </el-table-column>

      <el-table-column label="商品名称" min-width="200" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="分类" width="150" align="center">
        <template slot-scope="{row}">
          <span>{{ row.categoryName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="120" align="center">
        <template slot-scope="{row}">
          <span>¥{{ row.price }}</span>
        </template>
      </el-table-column>

      <el-table-column label="销量" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sales }}</span>
        </template>
      </el-table-column>

      <el-table-column label="总库存" width="120" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.totalStock > 0 ? 'success' : 'danger'">
            {{ row.totalStock > 0 ? '库存充足' : '库存不足' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handleAddSku(row)">
            添加SKU
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="handlePagination"
    />

    <!-- SKU编辑对话框 -->
    <el-dialog :title="dialogType === 'edit' ? '编辑SKU' : '添加SKU'" :visible.sync="skuDialogVisible" width="500px">
      <el-form ref="skuForm" :model="skuForm" :rules="skuRules" label-width="100px">
        <el-form-item label="规格名称" prop="specName" v-if="dialogType === 'add'">
          <el-input v-model="skuForm.specName" placeholder="请输入规格名称，如：面" />
        </el-form-item>
        <el-form-item label="规格值" prop="specValue" v-if="dialogType === 'add'">
          <el-input v-model="skuForm.specValue" placeholder="请输入规格值，如：大份" />
        </el-form-item>
        <el-form-item label="规格信息" v-if="dialogType === 'edit'">
          <div>
            <el-tag
              v-for="spec in skuForm.specValueList"
              :key="spec.specId"
              style="margin-right: 5px"
            >
              {{ spec.specName }}: {{ spec.specValue }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="skuForm.price" :min="0" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="skuForm.stock" :min="0" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skuDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSkuForm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSpuList, deleteSpu, getSpuDetail, updateSpu } from '@/api/product/spu'
import { updateSkuStatus, updateSku, addSku } from '@/api/product/sku'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'ProductList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1,
        size: 10,
        name: undefined
      },
      dialogType: 'add',
      skuDialogVisible: false,
      skuForm: {
        id: undefined,
        spuId: undefined,
        specName: '',
        specValue: '',
        price: 0,
        stock: 0,
        specValueList: []
      },
      skuRules: {
        specName: [{ required: true, message: '请输入规格名称', trigger: 'blur' }],
        specValue: [{ required: true, message: '请输入规格值', trigger: 'blur' }],
        price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入库存', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getSpuList(this.listQuery)
        this.list = data.records
        this.total = data.total
      } catch (error) {
        console.error('获取商品列表失败:', error)
        this.$message.error('获取商品列表失败')
      }
      this.listLoading = false
    },

    handleFilter() {
      this.listQuery.current = 1
      this.getList()
    },

    handlePagination({ page, limit }) {
      this.listQuery.current = page
      this.listQuery.size = limit
      this.getList()
    },

    handleCreate() {
      this.$router.push('/product/form')
    },

    handleUpdate(row) {
      this.$router.push(`/product/form/${row.id}`)
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确认删除该商品吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await deleteSpu(row.id)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除商品失败:', error)
          this.$message.error('删除商品失败')
        }
      }
    },

    handleSkuUpdate(sku) {
      this.dialogType = 'edit'
      this.skuForm = {
        id: sku.id,
        spuId: sku.spuId,
        price: sku.price,
        stock: sku.stock,
        specValueList: sku.specValueList
      }
      this.skuDialogVisible = true
    },

    async handleSkuStatusChange(sku) {
      try {
        const newStatus = sku.status === 1 ? 0 : 1
        await updateSkuStatus(sku.id, newStatus)
        this.$message.success(`${newStatus === 1 ? '上架' : '下架'}成功`)
        sku.status = newStatus
      } catch (error) {
        console.error('更新SKU状态失败:', error)
        this.$message.error('更新SKU状态失败')
      }
    },

    async submitSkuForm() {
      try {
        await this.$refs.skuForm.validate()
        if (this.dialogType === 'add') {
          // 先获取商品详情
          const { data: spuDetail } = await getSpuDetail(this.skuForm.spuId)
          
          // 构建新的SKU
          const newSku = {
            spuId: this.skuForm.spuId,
            name: this.skuForm.specName && this.skuForm.specValue ? 
              `${this.skuForm.specName}-${this.skuForm.specValue}` : '',
            price: this.skuForm.price,
            stock: this.skuForm.stock,
            specValueList: [{
              specName: this.skuForm.specName,
              specValue: this.skuForm.specValue
            }],
            status: 1
          }

          // 验证名称是否生成
          if (!newSku.name) {
            this.$message.warning('请输入规格名称和规格值')
            return
          }

          // 更新SPU，添加新的SKU
          const updateData = {
            ...spuDetail,
            skuList: [...(spuDetail.skuList || []), newSku]
          }
          
          await updateSpu(updateData)
          this.$message.success('添加SKU成功')
        } else {
          // 更新SKU
          await updateSku(this.skuForm)
          this.$message.success('更新SKU成功')
        }
        this.skuDialogVisible = false
        this.getList() // 刷新列表
      } catch (error) {
        if (error !== false) {
          console.error(this.dialogType === 'add' ? '添加SKU失败:' : '更新SKU失败:', error)
          this.$message.error(this.dialogType === 'add' ? '添加SKU失败' : '更新SKU失败')
        }
      }
    },

    handleAddSku(row) {
      this.dialogType = 'add'
      this.skuForm = {
        spuId: row.id,
        specName: '',
        specValue: '',
        price: row.price,
        stock: 0,
        specValueList: []
      }
      this.skuDialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
    margin-right: 10px;
  }
}

.el-table {
  .el-table {
    margin: 10px 0;
  }
}
</style> 
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="货物名称" clearable v-model.trim="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
        <el-button class="filter-item" v-if="groupTypeManager_btn_add" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="货主名称" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.shipperName}}</span>
        </template>
      </el-table-column> 
      <el-table-column align="center" label="货物名称" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="货物编号">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="货物型号">
        <template slot-scope="scope">
          <span>{{scope.row.model}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="货物类目">
        <template slot-scope="scope">
          <span>{{scope.row.goodsCatId}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.crtName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新主机">
        <template slot-scope="scope">
          <span>{{scope.row.crtHost}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主" prop="shipperId">
              <el-select
                v-model.trim="form.shipperId"
                filterable
                remote
                placeholder="货主模糊搜索"
                @change="onChange"
                :remote-method="remoteMethod"
                :loading="loading"> 
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物类目" prop="goodsCatId">
              <el-select
                v-model.trim="form.goodsCatId"
                placeholder="请选择货物类目"> 
                <el-option
                  v-for="item in goodsOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>  
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货物编号" prop="code">
              <el-input v-model.trim="form.code" placeholder="请输入货物编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="货物名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入货物名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货物型号" prop="model">
              <el-input v-model.trim="form.model" placeholder="请输入货物型号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
        <el-form-item label="应急处理">
          <el-input v-model.trim="form.remark" type="textarea" resize="none" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" placeholder="最多100字"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getShipperSearch } from '@/api/shipper/index'
  import { pageAll } from '@/api/base/category'
  import { page, addObj, getObj, delObj, putObj } from '@/api/base/goods'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'product',
    directives: {
      waves
    },
    data() {
      return {
        form: {
          // code: undefined,
          name: undefined,
          remark: undefined
        },
        rules: {
          shipperId: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          goodsCatId: [
            { required: true, message: '请选择货物类目', trigger: 'change' }
          ],
          code: [
            { required: true, message: '请输入货物编号', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入货物名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          model: [
            { required: true, message: '请输入货物型号', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        list: null,
        total: null,
        loading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        groupTypeManager_btn_edit: true,
        groupTypeManager_btn_del: true,
        groupTypeManager_btn_add: true,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        currentRow: [], // 行ID
        options: [],
        goodsOptions: []
      }
    },
    created() {
      this.getList()
      // this.groupTypeManager_btn_edit = this.elements['groupTypeManager:btn_edit']
      // this.groupTypeManager_btn_del = this.elements['groupTypeManager:btn_del']
      // this.groupTypeManager_btn_add = this.elements['groupTypeManager:btn_add']
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      // 详情按钮过滤
      detailDisabled() {
        return !(this.currentRow.length !== 0)
      }
    },
    methods: {
      // 搜索货主单位
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            getShipperSearch({ name: query }).then(response => {
              this.loading = false
              this.options = response.data.map(item => {
                return { value: item.id, label: item.name }
              })
            })
          }, 200)
        } else {
          this.options = []
        }
      },
      // 搜索类目
      onChange(val) {
        pageAll({ platform: 3, shipperId: val }).then(response => {
          this.goodsOptions = response.data
        })
      },
      // 选中行
      handleCurrentChangeRow(val) {
        this.currentRow = val || []
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.currentRow = []
          this.list = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate() {
        getObj(this.currentRow.id).then(response => {
          this.form = response.data
          this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
          this.onChange(this.form.goodsCatId)
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentRow.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(this.currentRow)
            this.list.splice(index, 1)
          })
        }).catch(() => {})
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.cancel()
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      cancel(done) {
        this.dialogFormVisible = false
        this.options = []
        this.goodsOptions = []
        this.$refs['form'].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            // this.form.password = undefined
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false
              this.cancel()
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      resetTemp() {
        this.form = {
          platform: 3,
          shipperId: undefined,
          shipperName: undefined,
          goodsCatId: undefined,
          code: undefined,
          name: undefined,
          model: undefined,
          remark: undefined
        }
      }
    }
  }
</script>
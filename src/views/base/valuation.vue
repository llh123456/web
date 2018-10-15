<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单位名称" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
        <el-button class="filter-item" v-if="groupTypeManager_btn_add" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="单位名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
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
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入单位名称"></el-input>
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
  import { page, addObj, getObj, delObj, putObj } from '@/api/base/valuation'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'valuation',
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
          name: [
            { required: true, message: '请输入单位名称', trigger: 'blur' }
          ]
        },
        list: null,
        total: null,
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
        currentRow: [] // 行ID
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
          name: undefined
        }
      }
    }
  }
</script>
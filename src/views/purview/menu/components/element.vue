<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="资源名称" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" :disabled="bthDisabled" v-if="menuManager_btn_element_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column width="200px" align="center" label="资源编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源地址">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源请求类型">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column width="200px" align="center" label="描述">
        <template slot-scope="scope">
          <span>{{scope.row.description}}</span>
        </template>
      </el-table-column>-->
      <el-table-column fixed="right" align="center" label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="menuManager_btn_element_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="menuManager_btn_element_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--<div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="150px">
        <el-form-item label="资源编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入资源编码"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-select class="filter-item" v-model="form.type" placeholder="请输入资源类型">
            <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入资源名称"></el-input>
        </el-form-item>
        <el-form-item label="资源地址" prop="uri">
          <el-input v-model="form.uri" placeholder="请输入资源地址"></el-input>
        </el-form-item>
        <el-form-item label="资源请求类型" prop="method">
          <el-select class="filter-item" v-model="form.method" placeholder="请输入资源请求类型">
            <el-option v-for="item in methodOptions" :key="item" :label="item" :value="item"> </el-option>
          </el-select>
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
  import { pageMenuB, addObj, getObj, delObj, putObj } from '@/api/element/index'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'elementPage',
    directives: {
      waves
    },
    // props: {
    //   menuId: {
    //     default: '1'
    //   }
    // },
    data() {
      return {
        methodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
        typeOptions: [
          { id: 1, name: 'button' },
          { id: 2, name: 'uri' }
        ],
        form: {
          code: undefined,
          type: undefined,
          title: undefined,
          uri: undefined,
          menuId: undefined,
          method: undefined,
          description: undefined,
          platform: this.platform
        },
        rules: {
          code: [
            { required: true, message: '请输入资源编码', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请输入资源类型', trigger: 'blur' }
            // { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入资源名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          uri: [
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          method: [
            { required: true, message: '请输入资源请求类型', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
          ]
        },
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          pageNum: 1,
          pageSize: 20,
          name: undefined,
          menuId: this.menuId
        },
        dialogFormVisible: false,
        dialogStatus: '',
        menuManager_btn_element_add: true,
        menuManager_btn_element_edit: true,
        menuManager_btn_element_del: true,
        menuId: -1,
        platform: 2,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      // this.getList()
      // this.menuManager_btn_element_add = this.elements['menuManager:btn_element_add']
      // this.menuManager_btn_element_del = this.elements['menuManager:btn_element_del']
      // this.menuManager_btn_element_edit = this.elements['menuManager:btn_element_edit']
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      bthDisabled() {
        return this.menuId === -1
      }
    },
    methods: {
      getList() {
        this.listLoading = true
        pageMenuB(this.menuId).then(response => {
          this.list = response.data
          // this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val
        this.getList()
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate(row) {
        getObj(row.id).then(response => {
          this.form = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(row)
            this.list.splice(index, 1)
          })
        }).catch(() => {})
      },
      create(formName) {
        const set = this.$refs
        this.form.menuId = this.menuId
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then((res) => {
              if (res.status !== 200) return
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
        const set = this.$refs
        set['form'].resetFields()
      },
      update(formName) {
        const set = this.$refs
        this.form.menuId = this.menuId
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            this.form.password = undefined
            putObj(this.form.id, this.form).then((res) => {
              if (res.status !== 200) return
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
          code: undefined,
          type: undefined,
          title: undefined,
          uri: undefined,
          menuId: undefined,
          method: undefined,
          description: undefined,
          platform: this.platform
        }
      }
    }
  }
</script>
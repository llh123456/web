<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="类型名称" v-model="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <el-button :disabled="!isId" class="filter-item" v-if="groupTypeManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      <!--<el-button :disabled="!isId" class="filter-item" style="margin-left: 10px;" @click="handlerAuthority" type="primary" icon="el-icon-news">权限分配</el-button>-->
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column width="200px" align="center" label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>-->
      <el-table-column width="200px" align="center" label="角色名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="角色类型">
        <template slot-scope="scope">
          <span>{{scope.row.roleTypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="平台">
        <template slot-scope="scope">
          <span v-if="scope.row.platform === 1">车主端</span>
          <span v-else-if="scope.row.platform === 2">后台平台账户</span>
          <span v-else-if="scope.row.platform === 3">后台货主端账户</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创造时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
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
      <el-table-column align="center" label="操作" width="260" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handlerAuthority(scope.row)">权限分配</el-button>
          <el-button v-if="groupTypeManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-if="groupTypeManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <!--<el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入编码"></el-input>
        </el-form-item>-->
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色类型" prop="roleTypeId">
          <el-select v-model="form.roleTypeId" placeholder="请选择">
            <el-option
              v-for="item in groupTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="form.departmentId" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible">
      <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
    </el-dialog>
  </div>
</template>

<script>
  import { getAllGroupTypes, getAllDepartments, page, addObj, getObj, delObj, putObj } from '@/api/group/index'
  // import { fetchTree } from '@/api/menu/index'
  // import { pageMenuB } from '@/api/element/index'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'group',
    directives: {
      waves
    },
    components: {
      'group-authority': () => import('./groupAuthority')
    },
    props: {
      isId: {
        default: ''
      }
    },
    data() {
      return {
        form: {
          name: undefined
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          roleTypeId: [
            { required: true, message: '请选择角色类型', trigger: 'change' }
          ],
          departmentId: [
            { required: true, message: '请选择所属部门', trigger: 'change' }
          ]
        },
        groupTypeList: null,
        departmentList: null,
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          platform: 3,
          shipperId: this.isId,
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
        dialogAuthorityVisible: false,
        dialogAuthorityName: '关联资源',
        currentId: null
      }
    },
    created() {
      this.getList()
      this.parameter()
      // this.groupTypeManager_btn_edit = this.elements['groupTypeManager:btn_edit']
      // this.groupTypeManager_btn_del = this.elements['groupTypeManager:btn_del']
      // this.groupTypeManager_btn_add = this.elements['groupTypeManager:btn_add']
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      parameter() {
        getAllGroupTypes({ platform: 3, shipperId: this.isId }).then(response => {
          this.groupTypeList = response.data
        })
        getAllDepartments({ platform: 3, shipperId: this.isId }).then(response => {
          this.departmentList = response.data
        })
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.list = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
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
          platform: 3,
          name: undefined,
          shipperId: this.isId,
          roleTypeId: undefined,
          departmentId: undefined
        }
      },
      handlerAuthority(row) {
        this.currentId = row.id
        this.dialogAuthorityVisible = true
        if (this.$refs.groupAuthority !== undefined) {
          this.$refs.groupAuthority.groupId = this.currentId
          this.$refs.groupAuthority.initAuthoritys()
        }
      },
      closeAuthorityDialog() {
        this.dialogAuthorityVisible = false
      }
    }
  }
</script>
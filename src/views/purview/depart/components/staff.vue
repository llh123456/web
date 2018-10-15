<template>
<div class="app-container calendar-list-container">
  <div class="filter-container">
    <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名或账户" v-model="listQuery.name"> </el-input>
    <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
    <el-button :disabled="!isId" class="filter-item" v-if="userManager_btn_add" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
  </div>
  <el-table :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
    <el-table-column align="center" label="序号" width="65"> <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template> </el-table-column>
    <el-table-column width="200px" align="center" label="所属部门"> <template slot-scope="scope">
        <span>{{scope.row.departmentName}}</span>
      </template> </el-table-column>
    <el-table-column width="110px" align="center" label="角色类型"> <template slot-scope="scope">
            <span>{{scope.row.roleTypeName}}</span>
          </template> </el-table-column>
    <el-table-column width="110px" align="center" label="角色名称"> <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template> </el-table-column>
    <el-table-column width="300px" align="center" label="员工姓名"> <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template> </el-table-column>
    <el-table-column width="180px" align="center" label="联系方式"> <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template> </el-table-column>
    <el-table-column width="110px" align="center" label="创建人"> <template slot-scope="scope">
            <span>{{scope.row.crtName}}</span>
          </template> </el-table-column>
    <el-table-column width="180px" align="center" label="创建时间"> <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template> </el-table-column>
    <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
        <el-button v-if="userManager_btn_edit" size="small" type="success" @click="handleUpdate(scope.row)">编辑
        </el-button>
        <el-button v-if="userManager_btn_del" size="small" type="danger" @click="handleDelete(scope.row)">删除
        </el-button>
      </template> </el-table-column>
  </el-table>
  <div v-show="!listLoading" class="pagination-container">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
  </div>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel" width="700px">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-row>
        <el-col :span="12">
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
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" placeholder="请选择">
              <el-option
                v-for="item in groupList"
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
          <el-form-item label="用户名" prop="code">
            <el-input v-model="form.code" placeholder="请输入用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobilePhone">
            <el-input v-if="dialogStatus == 'create'" v-model="form.mobilePhone" placeholder="请输入手机号码"></el-input>
            <!--<el-input v-else v-model="form.mobilePhone" placeholder="请输入手机号码" readonly></el-input>-->
            <el-input v-else v-model="form.mobilePhone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号">
            <el-input v-model="form.idcardNo" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-col>  
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="出生日期">
            <!--<el-input v-model="form.birthday" placeholder="请选择出生日期"></el-input>-->
            <el-date-picker type="date" :editable="false" :clearable="false" placeholder="请选择出生日期" v-model="form.birthday" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系地址">
            <el-input v-model="form.address" placeholder="请输入联系地址"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!--<el-form-item label="账户" prop="username">
        <el-input v-if="dialogStatus == 'create'" v-model="form.username" placeholder="请输入账户"></el-input>
        <el-input v-else v-model="form.username" placeholder="请输入账户" readonly></el-input>
      </el-form-item>-->
      <!--<el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>-->
      <!--<el-form-item label="性别">
        <el-select class="filter-item" v-model="form.sex" placeholder="请选择">
          <el-option v-for="item in  sexOptions" :key="item" :label="item" :value="item"> </el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="描述">
        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5}" placeholder="请输入内容" v-model="form.remark"> </el-input>
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
import { getAllDepartments, fetchTree } from '@/api/group/index'
import { page, addObj, getObj, delObj, putObj } from '@/api/user/index'
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // 水波纹指令
import { validatPhone } from '@/utils/validate'

export default {
  name: 'staff',
  props: {
    isId: {
      default: ''
    }
  },
  directives: {
    waves
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validatPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      departmentList: null,
      groupList: null,
      form: {
        // username: undefined,
        departmentId: undefined,
        roleId: undefined,
        name: undefined,
        mobilePhone: undefined,
        idcardNo: undefined,
        birthday: undefined,
        address: undefined,
        // sex: '男',
        // password: undefined,
        remark: undefined,
        platform: 3,
        shipperId: this.isId,
        type: 2
      },
      rules: {
        departmentId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入用户', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ]
        /* username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 20,
            message: '长度在 5 到 20 个字符',
            trigger: 'blur'
          }
        ] */
      },
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
      sexOptions: ['男', '女'],
      dialogFormVisible: false,
      dialogStatus: '',
      userManager_btn_edit: true,
      userManager_btn_del: true,
      userManager_btn_add: true,
      textMap: {
        update: '编辑',
        create: '创建'
      },
      tableKey: 0
    }
  },
  created() {
    this.parameter()
    this.getList()
    // this.userManager_btn_edit = this.elements['userManager:btn_edit']
    // this.userManager_btn_del = this.elements['userManager:btn_del']
    // this.userManager_btn_add = this.elements['userManager:btn_add']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    parameter() {
      getAllDepartments({ platform: 3, shipperId: this.isId }).then(response => {
        this.departmentList = response.data
      })
      fetchTree({ platform: 3, shipperId: this.isId }).then(response => {
        this.groupList = response.data
      })
    },
    getList() {
      this.listLoading = true
      page(this.listQuery)
        .then(response => {
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
      getObj(row.id)
        .then(response => {
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
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form)
            .then(() => {
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
          this.form.password = undefined
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
        // username: undefined,
        departmentId: undefined,
        roleId: undefined,
        name: undefined,
        mobilePhone: undefined,
        idcardNo: undefined,
        birthday: undefined,
        address: undefined,
        // sex: '男',
        // password: undefined,
        remark: undefined,
        platform: 3,
        shipperId: this.isId,
        type: 2
      }
    }
  }
}
</script>

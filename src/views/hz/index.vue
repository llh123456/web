<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="组织机构代码" v-model="listQuery.orgCode">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单位名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter" style="margin-left:5px;">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" @click="handleCreate" type="primary">新增</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handlePass" type="primary">重置密码</el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @row-dblclick="handleDblclickRow" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row
      style="width: 100%;min-height:200px;">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60px" align="center" label="头像">
        <template slot-scope="scope">
          <img v-if="scope.row.headImageUrl" :src="scope.row.headImageUrl" width="40">
          <img v-else src="../../../static/images/defaultImg_icon.png" width="40">
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="组织机构代码">
        <template slot-scope="scope">
          <span>{{scope.row.orgCode}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="单位名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{scope.row.legalPerson}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="手机号码">
        <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.crtName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="登录次数" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.loginTime" style="color: red;">{{scope.row.loginTime}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column width="150px" header-align="center" label="最新登录时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastLogintime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" width="450px" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="115px" style='width: 350px; margin-left:30px;'>
        <el-form-item label="组织机构代码" prop="orgCode">
          <el-input :disabled="!(dialogStatus=='create')" v-model="temp.orgCode"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="temp.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="legalPerson">
          <el-input v-model="temp.legalPerson"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobilePhone">
          <el-input v-model="temp.mobilePhone"  placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="temp.address" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注" style="margin-bottom:0">
          <el-input v-model="temp.remark" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { page, addObj, putObj, getObj, delObj, passObj } from '@/api/hz'
import waves from '@/directive/waves' // 水波纹指令
import { validatPhone } from '@/utils/validate'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

export default {
  name: 'hz',
  directives: {
    waves
  },
  data() {
    const phoneCheckValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码 '))
      } else if (!validatPhone(value)) {
        callback(new Error('请输入正确的手机号码 '))
      } else {
        callback()
      }
    }
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orgCode: undefined,
        name: undefined
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        // id: undefined,
        orgCode: '',
        name: '',
        legalPerson: '',
        // timestamp: new Date(),
        mobilePhone: '',
        address: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      pvData: [],
      rules: {
        orgCode: [{ required: true, message: '组织机构代码不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        legalPerson: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
        mobilePhone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: phoneCheckValidate, trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      currentRow: [] // 行ID
    }
  },
  created() {
    this.getList()
  },
  computed: {
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
    // 双击行
    handleDblclickRow(val) {
      this.currentRow = val || []
      this.$message({
        message: '双击测试成功！',
        type: 'success'
      })
    },
    // 列表
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.currentRow = []
        this.list = response.data.rows
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 0)
      }).catch(() => {
        this.listLoading = false
      })
    },
    // 搜索
    handleFilter() {
      this.listQuery.page = 1
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        // id: undefined,
        orgCode: '',
        name: '',
        legalPerson: '',
        // timestamp: new Date(),
        mobilePhone: '',
        address: '',
        remark: ''
      }
    },
    // 新建
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新建保存
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          addObj(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.resetTemp()
            this.getList()
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 编辑
    handleUpdate() {
      getObj({ shipperId: this.currentRow.id })
        .then(response => {
          this.temp = response.data
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        })
    },
    // 编辑保存
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          putObj(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 重置密码
    handlePass() {
      this.$confirm('是否重置为系统默认密码：123456, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        passObj({ shipperId: this.currentRow.id }).then(() => {
          this.$notify({
            title: '成功',
            message: '重置密码成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {})
    },
    // 删除
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj({ shipperId: this.currentRow.id }).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
          this.getList()
          // const index = this.list.indexOf(row)
          // this.list.splice(index, 1)
        })
      }).catch(() => {})
    },
    // 详情
    handleDetails() {
      console.log(this.currentRow)
    }
  }
}
</script>

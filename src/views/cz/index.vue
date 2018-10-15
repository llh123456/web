<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" clearable placeholder="账号" v-model.trim="listQuery.mobilePhone">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter" style="margin-left:5px;">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button @click="handleDetails" class="filter-item" :disabled="detailDisabled" type="primary">详情</el-button>
        <!--<el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>-->
        <el-button class="filter-item" @click="handleCreate" type="primary">新增</el-button>
        <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves @click="handleDownload">导出</el-button>
        <!--<el-button class="filter-item" type="primary" v-waves>导入</el-button>-->
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row
      style="width: 100%;min-height:200px;">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column width="60px" align="center" label="头像">
        <template slot-scope="scope">
          <span>
            <img v-if="scope.row.headImageUrl" :src="scope.row.headImageUrl" width="40">
            <img v-else src="../../../static/images/defaultImg_icon.png" width="40">
          </span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="手机账号">
        <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" label="微信ID">
        <template slot-scope="scope">
          <span>{{scope.row.weixin}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="注册时间">
        <template slot-scope="scope">
          <span>{{scope.row.registerTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="登录次数" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.loginTime" style="color: red;">{{scope.row.loginTime}}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="最新登录时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastLogintime}}</span>
          <!--<span>{{scope.row.lastLogintime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>-->
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" width="400px" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" inline label-position="left" label-width="90px" style='width: 300px; margin-left:30px;'>
        <!--<el-form-item label="单位名称" prop="title">
          <el-input v-model="temp.title"></el-input>
        </el-form-item>-->
        <el-form-item label="注册账号" prop="username">
          <el-input v-model="temp.username"  placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item label="设置密码" prop="password" style="margin-bottom:0">
          <el-input v-model="temp.password" placeholder="6-20位"></el-input>
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
import { page, addObj } from '@/api/cz'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import { validatPhone } from '@/utils/validate'

export default {
  name: 'cz',
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
        mobilePhone: undefined
      },
      temp: {
        // id: undefined,
        // timestamp: new Date(),
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      pvData: [],
      rules: {
        // title: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        username: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: phoneCheckValidate, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
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
    // 列表
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        this.currentRow = []
        this.list = response.data.rows
        this.total = response.data.total
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
        // timestamp: new Date(),
        username: '',
        password: ''
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
            this.getList()
            this.dialogFormVisible = false
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
      this.temp = Object.assign({}, this.currentRow) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 编辑保存
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          /* const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
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
          }) */
        }
      })
    },
    // 删除
    handleDelete() {
      this.$confirm('是否继续?', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.indexOf(this.currentRow)
        this.list.splice(index, 1)
      }).catch(() => {
      })
    },
    // 详情
    handleDetails() {
      this.$router.push({ name: 'czDetails', query: { id: this.currentRow.id }})
    },
    // 导出
    handleDownload() {
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'registerTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

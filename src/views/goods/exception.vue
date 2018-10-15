<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-item">
        <el-date-picker
          v-model="listQuery.ss"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <!--<div class="filter-item el-input el-input--medium" style="width: 40px; text-align: right;">状态</div>-->
      <el-select clearable placeholder="状态" style="width: 140px" class="filter-item" v-model="listQuery.orgCode">
        <el-option
          v-for="item in companyOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="取消方名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter" style="margin-left:5px;">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handlePass" type="primary">已收款</el-button>
        <el-button class="filter-item" type="primary">导出</el-button>
      </div>
    </div>

    <el-table :key='tableKey' :data="list" v-loading="listLoading" @row-dblclick="handleDblclickRow" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row
      style="width: 100%;min-height:200px;">
      <el-table-column align="center" label="序号" width="65">
        <template slot-scope="scope">
          <span>{{scope.row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="单号">
        <template slot-scope="scope">
          <span>{{scope.row.orgCode}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="取消方名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.legalPerson}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="取消时间">
        <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" header-align="center" label="取消原因">
        <template slot-scope="scope">
          <span>{{scope.row.crtName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="补偿费">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" header-align="center" label="状态" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.loginTime" style="color: red;">{{scope.row.loginTime}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column width="150px" header-align="center" label="处理时间">
        <template slot-scope="scope">
          <span>{{scope.row.lastLogintime}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    
  </div>
</template>

<script>
import { page } from '@/api/hz'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'exception',
  directives: {
    waves
  },
  data() {
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
      companyOptions: [
        { name: '2', id: '1' }
      ],
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
    // 已收款
    handlePass() {
      this.$confirm('是否确认已收款, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(() => {})
    }
  }
}
</script>

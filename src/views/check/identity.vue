<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 150px;" class="filter-item" placeholder="账号" v-model="listQuery.title"></el-input>
      <el-input style="width: 150px;" class="filter-item" placeholder="姓名"></el-input>
      <el-input style="width: 220px;" class="filter-item" placeholder="身份证号"></el-input>
      <div class="filter-item el-input el-input--medium" style="width: 40px; text-align: right;">状态</div>
      <el-select clearable placeholder="状态" style="width: 140px" class="filter-item" v-model="listQuery.sort">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter" style="margin-left:5px;">搜索</el-button>
      <div class="right-button">
        <el-button @click="handleCheck" class="filter-item" :disabled="detailDisabled" type="primary">审核</el-button>
        <!--<el-button class="filter-item" :disabled="detailDisabled" type="primary">详情</el-button>-->
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
      <el-table-column width="110px" align="center" label="手机账号">
        <template slot-scope="scope">
          <span>{{scope.row.mobilePhone}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" label="姓名">
        <template slot-scope="scope">
          <span>{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" label="身份证号">
        <template slot-scope="scope">
          <span>{{scope.row.idcardNo}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" label="家庭住址">
        <template slot-scope="scope">
          <span>{{scope.row.idcardAddress}}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="110px" label="认证照片">
        <template slot-scope="scope">
          <span>
          <img v-if="scope.row.idcardFaceImageUrl" :src="scope.row.idcardFaceImageUrl" width="40">
          <img v-else src="../../../static/images/defaultImg_icon.png" width="40">
          <img v-if="scope.row.idcardBackImageUrl" :src="scope.row.idcardBackImageUrl" width="40">
          <img v-else src="../../../static/images/defaultImg_icon.png" width="40">
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="95">
        <template slot-scope="scope">
          <span v-if="scope.row.authState" style="color: red;">{{scope.row.authState}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="center" label="提交时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
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
import { fetchIdentityPage } from '@/api/check'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'identity',
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
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: undefined
      },
      sortOptions: [
        { label: '全部', key: '1' },
        { label: '待审核', key: '2' },
        { label: '审核通过', key: '3' },
        { label: '审核未通过', key: '4' }
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
    handleCheck() {
      this.$router.push({ name: 'identityCheck', query: { id: this.currentRow.id }})
    },
    // 选中行
    handleCurrentChangeRow(val) {
      this.currentRow = val || []
    },
    // 双击行
    handleDblclickRow(val) {
      /* this.currentRow = val || []
      this.$message({
        message: '双击测试成功！',
        type: 'success'
      }) */
    },
    // 列表
    getList() {
      this.listLoading = true
      fetchIdentityPage(this.listQuery).then(response => {
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
    }
  }
}
</script>

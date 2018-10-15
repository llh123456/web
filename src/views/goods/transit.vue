<template>
  <div class="app-container release">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="编号" v-model="listQuery.name">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="货物名称">
      </el-input>
      <el-input style="width: 200px;" class="filter-item" placeholder="发货人">
      </el-input>
      <el-select clearable placeholder="状态" style="width: 140px" class="filter-item" v-model="listQuery.orgCode">
        <el-option
          v-for="item in companyOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves @click="handleFilter" style="margin-left:5px;">搜索</el-button>
    </div>
    <div class="state-filter">
      <el-radio-group  @change="handleFilter()" v-model="listQuery.state" size="mini" >
        <el-radio-button v-for="(item, index) in stateList" :key="item.value" :label="item.value">{{item.label}}
        </el-radio-button>
      </el-radio-group>
    </div>
    <div class="l-table">
      <el-row class="th">
        <el-col class="is-center" :span="4">货物
        </el-col>
        <el-col class="is-center" :span="3">发货人
        </el-col>
        <el-col class="is-center" :span="5">地址
        </el-col>
        <el-col class="is-center" :span="4">时间
        </el-col>
        <el-col class="is-center" :span="2">状态
        </el-col>
        <el-col class="is-center" :span="6">备注
        </el-col>
      </el-row>
    </div>
    <div class="l-table" v-for="(item, index) in list" :key="item.id">
      <el-row class="tr">
        <el-col :span="24">
          <div class="cell">
            NO.2018124564555 &nbsp; &nbsp; <span class="_time">审核时间：2018-05-01 12:15:59</span>
            <div class="fr" v-if="item.status === 'deleted'">
              <span class="link-type" @click="releaseBth">发布</span>
              <span class="link-type" @click="returnBth">退回</span>
              <span class="link-type" @click="cancelBth">取消</span>
              <span class="link-type" @click="handleDetails(item)">详情</span>
            </div>
            <div class="fr" v-else-if="item.status === 'draft'">
              <span class="link-type" @click="withdrawBth">撤回</span>
              <span class="link-type" @click="cancelBth">取消</span>
              <span class="link-type" @click="handleDetails(item)">详情</span>
            </div>
            <div class="fr" v-else>
              <span class="link-type" @click="handleDetails(item)">详情</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="td">
        <el-col :span="4">
          <div class="cell">稀释硫酸<br>30吨</div>
        </el-col>
        <el-col :span="3">
          <div class="cell">姓名<br>13588772620</div>
        </el-col>
        <el-col :span="5">
          <div class="cell">发：浙江省 杭州市 滨江区<br>收：浙江省 杭州市 西湖区</div>
        </el-col>
        <el-col :span="4">
          <div class="cell">发车：2018－05－03<br>到货：2018－05－05</div>
        </el-col>
        <el-col class="is-center" :span="2">
          <div class="cell">{{item.status}}</div>
        </el-col>
        <el-col :span="6">
          <div class="cell">{{item.id}}</div>
        </el-col>
      </el-row>
    </div>

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
  name: 'transit',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      stateList: [
        { 'value': undefined, 'label': '全部' },
        { 'value': '1', 'label': '待派车' },
        { 'value': '2', 'label': '已派车' },
        { 'value': '3', 'label': '已取消' }
      ],
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
    handleDetails(item) {
      this.$router.push({ name: 'releaseDetails', query: { id: item.id }})
    },
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
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .release {
    .table-border {
      td, th {
        padding: 10px 16px !important;
        text-align: center;
        color: #909399 !important;
      }
      th {
        background-color: #ffffff !important;
      }
      .red {
        color: red;
      }
      .row-fh {
        background-color: #f0fafd;
      }
      .link-type {
        padding-left: 7px;
      }
    }
    .l-table {
      border: 1px solid #ebeef5;
      position: relative;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-box-flex: 1;
      -ms-flex: 1;
      flex: 1;
      width: 100%;
      max-width: 100%;
      font-size: 14px;
      color: #606266;
      border-right: none;
      border-bottom: none;
      &+ .l-table{
        margin-top: 10px;
      }
      .th {
        font-weight: bold;
      }
      .el-col {
        border-bottom: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        padding: 12px 0;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
      }
      .cell {
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        white-space: normal;
        word-break: break-all;
        line-height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .td {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-direction: row;
        flex-direction: row;
        .cell {
          /*transform: translateY(50%);*/
        }
      }
      .tr {
        background-color: #f0fafd;
      }
      .link-type {
        padding-left: 7px;
      }
      .is-center {
        text-align: center;
      }
    }
  }
  .textl {
    text-align: left !important;
  }
  ._time {
    color: #d1d1d1 !important;
  }
</style>
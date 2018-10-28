<template>
  <div class="app-container release">
    <div class="filter-container" style="padding-bottom: 5px;">
      <el-input style="width: 150px;" class="filter-item" placeholder="编号" v-model.trim="listQuery.orderCode" clearable>
      </el-input>
      <el-input style="width: 150px;" class="filter-item" v-model.trim="listQuery.goodsName" placeholder="货物名称" clearable>
      </el-input>
      <el-input style="width: 150px;" class="filter-item" v-model.trim="listQuery.postContactName" placeholder="发货人" clearable>
      </el-input>
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
        <el-col class="is-center" :span="4">地址
        </el-col>
        <el-col class="is-center" :span="5">时间
        </el-col>
        <el-col class="is-center" :span="2">接单车数
        </el-col>
        <el-col class="is-center" :span="2">状态
        </el-col>
        <el-col class="is-center" :span="4">备注
        </el-col>
      </el-row>
    </div>
    <div v-if="list.length !== 0">
      <div class="l-table" v-for="(item, index) in list" :key="item.id">
        <el-row class="tr">
          <el-col :span="24">
            <div class="cell">
              NO.{{item.orderCode}} &nbsp; &nbsp; <span class="_time">审核时间：{{item.crtTime}}</span>
              <div class="fr" v-if="item.state === 6">
                <span class="link-type" @click="handleDetails(item)">派车</span>
                <!--<span class="link-type" @click="handleDetails(item)">详情</span>-->
              </div>
              <div class="fr" v-else>
                <span class="link-type" @click="handleDetails(item)">详情</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="td">
          <el-col :span="4">
            <div class="cell">{{item.goodsNames}}<!--<br>{{item.publishNumber}}{{item.publishUnitName}}--></div>
          </el-col>
          <el-col :span="3">
            <div class="cell">{{item.postContactName}}<br>{{item.postContactPhone}}</div>
          </el-col>
          <el-col :span="4">
            <div class="cell">发：{{item.postWareAddress}}<br>收：{{item.reciveWareAddress}}</div>
          </el-col>
          <el-col :span="5">
            <div class="cell">发车：{{item.postDepartureTime}}<br>到货：{{item.reciveDepartureTime}}</div>
          </el-col>
          <el-col class="is-center" :span="2">
            <div class="cell">
              {{item.consignmentOrderNumber}}
            </div>
          </el-col>
          <el-col class="is-center" :span="2">
            <div class="cell">
              <span v-if="item.state === 6">派车中</span>
              <span v-else>已完成</span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="cell">{{item.sendRemark}}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div v-else>
      <div class="l-table">
        <el-row class="td">
          <el-col :span="24" class="text-center">暂无数据</el-col>
        </el-row>
      </div>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { page } from '@/api/goods/consignment'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'dispatch',
  directives: {
    waves
  },
  data() {
    return {
      tableKey: 0,
      list: [],
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        orderCode: undefined,
        state: 6,
        goodsName: '',
        postContactName: ''
      },
      stateList: [
        { 'value': '6', 'label': '派车中' },
        { 'value': '8', 'label': '已完成' }
      ]
    }
  },
  computed: {
    ...mapGetters(['dispatchState'])
  },
  created() {
    this.getList()
  },
  methods: {
    handleDetails(item) {
      this.$router.push({ name: 'dispatchDetails', query: { id: item.id }})
      // this.$router.push({ name: 'dispatchDetails', query: { id: item.id, orderId: item.logisticsOrderId }})
    },
    // 列表
    getList() {
      this.listLoading = true
      page(this.listQuery).then(response => {
        // this.currentRow = []
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

<template>
  <div class="app-container">
    <div class="header-form-container">
      <div class="state">
        <svg-icon style="font-size: 16px;" icon-class="order_icon"/> &nbsp;状态: 已签收
      </div>
    </div>
    <div class="tableTitle">货源信息</div>
    <div class="header-form-container" style="padding: 6px 16px;border-bottom: none;">
      <div class="info">
        <!--<div class="title">货源信息</div>-->
        <div class="fr">
          <div class="text">提交人：黄大大 13646868789</div>
          <div class="text">提交时间：2018-05-01 11：25：46</div>
          <div class="text number">NO.2018124564555</div>
        </div>
      </div>
      <table class="table-border">
        <tr>
          <th>货主单位：</th>
          <td colspan="3">测试</td>
        </tr>
        <tr>
          <th>发货单位：</th>
          <td></td>
          <th>收货单位：</th>
          <td></td>
        </tr>
        <tr>
          <th>发货人：</th>
          <td></td>
          <th>收货人：</th>
          <td></td>
        </tr>
        <tr>
          <th>联系方式：</th>
          <td></td>
          <th>联系方式：</th>
          <td></td>
        </tr>
        <tr>
          <th>发车时间：</th>
          <td></td>
          <th>到货时间：</th>
          <td></td>
        </tr>
        <tr>
          <th>发货地址：</th>
          <td></td>
          <th>收货地址：</th>
          <td></td>
        </tr>
      </table>
    </div>
    <div class="goods-msg">
      <table class="table-border">
        <tr>
          <th>货物名称</th>
          <th>货物型号</th>
          <th>货物数量</th>
          <th>包装物</th>
          <th>包装型号</th>
          <th>包装数量</th>
          <th style="min-width: 200px;">应急处理方式</th>
        </tr>
        <tr>
          <td>货</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>货</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    <div>
      <div class="tableTitle">承运车辆（3）</div>
      <div class="l-table">
        <el-row class="th">
          <el-col class="is-center" :span="3">运输公司
          </el-col>
          <el-col class="is-center" :span="4">车主账号
          </el-col>
          <el-col class="is-center" :span="4">货物名称
          </el-col>
          <el-col class="is-center" :span="2">发货量 
          </el-col>
          <el-col class="is-center" :span="2">验收量
          </el-col>
          <el-col class="is-center" :span="2">扣损
          </el-col>
          <el-col class="is-center" :span="2">包装物
          </el-col>
          <el-col class="is-center" :span="3">包装回收
          </el-col>
          <el-col class="is-center" :span="2">回单状态
          </el-col>
        </el-row>
      </div>
      <div class="l-table" v-for="(item, index) in list" :key="item.id">
        <el-row class="tr">
          <el-col :span="24">
            <div class="cell">车牌号： 浙GB3398 &nbsp; 重型半挂9.6米 &nbsp; 32吨
              <div class="fr">
                <span class="link-type">详情</span>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row class="td">
          <el-col :span="3">
            <div class="cell">物发物流有限公司</div>
          </el-col>
          <el-col :span="4">
            <div class="cell">姓名<br>13588772620</div>
          </el-col>
          <el-col :span="4">
            <div class="cell">硝酸铵</div>
          </el-col>
          <el-col :span="2">
            <div class="cell">32吨</div>
          </el-col>
          <el-col :span="2">
            <div class="cell">-</div>
          </el-col>
          <el-col :span="2">
            <div class="cell">-</div>
          </el-col>
          <el-col :span="2">
            <div class="cell">木托盘</div>
          </el-col>
          <el-col :span="3">
            <div class="cell">57/60</div>
          </el-col>
          <el-col :span="2">
            <div class="cell">已上传</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div class="tableTitle">操作记录</div>
      <table class="table-border" style="table-layout: fixed;">
        <tr>
          <th width="180">时间</th>
          <th>内容</th>
          <th>操作记录</th>
          <th width="120">操作人</th>
        </tr>
        <tr>
          <td>2018-04-27 11:22:59</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td>2018-04-27 11:22:25</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>  
      </table>
    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'

export default {
  name: 'receiptDetails',
  data() {
    return {
      boxList: ['危险品', '防潮', '防火', '防撞'],
      checkedBox: ['防潮', '防火'],
      remark: '测试',
      otherList: ['装卸服务', '吊车服务', '仓储服务', '包装服务'],
      checkedOther: ['装卸服务'],
      otherRemark: '这个要求可以有',
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 5,
        importance: undefined,
        orderCode: undefined,
        type: undefined,
        sort: '+id',
        status: undefined
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.currentRow = []
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header-form-container {
  background-color: #f5f7fb;
  border: 1px solid #e4e7ed;
  padding: 12px 16px;
  overflow: hidden;
  .state {
    color: #ff5370;
    font-size: 14px;
    font-weight: 700;
    display: inline-block;
  }
  .table-border {
    border: none !important;
    th {
      width: 100px;
      text-align: right;
      background-color: #f5f7fb !important;
    }
    td, th {
      border: none !important;
      padding-left: 0 !important;
    }
  }
  .info {
    display: block;
    margin: 16px 0 12px;
    .text {
      display: inline-block;
      font-size: 14px;
      color: #cccccc;
      &+ .text {
        padding-left: 10px;
      }
      &.number {
        font-size: 18px;
        color: #ff5370;
      }
    }
    .title {
      font-size: 16px;
      color: #303133;
      font-weight: 700;
      border-left: 2px solid #1a91ec;
      text-indent: 9px;
      display: inline-block;
    }
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
</style>
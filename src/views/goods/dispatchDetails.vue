<template>
  <div class="app-container">
    <div class="header-form-container">
      <div class="state">
        <svg-icon style="font-size: 16px;" icon-class="order_icon"/> &nbsp;状态: {{dispatchState[temp.state]}}
      </div>
    </div>
    <div class="tableTitle">货源信息</div>
    <div class="header-form-container" style="padding: 6px 16px;border-bottom: none;">
      <table class="table-border table-span">
        <tr>
          <th>货主单位：</th>
          <td>
            {{form.shipperName}}
            <div class="info">
              <div class="fr">
                <div class="text">提交人：{{form.crtName}}</div>
                <div class="text">提交时间：{{form.crtTime}}</div>
                <div class="text number">NO.{{form.orderCode}}</div>
              </div>
            </div> 
          </td>
        </tr>
        <tr>
          <th>发货信息：</th>
          <td><span>单位：</span>{{form.postCompanyName}} &nbsp; <span>发货人：</span>{{form.postContactName}} &nbsp; <span>联系方式：</span>{{form.postContactPhone}} &nbsp; <span>发车时间：</span>{{form.postDepartureTime}} &nbsp; <span>发货地址：</span>{{form.postWareName}}{{form.postWareAddress}}</td>
        </tr>
        <tr>
          <th>收货信息：</th>
          <td><span>单位：</span>{{form.reciveCompanyName}} &nbsp; <span>收货人：</span>{{form.reciveContactName}} &nbsp; <span>联系方式：</span>{{form.reciveContactPhone}} &nbsp; <span>到货时间：</span>{{form.reciveDepartureTime}} &nbsp; <span>收货地址：</span>{{form.reciveWareName}}{{form.reciveWareAddress}}</td>
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
        <tr v-for="(item, index) in form.goodsList">
          <td>{{item.goodsName}}</td>
          <td>{{item.goodsModel}}</td>
          <td>{{item.goodsNumber}}</td>
          <td>{{item.packageName}}</td>
          <td>{{item.packageModel}}</td>
          <td>{{item.packageNumber}}</td>
          <td>{{item.remark}}</td>
        </tr>
      </table>
    </div>
    <div v-if="form.state === 6 ||　form.state === 8">
      <div class="tableTitle">线路与运价信息</div>
      <table class="table-border addTable">
        <tr>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
        </tr>
        <tr>
          <th>发货仓库：</th>
          <td> &nbsp;{{form.postWareName}}</td>
          <th>地址：</th>
          <td> &nbsp;
            {{form.postWareAreaName}}
            {{form.postWareAddress}}
          </td>
          <th>线路运距：</th>
          <td> &nbsp;{{form.lineDistance}}公里</td>
        </tr>
        <tr>
          <th>收货仓库：</th>
          <td> &nbsp;{{form.reciveWareName}}</td>
          <th>地址：</th>
          <td> &nbsp;
            {{form.reciveWareAreaName}}
            {{form.reciveWareAddress}}
          </td>
          <th>计价单位：</th>
          <td> &nbsp;{{form.lineUnitName}}</td>
        </tr>
        <tr>
          <th>车主运价：</th>
          <td> &nbsp;<span v-if="form.lineDriverPrice" style="color: red; font-size: 20px; font-weight: 700;">{{form.lineDriverPrice}}元/{{form.lineUnitName}}</span></td>
          <th class="check__label">结算方式：</th>
          <td> &nbsp;
            <span v-if="form.payType === 1">货到付款</span>
            <span v-else-if="form.payType === 2">30天结款</span>
            <span v-else>60天结款</span>
          </td>
          <th> &nbsp;</th>
          <td> &nbsp;</td>
        </tr>
        <tr>
          <th>其他费用：</th>
          <td colspan="5"> &nbsp;
            <span v-for="(item, index) in form.service" :key="item.id">{{item.name}}费：{{item.price}}元&nbsp; &nbsp; </span>
          </td>
        </tr>
        <tr>
          <th>备注：</th>
          <td colspan="5">
             &nbsp; {{form.remark}}
          </td>
        </tr>
      </table>
    </div>
    <div class="service">
      <div class="tableTitle">其他服务</div>
      <div class="el-form-item-checkbox">
        <el-checkbox-group v-model="form.serviceList">
          <el-checkbox v-for="o in otherList" :label="o" :key="o" :disabled="true"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="el-form-item-control">
        <el-input type="textarea" v-model="form.otherServiceRemark" resize="none" :rows="3"  :disabled="true" style="margin-top: 15px;"></el-input>
      </div>
    </div>
    <div class="remark">
      <div class="tableTitle">备注</div>
      <div class="el-form-item-checkbox">
        <el-checkbox-group v-model="form.sendRemarkTypeList">
          <el-checkbox v-for="o in boxList" :label="o" :key="o" :disabled="true"></el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="el-form-item-control">
        <el-input type="textarea" v-model="form.sendRemark" resize="none" :rows="3"  :disabled="true" style="margin-top: 15px; height: 50px;"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getObj } from '@/api/goods/goods'
import { getObj } from '@/api/goods/consignment'

var defaultForm = {
  // platform: 3,
  state: '',
  comePlatForm: 2,
  shipperId: undefined, // 货主
  postWareId: '', // 发货的仓库id
  reciveWareId: '', // 收货的仓库id
  postDepartureTime: '', // 发车时间
  reciveDepartureTime: '', // 到货时间
  goodsList: [
    { goodsId: '', goodsModel: '', goodsName: '', goodsNumber: undefined, packageId: '', packageModel: '', packageName: '', packageNumber: undefined, remark: '' }
  ],
  serviceList: [], // 其他服务类型
  otherServiceRemark: '', // 其他服务备注
  sendRemarkTypeList: [], // 运输类型（可以多选）1:危险品2:防潮3:防火4:防撞
  remark: '' // 备注
}

export default {
  name: 'dispatchDetails',
  data() {
    return {
      boxList: ['危险品', '防潮', '防火', '防撞'],
      checkedBox: ['防潮', '防火'],
      remark: '测试',
      otherList: ['装卸服务', '吊车服务', '仓储服务', '包装服务'],
      checkedOther: ['装卸服务'],
      otherRemark: '这个要求可以有',
      form: JSON.parse(JSON.stringify(defaultForm)),
      temp: {},
      lineInfo: {} // 线路信息
    }
  },
  computed: {
    ...mapGetters([
      'goodsState',
      'dispatchState'
    ])
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    fetchData(id) {
      getObj(id).then(response => {
        this.temp = response.data
        this.form = response.data.logisticsOrder
        this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
        this.form.service = this.form.serviceList
        this.form.serviceList = this.form.serviceList.map((item) => {
          return item.name
        })
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
  .table-span {
    span {
      color: #cccccc;
    }
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
    /*display: block;*/
    float: right;
    margin: 0 0 12px;
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
.remark {
  padding-bottom: 20px;
}
.table-border.addTable {
  margin-bottom: 15px;
  table-layout: fixed;
  th {
    width: 120px;
    text-align: right;
    background-color: #f5f7fb !important;
    &.text-center {
      text-align: center;
      background-color: #ffffff !important;
      width: 90px;
      padding: 6px 0 !important;
    }
  }
  td, th {
    padding-left: 0 !important;
  }
  td {
    padding: 0px !important;
    overflow: inherit !important;
  }
  .el-date-editor.el-input {
  }
}
</style>
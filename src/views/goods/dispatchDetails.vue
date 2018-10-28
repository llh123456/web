<template>
  <div class="app-container">
    <div class="header-form-container">
      <div class="state">
        <svg-icon style="font-size: 16px;" icon-class="order_icon"/> &nbsp;状态: 
        <span v-if="form.state === 6">派车中</span>
        <span v-else>已完成</span>
      </div>
    </div>
    <div class="tableTitle">接单信息</div>
    <div class="driver-msg">
      <div class="state-filter">
        <el-radio-group  @change="getList()" v-model="state" size="mini" >
          <el-radio-button v-for="(item, index) in stateList" :key="item.value" :label="item.value">{{item.label}}
          </el-radio-button>
        </el-radio-group>
      </div>
      <el-table :key='tableKey' v-if="form.state===6" :data="carList" height="300" v-loading="listLoading" @selection-change="handleCurrentChangeRow" tooltip-effect="dark" stripe border fit highlight-current-row
        style="width: 100%;">
        <el-table-column
          v-if="disabled"
          type="selection"
          width="42">
        </el-table-column>
        <el-table-column
          prop="trackPlatNumber"
          align="center"
          label="车牌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ownerName"
          align="center"
          label="车主账号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ownerName"
          align="center"
          label="姓名" 
          width="120">
        </el-table-column>
        <el-table-column
          prop="tracker.brandName"
          align="center"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="tracker.loadWeight"
          align="center"
          label="核定载重量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="crtTime"
          align="center"
          label="接单时间"
          width="160">
        </el-table-column>
        <!--<el-table-column
          align="center"
          label="操作"
          width="100">
          <template slot-scope="scope" v-if="disabled">
            <span class="link-type" @click="onCheck(scope.row)">审核</span>
          </template>
        </el-table-column>-->
      </el-table>
      <el-table :key='tableKey' v-else :data="carList" height="300" v-loading="listLoading" @selection-change="handleCurrentChangeRow" tooltip-effect="dark" stripe border fit highlight-current-row
        style="width: 100%;">
        <el-table-column
          prop="trackPlatNumber"
          align="center"
          label="车牌号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ownerName"
          align="center"
          label="车主账号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="ownerName"
          align="center"
          label="姓名" 
          width="120">
        </el-table-column>
        <el-table-column
          prop="tracker.brandName"
          align="center"
          label="车型">
        </el-table-column>
        <el-table-column
          prop="tracker.loadWeight"
          align="center"
          label="核定载重量"
          width="100">
        </el-table-column>
        <el-table-column
          prop="crtTime"
          align="center"
          label="接单时间"
          width="160">
        </el-table-column>
      </el-table>
      <div class="footerBox" v-if="form.state===6">
        <el-button type="primary" :loading="loading" @click="onSendCar">审核派车</el-button>
        <el-button type="primary" :loading="loading" @click="onAddCar">添加车辆</el-button>
        <el-button type="primary" :loading="loading" @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="loading" @click="onComplete">派车完成</el-button>
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
          <th>剩余货物数量</th>
          <th style="min-width: 200px;">应急处理方式</th>
        </tr>
        <tr v-for="(item, index) in form.goodsList">
          <td>{{item.goodsName}}</td>
          <td>{{item.goodsModel}}</td>
          <td>{{item.goodsNumber}}</td>
          <td>{{item.packageName}}</td>
          <td>{{item.packageModel}}</td>
          <td>{{item.packageNumber}}</td>
          <td><span style="color: red;">{{item.haveGoodsNumber}}</span></td>
          <td>{{item.remark}}</td>
        </tr>
      </table>
    </div>
    <div>
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
    <car-dialog ref="carDialog" :is-active="carDialogVisible" @updateList="addList" @toggleClick="carDialogToggle"></car-dialog>
    <send-dialog ref="sendDialog" :is-active="sendDialogVisible" @updateList="sendList" @toggleClick="sendDialogToggle"></send-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import { getObj } from '@/api/goods/goods'
import { getObj, getTruckListByLogisticsOrder, createConsiginOrderByPc, cancelTruckBatch, endTruck } from '@/api/goods/consignment'
import CarDialog from './components/CarDialog'
import SendDialog from './components/SendDialog'
import { isInArray, getParamValues } from '@/utils'

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
  components: {
    CarDialog,
    SendDialog
  },
  data() {
    return {
      boxList: ['危险品', '防潮', '防火', '防撞'],
      checkedBox: ['防潮', '防火'],
      remark: '测试',
      otherList: ['装卸服务', '吊车服务', '仓储服务', '包装服务'],
      checkedOther: ['装卸服务'],
      otherRemark: '这个要求可以有',
      form: JSON.parse(JSON.stringify(defaultForm)),
      tableKey: 0,
      loading: false,
      carDialogVisible: false,
      sendDialogVisible: false,
      listLoading: false,
      currentRow: [], // 行ID
      stateList: [
        { 'value': 1, 'label': '未派车' },
        { 'value': 2, 'label': '已派车' },
        { 'value': 3, 'label': '已取消' }
      ],
      state: 1,
      carList: [],
      listCancel: [],
      listNotSubmit: [],
      listSubmit: [],
      temp: {},
      lineInfo: {} // 线路信息
    }
  },
  computed: {
    ...mapGetters([
      'goodsState',
      'dispatchState'
    ]),
    disabled() {
      return !(this.state !== 1)
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    closeFrom() {
      this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
        if (isInArray(this.$store.getters.cachedViews, 'dispatch')) {
          setTimeout(() => {
            this.$parent.$refs.routerview.getList()
            // this.getList()
          }, 1000)
        }
        this.$router.push({ name: 'dispatch' })
      })
    },
    // 审核派车
    onSendCar() {
      if (!this.currentRow.length) {
        this.$message.error('请至少选择一条记录！')
        return
      }
      this.sendDialogVisible = true
      this.$refs.sendDialog.id = this.$route.query && this.$route.query.id
      this.$refs.sendDialog.form = this.form
      this.$refs.sendDialog.ids = getParamValues('id', this.currentRow)
      this.$nextTick(() => (this.$refs.sendDialog.getList()))
    },
    sendDialogToggle() {
      this.sendDialogVisible = false
    },
    // 审核更新
    sendList() {
      this.getCar()
      /* sendTruck().then(response => {
        this.getCar()
      }) */
    },
    // 添加车辆
    onAddCar() {
      this.carDialogVisible = true
      this.$nextTick(() => (this.$refs.carDialog.getList()))
    },
    carDialogToggle() {
      this.carDialogVisible = false
    },
    // 更新车辆
    addList(res) {
      const ids = res.map(item => {
        return item.id
      })
      createConsiginOrderByPc(this.$route.query.id, ids).then(response => {
        this.getCar()
      })
    },
    // 审核
    onCheck(row) {
      this.$confirm('是否继续?', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        console.log(0)
      }).catch(() => {
      })
    },
    // 取消
    onCancel() {
      if (!this.currentRow.length) {
        this.$message.error('请至少选择一条记录！')
        return
      }
      this.$confirm('是否继续?', '此操作将取消车辆运输', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        const list = this.currentRow.map(item => {
          return { id: item.id, msg: '' }
        })
        cancelTruckBatch(list).then(response => {
          this.getCar()
        })
      }).catch(() => {
      })
    },
    // 完成
    onComplete() {
      this.$confirm('是否继续?', '完成所有派车', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        endTruck(this.$route.query.id).then(response => {
          this.closeFrom()
        })
      }).catch(() => {
      })
    },
    // 派车列表
    getList() {
      this.currentRow = []
      if (this.state === 1) {
        this.carList = this.listNotSubmit
      } else if (this.state === 2) {
        this.carList = this.listSubmit
      } else {
        this.carList = this.listCancel
      }
    },
    // 选中行
    handleCurrentChangeRow(val) {
      this.currentRow = val || []
    },
    getCar() {
      this.listLoading = true
      const id = this.$route.query && this.$route.query.id
      getTruckListByLogisticsOrder(id).then(response => {
        this.listNotSubmit = response.data.listNotSubmit
        this.listCancel = response.data.listCancel
        this.listSubmit = response.data.listSubmit
        this.carList = this.listNotSubmit
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    fetchData(id) {
      // this.listLoading = true
      this.getCar()
      getObj(id).then(response => {
        this.temp = response.data
        this.form = response.data
        this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
        this.form.service = this.form.serviceList
        // this.listLoading = false
        this.form.serviceList = this.form.serviceList.map((item) => {
          return item.name
        })
      }).catch(() => {
        // this.listLoading = false
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
    table-layout: fixed;
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
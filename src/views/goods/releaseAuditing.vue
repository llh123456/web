<template>
  <div class="app-container">
    <div class="header-form-container">
      <div class="state">
        <svg-icon style="font-size: 16px;" icon-class="order_icon"/> &nbsp;状态: {{goodsState[form.state]}}
      </div>
    </div>
    <div class="tableTitle">线路与运价信息<span v-if="form.state === 5" class="link-type" style="margin-left: 20px;" @click="handleClick">+选择线路 </span></div>
    <el-form :model="temp" :rules="rules" ref="form" label-width="0" v-if="form.state === 5">
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
          <td> &nbsp;{{lineInfo.postWareName}}</td>
          <th>地址：</th>
          <td> &nbsp;
            {{lineInfo.postAreaProvName}}
            {{lineInfo.postAreaCityName}}
            {{lineInfo.postAreaName}}
          </td>
          <th>线路运距：</th>
          <td> &nbsp;{{lineInfo.distance}}</td>
        </tr>
        <tr>
          <th>收货仓库：</th>
          <td> &nbsp;{{lineInfo.reciverWareName}}</td>
          <th>地址：</th>
          <td> &nbsp;
            {{lineInfo.reciverAreaProvName}}
            {{lineInfo.reciverAreaCityName}}
            {{lineInfo.reciverAreaName}}
          </td>
          <th>计价单位：</th>
          <td> &nbsp;{{lineInfo.unitName}}</td>
        </tr>
        <tr>
          <th>车主运价：</th>
          <td> &nbsp;<span v-if="lineInfo.driverPrice" style="color: red; font-size: 20px; font-weight: 700;">{{lineInfo.driverPrice}}元/{{lineInfo.unitName}}</span></td>
          <th class="check__label">结算方式：</th>
          <td>
            <el-form-item label="" label-width="0" prop="payType">
              <el-select v-model="temp.payType" placeholder="请选择">
                <el-option
                  v-for="list in goodsAllList"
                  :key="list.id"
                  :label="list.name"
                  :value="list.id">
                </el-option>
              </el-select>
            </el-form-item>
          </td>
          <th> &nbsp;</th>
          <td> &nbsp;</td>
        </tr>
        <tr>
          <th>其他费用：</th>
          <td colspan="5"> &nbsp;
            <span v-for="(item, index) in form.service" :key="item.id">{{item.name}}费：<el-input-number style="width: 100px;" placeholder="0" :precision="0" :controls="false" v-model="item.delFlag"></el-input-number></span>
          </td>
        </tr>
        <!--<tr>
          <th>装卸费：</th>
          <td>
            <el-form-item label="" label-width="0">
              <el-input-number style="width: 100%;" placeholder="0" :precision="0" :controls="false" v-model="goodsNumber"></el-input-number>
            </el-form-item>
          </td>
          <th>其他费用：</th>
          <td>
            <el-form-item label="" label-width="0">
              <el-input-number style="width: 100%;" placeholder="0" :precision="0" :controls="false" v-model="goodsNumber"></el-input-number>
            </el-form-item>
          </td>
          <th> &nbsp;</th>
          <td> &nbsp;</td>
        </tr>-->
        <tr>
          <th>备注：</th>
          <td colspan="5">
            <el-input v-model="temp.remark" maxlength="50" placeholder="请输入备注"></el-input>
          </td>
        </tr>
      </table>
      <div class="footerBox">
        <el-button type="primary" @click="returnBth" :loading="minloading">退回</el-button>
        <el-button type="primary" @click="cancelBth" :loading="minloading">取消</el-button>
        <el-button type="primary" @click="createData" :loading="minloading">发布</el-button>
      </div>
    </el-form>
    <line-dialog ref="dialog" :reciverWareId="form.reciveWareId" :postWareId="form.postWareId" :is-id="form.shipperId" :is-active="dialogVisible" @updateList="handleUpdate" @toggleClick="dialogToggle"></line-dialog>
    <div class="tableTitle">货源信息</div>
    <div class="header-form-container" style="padding: 6px 16px;border-bottom: none;">
      <div class="info">
        <!--<div class="title">货源信息</div>-->
        <div class="fr">
          <div class="text">提交人：{{form.crtName}}</div>
          <div class="text">提交时间：{{form.crtTime}}</div>
          <div class="text number">NO.{{form.orderCode}}</div>
        </div>
      </div>
      <table class="table-border">
        <tr>
          <th>货主单位：</th>
          <td colspan="3">{{form.shipperName}}</td>
        </tr>
        <tr>
          <th>发货单位：</th>
          <td>{{form.postCompanyName}}</td>
          <th>收货单位：</th>
          <td>{{form.reciveCompanyName}}</td>
        </tr>
        <tr>
          <th>发货人：</th>
          <td>{{form.postContactName}}</td>
          <th>收货人：</th>
          <td>{{form.reciveContactName}}</td>
        </tr>
        <tr>
          <th>联系方式：</th>
          <td>{{form.postContactPhone}}</td>
          <th>联系方式：</th>
          <td>{{form.reciveContactPhone}}</td>
        </tr>
        <tr>
          <th>发车时间：</th>
          <td>{{form.postDepartureTime}}</td>
          <th>到货时间：</th>
          <td>{{form.reciveDepartureTime}}</td>
        </tr>
        <tr>
          <th>发货地址：</th>
          <td>{{form.postWareName}} {{form.postWareAddress}}</td>
          <th>收货地址：</th>
          <td>{{form.reciveWareName}} {{form.reciveWareAddress}}</td>
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
        <el-input type="textarea" v-model="form.remark" resize="none" :rows="3"  :disabled="true" style="margin-top: 15px; height: 50px;"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isInArray } from '@/utils'
import { getObj, setLogisticsOrderStatus, publishLogisticsOrder } from '@/api/goods/goods'
import LineDialog from './components/LineDialog'

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
  name: 'releaseAuditing',
  components: {
    LineDialog
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
      goodsNumber: undefined,
      loading: false,
      minloading: false,
      dialogVisible: false,
      lineInfo: {}, // 线路信息
      goodsAllList: [
        { id: 1, name: '货到付款' },
        { id: 2, name: '30天结款' },
        { id: 3, name: '60天结款' }
      ],
      rules: {
        payType: [
          { required: true, message: '请选择结算方式', trigger: 'change' }
        ]
      },
      temp: {
        id: null, // 货源ID
        lineId: null, // 线路ID
        payType: null, // 结算方式
        services: [],
        remark: ''
      }
    }
  },
  computed: {
    ...mapGetters(['goodsState'])
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    // 发布
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$confirm('是否继续?', '确认发布', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            if (!this.lineInfo.id) {
              this.$message.error('请选择线路运价')
              return
            }
            const postHttp = JSON.parse(JSON.stringify(this.temp))
            // postHttp['id'] = this.form.id
            postHttp['lineId'] = this.lineInfo.id
            postHttp['services'] = this.form.service.map((item) => {
              return { id: item.id, price: item.delFlag || 0 }
            })
            this.minloading = true
            publishLogisticsOrder(this.form.id, postHttp).then(() => {
              this.minloading = false
              this.$notify({
                title: '成功',
                message: '发布成功',
                type: 'success',
                duration: 2000
              })
              this.minloading = false
              this.$store.dispatch('delVisitedViews', this.$route)
              if (isInArray(this.$store.getters.cachedViews, 'release')) {
                setTimeout(() => {
                  this.$parent.$refs.routerview.getList()
                }, 1000)
              }
              this.$router.push({ name: 'release' })
            }).catch(() => {
              this.minloading = false
            })
          }).catch(() => {
          })
        }
      })
    },
    // 取消
    cancelBth() {
      this.$confirm('是否继续?', '确认取消', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.minloading = true
        setLogisticsOrderStatus(this.form.id, { msg: '', status: 4 }).then(() => {
          this.$notify({
            title: '成功',
            message: '取消成功',
            type: 'success',
            duration: 2000
          })
          this.minloading = false
          this.$store.dispatch('delVisitedViews', this.$route)
          if (isInArray(this.$store.getters.cachedViews, 'release')) {
            setTimeout(() => {
              this.$parent.$refs.routerview.getList()
              // this.getList()
            }, 1000)
          }
          this.$router.push({ name: 'release' })
        })
      }).catch(() => {
        this.minloading = false
      })
    },
    // 退回
    returnBth() {
      this.$confirm('是否继续?', '确认退回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.minloading = true
        setLogisticsOrderStatus(this.form.id, { msg: '', status: 3 }).then(() => {
          this.$notify({
            title: '成功',
            message: '退回成功',
            type: 'success',
            duration: 2000
          })
          this.minloading = false
          this.$store.dispatch('delVisitedViews', this.$route)
          if (isInArray(this.$store.getters.cachedViews, 'release')) {
            setTimeout(() => {
              this.$parent.$refs.routerview.getList()
              // this.getList()
            }, 1000)
          }
          this.$router.push({ name: 'release' })
        })
      }).catch(() => {
        this.minloading = false
      })
    },
    // 线路运价
    handleClick() {
      this.dialogVisible = true
      this.$nextTick(() => (this.$refs.dialog.getList()))
    },
    // 关闭dialog
    dialogToggle() {
      this.dialogVisible = false
    },
    // 更新
    handleUpdate(res) {
      this.lineInfo = res
    },
    fetchData(id) {
      getObj(id).then(response => {
        this.form = response.data
        this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
        this.postInfo = {
          customerCompanyName: response.data.postCompanyName,
          contactsUser: response.data.postContactName,
          contactsPhone: response.data.postContactPhone,
          name: response.data.postWareName,
          detailAddress: response.data.postWareAddress
        }
        this.reciveInfo = {
          customerCompanyName: response.data.reciveCompanyName,
          contactsUser: response.data.reciveContactName,
          contactsPhone: response.data.reciveContactPhone,
          name: response.data.reciveWareName,
          detailAddress: response.data.reciveWareAddress
        }
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
.check__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
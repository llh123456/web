<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px">
      <div class="header-form-container">
        <div class="state">NO.{{form.orderCode}}</div>
      </div>
      <div class="tableTitle">货源信息</div>
      <table class="table-border addTable">
        <tr>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
          <th style="height: 0px; padding: 0; border: none;"></th>
          <td style="height: 0px; padding: 0; border: none;"></td>
        </tr>
        <tr>
          <th class="text-center check__label">代发客户</th>
          <td colspan="6">
            <el-form-item label="" prop="shipperId" label-width="0">
              <el-select
                v-model.trim="form.shipperId"
                filterable
                remote
                placeholder="货主模糊搜索"
                @change="onChange"
                :remote-method="remoteMethod"
                :loading="loading"> 
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <th class="text-center" rowspan="2">发货信息</th>
          <th>
            <span v-if="!form.shipperId">发货单位：</span>
            <span v-else @click="handleClick('post')" class="link-type">+ 发货单位：</span>
          </th>
          <td> &nbsp;{{postInfo.customerCompanyName}}
          </td>
          <th>发货人：</th>
          <td> &nbsp;{{postInfo.contactsUser}}
          </td>
          <th>联系方式：</th>
          <td> &nbsp;{{postInfo.contactsPhone}}
          </td>
        </tr>
        <tr>
          <th>发货地址：</th>
          <td colspan="3"> &nbsp;{{postInfo.name}} {{postInfo.detailAddress}}
          </td>
          <th class="check__label">发车时间：</th>
          <td>
            <el-form-item label="" prop="postDepartureTime" label-width="0">
              <el-date-picker
                style="width: 100%;"
                v-model="form.postDepartureTime"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <th class="text-center" rowspan="2">到货信息</th>
          <th>
            <span v-if="!form.shipperId">收货单位：</span>
            <span v-else @click="handleClick('recive')" class="link-type">+ 收货单位：</span>
          </th>
          <td> &nbsp;{{reciveInfo.customerCompanyName}}
          </td>
          <th>收货人：</th>
          <td> &nbsp;{{reciveInfo.contactsUser}}
          </td>
          <th>联系方式：</th>
          <td> &nbsp;{{reciveInfo.contactsPhone}}
          </td>
        </tr>
        <tr>
          <th>收货地址：</th>
          <td colspan="3"> &nbsp;{{reciveInfo.name}} {{reciveInfo.detailAddress}}
          </td>
          <th class="check__label">到货时间：</th>
          <td>
            <el-form-item label="" prop="reciveDepartureTime" label-width="0">
              <el-date-picker
                style="width: 100%;"
                v-model="form.reciveDepartureTime"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </td>
        </tr>
      </table>
      <div class="goods-msg">
        <table class="table-border listTable addTable">
          <tr>
            <th>货物名称</th>
            <th>货物型号</th>
            <th>货物数量</th>
            <th>包装物</th>
            <th>包装型号</th>
            <th>包装数量</th>
            <th style="min-width: 200px;">应急处理方式</th>
            <th width="80">操作 &nbsp;<span style="font-size: 13px;cursor: pointer;" @click="addItem"><svg-icon icon-class="order_add"/></span></th>
          </tr>
          <tr v-for="(item, index) in form.goodsList" :key="index">
            <td>
              <el-form-item label="" label-width="0" :prop="'goodsList.'+index+'.goodsId'" :rules="goodsGroupRules.goodsGroupGoodsId">
                <el-select filterable popper-class="select-div" v-model="item.goodsId" placeholder="请选择">
                  <el-option
                    v-for="list in goodsAllList"
                    :key="list.id"
                    :label="list.name"
                    :value="list.id">
                    <div @click="goodsBth(list, item)">{{ list.name }}</div>
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td align="center">
              {{item.goodsModel}}
            </td>
            <td>
              <el-form-item label="" label-width="0" :prop="'goodsList.'+index+'.goodsNumber'" :rules="goodsGroupRules.goodsGroupGoodsNumber">
                <el-input-number style="width: 100%;" placeholder="0" :precision="0" :controls="false" v-model="item.goodsNumber"></el-input-number>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="" label-width="0" :prop="'goodsList.'+index+'.packageId'" :rules="goodsGroupRules.goodsGroupPackageId">
                <el-select filterable popper-class="select-div" v-model="item.packageId" placeholder="请选择">
                  <el-option
                    v-for="list in packageAllList"
                    :key="list.id"
                    :label="list.name"
                    :value="list.id">
                    <div @click="packageBth(list, item)">{{ list.name }}</div>
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td align="center">
              {{item.packageModel}}
            </td>
            <td>
              <el-form-item label="" label-width="0" :prop="'goodsList.'+index+'.packageNumber'" :rules="goodsGroupRules.goodsGroupPackageNumber">
                <el-input-number style="width: 100%;" placeholder="0" :precision="0" :controls="false" v-model="item.packageNumber"></el-input-number>
              </el-form-item>
            </td>
            <td align="center">
              {{item.remark}}
            </td>
            <td>
              <div class="el-form-item text-center">
                <el-popover
                  placement="top"
                  width="160"
                  v-model="item.visible">
                  <p style="padding:5px 0 10px;">确认删除?</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelItem(item)">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteItem(item, index)">确定</el-button>
                  </div>
                  <span class="el-icon-delete" slot="reference"></span>
                </el-popover>
              </div>
            </td>
          </tr>
        </table>
      </div>
      <div class="service">
        <div class="tableTitle">其他服务</div>
        <div class="el-form-item-checkbox">
          <el-checkbox-group v-model="form.serviceList">
            <el-checkbox v-for="o in otherList" :label="o" :key="o"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="el-form-item-control">
          <el-input type="textarea" v-model="form.otherServiceRemark" resize="none" :rows="3" style="margin-top: 15px;"></el-input>
        </div>
      </div>
      <div class="remark" style="overflow: hidden; padding-bottom: 50px;">
        <div class="tableTitle">备注</div>
        <div class="el-form-item-checkbox">
          <el-checkbox-group v-model="form.sendRemarkTypeList">
            <el-checkbox v-for="o in remarkList" :label="o" :key="o"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="el-form-item-control">
          <el-input type="textarea" v-model="form.sendRemark" resize="none" :rows="3" style="margin-top: 15px; height: 50px;"></el-input>
        </div>
      </div>
      <div class="footerBox">
        <el-button type="primary" :loading="minloading" @click="createData">保存</el-button>
        <el-button type="primary" v-if="form.state===2" :loading="minloading" @click="createCheck">审核</el-button>
        <el-button type="primary" v-if="form.state===2" :loading="minloading" @click="cancelData">退回</el-button>
      </div>
    </el-form>
    <el-dialog title="审核退回" width="500px" class="cancelDialog check" :visible.sync="returnVisible">
      <el-form :rules="returnRules" ref="dataForm" :model="temp" inline label-position="left" label-width="0" style="margin-left:20px;">
        <el-form-item label="" prop="type">
          <el-radio-group v-model="temp.type" @change="typeBth">
            <el-radio v-for="item in dataList" :label="item" :key="item">{{item}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" prop="remark" style="width: 89%; margin-bottom: 0px;">
          <el-input type="textarea" resize="none" v-model="temp.remark" width="400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="returnVisible = false">取 消</el-button>
        <el-button type="primary" @click="createReturn">确 定</el-button>
      </div>
    </el-dialog>
    <goods-dialog ref="dialog" :dialog-status="dialogStatus" :is-id="form.shipperId" :is-active="dialogVisible" @updateList="handleUpdate" @toggleClick="dialogToggle"></goods-dialog>
  </div>
</template>

<script>
import { isInArray } from '@/utils'
import { goodsAll, packageAll, addObj, getObj, setLogisticsOrderStatus } from '@/api/goods/goods'
import { getShipperSearch } from '@/api/shipper/index'
import GoodsDialog from './components/GoodsDialog'

var defaultForm = {
  // platform: 3,
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
  sendRemark: '' // 备注
}

export default {
  name: 'releaseEdit',
  components: {
    GoodsDialog
  },
  data() {
    const checkCode = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('数量必须大于0 '))
      } else {
        callback()
      }
    }
    return {
      url: '',
      remarkList: ['危险品', '防潮', '防火', '防撞'],
      checkedBox: ['防潮', '防火'],
      remark: '测试',
      otherList: ['装卸服务', '吊车服务', '仓储服务', '包装服务'],
      // otherList: ['装卸服务', '吊车服务', '仓储服务', '包装服务'],
      checkedOther: ['装卸服务'],
      otherRemark: '这个要求可以有',
      loading: false,
      minloading: false,
      dialogVisible: false,
      returnVisible: false,
      dataList: ['信息杂乱，不符合要求', '信息内容与实际比匹配', '其他'],
      options: [], // 代发客户
      wareOptions: [], // 仓库
      companyOptions: [], // 单位
      goodsAllList: [], // 货物名称列表
      packageAllList: [], // 包装物列表
      postInfo: {}, // 发货信息
      reciveInfo: {}, // 收货信息
      dialogStatus: '',
      temp: {
        type: '',
        remark: ''
      },
      returnRules: {
        type: [{ required: true, message: '请至少选择一个类型', trigger: 'change' }],
        remark: [
          { required: false, message: '备注不能为空', trigger: 'blur' },
          { min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur' }
        ]
      },
      form: JSON.parse(JSON.stringify(defaultForm)),
      rules: {
        shipperId: [
          { required: true, message: '请选择货主', trigger: 'change' }
        ],
        postDepartureTime: [
          { required: true, message: '请选择发车时间', trigger: 'change' }
        ],
        reciveDepartureTime: [
          { required: true, message: '请选择到货时间', trigger: 'change' }
        ]
      },
      goodsGroupRules: {
        goodsGroupGoodsId: [
          { required: true, message: '请选择货物名称', trigger: 'change' }
        ],
        goodsGroupGoodsNumber: [
          { required: true, message: '请填写货物数量', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ],
        goodsGroupPackageId: [
          { required: true, message: '请选择包装物', trigger: 'change' }
        ],
        goodsGroupPackageNumber: [
          { required: true, message: '请填写包装数量', trigger: 'blur' },
          { validator: checkCode, trigger: 'blur' }
        ]
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.url = from
    })
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods: {
    // 原因点击
    typeBth(val) {
      // const val = this.temp.type
      this.$nextTick(() => {
        // const type = Object.assign([], val)
        if (val === '其他') {
          this.returnRules.remark[0].required = true
        } else {
          this.returnRules.remark[0].required = false
          this.$refs['dataForm'].validateField('remark')
        }
      })
    },
    resetTemp() {
      this.temp = {
        type: [],
        remark: ''
      }
    },
    // 审核退回
    cancelData() {
      this.resetTemp()
      this.returnVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createCheck() {
      this.$confirm('是否继续?', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        setLogisticsOrderStatus(this.$route.query.id, { msg: '', status: 5 }).then(() => {
          this.$notify({
            title: '成功',
            message: '审核成功',
            type: 'success',
            duration: 2000
          })
          let toName = this.url.name
          if (!toName) toName = 'delivery'
          this.$store.dispatch('delVisitedViews', this.$route)
          if (isInArray(this.$store.getters.cachedViews, toName)) {
            setTimeout(() => {
              this.$parent.$refs.routerview.getList()
              // this.getList()
            }, 1000)
          }
          this.$router.push({ name: toName })
        })
      }).catch(() => {
      })
    },
    createReturn() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$confirm('是否继续?', '确认退回', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            const msg = this.temp.type === '其他' ? this.temp.remark : this.temp.type
            setLogisticsOrderStatus(this.$route.query.id, { msg: msg, status: 3 }).then(() => {
              this.$notify({
                title: '成功',
                message: '退回成功',
                type: 'success',
                duration: 2000
              })
              let toName = this.url.name
              if (!toName) toName = 'delivery'
              this.$store.dispatch('delVisitedViews', this.$route)
              if (isInArray(this.$store.getters.cachedViews, toName)) {
                setTimeout(() => {
                  this.$parent.$refs.routerview.getList()
                  // this.getList()
                }, 1000)
              }
              this.$router.push({ name: toName })
            })
          }).catch(() => {
          })
        }
      })
    },
    fetchData(id) {
      getObj(id).then(response => {
        this.form = response.data
        this.form.sendRemarkTypeList = this.form.sendRemarkTypeList || []
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
        this.form.serviceList = this.form.serviceList.map((item) => {
          return item.name
        })
        this.getData(this.form.shipperId)
      })
    },
    packageBth(res, item) {
      item.packageModel = res.model
      item.packageName = res.name
      item.remark = res.remark
    },
    goodsBth(res, item) {
      item.goodsModel = res.model
      item.goodsName = res.name
    },
    // 新建保存
    createData() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.form.postWareId) {
            this.$message.error('请选择发货单位')
            return
          }
          if (!this.form.reciveWareId) {
            this.$message.error('请选择收货单位')
            return
          }
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          const postHttp = JSON.parse(JSON.stringify(this.form))
          postHttp.serviceList = postHttp.serviceList.map((item) => {
            return { name: item }
          })
          delete postHttp['crtHost']
          delete postHttp['crtName']
          delete postHttp['crtTime']
          delete postHttp['crtUser']
          delete postHttp['delFlag']
          delete postHttp['delTime']
          delete postHttp['goodsNames']
          delete postHttp['lineDistance']
          delete postHttp['lineDriverPrice']
          delete postHttp['lineId']
          delete postHttp['lineShipperPrice']
          delete postHttp['lineUnitName']
          delete postHttp['orderCode']
          delete postHttp['payType']
          delete postHttp['postCompanyId']
          delete postHttp['reciveCompanyId']
          delete postHttp['updName']
          delete postHttp['updTime']
          delete postHttp['updUser']
          delete postHttp['state']
          delete postHttp['stateMsg']
          delete postHttp['shipper']
          delete postHttp['serviceNames']
          delete postHttp['sendRemarkType']
          // delete postHttp['remark']
          this.minloading = true
          addObj(postHttp).then(() => {
            // this.list.unshift(this.temp)
            // this.getList()
            this.minloading = false
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
            let toName = this.url.name
            if (!toName) toName = 'delivery'
            this.$store.dispatch('delVisitedViews', this.$route)
            if (isInArray(this.$store.getters.cachedViews, toName)) {
              setTimeout(() => {
                this.$parent.$refs.routerview.getList()
                // this.getList()
              }, 1000)
            }
            this.$router.push({ name: toName })
          }).catch(() => {
            this.minloading = false
          })
        }
      })
    },
    // 更新
    handleUpdate(res) {
      if (this.dialogStatus === 'post') {
        this.postInfo = res
        this.form.postWareId = res.id
      } else {
        this.reciveInfo = res
        this.form.reciveWareId = res.id
      }
    },
    // 发货信息dialog
    handleClick(res) {
      this.dialogVisible = true
      this.dialogStatus = res
      this.$nextTick(() => (this.$refs.dialog.getList()))
    },
    // 关闭dialog
    dialogToggle() {
      this.dialogVisible = false
    },
    cancelItem(item) {
      item.visible = !item.visible
    },
    // 货物信息删除操作
    deleteItem(item, index) {
      this.cancelItem(item)
      if (this.form.goodsList.length === 1) {
        this.$message.error('最后一条不能删除')
        return
      }
      this.form.goodsList.splice(index, 1)
    },
    // 新增货物列表
    addItem() {
      const arr = { goodsId: '', goodsModel: '', goodsName: '', goodsNumber: undefined, packageId: '', packageModel: '', packageName: '', packageNumber: undefined, remark: '' }
      this.form.goodsList.push(arr)
    },
    // 搜索货主单位
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          getShipperSearch({ name: query }).then(response => {
            this.loading = false
            this.options = response.data.map(item => {
              return { value: item.id, label: item.name }
            })
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getData(val) {
      goodsAll({ shipperId: val, platform: 2 }).then(response => {
        this.goodsAllList = response.data
      })
      packageAll({ shipperId: val, platform: 2 }).then(response => {
        this.packageAllList = response.data
      })
    },
    onChange(val) {
      this.postInfo = {}
      this.reciveInfo = {}
      this.form.postDepartureTime = ''
      this.form.reciveDepartureTime = ''
      this.form.goodsList = JSON.parse(JSON.stringify(defaultForm)).goodsList
      this.$refs['form'].clearValidate()
      this.getData(val)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.check__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
.table-border.listTable {
  td {
    padding: 0px !important;
  }
  th {
    text-align: center !important;
  }
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
</style>
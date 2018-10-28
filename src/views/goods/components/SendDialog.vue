<template>
  <el-dialog title="货物配载" width="1000px" class="historyDialog" :visible.sync="isActive" :before-close="dialogClose">
    <div class="select-label">
      <div>货物运量</div>
      <div class="source">
        <el-tag
          class="goods"
          :key="tag.id"
          v-for="tag in goodsList"
          :disable-transitions="false">
          <div>货物名称：{{tag.goodsName}}</div>
          <div>数量：{{tag.goodsNumber}}{{lineUnitName}}  剩余{{tag.leftGoodsNumber}}{{lineUnitName}}</div>
        </el-tag>
      </div>
    </div>
    <el-table
      ref="singleTable"
      :data="gridList"
      class="stowage dispatch"
      highlight-current-row
      height="300"
      @selection-change="handleCurrentChangeRow"
      stripe
      fit
      tooltip-effect="dark"
      border
      style="width: 100%;margin-top: 0;">
      <el-table-column
        type="selection"
        width="42">
      </el-table-column>
      <el-table-column
        label="车辆信息"
        align="left"
        width="160">
        <template slot-scope="scope">
          <div>车牌号： {{scope.row.trackPlatNumber}}</div>
          <div>车主： 13588772620 &nbsp; {{scope.row.ownerName}}</div>
          <div>车辆： {{scope.row.brandName}}9.6米 &nbsp; {{scope.row.loadWeight}}吨</div>
        </template>
      </el-table-column>
      <el-table-column
        property="detailAddress"
        label="运输货源">
        <template slot-scope="scope">
          <el-tag
            class="goods"
            :key="tag.id"
            @close="handleClose(scope.row, tag)"
            v-for="tag in scope.row.goodsList"
            :disable-transitions="false">
            <div>
              {{tag.goodsName}}<br>
              <el-input-number v-model="tag.haveGoodsNumber" :max="1000" :controls="false" :precision="0" :min="0"></el-input-number>
            </div>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
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
            <span v-for="(item, index) in form.service" :key="item.id">{{item.name}}费：<el-input-number style="width: 80px;border-bottom: 1px solid #dcdfe6;" placeholder="0" :precision="0" :min="0" :max="1000" :controls="false" v-model="item.price"></el-input-number>元 &nbsp; &nbsp;</span>
          </td>
        </tr>
        <tr>
          <th>备注：</th>
          <td colspan="5">
            <el-input style="border-bottom: 1px solid #dcdfe6;" v-model="form.remark" maxlength="50" placeholder="请输入备注"></el-input>
          </td>
        </tr>
      </table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { toChooseTruck, sendTruck } from '@/api/goods/consignment'

export default {
  name: 'SendDialog',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      total: null,
      option: [
        { id: 1, name: '类型' }
      ],
      gridList: [],
      selectList: [],
      goodsList: [],
      id: null,
      ids: [],
      form: {},
      lineUnitName: '', // 单位
      selectRow: '',
      currentRow: [] // 行ID
    }
  },
  methods: {
    // 选中行
    handleCurrentChangeRow(val) {
      this.selectList = val || []
    },
    // 关闭窗口
    dialogClose(done) {
      this.loading = false
      this.selectList = []
      this.currentRow = []
      this.gridList = []
      this.ids = []
      this.id = null
      this.lineUnitName = ''
      this.form = {}
      this.$emit('toggleClick', false)
    },
    // 选中行数据
    selectsRow(row) {
      // if (this.selectList.some(v => v.id === row.id)) return
      // this.selectList.push(row)
      this.selectList = row
    },
    // 获取表格数据
    getList() {
      toChooseTruck(this.id, this.ids).then(response => {
        this.gridList = response.data.consignmentOrderTrackList
        this.gridList.forEach((list, index) => {
          this.$set(list, 'goodsList', JSON.parse(JSON.stringify(response.data.goodsList)))
          list.goodsList.forEach((row, index) => {
            row['consignmentOrderTrackId'] = list.id
          })
          // list['goodsList'] = JSON.parse(JSON.stringify(response.data.goodsList))
        })
        this.goodsList = response.data.goodsList
        this.lineUnitName = response.data.lineUnitName
      })
    },
    // 删除标签
    handleClose(row, tag) {
      const item = this.gridList[this.gridList.indexOf(row)].goodsList
      item.splice(item.indexOf(tag), 1)
      this.gridList[this.gridList.indexOf(row)].goodsList = item
      console.log(this.gridList)
    },
    // 确定
    submit() {
      if (this.selectList.length) {
        const row = {
          orderId: this.$route.query.id,
          travelPrice: null,
          remark: '',
          sendTruckServices: [
            { price: null, serviceName: '' }
          ],
          trackGoodsList: [
            { consignmentOrderTrackId: null, goodsNumber: null }
          ]
        }
        row.orderId = this.id
        row.travelPrice = this.form.lineDriverPrice
        row.remark = this.form.remark
        row.sendTruckServices = this.form.service.map((item) => {
          return { price: item.price, serviceName: item.name }
        })
        const list = []
        this.selectList.forEach((row, index) => {
          row.goodsList.forEach((res) => {
            list.push({ goodsId: res.id, consignmentOrderTrackId: res.consignmentOrderTrackId, goodsNumber: res.haveGoodsNumber })
          })
        })
        row.trackGoodsList = list
        sendTruck(row).then(response => {
          this.$emit('updateList', this.selectList)
          this.dialogClose()
          this.$nextTick(() => (this.$emit('toggleClick', false)))
        })
      } else {
        this.$message.error('至少一条记录！')
        return
      }
    },
    // 初始化
    resetFields() {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.signTablePadding {
  padding: 3px 0;
}
</style>
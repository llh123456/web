<template>
  <div class="app-container">
    <table class="table-border identityCheck">
      <tr>
        <th>车牌号</th>
        <td>{{temp.platNumber}}</td>
        <th>状态</th>
        <td><span class="red">{{temp.authStateMsg}}</span></td>
      </tr>
      <tr>
        <th>手机账号</th>
        <td>{{temp.mobilePhone}}  {{temp.name}}</td>
        <th>所有人</th>
        <td>{{temp.ownerName}}</td>
      </tr> 
      <tr>
        <th>车辆类型</th>
        <td>{{temp.typeName}}</td>
        <th>所有人地址</th>
        <td>{{temp.ownerAddress}}</td>
      </tr>
      <tr>
        <th>品牌型号</th>
        <td>{{temp.brandName}}</td>
        <th>使用性质</th>
        <td>{{temp.userType}}</td>
      </tr>
      <tr>
        <th>车辆<br>识别代号</th>
        <td>{{temp.vinNumber}}</td>
        <th>注册日期</th>
        <td>{{temp.registerDate}}</td>
      </tr>
      <tr>
        <th>车辆总质量</th>
        <td>{{temp.weight}}</td>
        <th>核定载重量</th>
        <td>{{temp.loadWeight}}</td>
      </tr>
      <tr>
        <th>车辆大小</th>
        <td>长：{{temp.length}} 宽：{{temp.width}} 高： {{temp.height}}</td>
        <th>发证单位</th>
        <td>{{temp.issueOrg}}</td>
      </tr>
      <tr>
        <th>最新<br>年审日期</th>
        <td>{{temp.lastAnnualTrialDate}}</td>
        <th>强制<br>报废日期</th>
        <td>{{temp.forciblyDiscardedDate}}</td>
      </tr>
      <tr>
        <th>提交时间</th>
        <td colspan="3">{{temp.auditSubmitTime}}</td>
      </tr>
      <tr>
        <th>行驶证</th>
        <td colspan="3">
          <div class="item">
            <dt>行驶证正面</dt>
            <img v-if="temp.drivingLicenseFaceIamgeUrl" :src="temp.drivingLicenseFaceIamgeUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
          <div class="item">
            <dt>行驶证副卡</dt>
            <img v-if="temp.drivingLicenseBackIamgeUrl" :src="temp.drivingLicenseBackIamgeUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
        </td>
      </tr>
      <tr>
        <th>车辆照</th>
        <td colspan="3">
          <div class="item">
            <dt>车辆正面照</dt>
            <img v-if="temp.trackIamgeHead" :src="temp.trackIamgeHead" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
          <div class="item">
            <dt>车辆侧面照</dt>
            <img v-if="temp.trackIamgeBody" :src="temp.trackIamgeBody" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
          <div class="item">
            <dt>车尾照</dt>
            <img v-if="temp.trackIamgeTail" :src="temp.trackIamgeTail" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
        </td>
      </tr>
    </table>
    <table class="table-border identityCheck" style="margin-top: 20px; display: none;">
      <tr>
        <th>车主姓名</th>
        <td></td>
        <th>状态</th>
        <td></td>
      </tr>
      <tr>
        <th>手机账号</th>
        <td></td>
        <th>身份证号</th>
        <td></td>
      </tr>
      <tr>
        <th>地址</th>
        <td colspan="3"></td>
      </tr>
      <tr>
        <th>企业</th>
        <td></td>
        <th>状态</th>
        <td></td>
      </tr>
      <tr>
        <th>法定代表</th>
        <td></td>
        <th>注册资本</th>
        <td></td>
      </tr>
      <tr>
        <th>经营范围</th>
        <td colspan="3"></td>
      </tr>
    </table>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getObj } from '@/api/vehicle'
import BigImg from './components/BigImg.vue'

export default {
  name: 'vehicleDetails',
  directives: {
    waves
  },
  components: {
    BigImg
  },
  data() {
    return {
      showImg: false,
      temp: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      getObj({ trackId: this.$route.query.id }).then(response => {
        this.temp = response.data
      })
    },
    // 图片
    clickImg(e) {
      this.showImg = true
      this.imgSrc = e.currentTarget.src
    },
    viewImg() {
      this.showImg = false
      this.imgSrc = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .identityCheck {
    &.table-border {
      td, th {
        padding: 10px 13px !important;
      }
      th {
        width: 100px;
        text-align: left;
      }
      .red {
        color: red;
      }
    }
    .item {
      display: inline-block;
      &+.item {
        margin-left: 35px;
      }
      dt {
        text-align: center;
        padding: 4px 0;
      }
      img {
        border:#e4e7ed 1px solid;
        cursor: pointer;
      }
    }
  }
</style>
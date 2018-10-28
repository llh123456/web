<template>
  <div class="app-container identityDetails">
    <table class="table-border identityCheck">
      <tr>
        <th>手机账号</th>
        <td>{{temp.mobilePhone}}</td>
        <th>状态</th>
        <td><span class="red">{{temp.authState}}</span></td>
      </tr>
      <tr>
        <th>驾驶员姓名</th>
        <td>{{temp.name}}</td>
        <th>性别</th>
        <td>{{temp.sex}}</td>
      </tr>
      <tr>
        <th>手机号码</th>
        <td>{{temp.cellphone}}</td>
        <th>地址</th>
        <td>{{temp.auditSubmitAddress}}</td>
      </tr>
      <tr>
        <th>证号</th>
        <td>{{temp.driverLicenseNumber}}</td>
        <th>准驾车型</th>
        <td>{{temp.quasiDrivingModel}}</td>
      </tr>
      <tr>
        <th>有效期</th>
        <td>{{temp.validityBeginDate}} - {{temp.validityEndDate}}</td>
        <th>提交时间</th>
        <td>{{temp.crtTime}}</td>
      </tr>
      <tr>
        <th>认证照片</th>
        <td colspan="3">
          <div class="item">
            <dt>驾驶证正面</dt>
            <img v-if="temp.driverLicenseFaceIamgeUrl" :src="temp.driverLicenseFaceIamgeUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
          <div class="item">
            <dt>驾驶证副页</dt>
            <img v-if="temp.driverLicenseBackIamgeUrl" :src="temp.driverLicenseBackIamgeUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
          <div class="item">
            <dt>驾驶员照片</dt>
            <img v-if="temp.headIamge" :src="temp.headIamge" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
        </td>
      </tr>
    </table>
    <table v-if="false" class="table-border identityCheck" style="margin-top: 20px;">
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
        <th>车辆信息</th>
        <td colspan="3">
          <span class="link-type">浙GB2323</span>
          <span class="link-type">浙GB9888</span>
        </td>
      </tr>
    </table>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { getObj } from '@/api/driver'
import BigImg from './components/BigImg.vue'

export default {
  name: 'driverDetails',
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
      getObj({ driverId: this.$route.query.id }).then(response => {
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
    table-layout:fixed;
    &.table-border {
      td, th {
        padding: 10px 13px !important;
      }
      th {
        width: 100px;
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
  .identityDetails {
    .info {
      padding: 15px 25px;
      background-color: #edf2f8;
      img {
        border:#e4e7ed 1px solid;
        cursor: pointer;
        float: left;
        margin-right: 20px;
      }
      ul,ol {
        list-style: none;
        padding: 0;
        margin: 0;
      }
      ul li {
        font-size: 14px;
        line-height: 25px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        span {
          width: 105px;
          display: inline-block;
          color: #333333;
        }
      }
    }
    .el-row {
      margin-bottom: 20px;
    }
  }
</style>
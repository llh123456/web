<template>
  <div class="app-container identityDetails">
    <el-row>
      <el-col :span="24">
        <div class="info">
          <img v-if="temp.headImageUrl" :src="user.headImageUrl" @click="clickImg($event)" width="130" style="min-height: 120px;">
          <img v-else src="../../../static/images/none_icon.png" width="130">
          <ul>
            <li><span>手机账号</span><strong>{{user.mobilePhone}}</strong></li>
            <li><span>微信ID</span><strong>{{user.weixin}}</strong></li>
            <li><span>昵称</span><strong>---</strong></li>
            <li><span>注册时间</span><strong>{{user.registerTime}}</strong></li>
            <li><span>最新登录时间</span><strong>{{user.lastLoginTime}}</strong></li>
          </ul>
        </div>
      </el-col>
      <el-col :span="14" style="display: none;">
        <table class="table-border center">
          <tr>
            <th>注册产品</th>
            <th>注册时间</th>
            <th>最新登录时间</th>
            <th>登录次数</th>
          </tr>
          <tr>
            <td>车主产品</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>货主产品</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </el-col>
    </el-row>
    <table class="table-border identityCheck">
      <tr>
        <th>手机账号</th>
        <td>{{user.mobilePhone}}</td>
        <th>状态</th>
        <td><span class="red">{{user.trackerOwnerIdentity.authStateMsg}}</span></td>
      </tr>
      <tr>
        <th>姓名</th>
        <td>{{user.trackerOwnerIdentity.realName}}</td>
        <th>性别</th>
        <td>
          <span v-if="user.trackerOwnerIdentity.sex === 1">男</span>
          <span v-else>女</span>
        </td>
      </tr>
      <tr>
        <th>身份证号</th>
        <td>{{user.trackerOwnerIdentity.idcardNo}}</td>
        <th>地址</th>
        <td>{{user.trackerOwnerIdentity.idcardAddress}}</td>
      </tr>
      <tr>
        <th>提交时间</th>
        <td colspan="3">{{user.trackerOwnerIdentity.authSubmitTime}}</td>
      </tr>
      <tr>
        <th>认证照片</th>
        <td colspan="3">
          <div class="item">
            <dt>身份证正面</dt>
            <img v-if="user.trackerOwnerIdentity.idcardBackImageUrl" :src="user.trackerOwnerIdentity.idcardBackImageUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
            <!--<img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">-->
          </div>
          <div class="item">
            <dt>身份证反面</dt>
            <img v-if="user.trackerOwnerIdentity.idcardFaceImageUrl" :src="user.trackerOwnerIdentity.idcardFaceImageUrl" @click="clickImg($event)" width="120">
            <img v-else src="../../../static/images/none_icon.png" width="120">
          </div>
        </td>
      </tr>
    </table>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import { fetchIdentityDetail } from '@/api/check'
import { getObj } from '@/api/cz'
import BigImg from './components/BigImg.vue'

export default {
  name: 'identityDetails',
  directives: {
    waves
  },
  components: {
    BigImg
  },
  data() {
    return {
      showImg: false,
      temp: {},
      user: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      fetchIdentityDetail({ identityId: this.$route.query.id }).then(response => {
        this.temp = response.data
        getObj({ trackerOwnerId: response.data.trackOwnerId }).then(response => {
          this.user = response.data
        })
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
<template>
  <div class="app-container czDetails">
    <el-row>
      <el-col :span="24">
        <div class="info">
          <img v-if="temp.headImageUrl" :src="temp.headImageUrl" @click="clickImg($event)" width="130" style="min-height: 120px;">
          <img v-else src="../../../static/images/none_icon.png" width="130">
          <ul>
            <li><span>手机账号</span><strong>{{temp.mobilePhone}}</strong></li>
            <li><span>微信ID</span><strong>{{temp.weixin}}</strong></li>
            <li><span>昵称</span><strong>---</strong></li>
            <li><span>注册时间</span><strong>{{temp.registerTime}}</strong></li>
            <li><span>最新登录时间</span><strong>{{temp.lastLoginTime}}</strong></li>
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
    <el-tabs type="card" @tab-click="handleClick">
      <el-tab-pane label="实名认证">
        <table class="table-border czCheck">
          <tr>
            <th>手机账号</th>
            <td>{{temp.mobilePhone}}</td>
            <th>状态</th>
            <td><span class="red">{{temp.trackerOwnerIdentity.authStateMsg}}</span></td>
          </tr>
          <tr>
            <th>姓名</th>
            <td>{{temp.trackerOwnerIdentity.realName}}</td>
            <th>性别</th>
            <td>
              <span v-if="temp.trackerOwnerIdentity.sex === 1">男</span>
              <span v-else>女</span>
            </td>
          </tr>
          <tr>
            <th>身份证号</th>
            <td>{{temp.trackerOwnerIdentity.idcardNo}}</td>
            <th>地址</th>
            <td>{{temp.trackerOwnerIdentity.idcardAddress}}</td>
          </tr>
          <tr>
            <th>提交时间</th>
            <td colspan="3">{{temp.trackerOwnerIdentity.authSubmitTime}}</td>
          </tr>
          <tr>
            <th>认证照片</th>
            <td colspan="3">
              <div class="item">
                <dt>身份证正面</dt>
                <img v-if="temp.trackerOwnerIdentity.idcardBackImageUrl" :src="temp.trackerOwnerIdentity.idcardBackImageUrl" @click="clickImg($event)" width="120">
                <img v-else src="../../../static/images/none_icon.png" width="120">
                <!--<img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">-->
              </div>
              <div class="item">
                <dt>身份证反面</dt>
                <img v-if="temp.trackerOwnerIdentity.idcardFaceImageUrl" :src="temp.trackerOwnerIdentity.idcardFaceImageUrl" @click="clickImg($event)" width="120">
                <img v-else src="../../../static/images/none_icon.png" width="120">
              </div>
              <!--<div class="item">
                <dt>大头照片</dt>
                <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
              </div>-->
            </td>
          </tr>
        </table>
      </el-tab-pane>
      <el-tab-pane label="车辆">
        <el-table :data="temp.trackList" v-loading="listLoading" stripe border fit highlight-current-row
          style="width: 100%;">
          <el-table-column min-width="100px" align="center" label="车牌号码">
            <template slot-scope="scope">
              <span>{{scope.row.platNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="车辆类型">
            <template slot-scope="scope">
              <span>{{scope.row.typeName}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="品牌型号">
            <template slot-scope="scope">
              <span>{{scope.row.brandName}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="所有人">
            <template slot-scope="scope">
              <span>{{scope.row.ownerName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="95">
            <template slot-scope="scope">
              <span v-if="scope.row.authStateMsg" style="color: red;">{{scope.row.authStateMsg}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="110">
            <template slot-scope="scope">
              <span class="link-type" @click="$router.push({ name: 'vehicleDetails', query: { id: scope.row.id }})">详情</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="驾驶员">
        <el-table :data="temp.driverList" v-loading="listLoading" stripe border fit highlight-current-row
          style="width: 100%;">
          <el-table-column min-width="100px" align="center" label="驾驶员">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="手机号码">
            <template slot-scope="scope">
              <span>{{scope.row.cellphone}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="证号">
            <template slot-scope="scope">
              <span>{{scope.row.driverLicenseNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="准驾车型">
            <template slot-scope="scope">
              <span>{{scope.row.quasiDrivingModel}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100px" align="center" label="有效期">
            <template slot-scope="scope">
              <span>{{scope.row.validityBeginDate}} - {{scope.row.validityEndDate}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态" width="95">
            <template slot-scope="scope">
              <span v-if="scope.row.authState" style="color: red;">{{scope.row.authState}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="110">
            <template slot-scope="scope">
              <span class="link-type" @click="$router.push({ name: 'driverDetails', query: { id: scope.row.id }})">详情</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
  </div>
</template>

<script>
import { getObj } from '@/api/cz'
import waves from '@/directive/waves' // 水波纹指令
import BigImg from '../check/components/BigImg.vue'

export default {
  name: 'czDetails',
  directives: {
    waves
  },
  components: {
    BigImg
  },
  data() {
    return {
      listLoading: false,
      showImg: false,
      list: null,
      temp: {
        trackerOwnerIdentity: {},
        trackList: [],
        driverList: []
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 获取数据
    getData() {
      getObj({ trackerOwnerId: this.$route.query.id }).then(response => {
        this.temp = response.data
      })
    },
    // Tabs 选中
    handleClick(tab, event) {
      // console.log(tab.label)
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
  .czCheck {
    &.table-border {
      table-layout:fixed;
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
  .czDetails {
    .table-border {
      table-layout:fixed;
    }
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
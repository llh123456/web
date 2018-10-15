<template>
  <el-card class="box-card" style="height:100%">
    <div slot="header" class="clearfix">
      <span>组织相关</span>
    </div>
    <div v-if="!!isId">
      <div class="introduce">
        <table class="table-border">
          <tbody>
            <tr>
              <th>组织机构代码:</th><td>{{items.orgCode}}</td><th>单位名称:</th><td>{{items.name}}</td><th>联系人:</th><td>{{items.legalPerson}}</td>
            </tr>
            <tr>
              <th>手机号码:</th><td>{{items.mobilePhone}}</td><th>联系地址:</th><td colspan="3">{{items.address}}</td>
            </tr>
            <tr>
              <th>创建人:</th><td>{{items.crtName}}</td><th>创建时间:</th><td colspan="3">{{items.crtTime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="部门管理" name="first">
          <department-info v-if="activeName === 'first' && isRefresh" :is-id="isId"></department-info>
        </el-tab-pane>
        <el-tab-pane label="角色管理" name="second">
          <group-info v-if="activeName === 'second' && isRefresh" :is-id="isId"></group-info>
        </el-tab-pane>
        <el-tab-pane label="用户管理" name="third">
          <staff-info v-if="activeName === 'third' && isRefresh" :is-id="isId"></staff-info>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import { getDetailObj } from '@/api/shipper/index'
import DepartmentInfo from './department'
import GroupInfo from './group'
import StaffInfo from './staff'

export default {
  props: {
    isId: {
      default: ''
    },
    isRefresh: {
      type: Boolean,
      default: true
    }
  },
  components: {
    DepartmentInfo,
    GroupInfo,
    StaffInfo
  },
  data() {
    return {
      activeName: 'first',
      items: {}
    }
  },
  watch: {
    'isId': {
      handler: function(val, oldVal) {
        if (val) {
          this.init()
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      getDetailObj({ shipperId: this.isId }).then(response => {
        this.items = response.data
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .introduce {
    padding: 10px 10px 5px;
    margin-bottom: 10px;
    border: 1px solid #e4e7ed;
    background-color: #f5f7fb;
    .table-border {
      table-layout:fixed;
      border: 0 !important;
      th {
        width: 130px;
        text-align: right;
        font-weight: 500;
        border: 0 !important;
        background-color: #f5f7fb !important;
      }
      td {
        border: 0 !important;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 6px 10px 6px 0px !important;
      }
    }
  }
</style>
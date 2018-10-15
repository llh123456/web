<template>
  <div class="app-container">
  <el-tabs type="border-card">
    <el-tab-pane>
      <span slot="label">身份查询</span>
      <div class="filter-container">
        <el-input v-model="identity.a1" style="width: 150px;"  class="filter-item" placeholder="账号"></el-input>
        <el-input v-model="identity.a2" style="width: 150px;" class="filter-item" placeholder="姓名"></el-input>
        <el-input v-model="identity.a3" style="width: 200px;" class="filter-item" placeholder="企业名称"></el-input>
        <el-button class="filter-item" :loading="identityLoading" @click="identityBth" type="primary">搜索</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="车辆查询">
      <div class="filter-container">
        <el-input v-model="vehicle.a1" style="width: 150px;" class="filter-item" placeholder="车牌号"></el-input>
        <el-input v-model="vehicle.a2" style="width: 150px;" class="filter-item" placeholder="账号"></el-input>
        <el-input v-model="vehicle.a3" style="width: 200px;" class="filter-item" placeholder="企业名称"></el-input>
        <el-button class="filter-item" :loading="vehicleLoading" @click="vehicleBth" type="primary">搜索</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="驾驶员查询">
      <div class="filter-container">
        <el-input style="width: 200px;" v-model="driver.a1" class="filter-item" placeholder="证号"></el-input>
        <el-input style="width: 150px;" v-model="driver.a2" class="filter-item" placeholder="驾驶员姓名"></el-input>
        <el-button class="filter-item" :loading="driverLoading" @click="driverBth" type="primary">搜索</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>

export default {
  name: 'authenticate',
  data() {
    return {
      identityLoading: false,
      vehicleLoading: false,
      driverLoading: false,
      identity: {
        a1: '',
        a2: '',
        a3: ''
      },
      vehicle: {
        a1: '',
        a2: '',
        a3: ''
      },
      driver: {
        a1: '',
        a2: ''
      }
    }
  },
  methods: {
    // 身份搜索
    identityBth() {
      // this.identityLoading = true
    },
    // 车辆搜索
    vehicleBth() {
      // this.vehicleLoading = true
    },
    // 驾驶员搜索
    driverBth() {
      // this.driverLoading = true
    }
  }
}
</script>

<style>
</style>
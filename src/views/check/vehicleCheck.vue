<template>
  <div class="app-container">
    <table class="table-border identityCheck">
      <tr>
        <th>车牌号</th>
        <td>浙GB3398</td>
        <th>状态</th>
        <td><span class="red">等待审核</span></td>
      </tr>
      <tr>
        <th>手机账号</th>
        <td>13588772620  张三</td>
        <th>所有人</th>
        <td></td>
      </tr> 
      <tr>
        <th>车辆类型</th>
        <td></td>
        <th>所有人地址</th>
        <td></td>
      </tr>
      <tr>
        <th>品牌型号</th>
        <td></td>
        <th>使用性质</th>
        <td></td>
      </tr>
      <tr>
        <th>车辆<br>识别代号</th>
        <td></td>
        <th>注册日期</th>
        <td></td>
      </tr>
      <tr>
        <th>车辆总质量</th>
        <td></td>
        <th>核定载重量</th>
        <td></td>
      </tr>
      <tr>
        <th>车辆大小</th>
        <td>长： 宽： 高： </td>
        <th>发证单位</th>
        <td></td>
      </tr>
      <tr>
        <th>最新<br>年审日期</th>
        <td></td>
        <th>强制<br>报废日期</th>
        <td></td>
      </tr>
      <tr>
        <th>提交时间</th>
        <td colspan="3"></td>
      </tr>
      <tr>
        <th>行驶证</th>
        <td colspan="3">
          <div class="item">
            <dt>行驶证正面</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
          <div class="item">
            <dt>行驶证副卡</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
        </td>
      </tr>
      <tr>
        <th>车辆照</th>
        <td colspan="3">
          <div class="item">
            <dt>车辆正面照</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
          <div class="item">
            <dt>车辆侧面照</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
          <div class="item">
            <dt>车尾照</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
        </td>
      </tr>
    </table>
    <div class="footerBox">
      <el-button type="primary" :loading="loading" @click="saveData">审核通过</el-button>
      <el-button type="primary" :loading="cancelLoading" @click="cancelData">审核不通过</el-button>
    </div>
    <big-img v-if="showImg" @clickit="viewImg" :imgSrc="imgSrc"></big-img>
    <el-dialog title="审核不通过" width="480px" class="cancelDialog" :visible.sync="dialogVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" inline label-position="left" label-width="0" style="margin-left:20px;">
        <el-form-item label="" prop="type">
          <el-checkbox-group v-model="temp.type" @change="typeBth">
            <el-checkbox style="width: 180px;" v-for="item in dataList" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="" prop="remark" style="width: 89%; margin-bottom: 0px;">
          <el-input type="textarea" resize="none" v-model="temp.remark" width="400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="createData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import BigImg from './components/BigImg.vue'

export default {
  name: 'vehicleCheck',
  directives: {
    waves
  },
  components: {
    BigImg
  },
  data() {
    return {
      loading: false,
      cancelLoading: false,
      showImg: false,
      dialogVisible: false,
      dataList: ['行驶证正面不清晰', '行驶证副卡不清晰', '车辆照片模糊', '挂车行驶证正面不清晰', '挂车行驶证副卡不清晰', '其他'],
      temp: {
        type: [],
        remark: ''
      },
      rules: {
        type: [{ type: 'array', required: true, message: '请至少选择一个类型', trigger: 'change' }],
        remark: [
          { required: false, message: '备注不能为空', trigger: 'blur' },
          { min: 2, max: 60, message: '长度在 2 到 60 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 原因点击
    typeBth(val) {
      // const val = this.temp.type
      this.$nextTick(() => {
        const type = Object.assign([], val)
        if (type.pop() === '其他') {
          this.temp.type = []
          this.temp.type[0] = '其他'
          this.rules.remark[0].required = true
        } else {
          const index = this.temp.type.indexOf('其他')
          if (index !== -1) {
            this.temp.type.splice(index, 1)
          }
          this.rules.remark[0].required = false
          this.$refs['dataForm'].validateField('remark')
        }
      })
    },
    // 审核通过
    saveData() {
      // this.loading = true
      this.$confirm('确定用户 张三  13588772989 的车辆为审核通过?', '审核通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '审核成功',
          type: 'success',
          duration: 2000
        })
        // this.loading = false
      }).catch(() => {
      })
    },
    resetTemp() {
      this.temp = {
        type: [],
        remark: ''
      }
    },
    // 审核不通过
    cancelData() {
      this.resetTemp()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 审核不通过保存
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 获取数据
    getData() {
      console.log(0)
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
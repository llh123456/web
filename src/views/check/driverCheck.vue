<template>
  <div class="app-container">
    <table class="table-border identityCheck">
      <tr>
        <th>手机账号</th>
        <td>18355556666</td>
        <th>状态</th>
        <td><span class="red">等待审核</span></td>
      </tr>
      <tr>
        <th>驾驶员姓名</th>
        <td></td>
        <th>性别</th>
        <td></td>
      </tr>
      <tr>
        <th>手机号码</th>
        <td></td>
        <th>地址</th>
        <td></td>
      </tr>
      <tr>
        <th>证号</th>
        <td></td>
        <th>准驾车型</th>
        <td></td>
      </tr>
      <tr>
        <th>有效期</th>
        <td colspan="3"></td>
      </tr>
      <tr>
        <th>提交时间</th>
        <td colspan="3"></td>
      </tr>
      <tr>
        <th>认证照片</th>
        <td colspan="3">
          <div class="item">
            <dt>驾驶证正面</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
          <div class="item">
            <dt>驾驶证副页</dt>
            <img src="../../../static/images/none_icon.png" @click="clickImg($event)" width="120">
          </div>
          <div class="item">
            <dt>驾驶员照片</dt>
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
    <el-dialog title="审核不通过" width="400px" class="cancelDialog" :visible.sync="dialogVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" inline label-position="left" label-width="0" style="margin-left:20px;">
        <el-form-item label="" prop="type">
          <el-checkbox-group v-model="temp.type" @change="typeBth">
            <el-checkbox v-for="item in dataList" :label="item" :key="item">{{item}}</el-checkbox>
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
  name: 'driverCheck',
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
      dataList: ['驾驶证正面不清晰', '驾驶证副页不清晰', '驾驶员照片不清晰', '驾驶证已过期', '其他'],
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
      this.$confirm('确定用户 张三  13588772989 的驾驶员为审核通过?', '审核通过', {
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
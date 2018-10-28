<template>
  <el-dialog :title="textMap[dialogStatus]" width="900px" class="historyDialog" :visible.sync="isActive" :before-close="dialogClose">
    <div class="search">
      <el-input class="keyword" style="width: 200px;" v-model="listQuery.keyWords" placeholder="仓库名称"
                size="mini" clearable></el-input>
      <el-button type="primary" size="mini" @click="getList()">搜索</el-button>
      <!--<el-button size="mini" @click="cleared">清除</el-button>-->
    </div>
    <el-table
      ref="singleTable"
      :data="gridList"
      highlight-current-row
      @current-change="handleCurrentChange"
      height="200"
      border
      style="width: 100%"
      @row-click="selectsRow"
      @row-dblclick="submit"
    >
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <el-radio v-model="currentRow" :label="scope.$index"></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        property="name"
        label="仓库名称"
        width="150">
      </el-table-column>
      <el-table-column
        property="customerCompanyName"
        label="公司名称"
        width="150">
      </el-table-column>
      <el-table-column
        property="contactsUser"
        label="联系人">
      </el-table-column>
      <el-table-column
        property="contactsPhone"
        label="联系电话">
      </el-table-column>
      <el-table-column
        property="detailAddress"
        label="地址"
        width="180"
      >
      </el-table-column>
    </el-table>
    <div class="page">
      <div class="pagination">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChangePage"
                       :current-page="listQuery.pageNum"
                       :page-sizes="[20,30,50]" :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { selectWareByShipperIdAndName } from '@/api/base/ware'

export default {
  name: 'GoodsDialog',
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    isId: '',
    dialogStatus: ''
  },
  data() {
    return {
      loading: false,
      total: null,
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        dataNo: [],
        keyWords: ''
      },
      gridList: [],
      selectRow: '',
      currentRow: null,
      // dialogStatus: 'post',
      textMap: {
        'recive': '选择收货仓库',
        'post': '选择发货仓库'
      }
    }
  },
  methods: {
    // 关闭窗口
    dialogClose(done) {
      this.loading = false
      this.$emit('toggleClick', false)
    },
    // 选中行数据
    selectsRow(row) {
      this.selectRow = row
    },
    // redio 选中事件
    handleCurrentChange(val) {
      this.currentRow = this.gridList.indexOf(val)
    },
    // 每页显示条数
    handleSizeChange(val) {
      if (this.listQuery.pageSize === val) {
        return
      }
      this.listQuery.pageSize = val
      this.getList()
    },
    // 分页
    handleCurrentChangePage(val) {
      if (this.listQuery.pageNum === val) {
        return
      }
      this.listQuery.pageNum = val
      this.getList()
    },
    // 清除数据
    cleared() {
      this.total = null
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        dataNo: [],
        keyWords: ''
      }
    },
    // 获取表格数据
    getList() {
      const httpParams = {
        name: this.listQuery.keyWords,
        shipperId: this.isId,
        platform: 3,
        page: this.listQuery.pageNum,
        limit: this.listQuery.pageSize
      }
      selectWareByShipperIdAndName(httpParams).then(response => {
        this.gridList = response.data.rows
        this.total = response.data.total
      })
    },
    // 确定
    submit() {
      if (this.selectRow) {
        this.$emit('updateList', this.selectRow)
        this.$nextTick(() => (this.$emit('toggleClick', false)))
      } else {
        this.$message.error('请选择一条记录！')
        return
      }
      this.cleared()
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
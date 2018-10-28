<template>
  <el-dialog title="添加车辆" width="900px" class="historyDialog" :visible.sync="isActive" :before-close="dialogClose">
    <div class="search">
      <el-input class="keyword" style="width: 150px;" v-model="listQuery.keyWords" placeholder="账号"
                size="mini" clearable></el-input>
      <el-input class="keyword" style="width: 150px;" v-model="listQuery.keyWords" placeholder="车牌号码"
                size="mini" clearable></el-input>
      <el-select filterable v-model="listQuery.keyWords" size="mini" clearable placeholder="车辆类型">
        <el-option
          v-for="list in option"
          :key="list.id"
          :label="list.name"
          :value="list.id">
        </el-option>
      </el-select>     
      <el-input class="keyword" style="width: 200px;" v-model="listQuery.keyWords" placeholder="运输公司"
                size="mini" clearable></el-input>     
      <el-button type="primary" size="mini" @click="getList()">搜索</el-button>
    </div>
    <el-table
      ref="singleTable"
      :data="gridList"
      highlight-current-row
      height="200"
      border
      style="width: 100%"
      @row-click="selectsRow"
    >
      <el-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <span class="link-type">选择</span>
        </template>
      </el-table-column>
      <el-table-column
        property="platNumber"
        label="车牌号"
        width="100">
      </el-table-column>
      <el-table-column
        property="mobilePhone"
        label="车主账号"
        width="100">
      </el-table-column>
      <el-table-column
        property="name"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        property="typeName"
        label="车辆类型">
      </el-table-column>
      <el-table-column
        property="loadWeight"
        label="核定载重量"
      >
      </el-table-column>
      <el-table-column
        property="ownerName"
        label="运输公司"
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
    <div class="select-label">
      <div>已选车辆数（{{selectList.length}}）&nbsp; <span class="link-type" v-if="selectList.length" @click="onEmpty">清空</span></div>
      <div class="source">
        <el-tag
          :key="tag.id"
          v-for="tag in selectList"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag.platNumber}}
        </el-tag>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { fetchTrackPage } from '@/api/check'

export default {
  name: 'CarDialog',
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
      listQuery: {
        pageSize: 20,
        pageNum: 1,
        dataNo: [],
        keyWords: ''
      },
      option: [
        { id: 1, name: '类型' }
      ],
      gridList: [],
      selectList: [],
      selectRow: '',
      currentRow: null
    }
  },
  methods: {
    // 删除标签
    handleClose(row) {
      this.selectList.splice(this.selectList.indexOf(row), 1)
    },
    // 清空选择项
    onEmpty() {
      this.$confirm('是否继续?', '清空选择数据', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
        center: true
      }).then(() => {
        this.selectList = []
      }).catch(() => {
      })
    },
    // 关闭窗口
    dialogClose(done) {
      this.loading = false
      this.selectList = []
      this.$emit('toggleClick', false)
    },
    // 选中行数据
    selectsRow(row) {
      if (this.selectList.some(v => v.id === row.id)) return
      this.selectList.push(row)
      // this.selectRow = row
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
        keyWords: ''
      }
    },
    // 获取表格数据
    getList() {
      const httpParams = {
        name: this.listQuery.keyWords,
        // platform: 3,
        page: this.listQuery.pageNum,
        limit: this.listQuery.pageSize
      }
      fetchTrackPage(httpParams).then(response => {
        this.gridList = response.data.rows
        this.total = response.data.total
      })
    },
    // 确定
    submit() {
      if (this.selectList.length) {
        this.$emit('updateList', this.selectList)
        this.dialogClose()
        // this.$nextTick(() => (this.$emit('toggleClick', false)))
      } else {
        this.$message.error('至少一条记录！')
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
<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <!--<el-input style="width: 200px;" class="filter-item" placeholder="货主" clearable v-model.trim="listQuery.shipperId"> </el-input>-->
      <!--<el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="组织机构代码" clearable v-model.trim="listQuery.name"> </el-input>-->
      <el-input style="width: 200px;" @keyup.enter.native="handleFilter" class="filter-item" placeholder="公司名称" clearable v-model.trim="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
        <el-button class="filter-item" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @cell-dblclick="dblclick" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="货主" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.shipperName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" label="组织机构代码" width="200px">
        <template slot-scope="scope">
          <span>{{scope.row.orcNumber}}</span>
        </template>
      </el-table-column>-->
      <el-table-column width="200px" align="center" label="公司名称">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="联系人">
        <template slot-scope="scope">
          <span>{{scope.row.legalPerson}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="联系方式">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="创建人">
        <template slot-scope="scope">
          <span>{{scope.row.crtName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{scope.row.updTime}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新人">
        <template slot-scope="scope">
          <span>{{scope.row.updName}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="最后更新主机">
        <template slot-scope="scope">
          <span>{{scope.row.crtHost}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
  </div>
</template>

<script>
  import { page, delObj } from '@/api/base/customer'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'customer',
    directives: {
      waves
    },
    data() {
      return {
        list: null,
        total: null,
        loading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          shipperId: undefined,
          name: undefined
        },
        groupTypeManager_btn_edit: true,
        groupTypeManager_btn_del: true,
        groupTypeManager_btn_add: true,
        tableKey: 0,
        currentRow: [], // 行ID
        options: []
      }
    },
    created() {
      this.getList()
      // this.groupTypeManager_btn_edit = this.elements['groupTypeManager:btn_edit']
      // this.groupTypeManager_btn_del = this.elements['groupTypeManager:btn_del']
      // this.groupTypeManager_btn_add = this.elements['groupTypeManager:btn_add']
    },
    computed: {
      ...mapGetters([
        'elements'
      ]),
      // 详情按钮过滤
      detailDisabled() {
        return !(this.currentRow.length !== 0)
      }
    },
    methods: {
      // 双击
      dblclick(row) {
      },
      // 搜索货主单位
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 200)
        } else {
          this.options = []
        }
      },
      // 选中行
      handleCurrentChangeRow(val) {
        this.currentRow = val || []
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.currentRow = []
          this.list = response.data.rows
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.listLoading = false
        })
      },
      handleCreate() {
        this.$router.push({ name: 'customerAdd' })
      },
      handleUpdate() {
        this.$router.push({ name: 'customerEdit', query: { id: this.currentRow.id }})
      },
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentRow.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            const index = this.list.indexOf(this.currentRow)
            this.list.splice(index, 1)
          })
        }).catch(() => {})
      }
    }
  }
</script>
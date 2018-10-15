<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="线路名称" clearable v-model.trim="listQuery.name"> </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
      <div class="right-button">
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
        <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
        <el-button class="filter-item" v-if="groupTypeManager_btn_add" @click="handleCreate" type="primary" icon="edit">添加</el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row style="width: 100%">
      <el-table-column label="计费里程" align="center">
        <el-table-column align="center" label="发货地区及公司" width="400px">
          <template slot-scope="scope">
            <span>
              {{scope.row.postAreaProvName}}
              {{scope.row.postAreaCityName}}
              {{scope.row.postAreaName}}
              {{scope.row.postCompanyName}}
            </span>
          </template>
        </el-table-column> 
        <el-table-column align="center" label="出发厂区名称" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.postWareName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="400px" align="center" label="收货地区及公司">
          <template slot-scope="scope">
            <span>
              {{scope.row.reciverAreaProvName}}
              {{scope.row.reciverAreaCityName}}
              {{scope.row.reciverAreaName}}
              {{scope.row.reciverCompanyName}}
            </span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="到达厂区名称">
          <template slot-scope="scope">
            <span>{{scope.row.reciverWareName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="center" label="两厂距离">
          <template slot-scope="scope">
            <span>{{scope.row.distance}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="承包车主" align="center">
        <el-table-column width="150px" align="center" label="吨公里运价">
          <template slot-scope="scope">
            <span>{{scope.row.driverPrice}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="物发公司" align="center">
        <el-table-column width="150px" align="center" label="吨公里运价">
          <template slot-scope="scope">
            <span>{{scope.row.shipperPrice}}</span>
          </template>
        </el-table-column>
      </el-table-column>
      <!--<el-table-column width="200px" align="center" label="创建时间">
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
      </el-table-column>-->
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="货主" prop="shipperId">
              <el-select
                v-model.trim="form.shipperId"
                style="width:100%"
                filterable
                remote
                placeholder="货主模糊搜索"
                @change="onChange"
                :remote-method="remoteMethod"
                :loading="loading"> 
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发货仓库" prop="postWareId">
              <el-select v-model="form.postWareId" placeholder="请选择">
                <el-option
                  v-for="item in wareOptions"
                  style="width:100%"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="收货仓库" prop="reciverWareId">
              <el-select v-model="form.reciverWareId" placeholder="请选择">
                <el-option
                  v-for="item in wareOptions"
                  style="width:100%"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="两厂距离" prop="distance">
              <el-input-number placeholder="公里数" controls-position="right" v-model="form.distance" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计价单位" prop="unitId">
              <el-select v-model="form.unitId" placeholder="请选择">
                <el-option
                  v-for="item in unitList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="货主运价" prop="shipperPrice">
              <el-input-number controls-position="right" v-model="form.shipperPrice" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车主运价" prop="driverPrice">
              <el-input-number controls-position="right" v-model="form.driverPrice" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { pageAll } from '@/api/base/valuation'
  import { getShipperSearch } from '@/api/shipper/index'
  import { wareByShipperId } from '@/api/base/ware'
  import { page, addObj, getObj, delObj, putObj } from '@/api/base/line'
  import { mapGetters } from 'vuex'
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'lines',
    directives: {
      waves
    },
    data() {
      return {
        form: {
          shipperId: undefined,
          postWareId: undefined,
          reciverWareId: undefined,
          distance: undefined,
          unitId: undefined,
          shipperPrice: undefined,
          driverPrice: undefined
        },
        rules: {
          shipperId: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          postWareId: [
            { required: true, message: '请选择发货仓库', trigger: 'change' }
          ],
          reciverWareId: [
            { required: true, message: '请选择收货仓库', trigger: 'change' }
          ],
          distance: [
            { required: true, message: '请输入两厂距离', trigger: 'blur' }
          ],
          unitId: [
            { required: true, message: '请选择计价单位', trigger: 'change' }
          ],
          shipperPrice: [
            { required: true, message: '请输入货主运价', trigger: 'blur' }
          ],
          driverPrice: [
            { required: true, message: '请输入车主运价', trigger: 'blur' }
          ]
        },
        list: null,
        total: null,
        loading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        groupTypeManager_btn_edit: true,
        groupTypeManager_btn_del: true,
        groupTypeManager_btn_add: true,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0,
        currentRow: [], // 行ID
        options: [],
        unitList: [],
        wareOptions: []
      }
    },
    created() {
      this.getList()
      this.getValuation()
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
      getValuation() {
        pageAll({ platform: 2, shipperId: 1 }).then(response => {
          this.unitList = response.data
        })
      },
      // 搜索货主单位
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            getShipperSearch({ name: query }).then(response => {
              this.loading = false
              this.options = response.data.map(item => {
                return { value: item.id, label: item.name }
              })
            })
          }, 200)
        } else {
          this.options = []
        }
      },
      // 搜索仓库
      onChange(val) {
        wareByShipperId({ shipperId: val }).then(response => {
          this.wareOptions = response.data
        })
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
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate() {
        getObj(this.currentRow.id).then(response => {
          this.form = response.data
          this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
          this.onChange(this.form.shipperId)
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
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
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.dialogFormVisible = false
              this.cancel()
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      cancel(done) {
        this.dialogFormVisible = false
        this.options = []
        // this.unitList = []
        this.wareOptions = []
        this.$refs['form'].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            // this.form.password = undefined
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false
              this.cancel()
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      resetTemp() {
        this.form = {
          shipperId: undefined,
          postWareId: undefined,
          reciverWareId: undefined,
          distance: undefined,
          unitId: undefined,
          shipperPrice: undefined,
          driverPrice: undefined
        }
      }
    }
  }
</script>
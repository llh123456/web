<template>
  <div class="app-container calendar-list-container">
    <el-card>
      <div slot="header">
        <span>货主单位</span>
      </div>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="货主" prop="shipperId">
              <el-select
                v-model.trim="form.shipperId"
                filterable
                remote
                placeholder="货主模糊搜索"
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
          <el-col :span="12">
            <!--<el-form-item label="组织机构代码">
              <el-input v-model.trim="form.code" :disabled="true" placeholder=""></el-input>
            </el-form-item>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model.trim="form.name" placeholder="请输入公司名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="legalPerson">
              <el-input v-model.trim="form.legalPerson" placeholder="请输入联系人"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model.trim="form.phone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址" prop="address">
              <el-input v-model.trim="form.address" placeholder="请输入地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!--<el-form-item label="备注">
          <el-input v-model.trim="form.remark" type="textarea" resize="none" maxlength="100" :autosize="{ minRows: 3, maxRows: 5}" placeholder="最多100字"> </el-input>
        </el-form-item>-->
        <div class="dialog-footer" style="text-align: center;">
          <el-button @click="back">取 消</el-button>
          <el-button v-if="!isEdit" type="primary" @click="create('form')">确 定</el-button>
          <el-button v-else type="primary" @click="update('form')">确 定</el-button>
        </div>
      </el-form>
    </el-card>
    <el-card v-if="isEdit" style="margin-top: 30px;">
      <div slot="header">
        <span>仓库地址</span>
      </div>
      <div class="filter-container">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="仓库名称" clearable v-model.trim="listQuery.name"> </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
        <div class="right-button">
          <el-button class="filter-item" :disabled="detailDisabled" @click="handleDelete" type="danger">删除</el-button>
          <el-button class="filter-item" :disabled="detailDisabled" @click="handleUpdate" type="primary">编辑</el-button>
          <el-button class="filter-item" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>
      </div>
      <el-table :key='tableKey' :data="list" v-loading.body="listLoading" @current-change="handleCurrentChangeRow" stripe border fit highlight-current-row style="width: 100%">
        <el-table-column align="center" label="仓库名称" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.contactsUser}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="联系方式">
          <template slot-scope="scope">
            <span>{{scope.row.contactsPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="地址">
          <template slot-scope="scope">
            <span>{{scope.row.detailAddress}}</span>
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
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :before-close="cancel">
        <el-form :model="temp" :rules="rule" ref="forms" label-width="100px">
          <el-form-item label="仓库名称" prop="name">
            <el-input v-model.trim="temp.name" placeholder="请输入仓库名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contactsUser">
            <el-input v-model.trim="temp.contactsUser" placeholder="请输入联系人"></el-input>
          </el-form-item>    
          <el-form-item label="联系方式" prop="contactsPhone">
            <el-input v-model.trim="temp.contactsPhone" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="areaId">
            <el-cascader
              style="width: 300px;"
              placeholder="省市区"
              :options="areaOptions"
              @active-item-change="handleItemChange"
              v-model.trim="temp.areaId"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input v-model.trim="temp.detailAddress" placeholder=""></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button v-if="dialogStatus=='create'" type="primary" @click="createDialog('forms')">确 定</el-button>
          <el-button v-else type="primary" @click="updateDialog('forms')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
  import { getShipperSearch } from '@/api/shipper/index'
  import { getAreaByParentId } from '@/api/base/area'
  import { addObj, putObj, getObj } from '@/api/base/customer'
  import { warepage, wareaddObj, waregetObj, waredelObj, wareputObj } from '@/api/base/ware'
  import waves from '@/directive/waves' // 水波纹指令
  import { validatPhone } from '@/utils/validate'
  import { isInArray } from '@/utils'
  
  var defaultForm = {
    platform: 3,
    shipperId: undefined,
    customerCompanyId: undefined,
    name: undefined,
    legalPerson: undefined,
    phone: undefined,
    address: undefined
  }
  
  export default {
    name: 'PageDetail',
    directives: {
      waves
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const phoneCheckValidate = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入手机号码 '))
        } else if (!validatPhone(value)) {
          callback(new Error('请输入正确的手机号码 '))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        form: JSON.parse(JSON.stringify(defaultForm)),
        temp: {
          name: undefined,
          remark: undefined
        },
        props: {
          label: 'areaName',
          value: 'id',
          children: 'cities'
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        options: [],
        areaOptions: [],
        rules: {
          shipperId: [
            { required: true, message: '请选择货主', trigger: 'change' }
          ],
          name: [
            { required: true, message: '请输入公司名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          legalPerson: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ]
        },
        rule: {
          name: [
            { required: true, message: '请输入仓库名称', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          contactsUser: [
            { required: true, message: '请输入联系人', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          contactsPhone: [
            { required: true, validator: phoneCheckValidate, trigger: 'blur' }
          ],
          areaId: [
            { required: true, message: '请输选择省市区', trigger: 'change' }
          ],
          detailAddress: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ]
        },
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          customerCompanyId: this.$route.query.id
        },
        listLoading: true,
        tableKey: 0,
        currentRow: [], // 行ID
        total: null,
        list: null
      }
    },
    created() {
      const id = this.$route.query && this.$route.query.id
      if (this.isEdit && !!id) {
        this.fetchData(id)
        this.getList()
      } else {
        this.form = Object.assign({}, defaultForm)
      }
      getAreaByParentId({ platform: 3, parentId: 0, level: 1 }).then(response => {
        // console.log(response.data)
        this.areaOptions = response.data.map(item => {
          return { value: item.id, label: item.areaName, children: [] }
        })
      })
      // getAllArea().then(response => {
      //   console.log(response.data)
      // })
    },
    computed: {
      // 详情按钮过滤
      detailDisabled() {
        return !(this.currentRow.length !== 0)
      }
    },
    methods: {
      fetchData(id) {
        getObj(id).then(response => {
          this.form = response.data
          this.options = [{ value: this.form.shipperId, label: this.form.shipperName }]
        })
      },
      back() {
        this.$store.dispatch('delVisitedViews', this.$route).then((views) => {
          if (isInArray(this.$store.getters.cachedViews, 'customer')) {
            setTimeout(() => {
              this.$parent.$parent.$refs.routerview.getList()
            }, 1000)
          }
          this.$router.push({ name: 'customer' })
        })
      },
      create(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.form = JSON.parse(JSON.stringify(defaultForm))
              this.back()
            })
          } else {
            return false
          }
        })
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            putObj(this.form.id, this.form).then(() => {
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
              this.form = JSON.parse(JSON.stringify(defaultForm))
              this.back()
            })
          } else {
            return false
          }
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
        warepage(this.listQuery).then(response => {
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
        waregetObj(this.currentRow.id).then(response => {
          this.temp = response.data
          this.temp.areaId = [this.temp.provId, this.temp.cityId, this.temp.areaId]
          this.handleItemChange([this.temp.provId])
          setTimeout(() => {
            this.handleItemChange([this.temp.provId, this.temp.cityId])
          }, 1000)
          this.dialogFormVisible = true
          this.dialogStatus = 'update'
        })
      },
      createDialog(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const post = JSON.parse(JSON.stringify(this.temp))
            post.areaId = post.areaId[post.areaId.length - 1]
            wareaddObj(post).then(() => {
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
      updateDialog(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            const post = JSON.parse(JSON.stringify(this.temp))
            post.areaId = post.areaId[post.areaId.length - 1]
            wareputObj(this.temp.id, post).then(() => {
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
      handleDelete() {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          waredelObj(this.currentRow.id).then(() => {
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
      cancel(done) {
        this.dialogFormVisible = false
        this.options = []
        this.$refs['forms'].resetFields()
      },
      resetTemp() {
        this.temp = {
          platform: 3,
          shipperId: this.form.shipperId,
          customerCompanyId: this.$route.query.id,
          contactsUser: undefined,
          detailAddress: undefined,
          name: undefined,
          areaId: undefined,
          contactsPhone: undefined
        }
      },
      handleItemChange(val) {
        // const item = val[val.length - 1]
        getAreaByParentId({ platform: 3, parentId: val[val.length - 1], level: val.length + 1 }).then(response => {
          const list = response.data.map(item => {
            if (item.level === 2) {
              // return { id: { id: item.id, level: item.level }, areaName: item.areaName, cities: [] }
              return { value: item.id, label: item.areaName, children: [] }
            } else {
              // return { id: { id: item.id, level: item.level }, areaName: item.areaName }
              return { value: item.id, label: item.areaName }
            }
          })
          this.pustList(this.areaOptions, val[val.length - 1], list)
        })
      },
      pustList(arr, a, b) {
        arr.forEach((list, index) => {
          if (list.value === a) {
            list.children = b
          } else if (list.children && list.children.length) {
            this.pustList(list.children, a, b)
          }
        })
      }
    }
  }
</script>

<style>
</style>
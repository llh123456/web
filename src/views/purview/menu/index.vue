<!--suppress ALL -->
<template>
  <div class="app-container calendar-list-container">
    <div class="state-filter">
      <el-radio-group v-model="listQuery.platform" size="mini" @change="Init">
        <el-radio-button v-for="(item, index) in stateList" :key="item.vaule" :label="item.vaule">{{item.label}}</el-radio-button>
      </el-radio-group>
    </div>
    <div class="filter-container">
      <el-button-group>
        <el-button type="primary" v-if="menuManager_btn_add" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
        <el-button type="primary" v-if="menuManager_btn_edit" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
        <el-button type="primary" :disabled="currentId === -1" v-if="menuManager_btn_del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      </el-button-group>
    </div>
    <el-row :gutter="20" style='margin-top:10px;'>
      <el-col :span="8">
        <el-card class="box-card">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText">
          </el-input>
          <el-tree style="margin-top: 10px;" class="filter-tree" :data="treeData" node-key="id" :expand-on-click-node="false" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all></el-tree>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="rules">
            <el-form-item label="路径编码" prop="code">
              <el-input v-model="form.code" :disabled="formEdit" placeholder="请输入路径编码"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" :disabled="formEdit" placeholder="请输入标题"></el-input>
            </el-form-item>
            <el-form-item label="父级节点" prop="parentId">
              <el-input v-model="form.parentId" :disabled="formEdit" placeholder="请输入父级节点" readonly></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon">
              <el-input v-model="form.icon" :disabled="formEdit" placeholder="请输入图标"></el-input>
            </el-form-item>
            <el-form-item label="资源路径" prop="href">
              <el-input v-model="form.href" :disabled="formEdit" placeholder="请输入资源路径"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="type">
              <el-select class="filter-item" v-model="form.type" :disabled="formEdit" placeholder="请选择菜单类型">
                <el-option v-for="item in typeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="归属平台" prop="platform">
              <el-select class="filter-item" v-model="form.platform" :disabled="true" placeholder="请选择归属平台">
                <el-option v-for="item in platformOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="排序" prop="orderNum">-->
            <!--<el-input v-model="form.orderNum" :disabled="formEdit" placeholder="请输入排序"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="描述" prop="description">
              <el-input v-model="form.description" :disabled="formEdit" placeholder="请输入描述"></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus == 'update'">
              <el-button type="primary" @click="update('form')">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
            <el-form-item v-if="formStatus == 'create'">
              <el-button type="primary" @click="create('form')">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <span>按钮或资源</span>
          <menu-element :menuId='currentId' :platform='listQuery.platform' ref="menuElement"></menu-element>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchTree, getObj, addObj, delObj, putObj } from '@/api/menu/index'
  import { mapGetters } from 'vuex'
  export default {
    name: 'menuManager',
    components: {
      'menu-element': () =>
        import('./components/element')
    },
    data() {
      return {
        filterText: '',
        list: null,
        total: null,
        formEdit: true,
        formAdd: true,
        formStatus: '',
        showElement: false,
        typeOptions: [
          { id: 1, name: '目录' },
          { id: 2, name: '菜单' }
        ],
        platformOptions: [
          { id: 1, name: '车主端' },
          { id: 2, name: '后台平台账户' },
          { id: 3, name: '后台货主端账户' }
        ],
        stateList: [
          { label: '平台', vaule: 2 },
          { label: '货主', vaule: 3 }
        ],
        listQuery: {
          platform: 2
        },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        labelPosition: 'right',
        form: {
          code: undefined,
          title: undefined,
          parentId: undefined,
          href: undefined,
          icon: undefined,
          orderNum: undefined,
          description: undefined,
          path: undefined,
          enabled: undefined,
          type: undefined,
          attr1: undefined
        },
        rules: {
          code: [
            { required: true, message: '请输入路径编码', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          icon: [
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          href: [
            { required: true, message: '请输入资源路径', trigger: 'blur' },
            { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
          ],
          description: [
            { max: 255, message: '长度在 0 到 255 个字符', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
          ],
          platform: [
            { required: true, message: '请选择归属平台', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择菜单类型', trigger: 'change' }
          ]
        },
        currentId: -1,
        menuManager_btn_add: true,
        menuManager_btn_edit: true,
        menuManager_btn_del: true
      }
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val)
      }
    },
    created() {
      this.getList()
      // this.menuManager_btn_add = this.elements['menuManager:btn_add']
      // this.menuManager_btn_del = this.elements['menuManager:btn_del']
      // this.menuManager_btn_edit = this.elements['menuManager:btn_edit']
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        fetchTree(this.listQuery).then(response => {
          this.treeData = response.data
          this.$nextTick(() => (
            this.$refs.menuTree.setCurrentKey(this.currentId)
          ))
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.title.indexOf(value) !== -1
      },
      getNodeData(data) {
        if (!this.formEdit) {
          this.formStatus = 'update'
        }
        getObj(data.id).then(response => {
          this.form = response.data
        })
        this.currentId = data.id
        this.showElement = true
        this.$refs.menuElement.menuId = data.id
        this.$refs.menuElement.platform = this.listQuery.platform
        this.$refs.menuElement.getList()
      },
      handlerEdit() {
        if (this.form.id) {
          this.formEdit = false
          this.formStatus = 'update'
        }
      },
      handlerAdd() {
        this.resetForm()
        this.formEdit = false
        this.formStatus = 'create'
      },
      Init() {
        this.getList()
        this.currentId = -1
        this.resetForm()
        this.onCancel()
        this.$refs.menuElement.menuId = this.currentId
        this.$refs.menuElement.platform = this.listQuery.platform
        this.$refs.menuElement.getList()
      },
      handleDelete() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(this.currentId).then(() => {
            this.getList()
            this.currentId = -1
            this.resetForm()
            this.onCancel()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {})
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            putObj(this.form).then((res) => {
              this.getList()
              this.onCancel()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      create(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form).then((res) => {
              this.currentId = res.data.id
              this.getList()
              // set[formName].resetFields()
              this.onCancel()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      onCancel() {
        this.formEdit = true
        this.formStatus = ''
        this.$refs['form'].clearValidate()
      },
      resetForm() {
        this.form = {
          code: undefined,
          title: undefined,
          parentId: this.currentId,
          href: undefined,
          icon: undefined,
          orderNum: undefined,
          description: undefined,
          path: undefined,
          enabled: undefined,
          type: undefined,
          platform: this.listQuery.platform
        }
      }
    }
  }
</script>
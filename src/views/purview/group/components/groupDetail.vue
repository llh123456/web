<template>
<el-row :gutter="20">
  <el-col :span="24">
    <el-button-group>
      <el-button type="primary" v-if="groupManager_btn_add" icon="el-icon-plus" @click="handlerAdd">添加</el-button>
      <el-button type="primary" v-if="groupManager_btn_edit" icon="el-icon-edit" @click="handlerEdit">编辑</el-button>
      <el-button type="primary" :disabled="currentId === -1" v-if="groupManager_btn_del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="primary" :disabled="currentId === -1" v-if="groupManager_btn_resourceManager" icon="el-icon-news" @click="handlerAuthority">权限分配</el-button>
    </el-button-group>
  </el-col>
  <el-col :span="8" style='margin-top:20px;'>
    <el-card class="box-card">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
      <el-tree style="margin-top: 10px;" class="filter-tree" :data="treeData" node-key="id" :expand-on-click-node="false" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="groupTree" @node-click="getNodeData" default-expand-all></el-tree>
    </el-card>
  </el-col>
  <el-col :span="16" style='margin-top:20px;'>
    <el-card class="box-card">
      <el-form :label-position="labelPosition" label-width="80px" :model="form" ref="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" :disabled="formEdit"></el-input>
        </el-form-item>
        <!--<el-form-item label="编码">
          <el-input v-model="form.code" :disabled="formEdit"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" :disabled="formEdit"></el-input>
        </el-form-item>-->
        <el-form-item label="角色类型" prop="roleTypeId">
          <el-select v-model="form.roleTypeId" :disabled="formEdit" placeholder="请选择">
            <el-option
              v-for="item in groupTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="departmentId">
          <el-select v-model="form.departmentId" :disabled="formEdit" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formStatus == 'update'">
          <el-button type="primary" v-if="groupManager_btn_edit" @click="update('form')">更新</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
        <el-form-item v-if="formStatus == 'create'">
          <el-button type="primary" v-if="groupManager_btn_add" @click="create('form')">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </el-col>
  <el-dialog :title="dialogAuthorityName" :visible.sync="dialogAuthorityVisible">
    <group-authority :groupId="currentId" @closeAuthorityDialog="closeAuthorityDialog" ref="groupAuthority"></group-authority>
  </el-dialog>
</el-row>
</template>

<script>
import { getAllGroupTypes, getAllDepartments, fetchTree, getObj, addObj, delObj, putObj } from '@/api/group/index'
import { mapGetters } from 'vuex'
export default {
  name: 'groupDetail',
  components: {
    'group-authority': () => import('./groupAuthority')
  },
  props: {
    type: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      groupTypeList: null,
      departmentList: null,
      total: null,
      formEdit: true,
      formAdd: true,
      formStatus: '',
      dialogAuthorityVisible: false,
      dialogAuthorityName: '关联资源',
      listQuery: {
        platform: 2,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      labelPosition: 'right',
      groupManager_btn_edit: true,
      groupManager_btn_del: true,
      groupManager_btn_add: true,
      groupManager_btn_userManager: true,
      groupManager_btn_resourceManager: true,
      form: {
        code: undefined,
        name: undefined,
        description: undefined,
        groupType: this.type
      },
      currentId: -1,
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 255, message: '长度在 2 到 255 个字符', trigger: 'blur' }
        ],
        roleTypeId: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  created() {
    this.parameter()
    this.getList()
    // this.groupManager_btn_edit = this.elements['groupManager:btn_edit']
    // this.groupManager_btn_del = this.elements['groupManager:btn_del']
    // this.groupManager_btn_add = this.elements['groupManager:btn_add']
    // this.groupManager_btn_userManager = this.elements['groupManager:btn_userManager']
    // this.groupManager_btn_resourceManager = this.elements['groupManager:btn_resourceManager']
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    parameter() {
      getAllGroupTypes({ platform: 2 }).then(response => {
        this.groupTypeList = response.data
      })
      getAllDepartments({ platform: 2 }).then(response => {
        this.departmentList = response.data
      })
    },
    getList() {
      fetchTree(this.listQuery).then(response => {
        this.treeData = response.data
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getNodeData(data) {
      if (!this.formEdit) {
        this.formStatus = 'update'
      }
      getObj(data.id).then(response => {
        this.form = response.data
      })
      this.currentId = data.id
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
    handleDelete() {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delObj(this.currentId).then(() => {
          this.getList()
          this.resetForm()
          this.onCancel()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    update(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          putObj(this.form.id, this.form).then(() => {
            this.getList()
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
    create(formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.getList()
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
        // parentId: this.currentId,
        // code: undefined,
        name: undefined,
        platform: 2,
        // description: undefined,
        roleTypeId: undefined,
        departmentId: undefined
      }
    },
    handlerAuthority() {
      this.dialogAuthorityVisible = true
      if (this.$refs.groupAuthority !== undefined) {
        this.$refs.groupAuthority.groupId = this.currentId
        this.$refs.groupAuthority.initAuthoritys()
      }
    },
    closeAuthorityDialog() {
      this.dialogAuthorityVisible = false
    }
  }
}
</script>

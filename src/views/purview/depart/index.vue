<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple" style="margin-right: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>组织架构</span>
            </div>
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree style="margin-top: 10px;" class="filter-tree"  node-key="id" :data="mainTreeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData" highlight-current>
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="18" style="height:100%">
        <div class="grid-content bg-purple-light">
          <all-container :is-refresh="refresh" :is-id="currentTreeNodeId"></all-container>
          <!--<el-card class="box-card" style="height:100%">
            <div slot="header" class="clearfix">
              <span>组织相关</span>
            </div>
            <div>
              <el-tabs value="first">
                <el-tab-pane label="部门管理" name="second">
                  <depart-position :departId="currentTreeNodeId" ref="positionManager" />
                </el-tab-pane>
                <el-tab-pane label="角色管理" name="group">
                  
                </el-tab-pane>
                <el-tab-pane label="用户管理" name="first">
                  <div class="filter-container">
                    <el-input @keyup.enter.native="handlerTableRowFilter" style="width: 200px;" class="filter-item" placeholder="姓名" v-model="listTableQuery.name">
                    </el-input>
                    <el-button :disabled="!currentTreeNodeId" class="filter-item" type="primary" icon="search" @click="handlerTableRowFilter">搜索</el-button>
                    <el-button :disabled="!currentTreeNodeId" style="margin-left: 10px;" class="filter-item" @click="handleTableRowCreate" v-if="departManager_btn_user_add" type="primary">添加用户</el-button>
                  </div>
                  <el-table :data="childTableData" border highlight-current-row style="width: 100%">
                    <el-table-column align="center" label="序号" width="65"> <template slot-scope="scope">
                          <span>{{scope.row.id}}</span>
                        </template> </el-table-column>
                    <el-table-column width="200px" align="center" label="所属部门"> <template slot-scope="scope">
                        <span>{{scope.row.name}}</span>
                      </template> </el-table-column>
                    <el-table-column width="110px" align="center" label="角色类型"> <template slot-scope="scope">
                            <span>{{scope.row.roleTypeName}}</span>
                          </template> </el-table-column>
                    <el-table-column width="110px" align="center" label="角色名称"> <template slot-scope="scope">
                            <span>{{scope.row.roleName}}</span>
                          </template> </el-table-column>
                    <el-table-column width="300px" align="center" label="员工姓名"> <template slot-scope="scope">
                            <span>{{scope.row.name}}</span>
                          </template> </el-table-column>
                    <el-table-column width="180px" align="center" label="联系方式"> <template slot-scope="scope">
                          <span>{{scope.row.mobilePhone}}</span>
                        </template> </el-table-column>
                    <el-table-column width="110px" align="center" label="创建人"> <template slot-scope="scope">
                            <span>{{scope.row.crtName}}</span>
                          </template> </el-table-column>
                    <el-table-column width="180px" align="center" label="创建时间"> <template slot-scope="scope">
                          <span>{{scope.row.crtTime}}</span>
                        </template> </el-table-column>
                    <el-table-column fixed="right" align="center" label="操作" width="150"> <template slot-scope="scope">
                        <el-button v-if="departManager_btn_user_edit" size="small" type="success" @click="handleTableRowUpdate(scope.row)">编辑
                        </el-button>
                        <el-button v-if="departManager_btn_user_del" size="small" type="danger" @click="handleTableRowDelete(scope.row)">删除
                        </el-button>
                    </template> </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>-->
        </div>
      </el-col>
    </el-row>
    <!--<el-dialog v-if="departManager_btn_add" :title="textMap[dialogStatus]" :before-close="closeUserDialog" :visible.sync="dialogUserVisible">
      <depart-user :dialogStatus="dialogStatus" :groupList="groupList" :departmentList="departmentList" @closeUserDialog="closeUserDialog" ref="departUser"></depart-user>
    </el-dialog>-->
  </div>
</template>

<script>
import { getAllShippers } from '@/api/shipper/index'
import { mapGetters } from 'vuex'
import AllContainer from './components/AllContainer'

export default {
  name: 'departManager',
  components: {
    AllContainer
  },
  watch: {
    filterText(val) {
      this.$refs.mainTree.filter(val)
    }
  },
  methods: {
    // 公司搜索
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 公司
    initmainTreeData() {
      getAllShippers().then(response => {
        this.mainTreeData = response.data
      })
    },
    // 公司点击
    getTreeNodeData(data) {
      this.currentTreeNodeId = data.id
      this.currentTreeNode = data
      this.refresh = false
      this.$nextTick(() => (
        this.refresh = true
      ))
    }
  },
  created() {
    this.initmainTreeData()
    // 加载树
    // this.departManager_btn_edit = this.elements['departManager:btn_edit']
    // this.departManager_btn_del = this.elements['departManager:btn_del']
    // this.departManager_btn_add = this.elements['departManager:btn_add']
    // this.departManager_btn_user_add = this.elements['departManager:btn_user_add']
    // this.departManager_btn_user_del = this.elements['departManager:btn_user_del']
    /* getTypeValue('org_depart').then(response => {
      this.departTypeOptions = response.data.rows
    }) */
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      departmentList: null,
      groupList: null,
      // 添加用户
      dialogUserVisible: false,
      departTypeOptions: [],
      departManager_btn_edit: true,
      departManager_btn_del: true,
      departManager_btn_add: true,
      departManager_btn_user_add: true,
      departManager_btn_user_edit: true,
      departManager_btn_user_del: true,
      filterText: '',
      currentTreeNodeId: undefined,
      currentTreeNode: {},
      // 公司数据
      mainTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      refresh: true
    }
  }
}
</script>

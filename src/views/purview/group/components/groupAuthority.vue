<template>
<el-row :gutter="20">
  <el-col :span="24">
    <el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
  </el-col>
  <el-col :span="8" style='margin-top:15px;'>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"> </el-input>
    <el-tree style="margin-top: 10px;" class="filter-tree" :node-key="getTreeNodeKey" :data="treeData" show-checkbox node-key="id" :expand-on-click-node="false" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all></el-tree>
  </el-col>
  <el-col :span="16" style='margin-top:15px;'>
    <el-table class="groupManager" ref="elementTable" :data="list" border fit highlight-current-row @select="handleSelectionChange" style="width: 100%">
      <el-table-column v-if="groupManager_element" type="selection" width="55"> </el-table-column>
      <el-table-column width="200px" align="center" label="资源编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源类型">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源名称">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源地址">
        <template slot-scope="scope">
          <span>{{scope.row.uri}}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="center" label="资源请求类型">
        <template slot-scope="scope">
          <span>{{scope.row.method}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-col>
</el-row>
</template>

<script>
import { fetchTree } from '@/api/menu/index'
import { pageMenuB } from '@/api/element/index'
import { addElementAuthority, getElementAuthority, modifyMenuAuthority, getMenuAuthority } from '@/api/group/index'
import { mapGetters } from 'vuex'
export default {
  name: 'groupAuthority',
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        platform: 2,
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      groupManager_menu: true,
      groupManager_element: true
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val)
    }
  },
  created() {
    this.getList()
    // this.groupManager_menu = this.elements['groupManager:menu']
    // this.groupManager_element = this.elements['groupManager:element']
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
        this.initAuthoritys()
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    getNodeData(data) {
      this.listQuery.menuId = data.id
      pageMenuB(data.id).then(response => {
        this.list = response.data
        getElementAuthority(data.id, { roleId: this.groupId }).then(data => {
          const obj = {}
          for (let i = 0; i < this.list.length; i++) {
            obj[this.list[i].id] = this.list[i]
          }
          const toggle = {}
          for (let i = 0; i < data.data.length; i++) {
            const id = data.data[i].id
            if (obj[id] !== undefined && toggle[id] === undefined && data.data[i].checkFlag === 1) {
              this.$refs.elementTable.toggleRowSelection(obj[data.data[i].id])
              toggle[id] = true
            }
          }
        })
      })
      this.currentId = data.id
      this.showElement = true
    },
    getTreeNodeKey(node) {
      return node.id
    },
    handleSelectionChange(val, row) {
      let flag = true
      for (let i = 0; i < val.length; i++) {
        if (val[i].id === row.id) {
          addElementAuthority({
            roleId: this.groupId,
            // menuId: this.currentId,
            resourceId: row.id,
            checkFlag: 1,
            type: 2
          })
          flag = false
          break
        }
      }
      if (flag) {
        addElementAuthority({
          roleId: this.groupId,
          resourceId: row.id,
          checkFlag: 0,
          type: 2
        })
      }
    },
    update() {
      // this.$emit('closeAuthorityDialog')
      const nodes = this.$refs.menuTree.getCheckedNodes()
      const ids = []
      for (let i = 0; i < nodes.length; i++) {
        // ids.push(nodes[i].id)
        ids.push({ resourceId: nodes[i].id, roleId: this.groupId, type: 1 })
      }
      modifyMenuAuthority(this.groupId, {
        rolePermissions: ids
      }).then(() => {
        this.$notify({
          title: '成功',
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    initAuthoritys() {
      this.$refs.menuTree.setCheckedKeys([])
      getMenuAuthority(this.groupId).then(response => {
        const result = []
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].checkFlag === 1 && result.push(response.data[i].id)
        }
        this.$refs.menuTree.setCheckedKeys(result)
      })
    }
  }
}
</script>

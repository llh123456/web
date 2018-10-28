<template>
	<section>
	  <el-menu class="navbar" mode="horizontal">
	  	<el-row>
	  		<el-col :span="4">
					<div class="logo">
						<svg-icon icon-class="user" />
					</div>
					<div class="name">
							{{name}}，您好！
					</div>
	  		</el-col>
	  		<el-col :span="15">
  				<div class="tabs-bar">
  					<tags-view></tags-view>
  				</div>
	  		</el-col>
	  		<el-col :span="5">
			    <div class="right-menu">
			      <el-dropdown class="avatar-container right-menu-item" trigger="click">
			        <div class="avatar-wrapper">个人中心<i class="el-icon-arrow-down el-icon--right"></i> </div>
			        <el-dropdown-menu slot="dropdown">
			          <router-link to="/">
			            <el-dropdown-item>首页</el-dropdown-item>
			          </router-link>
			          <el-dropdown-item divided>
			            <span @click="logout" style="display:block;">退出登录</span>
			          </el-dropdown-item>
			        </el-dropdown-menu>
			      </el-dropdown>
			    </div>
	  		</el-col>
	  	</el-row>
	  </el-menu>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import TagsView from './TagsView'

export default {
  components: {
    TagsView
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('FedLogOut').then(() => {
        location.reload()
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 48px;
  /*line-height: 50px;*/
  background: #2b63b8;
  border-bottom:solid 0px #e6e6e6;
  color: #ffffff;
  border-radius: 0px !important;
  overflow: hidden;
  .hamburger-container {
    line-height: 58px;
    height: 48px;
    float: left;
    padding: 0 10px;
  }
  .logo {
  	float: left;
  	color: #ffffff;
  	margin:7px 0 0 8px;
  	.svg-icon {
	  	width: 34px;
	  	height: 34px;
  	}
  }
  .name {
  	font-size: 14px;
  	color: #ffffff;
  	margin-left: 54px;
  	padding-right: 20px;
  	line-height: 48px;
	  text-overflow: ellipsis;
	  white-space: nowrap;
	  overflow: hidden;
  }
  .tabs-bar {
    padding-top: 18px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    line-height: 48px;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      /*height: 20px;*/
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 48px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 0px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<template>
  <div class="app-container calendar-list-container">
    {{$route.query.id}}
    <el-input v-model="test" style="width: 100px;" placeholder=""></el-input>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // 水波纹指令
  
  export default {
    name: 'customerDetails',
    directives: {
      waves
    },
    data() {
      return {
        loading: false,
        test: ''
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>
<template>
  <div class="public-container bill-add-container">
    <div class="wrapper">
      <div class="content">
        <page-detail :is-edit='false' ></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
import PageDetail from './components/PageDetail'

export default {
  name: 'customerAdd',
  components: { PageDetail }
}
</script>

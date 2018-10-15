<template>
  <div class="public-container bill-add-container">
    <div class="wrapper">
      <div class="content">
        <page-detail :is-edit='true'></page-detail>
      </div>
    </div>
  </div>
</template>

<script>
import PageDetail from './components/PageDetail'

export default {
  name: 'customerEdit',
  components: { PageDetail }
}
</script>

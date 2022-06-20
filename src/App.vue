<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
.el-table--enable-row-hover .el-table__body tr:hover>td{
  background-color: #99cccc !important;
}

</style>

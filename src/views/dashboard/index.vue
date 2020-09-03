<template>
  <div class="dashboard-container">
    <!--<component :is="currentRole" />-->
    质控中心
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
<style>
  .dashboard-container{
    width: 100%;
    height:calc( 100vh - 85px);
    line-height: calc( 100vh - 85px );
    text-align: center;
    font-size: 24px;
  }
</style>

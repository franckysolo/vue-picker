<template>
  <div id="app" class="container">
    <h1>Vue2 - Date time Picker</h1>
    <vue-picker
      mode="date"
      :labels="months"
      :nextTips="nextTips"
      :prevTips="prevTips"
      inputName="datepicker">
    </vue-picker>
  </div>
</template>

<script>
import moment from 'moment'
moment.locale('fr')
import VuePicker from './components/vue-picker'

export default {
  name: 'app',
  components: {
    VuePicker
  },
  data () {
    return {
      months: ['L', 'M', 'M', 'J', 'V', 'S', 'D'],
      nextTips: 'Suivant',
      prevTips: 'Précédent'
    }
  }
}
</script>

<style lang="less">
@import 'assets/less/style.less';
</style>

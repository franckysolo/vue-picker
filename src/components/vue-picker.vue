<template>
  <div class="picker-container form-group" @click.stop>
    <input type="hidden" :name="inputName" v-model="dateRow">
    <div class="input-group">
      <div class="input-group-addon">
        <span class="glyphicon glyphicon-calendar"></span>
      </div>
      <input @click="showPicker" type="text" name="picker" v-model="dateField"
        class="form-control" :placeholder="placeholder">
      <datepicker
        :locale="locale"
        :mode="mode"
        :date="date"
        :days="labels"
        :visible="isVisible">
      </datepicker>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Datepicker from './vue-picker-date'
export default {
  name: 'PickerContainer',
  props: {
    locale: {
      type: String,
      default: 'fr'
    },
    mode: {
      type: String,
      default: 'full' // (full | date| time)
    },
    value: {
      type: String
    },
    placeholder: {
      type: String
    },
    prevTips: {
      type: String
    },
    nextTips: {
      type: String
    },
    inputName: {
      type: String,
      required: true,
      default: 'datetime'
    },
    inputDateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    inputTimeFormat: {
      type: String,
      default: 'HH:mm:ss'
    },
    dateFormat: {
      type: String,
      default: 'DD/MM/YYYY'
    },
    timeFormat: {
      type: String,
      default: 'HH:mm:ss'
    },
    labels: {
      type: Array,
      default: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    }
  },
  components: {
    Datepicker
  },
  data () {
    return {
      isVisible: false,
      date: this.setDate(this.value, this.rawFormat),
      fieldFormat: '',
      rawFormat: ''
    }
  },
  created () {
    this.setDateFormat()
    this.$on('changeDate', () => this.hidePicker())
    this.$on('changeTime', (time) => this.computeDatetime(time))
  },
  computed: {
    // Date in field for view
    dateField () {
      return this.date.format(this.fieldFormat)
    },
    // Date hidden field in sql format
    dateRow () {
      return this.date.format(this.rawFormat)
    }
  },
  methods: {
    setDate (date, format) {
      if (date) {
        return moment(date, format)
      }
      return moment()
    },
    computeDatetime (time) {
      let value = this.date.format('YYYY-MM-DD') + ' ' + time.formatted()
      this.$set(this.$data, 'date', this.setDate(value, this.rawFormat))
    },
    setDateFormat () {
      switch (this.mode) {
        case 'date':
          this.fieldFormat = this.dateFormat
          this.rawFormat = this.inputDateFormat
          break
        case 'time':
          this.fieldFormat = this.timeFormat
          this.rawFormat = this.inputTimeFormat
          break
        default:
          this.fieldFormat = this.dateFormat + ' ' + this.timeFormat
          this.rawFormat = this.inputDateFormat + ' ' + this.inputTimeFormat
          break
      }
    },
    showPicker () {
      this.isVisible = true
      setTimeout(() => document.addEventListener('click', this.hidePicker), 0)
    },
    hidePicker () {
      this.isVisible = false
      document.removeEventListener('click', this.hidePicker)
    }
  }
}
</script>

<template>
  <transition name="slide-fade">
    <div class="picker" v-if="visible">
      <div class="picker-header">
        <span class="picker-curdate">{{ currentDate }}</span>
      </div>
      <div class="picker-wrapper">
        <transition name="slide-fh" :class="classVDirection">
          <div class="picker-agenda" v-if="vmode === AGENDA_VIEW && mode !== 'time'">
            <div class="picker-control">
              <div class="picker-month">
                <transition-group name="slide-fh" :class="classDirection" tag="div">
                  <div v-for="month in [month]" :key="month">
                    {{ month.formatted() }}
                  </div>
                </transition-group>
              </div>
              <span class="picker-prev" @click="prevMonth()" :title="prevTips">
                <span class="glyphicon glyphicon-chevron-left"></span>
              </span>
              <div class="picker-next" @click="nextMonth()" :title="nextTips">
                <span class="glyphicon glyphicon-chevron-right"></span>
              </div>
            </div>
            <div class="picker-week">
              <div v-for="day in days" class="picker-week-days">
                {{ day }}
              </div>
            </div>
            <div class="picker-days" :class="classWeeks">
              <transition-group name="slide-fv" :class="classDirection" tag="div">
                <div class="picker-days-container" v-for="month in [month]" :key="month">
                  <div class="picker-day" :style="'width:' + (month.weekStart() * 41) + 'px'">
                  </div>
                  <div @click="selectDate(day)" class="picker-day" v-for="day in month.days()" :class="{selected: isSelected(day), today: isToday(day)}">
                    <span class="picker-day-fx"></span>
                    <span class="picker-day-txt">{{ day.format('DD') }}</span>
                  </div>
                </div>
              </transition-group>
            </div>
          </div>
        </transition>
        <transition name="slide-fh" :class="classVDirection">
          <div class="picker-time" v-if="(mode === 'full' && vmode === TIME_VIEW) || mode === 'time'">
            <div class="picker-swatch">
              <span class="picker-curdate">{{ time.formatted() }}</span>
            </div>
            <div class="row">
              <div class="col-xs-4 col-sm-4">
                <div class="btn btn-default" @click="nextHour()">
                  <span class="glyphicon glyphicon-chevron-up"></span>
                </div>
                <div class="form-group">
                  <input v-model="hour" class="form-control" @input="setHour(hour)">
                </div>
                <div class="btn btn-default" @click="prevHour()">
                  <span class="glyphicon glyphicon-chevron-down"></span>
                </div>
              </div>
              <div class="col-xs-4 col-sm-4">
                <div class="btn btn-default" @click="nextMinute()">
                  <span class="glyphicon glyphicon-chevron-up"></span>
                </div>
                <div class="form-group">
                  <input v-model="minute" class="form-control">
                </div>
                <div class="btn btn-default" @click="prevMinute()">
                  <span class="glyphicon glyphicon-chevron-down"></span>
                </div>
              </div>
              <div class="col-xs-4 col-sm-4">
                <div class="btn btn-default" @click="nextSecond()">
                  <span class="glyphicon glyphicon-chevron-up"></span>
                </div>
                <div class="form-group">
                  <input v-model="second" class="form-control">
                </div>
                <div class="btn btn-default" @click="prevSecond()">
                  <span class="glyphicon glyphicon-chevron-down"></span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="picker-mode" v-show="mode === 'full'">
        <a v-if="vmode === AGENDA_VIEW" class="btn btn-default" @click="changeViewMode(TIME_VIEW)">
          <span class="glyphicon glyphicon-time"></span>
        </a>
        <a v-else class="btn btn-default" @click="changeViewMode(AGENDA_VIEW)">
          <span class="glyphicon glyphicon-calendar"></span>
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
import moment from 'moment'
import Month from '../modules/month'
import Time from '../modules/time'
const AGENDA_VIEW = 0
const TIME_VIEW = 1
export default {
  name: 'PickerDate',
  props: {
    date: {},
    days: {
      type: Array
    },
    mode: {
      type: String,
      default: 'full' // (full | date| time)
    },
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      vmode: AGENDA_VIEW,
      AGENDA_VIEW: AGENDA_VIEW,
      TIME_VIEW: TIME_VIEW,
      month: new Month(this.date.month(), this.date.year()),
      time: null,
      hour: '00',
      minute: '00',
      second: '00',
      isVisible: this.visible,
      classDirection: 'off',
      classVDirection: 'off',
      nextTips: '',
      prevTips: ''
    }
  },
  created () {
    let curdate = this.$parent.date
    this.time = new Time(curdate.format('H'), curdate.format('m'), curdate.format('s'))
    this.hour = this.time.hour
    this.minute = this.time.minute
    this.second = this.time.second
    this.nextTips = this.$parent.nextTips
    this.prevTips = this.$parent.prevTips
  },
  watch: {
    visible (val, oldVal) {
      if (val === false) {
        this.classDirection = 'off'
      }
    }
  },
  methods: {
    changeViewMode (mode) {
      this.vmode = mode
    },
    isSelected (day) {
      return this.date.unix() === day.unix()
    },
    isToday (day) {
      let fmt = 'YYYY-MM-DD'
      let today = moment()
      return today.format(fmt) === day.format(fmt)
    },
    selectDate (day) {
      this.$parent.date = day.clone()
      this.$parent.$emit('changeDate')
      if (this.mode === 'full') {
        this.$parent.$emit('changeTime', this.time)
      }
    },
    setHour (hour) {
      window.alert('call')
    },
    setTimeDay () {
      this.time = new Time(this.hour, this.minute, this.second)
      if (this.mode === 'time') {
        this.$parent.date = this.time.time
      } else if (this.mode === 'full') {
        this.$parent.$emit('changeTime', this.time)
      }
    },
    nextMonth () {
      this.classDirection = 'direction-next'
      let month = this.month.month + 1
      let year = this.month.year
      if (month > 11) {
        year += 1
        month = 0
      }
      this.month = new Month(month, year)
    },
    prevMonth () {
      this.classDirection = 'direction-prev'
      let month = this.month.month - 1
      let year = this.month.year
      if (month < 0) {
        year -= 1
        month = 11
      }
      this.month = new Month(month, year)
    },
    nextHour () {
      let hour = this.time.hourToInt() + 1
      if (hour > 23) {
        hour = 0
      }
      let ts = new Time(hour, this.minute, this.second)
      this.hour = ts.hour
      this.setTimeDay()
    },
    prevHour () {
      let hour = this.time.hourToInt() - 1
      if (hour < 0) {
        hour = 23
      }
      let ts = new Time(hour, this.minute, this.second)
      this.hour = ts.hour
      this.setTimeDay()
    },
    nextMinute () {
      let m = this.time.minuteToInt() + 1
      if (m > 59) {
        m = 0
      }
      let ts = new Time(this.hour, m, this.second)
      this.minute = ts.minute
      this.setTimeDay()
    },
    prevMinute () {
      let m = this.time.minuteToInt() - 1
      if (m < 0) {
        m = 59
      }
      let ts = new Time(this.hour, m, this.second)
      this.minute = ts.minute
      this.setTimeDay()
    },
    nextSecond () {
      let s = this.time.secondToInt() + 1
      if (s > 59) {
        s = 0
      }
      let ts = new Time(this.hour, this.minute, s)
      this.second = ts.second
      this.setTimeDay()
    },
    prevSecond () {
      let s = this.time.secondToInt() - 1
      if (s < 0) {
        s = 59
      }
      let ts = new Time(this.hour, this.minute, s)
      this.second = ts.second
      this.setTimeDay()
    }
  },
  computed: {
    currentDate () {
      return this.date.format('dddd DD MMMM YYYY')
    },
    currentYear () {
      return this.date.format('YYYY')
    },
    currentTime () {
      return this.time.formatted()
    },
    currentMonthName () {
      return this.date.format('MMMM')
    },
    classWeeks () {
      let size = this.month.weeks() < 0 ? 6 : this.month.weeks()
      return 'has-' + size + '-weeks'
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/vue-picker-date";
@import "../assets/less/vue-picker-time";
@import "../assets/less/vue-picker-animation";
</style>

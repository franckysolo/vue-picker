import moment from 'moment'

class Time {

  constructor (hour = null, minute = null, second = null) {
    this.time = moment({
      hour,
      minute,
      second
    })

    this.hour = this.time.format('HH')
    this.minute = this.time.format('mm')
    this.second = this.time.format('ss')
  }

  hourToInt () {
    return this.time.hour()
  }

  minuteToInt () {
    return this.time.minute()
  }

  secondToInt () {
    return this.time.second()
  }

  formatted () {
    return this.time.format('HH:mm:ss')
  }
}

export { Time as default }

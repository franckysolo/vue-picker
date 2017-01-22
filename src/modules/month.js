
import Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

class Month {

  constructor (month, year) {
    this.start = moment([year, month])
    this.end = this.start.clone().endOf('month')
    this.month = month
    this.year = year
  }

  weekStart () {
    return this.start.weekday()
  }

  weeks () {
    return this.end.week() - this.start.week() + 1
  }

  days () {
    let range = moment.range(this.start, this.end)
    return Array.from(range.by('days'))
  }

  formatted () {
    return this.start.format('MMMM YYYY')
  }
}

export { Month as default }

export const formCalculateFunctions = {
  abGetNumber: function (data: any) {
    if (data === undefined || data === '') {
      return 0
    }
    const number = Number(data)
    if (Number.isNaN(number)) {
      console.info('取值字段为 NaN，返回0')
      return 0
    }
    return number
  },
  abSubAvg: function (subDataList: any, key: any) {
    if (!subDataList || !key) {
      console.info('平均计算对象中存在空值，返回0')
      return 0
    }
    if (subDataList.length == 0) return 0

    let sum = 0
    subDataList.forEach(function (data: any) {
      if (!data[key]) return
      sum = sum + Number(data[key])
    })
    return sum / subDataList.length
  },
  abSubSum: function (subDataList: any, key: any) {
    if (!subDataList || !key) {
      console.info('合计计算对象中存在空值，返回0')
      return 0
    }
    let sum = 0
    subDataList.forEach(function (data: any) {
      if (!data[key]) return
      sum = sum + Number(data[key])
    })
    return sum
  },
  // 计算身份证的日期
  calIdCardDate: function (idCard: any) {
    if (idCard == null || idCard == '') return 'not calculate'

    let birthday = ''
    if (idCard.length == 15) {
      birthday = `19${idCard.slice(6, 12)}`
    } else if (idCard.length == 18) {
      birthday = idCard.slice(6, 14)
    }
    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
    return birthday
  },
  //计算身份证的性别
  calIdCardSex: function (idCard: any) {
    if (idCard == null || (idCard.length != 18 && idCard.length != 15)) {
      return 'not calculate'
    }

    const genderCode = idCard.charAt(idCard.length - 2)
    if (genderCode % 2 == 1) {
      return '男'
    } else {
      return '女'
    }
  },
  // 计算身份证的年龄
  calIdCardYear: function (idCard: any) {
    if (idCard == null || (idCard.length != 18 && idCard.length != 15)) {
      return 'not calculate'
    }
    const birthday = this.calIdCardDate(idCard)
    return this.calIdDateYear(birthday)
  },

  // 通过计算日期计算年龄
  calIdDateYear: function (date: any) {
    if (!date) {
      return 'not calculate'
    }
    const birthDate = new Date(date)
    const currentDate = new Date()
    let age = currentDate.getFullYear() - birthDate.getFullYear()
    //需要比较月日，否则会导致计算可能偏大
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--
    }
    if (isNaN(age) || age < 0) {
      age = 0
    }
    return age
  },

  // 计算日期的星期几
  calDateWeek: function (date: any) {
    if (!date) {
      return 'not calculate'
    }

    const datelist = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return datelist[new Date(date).getDay()]
  },
  // 计算日期指定后的天数
  calDateAfterDay: function (date: any, num: any) {
    if (!date || isNaN(num) || !num) {
      return 'not calculate'
    }
    const days = Number(num)
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  },
  // 计算日期 指定后几个月
  calDateAfterMonth: function (date: any, num: any) {
    if (!date || isNaN(num) || !num) {
      return 'not calculate'
    }
    const months = Number(num)

    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  },

  GetMonday: function (date?: any) {
    const dd = date ? new Date(date) : new Date()
    const week = dd.getDay() //获取时间的星期数
    const minus = week ? week - 1 : 6
    dd.setDate(dd.getDate() - minus) //获取周一日期
    const y = dd.getFullYear()
    const m =
      dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1
    const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()
    return new Date(`${y}-${m}-${d}`)
  },
  GetSunday: function (date?: any) {
    const dd = date ? new Date(date) : new Date()
    const week = dd.getDay() //获取时间的星期数
    const minus = week ? week - 1 : 6
    dd.setDate(dd.getDate() - minus) //获取周一日期
    dd.setDate(dd.getDate() + 6) //加6得到周日日期
    const y = dd.getFullYear()
    const m =
      dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1
    const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate()
    return new Date(`${y}-${m}-${d}`)
  },

  // 计算时间差(分/时/天/周/月/年)
  calculationDate: function (type: string, start: any, end: any) {
    if (!start || !end) {
      return 'not calculate'
    } else {
      const oneSecond = 1000
      const oneMinute = oneSecond * 60
      const oneHour = oneMinute * 60
      const oneDay = oneHour * 24
      const oneWeek = oneDay * 7
      const oneMonth = oneDay * 30
      const startDate = new Date(start)
      const endDate = new Date(end)

      const timeDiff = Math.abs(endDate.getTime() - startDate.getTime())

      switch (type) {
        case 'y':
          return Math.ceil(Number((timeDiff / (oneDay * 365.2425)).toFixed(1)))
        case 'M':
          return Math.ceil(timeDiff / oneMonth)
        case 'w':
          return Math.ceil(timeDiff / oneWeek)
        case 'h':
          return Math.ceil(timeDiff / oneHour)
        case 'm':
          return Math.ceil(timeDiff / oneMinute)
        case 's':
          return Math.ceil(timeDiff / oneSecond)
        default:
          return Math.ceil(timeDiff / oneDay)
      }
    }
  },
  isNotEmpty: function (array: any) {
    return array && array.length > 0
  },
  calPageIndex: function (index: number, page: any = null) {
    if (!page) {
      return index + 1
    }
    return (page.currentPage - 1) * page.pageSize + index + 1
  },
}

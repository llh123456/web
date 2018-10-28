export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 密码验证*/
export function validatPassword(str) {
  const reg = /^(\w){6,20}$/
  return reg.test(str)
}

/* 手机验证*/
export function validatPhone(str) {
  const reg = /^1[3456789]\d{9}$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

/* 身份证验证*/
export function validatCardNo(card) {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return reg.test(card)
}

/* 车牌验证*/
export function validatTruckNumber(truckNo) {
  const reg = /^[\u4e00-\u9fa5]{1}[a-zA-Z]{1}[a-zA-Z_0-9]{4}[a-zA-Z_0-9_\u4e00-\u9fa5]$/
  // const reg1 = /^[\u4e00-\u9fa5]{1}[0-9]{2}[a-zA-Z_0-9]{5}$/
  return reg.test(truckNo)
}

/* 只能输入数字和小数点*/
export function validatMoney(e, length) {
  if (length === undefined || length === '' || length === 'null' || length === 'undefined') {
    length = 2
  }
  const obj = e.target || e.srcElement
  obj.value = obj.value.replace(/[^\d\.]/g, '')
  const v = obj.value
  const isFullStop = (key) => {
    return (key === 190 || key === 110)
  }
  const isNumber = (key) => {
    return (key >= 48 && key <= 57) || (key >= 96 && key <= 105)
  }
  const isSpecialKey = (key) => {
    return (key === 8 || key === 46 || (key >= 37 && key <= 40) || key === 35 || key === 36 || key === 9 || key === 13)
  }
  obj.oncontextmenu = (e) => {
    return false
  }
  obj.oninput = (e) => {
    obj.value = obj.value.replace(/[^\d\.]/g, '') ? obj.value.replace(/[^\d\.]/g, '') || v : ''
  }
  obj.onkeyup = (e) => {
    obj.value = obj.value.replace(/[^\d\.]/g, '') ? obj.value.replace(/[^\d\.]/g, '') || v : ''
    // obj.value = obj.value.replace(/^\./g, '')
  }
  obj.onkeydown = (e) => {
    const key = window.event ? e.keyCode : e.which
    const value = obj.value.toString()
    // if (e.code.indexOf('Digit') === -1 && e.code !== 'Backspace' && e.code !== 'Period' && e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return false
    if (!isNumber(key) && !isFullStop(key) && key !== 8 && key !== 46 && key !== 37 && key !== 39) {
      return false
    }
    if (!value) {
      if (isFullStop(key)) return false
    }
    if (isFullStop(key)) {
      return value.indexOf('.') < 0
    }
    /* if (value === '0' || value === 0) {
      if (isNumber(key) && !e.shiftKey) {
        // return false
      }
    } */
    if (isNumber(key) && !e.shiftKey) {
      const dot = value.indexOf('.')
      if (dot !== -1) {
        const dotCnt = value.substring(dot + 1, value.length)
        if (dotCnt.length >= length) {
          return false
        }
      }
    }
    return (isSpecialKey(key)) || ((isNumber(key) && !e.shiftKey))
  }
  return false
}

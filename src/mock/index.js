import Mock from 'mockjs'

let count = 0, regCount = 0

function checkReg(obj) {
  if (regCount++ > 10) return
  for (let key in obj) {
    if (/^\/.*\/i?g?m?/ig.test(obj[key])) {
      let arr = (obj[key]+'').split('/')
      try {
            obj[key] = new RegExp(arr[1],arr[2])
        } catch(e) {
            obj[key] = obj[key]
        }
    }
    if (typeof obj[key] === 'object' && typeof obj[key] !== 'function') {
      checkReg(obj[key])
    }
  }
  return obj
}

function setListIntoData(data, loop) {
  let temp,
      list = [],
      keys = Object.keys(data)
  if (keys.indexOf(loop.key) > -1) {
    temp = data[loop.key]
    for (let i = 0; i < loop.num; i++) {
      // for (let key in temp) {
      //   temp[key] = checkReg(temp[key])
      // }
      list.push(Mock.mock(checkReg(temp)))     
    }
    data[loop.key] = list
  } else {
    if (count++ > 10) return
    for (let key in data) {
      if (typeof data[key] === 'object' && typeof data[key] !== 'function') {
        setListIntoData(data[key], loop)
      }
    }
  }
}

export function getMock(json, option) {
  json = json || {
    success: true,
    message: "Ok",
    responseCode: 1000,
    data: {
    }
  }
  const loops = option.loops || []
  if (option.isDynamic) {
    // if (option.num !== '' && option.num>=0) {
    //   const num = option.num    
    //   const list = [];
    //   for (let i = 0; i < num; i++) {
    //     for (let key in json.data) {
    //       json.data[key] = checkReg(json.data[key])
    //     }
    //     list.push(Mock.mock(json.data));
    //   }
    //   json.data = list
    // } else {
    //   for (let key in json.data) {
    //     json.data[key] = checkReg(json.data[key])
    //   }
    //   json.data = Mock.mock(json.data)
    // }

    if (loops.length > 0) {
      loops.forEach(item => {
        setListIntoData(json.data, item)
      })
    } 
    // else {
    //   for (let key in json.data) {
    //     json.data[key] = checkReg(json.data[key])
    //   }
    // }
    json.data = Mock.mock(checkReg(json.data))
  }
  return json
}

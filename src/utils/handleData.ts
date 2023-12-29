// remove all invalid value
export function dropInvalidValue(items: any) {
  // 如果item就是一个值，判断是否应该保留
  if (items === null || items === undefined || items === '') {
    return null
  }
  if (items instanceof File) {
    // 是文件对象，直接返回不做处理
    return items
  }
  if (typeof items === 'object') {
    // 如果是对象，需要进一步处理
    if (Array.isArray(items)) {
      const result: any[] = []
      items.forEach((item) => {
        const res = dropInvalidValue(item)
        if (res !== null) {
          result.push(res)
        }
      })
      return result
    }
    if (Object.keys(items).length > 0) {
      const result: Record<string, any> = {}
      // 非数组
      Object.keys(items).forEach((key) => {
        const res = dropInvalidValue(items[key])
        if (res !== null) {
          result[key] = res
        }
      })
      return result
    }
    return items
  }
  return items
}

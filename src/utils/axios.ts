import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import Qs from 'qs'
import { message } from 'chopperui-react'

interface AxiosConfig extends AxiosRequestConfig {
  enableFormData?: boolean
  enableJSON?: boolean
  [propName: string]: any
}

export type DataType = {
  data?: any
  errcode?: number
  description?: string
  // eslint-disable-next-line camelcase
  description_cn?: string
}

export type RequestHandlerReturn = Promise<DataType>
export type RequestHandler = (url: string, data?: any, timeout?: number) => RequestHandlerReturn
// export type InnerRequestHandler = (url: string, data?: any, timeout?: number) => Promise<InnerAxiosResponse>

interface selfParams {
  params?: any
  timeout?: number
}

// remove all invalid value
// {a:1,b:null} => {a:1}
// {a:1,b:[null,1]} => {a:1,b:[1]}
// {a:1,b:[]} => {a:1,b:[]}
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
      const result: Array<any> = []
      items.forEach((item) => {
        const ret: any = dropInvalidValue(item)
        if (ret !== null) {
          result.push(ret)
        }
      })
      return result
    }
    if (Object.keys(items).length > 0) {
      const result: Record<string, any> = {}
      // 非数组
      Object.keys(items).forEach((key) => {
        const ret = dropInvalidValue(items[key])
        if (ret !== null) {
          result[key] = ret
        }
      })
      return result
    }
    return items
  }
  return items
}
// 以表单形式提交数据，目前仅支持一级操作
export function dataToFormData(data: any) {
  if (data) {
    const ret = new FormData()
    Object.keys(data).forEach((key) => {
      const obj = data[key]
      if (Array.isArray(obj)) {
        // 是数组
        obj.forEach((target, index) => {
          // FormData 实例方法
          ret.append(`${key}[${index}]`, target)
        })
      } else {
        ret.append(key, obj)
      }
    })
    return ret
  } else {
    console.error(`FormData has no data`)
    return false
  }
}
// 格式化请求的数据，默认使用
export function formatRequestData(config: AxiosConfig) {
  const axiosConfig = config
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    // 去掉无效值
    const data = dropInvalidValue(config.data)
    if (config.enableFormData) {
      // 强制使用formData提交，如文件上传
      const resData = dataToFormData(data)
      resData && (axiosConfig.data = resData)
    } else if (config.enableJSON) {
      // 作为application/json提交
      axiosConfig.data = data
    } else {
      axiosConfig.data = Qs.stringify(data)
    }
  }
  return axiosConfig
}
let baseUrl = '/'
if (process.env.NODE_ENV === 'production') {
  baseUrl = '/kme-web/'
}
const instance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'If-Modified-Since': '0',
    Accept: 'application/json',
  },
})

// 不能发送信号的请求
// 'cicd/listjoblogs'
// const blackList: string[] = []
// 添加请求拦截器
// let interceptorsId =
instance.interceptors.request.use(
  (config: AxiosConfig) => {
    // 在发送请求之前做些什么
    // let jump = true
    // for (let i = 0, len = blackList.length; i < len; i++) {
    //   if (!config) break
    //   if (config?.url?.includes(blackList[i])) {
    //     jump = false
    //     break
    //   }
    // }
    // if (jump) {
    //   window.parent.postMessage('requesting', '*')
    // }
    return Promise.resolve(formatRequestData(config))
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// instance.interceptors.request.eject(interceptorsId);
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return Promise.resolve(res)
  },
  (err: AxiosError) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误(400)'
          break
        case 401:
          err.message = '未授权，请重新登录(401)'
          break
        case 403:
          err.message = '拒绝访问(403)'
          break
        case 404:
          err.message = '请求出错(404)'
          break
        case 408:
          err.message = '请求超时(408)'
          break
        case 500:
          err.message = '服务器错误(500)'
          break
        case 501:
          err.message = '服务未实现(501)'
          break
        case 502:
          err.message = '网络错误(502)'
          break
        case 503:
          err.message = '服务不可用(503)'
          break
        case 504:
          err.message = '网络超时(504)'
          break
        case 505:
          err.message = 'HTTP版本不受支持(505)'
          break
        default:
          err.message = `连接出错(${err.response.status})!`
      }
    } else {
      err.message = '连接服务器失败!'
    }
    if (!err.config.url?.startsWith('/login')) {
      message.error(err.message)
    }
    return Promise.reject(err.message)
  },
)

const get: RequestHandler = (url, data, timeout) => {
  const params: selfParams = {}
  if (data) {
    params.params = data
  }

  if (timeout) {
    params.timeout = timeout
  }

  if (url.startsWith('/login')) {
    return instance.get(url, params).catch((err) => {
      return err
    })
  } else {
    return instance.get(url, params)
  }
}

const post: RequestHandler = (url, data, timeout) => {
  // data = Qs.stringify(data)

  const config = {
    timeout,
    enableJSON: true,
  }

  return instance.post(url, data, config)
}

const put: RequestHandler = (url, data, timeout) => {
  // data = Qs.stringify(data)

  const config = {
    timeout,
    enableJSON: true,
  }

  return instance.put(url, data, config)
}

const getApi: RequestHandler = (url, data, timeout) => {
  return new Promise((resolve) => {
    get(url, data, timeout)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        // console.log(url)
        console.log(err)
        // reject(err)
      })
  })
}

const postApi: RequestHandler = (url, data, timeout) => {
  return new Promise((resolve) => {
    post(url, data, timeout)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err)
        // reject(err)
      })
  })
}

const putApi: RequestHandler = (url, data, timeout) => {
  return new Promise((resolve) => {
    put(url, data, timeout)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        console.log(err)
        // reject(err)
      })
  })
}

export default {
  get,
  post,
  getApi,
  postApi,
  putApi,
}

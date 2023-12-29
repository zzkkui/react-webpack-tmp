import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  //  InternalAxiosRequestConfig
} from 'axios'
import Qs from 'qs'
import { message } from 'antd'
import { isPlainObject } from '@reduxjs/toolkit'
import { dropInvalidValue } from './handleData'

export interface AxiosConfig extends AxiosRequestConfig {
  enableFormData?: boolean
  enableJSON?: boolean
  timeout?: number
  // headers: AxiosRequestHeaders
  [propName: string]: any
}

export type DataType = {
  data?: any
  errcode?: number
  description?: string
  description_cn?: string
}

export type RequestHandlerReturn = Promise<DataType>
export type RequestHandler = (url: string, data?: any, config?: AxiosConfig) => RequestHandlerReturn

interface selfParams {
  params?: any
  timeout?: number
}

// 以表单形式提交数据，目前仅支持一级操作
function dataToFormData(data: Record<string, any>) {
  const res = new FormData()
  Object.keys(data).forEach((key) => {
    const obj = data[key]
    if (Array.isArray(obj)) {
      obj.forEach((target, index) => {
        // FormData 实例方法
        res.append(`${key}[${index}]`, target)
      })
    } else {
      res.append(key, obj)
    }
  })
  return res
}

// 格式化请求的数据，默认使用
export function formatRequestData(config: AxiosConfig) {
  const axiosConfig = config
  if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
    // 去掉无效值
    const data = dropInvalidValue(config.data)
    if (config.enableFormData) {
      if (isPlainObject(data)) {
        // 强制使用formData提交，如文件上传
        const resData = dataToFormData(data)
        resData && (axiosConfig.data = resData)
      } else {
        console.error('error data type')
      }
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
const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'If-Modified-Since': '0',
    Accept: 'application/json',
  },
})

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // axios bug
    // return formatRequestData(config) as InternalAxiosRequestConfig
    return formatRequestData(config)
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (res: AxiosResponse) => {
    return Promise.resolve(res)
  },
  (err: AxiosError) => {
    // axios v0.2.* 版本取消请求后的状态
    //  __CANCEL__ 在其原型链上没有导出类型 (axios v1 版本也有)
    if ((err as any).__CANCEL__) {
      return Promise.reject(new Error('canceled'))
    }
    // // axios v1 版本取消请求后的状态
    // if (err.code === 'ERR_CANCELED') {
    //   return Promise.reject(err.message)
    // }
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
    if (!err.config?.url?.startsWith('/login')) {
      message.error(err.message)
    }
    return Promise.reject(err.message)
  },
)

const get: RequestHandler = (url, data, config) => {
  const params: selfParams = { ...config }
  if (data) {
    params.params = data
  }
  return instance.get(url, params)
}

const post: RequestHandler = (url, data, config) => {
  const instanceConfig: AxiosConfig = {
    // 默认格式
    enableFormData: true,
  }

  if (config) {
    const { timeout, enableJSON, params } = config
    timeout && (instanceConfig.timeout = timeout)
    params && (instanceConfig.params = params)
    if (enableJSON) {
      instanceConfig.enableJSON = true
      instanceConfig.enableFormData = false
    }
  }

  return instance.post(url, data, instanceConfig)
}

const put: RequestHandler = (url, data, config) => {
  const instanceConfig: AxiosConfig = {
    enableFormData: true,
  }

  if (config) {
    const { timeout, enableJSON, params } = config
    timeout && (instanceConfig.timeout = timeout)
    params && (instanceConfig.params = params)
    if (enableJSON) {
      instanceConfig.enableJSON = true
      instanceConfig.enableFormData = false
    }
  }

  return instance.put(url, data, instanceConfig)
}

const deleteFn: RequestHandler = (url, data, config) => {
  const params: selfParams = { ...config }
  if (data) {
    params.params = data
  }

  return instance.delete(url, params)
}

const getApi: RequestHandler = (url, data, config) => {
  return new Promise((resolve, reject) => {
    get(url, data, config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return new Promise(() => {
            //
          })
        }
        reject(err)
      })
  })
}

const postApi: RequestHandler = (url, data, config) => {
  return new Promise((resolve, reject) => {
    post(url, data, config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return new Promise(() => {
            //
          })
        }
        reject(err)
      })
  })
}

const putApi: RequestHandler = (url, data, config) => {
  return new Promise((resolve, reject) => {
    put(url, data, config)
      .then((response) => {
        resolve(response.data)
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return new Promise(() => {
            //
          })
        }
        reject(err)
      })
  })
}

const deleteApi: RequestHandler = (url, data, config) => {
  return new Promise((resolve, reject) => {
    deleteFn(url, data, config)
      .then((response) => {
        if (response) {
          resolve(response.data)
        } else {
          resolve(response)
        }
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          return new Promise(() => {
            //
          })
        }
        reject(err)
      })
  })
}

export default {
  get,
  post,
  getApi,
  postApi,
  putApi,
  deleteApi,
}

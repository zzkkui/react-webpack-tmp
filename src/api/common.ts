import axios, { AxiosConfig, RequestHandlerReturn } from 'src/utils/axios'

export default {
  getMockList(params: any, config?: AxiosConfig): RequestHandlerReturn {
    return axios.getApi(`/mock/list`, params, config)
  },
}

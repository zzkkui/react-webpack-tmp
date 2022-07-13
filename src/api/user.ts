import axios, { RequestHandlerReturn } from 'src/utils/axios'

const prefix = '/external/'
const prefixHome = '/external/home/'

export default {
  // 获取集群列表
  zoneListApi(): RequestHandlerReturn {
    return axios.getApi(`${prefixHome}zone/list`)
  },

  // 获取项目信息
  projectInfoApi(): RequestHandlerReturn {
    return axios.getApi(`${prefixHome}project/info`)
  },

  // 获取权限信息（目前只有菜单信息）
  permissionInfoApi(): RequestHandlerReturn {
    return axios.getApi(`${prefix}router/get`)
  },
}

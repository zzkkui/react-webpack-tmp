import Mockjs from 'mockjs'

export default [
  {
    url: '/router/get',
    type: 'get',
    response: (config) => {
      const data = Mockjs.mock({
        overview: '/overview',
        list: '/list',
        listDetail: '/list/detail',
      })
      return {
        description: 'ok',
        description_cn: '',
        errcode: 0,
        data,
      }
    },
  },
  {
    url: '/list',
    type: 'get',
    response: (config) => {
      const data = Mockjs.mock([
        {
          id: 2,
          name: "pcloud测试48",
          region: "pcloud48环境"
        },
        {
          id: 3,
          name: "pcloud测试49",
          region: "pcloud49环境"
        }
      ])
      return {
        description: 'ok',
        description_cn: '',
        errcode: 0,
        data,
      }
    },
  }
]

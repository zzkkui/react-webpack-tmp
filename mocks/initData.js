import Mockjs from 'mockjs'

export default [
  {
    url: '/router/get',
    type: 'get',
    response: (config) => {
      const data = Mockjs.mock({
        overview: '/overview',
        redis: '/redis',
        RedisDetail: '/redis/:id',
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
    url: '/zone/list',
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
  },
  {
    url: 'project/info',
    type: 'get',
    response: (config) => {
      const data = Mockjs.mock({
        "project_id": 2,
        "project_name": "测试项目B",
        "dev_id": 201356,
        "dev_name": "13828762825",
        "dev_type": 0,
        "dev_auth_type": 2
      })
      return {
        description: 'ok',
        description_cn: '',
        errcode: 0,
        data,
      }
    },
  }
]

import Mockjs from 'mockjs'

export default [
  {
    url: '/mock/list',
    type: 'get',
    response: (config) => {
      console.log('in mock ====>')
      const data = Mockjs.mock({
        "array|1-3": ['aaa', 'bbb', 'ccc']
      })
      return {
        description: 'ok',
        description_cn: '',
        errcode: 0,
        data: data.array
      }
    },
  },
]

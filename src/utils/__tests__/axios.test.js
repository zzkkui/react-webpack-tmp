import Qs from 'qs'
import { dataToFormData, formatRequestData } from '../axios'

it('测试 dataToFormData 方法 传空', () => {
  const res = dataToFormData()
  expect(res).toBeFalsy()
})

it('测试 dataToFormData 方法 传入一个对象', () => {
  const res = dataToFormData({ name: '123', arr: ['aa', 'bb'] })
  expect(res).toEqual(expect.any(FormData))
})

it('测试 formatRequestData 方法传入 AxiosConfig, enableJSON: true', () => {
  const res = formatRequestData({ method: 'post', enableJSON: true, data: { aa: '11', bb: '22' } })
  expect(res).toEqual({ method: 'post', enableJSON: true, data: { aa: '11', bb: '22' } })
})

it('测试 formatRequestData 方法传入 AxiosConfig, enableJSON: true, data 有 "", null, undefined', () => {
  const res = formatRequestData({
    method: 'post',
    enableJSON: true,
    data: { aa: '11', bb: '22', cc: '', dd: null, ee: undefined },
  })
  expect(res).toEqual({ method: 'post', enableJSON: true, data: { aa: '11', bb: '22' } })
})

it('测试 formatRequestData 方法传入 AxiosConfig enableFormData: true', () => {
  const res = formatRequestData({
    method: 'post',
    enableFormData: true,
    data: { aa: '11', bb: '22' },
  })
  expect(res).toEqual({ method: 'post', enableFormData: true, data: expect.any(FormData) })
})

it('测试 formatRequestData 方法传入 AxiosConfig', () => {
  const res = formatRequestData({
    method: 'post',
    data: { aa: '11', bb: '22' },
  })
  expect(res).toEqual({ method: 'post', data: Qs.stringify({ aa: '11', bb: '22' }) })
})

it('测试 formatRequestData 方法传入 AxiosConfig, data 有 "", null, undefined', () => {
  const res = formatRequestData({
    method: 'post',
    data: { aa: '11', bb: '22', cc: '', dd: null, ee: undefined },
  })
  expect(res).toEqual({ method: 'post', data: Qs.stringify({ aa: '11', bb: '22' }) })
})

it('测试 formatRequestData 方法传入 AxiosConfig, get', () => {
  const res = formatRequestData({
    method: 'get',
    data: { aa: '11', bb: '22' },
  })
  expect(res).toEqual({ method: 'get', data: { aa: '11', bb: '22' } })
})

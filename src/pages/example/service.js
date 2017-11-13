import axios from 'axios'
import md5 from 'md5'
export default {
  login (user) {
    return axios.post('/wallet/user/login', {
      version: 'v1',
      phone: '22212345678',
      pass: md5('123456')
    })
  }
}

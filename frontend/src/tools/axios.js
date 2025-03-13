import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8000',
})

instance.defaults.headers['Authorization'] =
  'Token 824c5386546a03580df5b59a0a50778dffe485e8385d21cdd1c4eb620246166a'

export default instance

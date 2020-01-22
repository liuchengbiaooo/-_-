import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
let service = axios.create({
    baseURL: 'http://192.168.3.22/youyi_center/public/',
    //baseURL: 'http://game-api.rpgmoba.com',
    method: 'get',
    //withCredentials: true,
    timeout: 60000, // 请求超时时间 60秒
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

// axios.defaults.headers.common['Authorization'] = store.state.user.token
// request拦截器
service.interceptors.request.use(

    config => {
        //console.log("sss", store.state.user.token)
        if (store.state.user.token) {
            let token = store.state.user.token;
            config.headers["Login-Token"] = token // 让每个请求携带自定义token 请根据实际情况自行修改

        }
        // console.log("config", config)
        return config
    },
    error => {

        Promise.reject(error)
    }
)

// respone拦截器
service.interceptors.response.use(
    response => {
        /**
         * code为非1是抛错 可结合自己业务进行修改
         * code:200,接口正常返回;-1:返回的数据不对;
         */
        const res = response.data
        if (res.code !== 200) {
            const ref = response.data.msg;
            Message({
                    message: ref,
                    type: 'error',
                    duration: 2 * 1000
                })
                // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                })
            }
            return Promise.resolve(response);
        } else {
            return response.data
        }
    },
    error => {
        console.log("chucuo")
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
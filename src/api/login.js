import request from '@/utils/axios'
import { appUrl } from '@/utils/env'

//登录
export function login(account, password) {
    return request({
        url: 'admin/sign/login',
        method: 'post',
        params: {
            account,
            password
        }
    })
}

// export function getInfo(token) {
//     return request({
//         url: appUrl + '/user/info',
//         method: 'get',
//         params: { token }
//     })
// }

// export function logout() {
//     return request({
//         url: appUrl + '/user/logout',
//         method: 'post'
//     })
// }
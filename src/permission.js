import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { getToken } from '@/utils/auth' // 验权(从cookie中获取)


const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
    NProgress.start()

    if (getToken()) {

        if (to.path === '/login') {
            console.log("SADfsdfsd")
            next({ path: '/' })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            store.dispatch('Platforms')
            next()
                // if (store.getters.roles.length === 0) {
                //   store.dispatch('Permission').then(() => {
                //     next({ path: to.path })
                //   }).catch((err) => {
                //     store.dispatch('FedLogOut').then(() => {
                //       Message.error(err || 'Verification failed, please login again')
                //       next({ path: '/' })
                //     })
                //   })
                // } else {
                //   next()
                // }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})
router.afterEach((to, from, next) => {
    NProgress.done() // 结束Progress
})
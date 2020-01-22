import request from '@/utils/axios';

//游戏列表
export function gameList(page) {
    return request({
        url: 'admin/game/query',
        method: 'post',
        params: { page }
    })
}

//添加游戏
export function addGame(name, icon, type, theme, url, platform, img, intro, window_display) {
    return request({
        url: 'admin/game/create',
        method: 'post',
        params: { name, icon, type, theme, url, platform, img, intro, window_display }
    })
}

//编辑游戏 
export function compileGame(id, name, icon, type, theme, url, platform, img, intro, window_display) {
    return request({
        url: 'admin/game/edit',
        method: 'post',
        params: { id, name, icon, type, theme, url, platform, img, intro, window_display }
    })
}

//删除游戏
export function deleteGame(id) {
    return request({
        url: 'admin/game/remove',
        method: 'post',
        params: { id }
    })
}
//获取游戏平台列表
export function platformList() {
    return request({
        url: 'admin/game/platforms',
        method: 'post',
        params: {}
    })
}

//上传游戏图标
export function gameIcon(file) {
    return request({
        url: 'admin/upload/img',
        method: 'post',
        data: file
    })
}
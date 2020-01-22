import request from '@/utils/axios';

//版块列表
export function sectionList(platform) {
    return request({
        url: 'admin/plate/query',
        method: 'post',
        params: { platform }
    })
}
//新增版块
export function addSection(platform, name) {
    return request({
        url: 'admin/plate/create',
        method: 'post',
        params: { platform, name }
    })
}

//删除版块
export function deleteSection(id) {
    return request({
        url: 'admin/plate/remove',
        method: 'post',
        params: { id }
    })
}

//版块内游戏列表
export function sectionGameList(id) {
    return request({
        url: 'admin/plate/games',
        method: 'post',
        params: { id }
    })
}

//确定上架
export function allowPutaway(plate_id, game_id) {
    return request({
        url: 'admin/plate/up',
        method: 'post',
        params: { plate_id, game_id }
    })
}

//下架游戏
export function soldOutGame(plate_id, game_id) {
    return request({
        url: 'admin/plate/down',
        method: 'post',
        params: { plate_id, game_id }
    })
}